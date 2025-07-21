from db import get_db
from recommendation_engine import build_graph
from extract_json import extract_json_block
from models import Recommendation
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import traceback


def run_recommendation(emp_id: int, goal: str):
    try:
        # Get database session
        db = next(get_db())
        
        # Check if recommendation already exists for this employee and goal
        existing_recommendation = db.query(Recommendation).filter(
            Recommendation.emp_id == emp_id,
            Recommendation.goal == goal
        ).first()
        
        if existing_recommendation:
            # Check if last_updated_time is older than 1 day
            one_day_ago = datetime.now() - timedelta(days=1)
            needs_update = (
                existing_recommendation.last_updated_time is None or
                existing_recommendation.last_updated_time < one_day_ago or
                not existing_recommendation.valid
            )
            
            if not needs_update:
                # Return existing recommendation data
                return {
                    "emp_id": emp_id,
                    "goal": goal,
                    "valid": existing_recommendation.valid,
                    "output": existing_recommendation.output,
                    "validation_summary": existing_recommendation.validation_summary,
                    "analysis": existing_recommendation.analysis,
                    "from_db": True,
                    "last_updated": existing_recommendation.last_updated_time.isoformat() if existing_recommendation.last_updated_time else None
                }
            else:
                # Update existing recommendation
                print(f"Updating recommendation for emp_id: {emp_id}, goal: {goal} (older than 1 day)")
                graph = build_graph()
                print("Graph built successfully")
                
                result = graph.invoke({
                    "emp_id": emp_id,
                    "goal": goal,
                })
                # print(f"Graph invocation result: {result}")
                
                # Extract the data
                output = extract_json_block(result.get("output", ""))
                validation_summary = extract_json_block(result.get("validation_summary", ""))
                analysis = extract_json_block(result.get("llm_analysis", ""))
                valid = result.get("is_valid", False)
                
                # Update existing recommendation
                existing_recommendation.output = output
                existing_recommendation.analysis = analysis
                existing_recommendation.valid = valid
                existing_recommendation.validation_summary = validation_summary
                existing_recommendation.last_updated_time = datetime.now()
                
                db.commit()
                db.refresh(existing_recommendation)
                
                return {
                    "emp_id": emp_id,
                    "goal": goal,
                    "valid": valid,
                    "output": output,
                    "validation_summary": validation_summary,
                    "analysis": analysis,
                    "from_db": False,
                    "last_updated": existing_recommendation.last_updated_time.isoformat()
                }
        
        else:
            # If no existing recommendation, generate new one
            print(f"Starting recommendation for emp_id: {emp_id}, goal: {goal}")
            graph = build_graph()
            print("Graph built successfully")
            
            result = graph.invoke({
                "emp_id": emp_id,
                "goal": goal,
            })
            # print(f"Graph invocation result: {result}")
            
            # Extract the data
            output = extract_json_block(result.get("output", ""))
            validation_summary = extract_json_block(result.get("validation_summary", ""))
            analysis = extract_json_block(result.get("llm_analysis", ""))
            valid = result.get("is_valid", False)
            
            # Save to database with duplicate handling
            new_recommendation = Recommendation(
                emp_id=emp_id,
                goal=goal,
                output=output,
                analysis=analysis,
                valid=valid,
                validation_summary=validation_summary,
                last_updated_time=datetime.now()
            )
            
            try:
                # Try to add the new recommendation
                db.add(new_recommendation)
                db.commit()
                db.refresh(new_recommendation)
                
                return {
                    "emp_id": emp_id,
                    "goal": goal,
                    "valid": valid,
                    "output": output,
                    "validation_summary": validation_summary,
                    "analysis": analysis,
                    "from_db": False,
                    "last_updated": new_recommendation.last_updated_time.isoformat()
                }
            except Exception as db_error:
                # If we get a duplicate key error, rollback and update existing record
                db.rollback()
                
                # Query again to get the existing record (race condition handling)
                existing_recommendation = db.query(Recommendation).filter(
                    Recommendation.emp_id == emp_id,
                    Recommendation.goal == goal
                ).first()
                
                if existing_recommendation:
                    # Update the existing record
                    existing_recommendation.output = output
                    existing_recommendation.analysis = analysis
                    existing_recommendation.valid = valid
                    existing_recommendation.validation_summary = validation_summary
                    existing_recommendation.last_updated_time = datetime.now()
                    
                    db.commit()
                    db.refresh(existing_recommendation)
                    
                    return {
                        "emp_id": emp_id,
                        "goal": goal,
                        "valid": valid,
                        "output": output,
                        "validation_summary": validation_summary,
                        "analysis": analysis,
                        "from_db": False,
                        "last_updated": existing_recommendation.last_updated_time.isoformat()
                    }
                else:
                    # Re-raise the original error if we can't find the existing record
                    raise db_error
    except Exception as e:
        print(f"Error in run_recommendation: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return {
            "error": str(e),
            "message": "An error occurred while processing the recommendation.",
            "traceback": traceback.format_exc()
        }
    finally:
        # Close the database session
        if 'db' in locals():
            db.close()


def refresh_recommendation(emp_id: int, goal: str):
    try:
        # Get database session
        db = next(get_db())
        
        # Always generate new recommendation
        print(f"Refreshing recommendation for emp_id: {emp_id}, goal: {goal}")
        graph = build_graph()
        print("Graph built successfully")
        
        result = graph.invoke({
            "emp_id": emp_id,
            "goal": goal,
        })
        
        # Extract the data
        output = extract_json_block(result.get("output", ""))
        validation_summary = extract_json_block(result.get("validation_summary", ""))
        analysis = extract_json_block(result.get("llm_analysis", ""))
        valid = result.get("is_valid", False)
        
        # Check if recommendation already exists for this employee and goal
        existing_recommendation = db.query(Recommendation).filter(
            Recommendation.emp_id == emp_id,
            Recommendation.goal == goal
        ).first()
        
        if existing_recommendation:
            # Update existing recommendation
            existing_recommendation.output = output
            existing_recommendation.analysis = analysis
            existing_recommendation.valid = valid
            existing_recommendation.validation_summary = validation_summary
            existing_recommendation.last_updated_time = datetime.now()
            
            db.commit()
            db.refresh(existing_recommendation)
            
            return {
                "emp_id": emp_id,
                "goal": goal,
                "valid": valid,
                "output": output,
                "validation_summary": validation_summary,
                "analysis": analysis,
                "from_db": False,
                "last_updated": existing_recommendation.last_updated_time.isoformat()
            }
        else:
            # Create new recommendation
            new_recommendation = Recommendation(
                emp_id=emp_id,
                goal=goal,
                output=output,
                analysis=analysis,
                valid=valid,
                validation_summary=validation_summary,
                last_updated_time=datetime.now()
            )
            
            # Use merge instead of add to handle potential duplicates
            merged_recommendation = db.merge(new_recommendation)
            db.commit()
            db.refresh(merged_recommendation)
            
            return {
                "emp_id": emp_id,
                "goal": goal,
                "valid": valid,
                "output": output,
                "validation_summary": validation_summary,
                "analysis": analysis,
                "from_db": False,
                "last_updated": merged_recommendation.last_updated_time.isoformat()
            }
            
    except Exception as e:
        print(f"Error in refresh_recommendation: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return {
            "error": str(e),
            "message": "An error occurred while refreshing the recommendation.",
            "traceback": traceback.format_exc()
        }
    finally:
        # Close the database session
        if 'db' in locals():
            db.close()


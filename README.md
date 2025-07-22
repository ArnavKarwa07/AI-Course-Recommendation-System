# SkillSense AI - Employee Learning Recommendation System

**Sensing Skills, Shaping Futures**

An intelligent AI-powered platform that transforms employee learning by providing personalized course recommendations and strategic skill development roadmaps. Our system analyzes employee profiles, performance data, and career goals to create tailored learning experiences that drive professional growth and organizational success.

![Data Workflow](data_workflow.png)

## 🎯 Why SkillSense AI?

### For Organizations

- **Boost Employee Performance**: AI-driven recommendations align learning with actual skill gaps and role requirements
- **Accelerate Career Development**: Structured roadmaps guide employees through logical skill progression
- **Maximize Training ROI**: Targeted recommendations ensure training investments deliver measurable results
- **Reduce Skills Shortage**: Proactive identification and addressing of skill gaps before they impact productivity
- **Data-Driven Insights**: Comprehensive analytics help L&D teams make informed decisions

### For Employees

- **Personalized Learning Journey**: Get recommendations tailored to your specific skills, goals, and learning style
- **Clear Career Progression**: See exactly what skills you need to advance in your career
- **Time-Efficient Learning**: Focus on courses that matter most for your role and aspirations
- **Progress Tracking**: Monitor your learning achievements and skill development over time
- **AI-Powered Guidance**: Receive intelligent suggestions based on your unique profile and performance

## ✨ Key Features

### AI-Powered Intelligence

- **Smart Recommendations**: Advanced LLM analysis provides personalized course suggestions with clear reasoning
- **Behavioral Analysis**: Identifies individual learning patterns and preferences for optimal course matching
- **Skill Gap Detection**: Automatically analyzes current skills against role requirements and career goals
- **Quality Assurance**: Multi-agent validation ensures recommendations are relevant and achievable

### Comprehensive Analytics

- **Performance Dashboards**: Real-time insights into learning progress, KPI tracking, and skill development
- **Career Growth Insights**: Visualize promotion readiness and identify development opportunities
- **Learning Statistics**: Track completion rates, scores, and learning achievements
- **Skill Assessment**: Interactive skill mapping with proficiency levels and progress tracking

### Strategic Learning Paths

- **AI-Generated Roadmaps**: Timeline-based learning sequences that build skills progressively
- **Course Sequencing**: Logical progression from foundational to advanced topics
- **Realistic Timelines**: Achievable learning schedules that consider workload and complexity
- **Adaptive Planning**: Roadmaps adjust based on completion progress and changing requirements

### Employee-Centric Design

- **Complete Profiles**: Comprehensive view of skills, projects, learning history, and career goals
- **Course Catalog**: Browse and discover courses with intelligent filtering and search
- **Progress Tracking**: Monitor learning journey with detailed completion history and scores
- **Mobile-Friendly**: Responsive design works seamlessly across all devices

## Technical Architecture

### Frontend Technology Stack

- **React 19 + Vite**: Modern frontend framework with lightning-fast development experience
- **Context API**: Centralized state management for authentication and global data
- **Responsive Design**: Mobile-first approach ensuring consistent experience across devices
- **Component Architecture**: Modular, reusable components for maintainable code

### Backend Technology Stack

- **FastAPI**: High-performance Python web framework for scalable API development
- **MySQL Database**: Robust relational database for data persistence and integrity
- **LangGraph**: Advanced multi-agent system for AI recommendation pipeline
- **OpenAI Integration**: Cutting-edge language models for intelligent analysis

### AI Recommendation Engine

The system employs a sophisticated multi-agent architecture:

1. **Data Collection Agent**: Gathers comprehensive employee profiles, course catalogs, and performance data
2. **Analysis Agent**: Performs deep behavioral analysis and identifies skill gaps using advanced algorithms
3. **Recommendation Agent**: Generates personalized course suggestions and learning roadmaps
4. **Validation Agent**: Ensures recommendation quality, relevance, and achievability
5. **Output Agent**: Formats and delivers final recommendations with clear explanations

![Technical Workflow](technical_workflow.png)

The above diagram illustrates the complete technical architecture and data flow of SkillSense AI, showing how user interactions trigger the AI recommendation pipeline and database operations.

### Database Structure

The system uses a comprehensive MySQL database with the following key tables:

- **`m_roles`**: Master data for organizational roles and skill requirements
- **`m_emp`**: Employee profiles with skills, preferences, and career goals
- **`m_courses`**: Course catalog with metadata and skill mappings
- **`t_emp_kpi`**: Employee performance tracking and KPI metrics
- **`t_course_completion`**: Learning history and completion records
- **`t_emp_projects`**: Project experience and skill utilization
- **`t_recommendation`**: AI-generated recommendations and analysis

The [database.sql](server/database.sql) file includes complete schema definitions and sample data for testing.

### Database Schema

#### Master Tables

**`m_roles`** - Organizational Roles and Requirements

```sql
CREATE TABLE m_roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    required_skills TEXT,
    skill_level_required JSON,
    responsibilities TEXT,
    career_progression_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**`m_emp`** - Employee Master Data

```sql
CREATE TABLE m_emp (
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(255) NOT NULL,
    role_id INT,
    department VARCHAR(255),
    current_skills TEXT,
    skill_proficiency JSON,
    career_goals TEXT,
    learning_preferences JSON,
    years_of_experience INT,
    education_background TEXT,
    certifications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES m_roles(role_id)
);
```

**`m_courses`** - Course Catalog

```sql
CREATE TABLE m_courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(255) NOT NULL,
    course_description TEXT,
    category VARCHAR(255),
    difficulty_level ENUM('Beginner', 'Intermediate', 'Advanced'),
    duration_hours INT,
    skills_covered TEXT,
    prerequisites TEXT,
    learning_outcomes TEXT,
    rating DECIMAL(3,2),
    provider VARCHAR(255),
    course_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Transaction Tables

**`t_emp_kpi`** - Employee Performance Metrics

```sql
CREATE TABLE t_emp_kpi (
    kpi_id INT PRIMARY KEY AUTO_INCREMENT,
    emp_id INT,
    evaluation_period VARCHAR(50),
    performance_score DECIMAL(5,2),
    goal_achievement_rate DECIMAL(5,2),
    skill_improvement_score DECIMAL(5,2),
    leadership_score DECIMAL(5,2),
    collaboration_score DECIMAL(5,2),
    innovation_score DECIMAL(5,2),
    comments TEXT,
    evaluator_id INT,
    evaluation_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emp_id) REFERENCES m_emp(emp_id)
);
```

**`t_course_completion`** - Learning History

```sql
CREATE TABLE t_course_completion (
    completion_id INT PRIMARY KEY AUTO_INCREMENT,
    emp_id INT,
    course_id INT,
    enrollment_date DATE,
    completion_date DATE,
    completion_status ENUM('Enrolled', 'In Progress', 'Completed', 'Dropped'),
    score DECIMAL(5,2),
    time_spent_hours INT,
    feedback TEXT,
    certificate_earned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emp_id) REFERENCES m_emp(emp_id),
    FOREIGN KEY (course_id) REFERENCES m_courses(course_id)
);
```

**`t_emp_projects`** - Project Experience

```sql
CREATE TABLE t_emp_projects (
    project_id INT PRIMARY KEY AUTO_INCREMENT,
    emp_id INT,
    project_name VARCHAR(255),
    project_description TEXT,
    role_in_project VARCHAR(255),
    technologies_used TEXT,
    skills_utilized TEXT,
    skills_gained TEXT,
    project_duration_months INT,
    project_start_date DATE,
    project_end_date DATE,
    project_success_rating DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emp_id) REFERENCES m_emp(emp_id)
);
```

**`t_recommendation`** - AI Recommendations

```sql
CREATE TABLE t_recommendation (
    recommendation_id INT PRIMARY KEY AUTO_INCREMENT,
    emp_id INT,
    recommended_courses JSON,
    skill_gap_analysis TEXT,
    learning_roadmap JSON,
    recommendation_reasoning TEXT,
    priority_level ENUM('High', 'Medium', 'Low'),
    estimated_completion_time VARCHAR(100),
    expected_outcomes TEXT,
    recommendation_score DECIMAL(5,2),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Active', 'Completed', 'Outdated') DEFAULT 'Active',
    FOREIGN KEY (emp_id) REFERENCES m_emp(emp_id)
);
```

<!-- ## Getting Started -->

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **MySQL** (v8.0 or higher)
- **OpenAI API Key**

### Environment Setup

**Configure `.env` file:**

```env
# Database Configuration
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=recom_dummy

# API Keys
GPT_API_KEY=your_openai_api_key_here
```

## API Reference

### Endpoints

| Endpoint                  | Method | Description                           | Parameters          |
| ------------------------- | ------ | ------------------------------------- | ------------------- |
| `/recommend`              | POST   | Generate personalized recommendations | `emp_id`, `goal`    |
| `/refresh_recommendation` | POST   | Refresh existing recommendations      | `emp_id`, `goal`    |
| `/employee/{emp_id}`      | GET    | Retrieve employee profile             | `emp_id` (path)     |
| `/courses`                | GET    | Get complete course catalog           | None                |
| `/roles`                  | GET    | Get all organizational roles          | None                |
| `/completion/{emp_id}`    | GET    | Get employee learning history         | `emp_id` (path)     |
| `/kpi/{emp_id}`           | GET    | Get employee performance metrics      | `emp_id` (path)     |
| `/projects/{emp_id}`      | GET    | Get employee project experience       | `emp_id` (path)     |
| `/chat`                   | POST   | AI chatbot interaction                | `emp_id`, `message` |

### Authentication

All endpoints require valid employee authentication via the login system.

## Important Functions

### Core Recommendation Engine

| Function                   | File                                                        | Description                                        | Usage                                   |
| -------------------------- | ----------------------------------------------------------- | -------------------------------------------------- | --------------------------------------- |
| `build_graph()`            | [recommendation_engine.py](server/recommendation_engine.py) | Creates LangGraph workflow for AI recommendations  | Multi-agent pipeline orchestration      |
| `run_recommendation()`     | [recommendation.py](server/recommendation.py)               | Main function to generate/retrieve recommendations | Handles caching and database operations |
| `refresh_recommendation()` | [recommendation.py](server/recommendation.py)               | Forces regeneration of recommendations             | Bypasses cache for fresh analysis       |

### Data Collection & Analysis

| Function              | File                                                        | Description                                       | Usage                                       |
| --------------------- | ----------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------- |
| `collect_user_data()` | [recommendation_engine.py](server/recommendation_engine.py) | Gathers employee profile, KPIs, projects, courses | First step in recommendation pipeline       |
| `analyze_user_data()` | [recommendation_engine.py](server/recommendation_engine.py) | AI analysis of employee behavior and skill gaps   | Identifies learning patterns and needs      |
| `generate_output()`   | [recommendation_engine.py](server/recommendation_engine.py) | Creates personalized course recommendations       | Uses LLM to match courses to employee needs |
| `validate_output()`   | [recommendation_engine.py](server/recommendation_engine.py) | Quality assurance for AI recommendations          | Ensures output validity and relevance       |

### Chatbot & AI Processing

| Function                 | File                            | Description                                       | Usage                       |
| ------------------------ | ------------------------------- | ------------------------------------------------- | --------------------------- |
| `process_chat_message()` | [chatbot.py](server/chatbot.py) | Main chatbot processing with streaming response   | Real-time AI conversations  |
| `get_employee_data()`    | [chatbot.py](server/chatbot.py) | Retrieves comprehensive employee context for chat | Personalized chat responses |
| `build_system_prompt()`  | [chatbot.py](server/chatbot.py) | Creates context-aware prompts for LLM             | Dynamic prompt generation   |
| `chat_node()`            | [chatbot.py](server/chatbot.py) | LangGraph node for streaming chat responses       | Graph-based chat processing |

### Utility Functions

| Function                 | File                                                        | Description                                           | Usage                                 |
| ------------------------ | ----------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------- |
| `extract_json_block()`   | [extract_json.py](server/extract_json.py)                   | Extracts JSON from LLM text responses                 | Parses AI-generated structured data   |
| `stream_chat_response()` | [api.py](server/api.py)                                     | Generator for streaming chat responses                | Real-time response delivery           |
| `serialize()`            | [recommendation_engine.py](server/recommendation_engine.py) | Converts database objects to JSON-serializable format | Data transformation for API responses |

## 🔧 Performance & Scalability

### Optimization Features

- **Fast Loading**: Vite-powered frontend with optimized build process
- **Efficient APIs**: FastAPI backend with async processing
- **Smart Caching**: Strategic caching for improved response times
- **Database Optimization**: Indexed queries and optimized data retrieval

### Scalability

- **Microservices Ready**: Modular architecture supports horizontal scaling
- **Cloud Compatible**: Deploy on AWS, Azure, or Google Cloud
- **Load Balancing**: Support for high-availability configurations

## 🔍 Troubleshooting

### Common Issues

**Database Connection Problems**

- Verify MySQL service is running
- Check credentials in `server/.env`
- Ensure database exists and is accessible

**API Key Issues**

- Confirm OpenAI API key is valid and active
- Check API usage limits and quotas
- Verify key permissions for required operations

**Frontend Build Errors**

- Clear `node_modules` and reinstall dependencies
- Check Node.js version compatibility
- Update packages to latest compatible versions

---

## Sample Case 

### Employee Profile: ID 101 (Arjun Verma)

#### 1. Employee Data Collection

**Employee Master Data (`m_emp`)**
| emp_id | name | role_id | role | dept | skills (skill : proficiency) | learning_preferences | interests | career_goal | join_date | last_promotion_date | experience (in months) | languages |
|--------|------|---------|------|------|------------------------------|---------------------|-----------|-------------|-----------|-------------------|----------------------|-----------|
| 101 | Arjun Verma | 1 | Software Engineer | Engineering | {"Git": 4, "Python": 4} | Online | AI, Web Dev | Senior Dev | 2021-07-10 | 2023-07-10 | 36 | English, Hindi |

**Role Requirements (`m_roles`)**
| role_id | role | dept | job_level | skills_required | avg_promotion_time (months) |
|---------|------|------|-----------|-----------------|---------------------------|
| 1 | Software Engineer | Engineering | Junior | {"Git": 3, "Python": 3} | 24 |

#### 2. Performance Analytics

**KPI Metrics (`t_emp_kpi`)**
| emp_id | month | kpi_metric | kpi_score | review |
|--------|-------|------------|-----------|---------|
| 101 | 2024-01-01 | Feedback | 4.5 | Peers praised timely delivery |
| 101 | 2024-02-01 | Code Quality | 4.2 | Clean modular code |
| 101 | 2024-03-01 | Bug Resolution | 4.6 | Fixed critical issues fast |
| 101 | 2024-04-01 | Team Collaboration | 4.0 | Great sync with frontend |
| 101 | 2024-05-01 | Documentation | 3.9 | Needs slight improvement |

#### 3. Learning History

**Course Completion (`t_course_completion`)**
| emp_id | course_id | start_date | end_date | duration (months) | expected_duration (months) | score |
|--------|-----------|------------|----------|-------------------|---------------------------|-------|
| 101 | 201 | 2024-01-01 | 2024-02-01 | 1.8 | 1 | 4.6 |

#### 4. Project Experience

**Project History (`t_emp_projects`)**
| project_id | project_name | emp_id | project_role | duration (months) | date | tech_stack | skills_used |
|------------|--------------|--------|--------------|-------------------|------|------------|-------------|
| 1001 | Inventory Automation Tool | 101 | Backend Developer | 5 | 2023-07-15 | Python, Flask | {"SQL": 3, "Python": 4} |
| 1002 | AI Chatbot Integration | 101 | Lead Developer | 4 | 2026-01-20 | Python, Rasa | {"NLP": 3, "Python": 4} |

#### 5. AI Analysis Results

**Analysis Output:**

```json
{
  "skill_gaps": ["SQL", "NLP", "Documentation"],
  "behavior_traits": [
    "timely delivery",
    "problem-solving",
    "team collaboration",
    "attention to detail"
  ],
  "learning_preferences": ["Online"]
}
```

#### 6. Available Courses

**Course Catalog (`m_courses`)**
| course_id | name | category | desc | skills | format | level | prerequisite_skills | duration (months) |
|-----------|------|----------|------|--------|--------|-------|-------------------|------------------|
| 201 | Intro to Python | Programming | Learn Python basics | {"Python": 3} | Online | Beginner | null | 1 |
| 202 | Advanced Java | Programming | Deep dive into Java | {"Java": 4} | Online | Advanced | {"Java": 3} | 2 |

#### 7. AI Recommendations

**Generated Output:**

```json
[
  {
    "desc": "SQL queries",
    "order": 1,
    "c_name": "SQL for Data Analysts",
    "reason": "Identified skill gap in SQL",
    "duration": 1.0,
    "course_id": "205"
  },
  {
    "desc": "Full ML course",
    "order": 2,
    "c_name": "Machine Learning A-Z",
    "reason": "Supports career goal"
    ...
  }
]
```

**Recommendations stored in (`t_recommendation`)**
| recommendation_id | emp_id | goal | output | analysis (skill_gap, behaviour_traits, learning_preferences) | valid | validation_summary | last_updated_time |
|------------------|--------|------|--------|-----------------------------------------------------------|-------|-------------------|------------------|
| 31 | 101 | roadmap | [{"desc": "SQL queries", "order": 1, "c_name": "SQL for Data Analysts", "reason": "Identified skill gap in SQL", "duration": 1.0, "course_id": "205"}, {"desc": "Full ML course", "order": 2, "c_name": "Machine Learning A-Z", "reason": "Supports career goal..."}] | {"skill_gaps": ["Documentation", "SQL", "NLP"], "behavior_traits": ["timely delivery", "clean code", "team collaboration"], "learning_preferences": ["Online"]} | 0 | {"valid": false, "reason": "Course progression issues"} | 2025-07-22 23:22:50 |
| 41 | 101 | courses | [{"name": "SQL for Data Analysts", "reason": "Addresses SQL skill gap", "course_id": 205}, {"name": "Machine Learning A-Z", "reason": "NLP skill enhancement", "course_id": 203}, {"name": "Data Analysis with Excel", "reason": "Improves documentation skills..."}] | {"skill_gaps": ["SQL", "NLP", "Documentation"], "behavior_traits": ["timely delivery", "problem-solving", "team collaboration", "attention to detail"], "learning_preferences": ["Online"]} | 1 | {"valid": true, "reason": "All courses are relevant"} | 2025-07-22 23:22:10 |

#### 8. User Interface Output

The system generates personalized learning recommendations displayed through intuitive interfaces:

![Roadmap UI](roadmap_ui_example.png)

![Recommendations UI](recommended_courses_ui_example.png)

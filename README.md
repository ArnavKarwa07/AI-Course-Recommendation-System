# SkillSense AI - Employee Learning Recommendation System

**Sensing Skills, Shaping Futures**

An intelligent AI-powered platform that transforms employee learning by providing personalized course recommendations and strategic skill development roadmaps. Our system analyzes employee profiles, performance data, and career goals to create tailored learning experiences that drive professional growth and organizational success.

![Data Workflow](data_workflow.png)

## 🔄 Technical Workflow

![Technical Workflow](technical_workflow.png)

The above diagram illustrates the complete technical architecture and data flow of SkillSense AI, showing how user interactions trigger the AI recommendation pipeline and database operations.

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

<!-- ### Quick Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-org/skillsense-ai.git
   cd skillsense-ai
   ```

2. **Frontend Setup**

   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Backend Setup**

   ```bash
   cd server
   pip install -r requirements.txt
   # Configure .env file with database and API credentials
   python main.py
   ```

4. **Database Setup**
   - Create MySQL database
   - Configure connection in `server/.env`
   - Run database migrations -->

<!-- ## 🎯 How to Use SkillSense AI

### For Employees

1. **Login & Profile Setup**

   - Access the system with your employee ID
   - Complete your profile with skills, interests, and career goals

2. **Explore Your Dashboard**

   - View AI-generated learning roadmaps
   - See personalized course recommendations
   - Track your learning progress and achievements

3. **Browse Courses**

   - Explore the complete course catalog
   - Use intelligent filters to find relevant courses
   - View AI explanations for why courses are recommended

4. **Monitor Your Growth**
   - Access detailed analytics on your learning journey
   - Track KPI improvements and skill development
   - Plan your career progression with data insights

### For Administrators

1. **Employee Analytics**

   - Monitor organizational learning trends
   - Identify skill gaps across teams
   - Track training effectiveness and ROI

2. **Course Management**
   - Manage course catalog and metadata
   - Monitor course popularity and completion rates
   - Analyze recommendation patterns -->

## API Reference

### Endpoints

| Endpoint                  | Method | Description                           | Parameters |
| ------------------------- | ------ | ------------------------------------- | ---------- |
| `/recommend`              | POST   | Generate personalized recommendations | `emp_id`, `goal` |
| `/refresh_recommendation` | POST   | Refresh existing recommendations      | `emp_id`, `goal` |
| `/employee/{emp_id}`      | GET    | Retrieve employee profile             | `emp_id` (path) |
| `/courses`                | GET    | Get complete course catalog           | None |
| `/roles`                  | GET    | Get all organizational roles          | None |
| `/completion/{emp_id}`    | GET    | Get employee learning history         | `emp_id` (path) |
| `/kpi/{emp_id}`           | GET    | Get employee performance metrics      | `emp_id` (path) |
| `/projects/{emp_id}`      | GET    | Get employee project experience       | `emp_id` (path) |
| `/chat`                   | POST   | AI chatbot interaction                | `emp_id`, `message` |


### Authentication

All endpoints require valid employee authentication via the login system.

<!-- ## Security & Privacy

- **Data Protection**: All employee data is encrypted and securely stored
- **Access Control**: Role-based permissions ensure data privacy
- **API Security**: Secure authentication and authorization mechanisms
- **Compliance**: Adheres to data protection regulations and best practices -->

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

**SkillSense AI** - Transforming employee learning through intelligent recommendations and personalized skill development paths.

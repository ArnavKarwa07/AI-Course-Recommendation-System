-- Employee Career Development and Recommendation System Database Schema
-- This file contains the complete database structure for the recommendation system

-- Create database
CREATE DATABASE IF NOT EXISTS recom_dummy;
USE recom_dummy;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS t_recommendation;
DROP TABLE IF EXISTS t_emp_projects;
DROP TABLE IF EXISTS t_course_completion;
DROP TABLE IF EXISTS t_emp_kpi;
DROP TABLE IF EXISTS m_courses;
DROP TABLE IF EXISTS m_emp;
DROP TABLE IF EXISTS m_roles;

-- Create roles master table
CREATE TABLE m_roles (
    role_id INT PRIMARY KEY,
    role VARCHAR(100),
    dept VARCHAR(100),
    job_level VARCHAR(50),
    skills_required JSON,
    avg_promotion_time INT
);

-- Create employee master table
CREATE TABLE m_emp (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100),
    role_id INT,
    role VARCHAR(100),
    dept VARCHAR(100),
    skills JSON,
    learning_preferences VARCHAR(100),
    interests VARCHAR(100),
    career_goal VARCHAR(100),
    join_date DATE,
    last_promotion_date DATE,
    experience INT,
    languages VARCHAR(100),
    FOREIGN KEY (role_id) REFERENCES m_roles(role_id)
);

-- Create employee KPI tracking table
CREATE TABLE t_emp_kpi (
    emp_id INT,
    month DATE,
    kpi_metric VARCHAR(100),
    kpi_score DECIMAL(5,2),
    review TEXT,
    FOREIGN KEY (emp_id) REFERENCES m_emp(emp_id)
);

-- Create courses master table
CREATE TABLE m_courses (
    course_id INT PRIMARY KEY,
    name VARCHAR(100),
    category VARCHAR(100),
    `desc` TEXT,
    skills JSON,
    format VARCHAR(50),
    level VARCHAR(50),
    prerequisite_skills JSON,
    duration FLOAT
);

-- Create course completion tracking table
CREATE TABLE t_course_completion (
    emp_id INT,
    course_id INT,
    start_date DATE,
    end_date DATE GENERATED ALWAYS AS (DATE_ADD(start_date, INTERVAL expected_duration MONTH)) STORED,
    duration FLOAT,
    expected_duration FLOAT,
    score DECIMAL(5,2),
    FOREIGN KEY (emp_id) REFERENCES m_emp(emp_id),
    FOREIGN KEY (course_id) REFERENCES m_courses(course_id)
);

-- Create trigger for setting expected duration
DELIMITER $$

CREATE TRIGGER trg_set_expected_duration
BEFORE INSERT ON t_course_completion
FOR EACH ROW
BEGIN
    DECLARE course_dur FLOAT;

    SELECT duration INTO course_dur
    FROM m_courses
    WHERE course_id = NEW.course_id;

    SET NEW.expected_duration = course_dur;
END$$

DELIMITER ;

-- Create employee projects table
CREATE TABLE t_emp_projects (
    project_id INT PRIMARY KEY,
    project_name VARCHAR(100),
    emp_id INT,
    project_role VARCHAR(100),
    duration FLOAT,
    date DATE,
    tech_stack VARCHAR(100),
    skills_used JSON,
    FOREIGN KEY (emp_id) REFERENCES m_emp(emp_id)
);

-- Create recommendations table
CREATE TABLE t_recommendation (
    recommendation_id INT PRIMARY KEY,
    emp_id INT,
    goal VARCHAR(255),
    output JSON,
    analysis JSON,
    valid BOOLEAN,
    validation_summary JSON,
    last_updated_time DATETIME,
    FOREIGN KEY (emp_id) REFERENCES m_emp(emp_id)
);

-- Add unique constraint for employee and goal combination
ALTER TABLE t_recommendation 
ADD CONSTRAINT unique_emp_goal UNIQUE (emp_id, goal);

-- Insert sample data for roles
INSERT INTO m_roles VALUES
(1, 'Software Engineer', 'Engineering', 'Junior', '{"Python": 3, "Git": 3}', 24),
(2, 'Senior Software Engineer', 'Engineering', 'Mid', '{"Java": 4, "System Design": 3}', 36),
(3, 'Team Lead', 'Engineering', 'Senior', '{"Leadership": 5, "Agile": 4}', 48),
(4, 'Data Scientist', 'Data', 'Junior', '{"Python": 4, "Machine Learning": 3}', 30),
(5, 'Data Analyst', 'Data', 'Junior', '{"Excel": 4, "SQL": 3}', 24),
(6, 'Project Manager', 'Management', 'Senior', '{"Scrum": 5, "JIRA": 4}', 60),
(7, 'HR Executive', 'HR', 'Junior', '{"Communication": 4, "Recruitment": 3}', 24),
(8, 'HR Manager', 'HR', 'Senior', '{"Leadership": 5, "Conflict Resolution": 4}', 60),
(9, 'DevOps Engineer', 'Infrastructure', 'Mid', '{"AWS": 4, "Docker": 4}', 36),
(10, 'Business Analyst', 'Business', 'Mid', '{"Analysis": 4, "Excel": 4}', 30),
(11, 'UI/UX Designer', 'Design', 'Junior', '{"Figma": 4, "User Research": 3}', 24),
(12, 'Marketing Analyst', 'Marketing', 'Junior', '{"SEO": 4, "Analytics": 3}', 24),
(13, 'Finance Analyst', 'Finance', 'Junior', '{"Excel": 5, "Finance": 4}', 24),
(14, 'Tech Lead', 'Engineering', 'Senior', '{"Microservices": 4, "Leadership": 5}', 48),
(15, 'CTO', 'Executive', 'Executive', '{"Strategy": 5, "Technology": 5}', 72);

-- Insert sample data for employees
INSERT INTO m_emp VALUES
(101, 'Arjun Verma', 1, 'Software Engineer', 'Engineering', '{"Python": 4, "Git": 4}', 'Online', 'AI, Web Dev', 'Senior Dev', '2021-07-10', '2023-07-10', 3, 'English, Hindi'),
(102, 'Neha Sharma', 2, 'Senior Software Engineer', 'Engineering', '{"Java": 5, "System Design": 4}', 'Books', 'Backend Systems', 'Tech Lead', '2019-05-12', '2022-05-12', 6, 'English'),
(103, 'Ravi Joshi', 4, 'Data Scientist', 'Data', '{"Python": 4, "ML": 3}', 'Videos', 'Healthcare AI', 'ML Engineer', '2022-01-01', '2024-01-01', 2, 'English'),
(104, 'Simran Kaur', 5, 'Data Analyst', 'Data', '{"SQL": 4, "Excel": 4}', 'Courses', 'Visualization', 'BI Analyst', '2020-09-15', '2023-09-15', 4, 'English'),
(105, 'Manish Mehta', 6, 'Project Manager', 'Management', '{"Scrum": 5}', 'Mentorship', 'Program Management', 'Director', '2016-03-20', '2022-03-20', 9, 'English'),
(106, 'Priya Kapoor', 3, 'Team Lead', 'Engineering', '{"Leadership": 4, "Agile": 4}', 'Online', 'AI Ethics', 'Engineering Manager', '2017-07-01', '2020-07-01', 8, 'English'),
(107, 'Alok Singh', 7, 'HR Executive', 'HR', '{"Recruitment": 3}', 'Workshops', 'Employee Growth', 'HR Manager', '2022-02-28', '2023-08-28', 2, 'English'),
(108, 'Tanvi Desai', 9, 'DevOps Engineer', 'Infrastructure', '{"Docker": 4, "Kubernetes": 3}', 'Online', 'Cloud', 'Infra Lead', '2021-06-18', '2023-06-18', 3, 'English'),
(109, 'Karan Patel', 10, 'Business Analyst', 'Business', '{"Excel": 4}', 'Podcasts', 'BPM', 'Sr. BA', '2018-11-11', '2022-11-11', 5, 'English'),
(110, 'Megha Nair', 11, 'UI/UX Designer', 'Design', '{"Figma": 4}', 'Bootcamp', 'Design Systems', 'Sr. Designer', '2020-02-20', '2022-02-20', 4, 'English'),
(111, 'Rahul Kumar', 12, 'Marketing Analyst', 'Marketing', '{"SEO": 4}', 'Webinars', 'Growth Hacking', 'Marketing Manager', '2021-09-05', '2023-09-05', 3, 'English'),
(112, 'Sanya Rathi', 13, 'Finance Analyst', 'Finance', '{"Finance": 4}', 'Books', 'Stock Analysis', 'Finance Manager', '2022-04-04', '2024-04-04', 2, 'English'),
(113, 'Amit Thakur', 14, 'Tech Lead', 'Engineering', '{"Leadership": 5}', 'Online', 'Innovation', 'Engineering Head', '2016-01-10', '2019-01-10', 10, 'English'),
(114, 'Divya Shetty', 1, 'Software Engineer', 'Engineering', '{"Python": 4}', 'Online', 'Web3', 'Sr. Software Engineer', '2023-06-01', '2024-06-01', 1, 'English'),
(115, 'Jatin Grover', 5, 'Data Analyst', 'Data', '{"SQL": 4}', 'Courses', 'Retail Data', 'BI Consultant', '2020-10-10', '2022-10-10', 4, 'English'),
(116, 'Nidhi Rane', 11, 'UI/UX Designer', 'Design', '{"Figma": 4}', 'Workshops', 'Design Systems', 'UX Lead', '2021-12-12', '2023-12-12', 3, 'English'),
(117, 'Saurabh Dixit', 7, 'HR Executive', 'HR', '{"Recruitment": 4}', 'Mentorship', 'Culture Dev', 'HRBP', '2022-03-03', '2023-03-03', 2, 'English'),
(118, 'Ritika Jain', 8, 'HR Manager', 'HR', '{"Conflict Resolution": 5}', 'Online', 'People Strategy', 'HR Head', '2015-01-01', '2020-01-01', 10, 'English'),
(119, 'Ankit Rao', 2, 'Senior Software Engineer', 'Engineering', '{"Java": 4}', 'Books', 'Distributed Systems', 'Tech Lead', '2018-08-08', '2021-08-08', 6, 'English'),
(120, 'Isha Bhosale', 4, 'Data Scientist', 'Data', '{"ML": 4}', 'Courses', 'AI', 'AI Lead', '2020-05-05', '2023-05-05', 4, 'English');

-- Insert sample data for courses
INSERT INTO m_courses VALUES
(201, 'Intro to Python', 'Programming', 'Learn Python basics', '{"Python": 3}', 'Online', 'Beginner', 'null', 10),
(202, 'Advanced Java', 'Programming', 'Deep dive into Java', '{"Java": 4}', 'Online', 'Advanced', '{"Java": 3}', 15),
(203, 'Machine Learning A-Z', 'Data Science', 'Full ML course', '{"Machine Learning": 4, "Python": 3}', 'Online', 'Intermediate', '{"Python": 3}', 20),
(204, 'Data Analysis with Excel', 'Data Analysis', 'Excel for analysis', '{"Excel": 4}', 'Offline', 'Beginner', 'null', 8),
(205, 'SQL for Data Analysts', 'Data Analysis', 'SQL queries', '{"SQL": 4}', 'Online', 'Intermediate', '{"Excel": 3}', 12),
(206, 'Leadership Essentials', 'Management', 'Lead effectively', '{"Leadership": 4}', 'Workshop', 'Intermediate', 'null', 6),
(207, 'Agile & Scrum', 'Project Management', 'Agile methodology', '{"Agile": 4, "Scrum": 4}', 'Online', 'Beginner', 'null', 7),
(208, 'AWS Certified DevOps', 'Cloud', 'AWS for DevOps', '{"AWS": 4, "Docker": 3}', 'Online', 'Advanced', '{"Linux": 3}', 25),
(209, 'UI Design with Figma', 'Design', 'Design interfaces', '{"Figma": 4}', 'Online', 'Beginner', 'null', 9),
(210, 'JIRA for Project Managers', 'Project Management', 'Track projects', '{"JIRA": 4}', 'Online', 'Beginner', 'null', 5),
(211, 'Microservices Architecture', 'Software Architecture', 'Service-oriented systems', '{"Microservices": 4}', 'Online', 'Advanced', '{"Java": 3}', 18),
(212, 'Financial Modeling', 'Finance', 'Excel for finance', '{"Excel": 5, "Finance": 4}', 'Online', 'Advanced', 'null', 12),
(213, 'Conflict Resolution', 'HR', 'Managing workplace conflict', '{"Conflict Resolution": 4}', 'Workshop', 'Intermediate', 'null', 6),
(214, 'SEO Masterclass', 'Marketing', 'SEO techniques', '{"SEO": 4}', 'Online', 'Beginner', 'null', 10),
(215, 'Power BI Essentials', 'Data Analysis', 'Visualize data', '{"Power BI": 3}', 'Online', 'Intermediate', '{"Excel": 3}', 10),
(216, 'AI Ethics', 'AI', 'Ethical considerations in AI', '{"Ethics": 4}', 'Online', 'Intermediate', '{"Machine Learning": 3}', 7),
(217, 'Growth Hacking Tactics', 'Marketing', 'Growth strategies', '{"Analytics": 3}', 'Online', 'Intermediate', 'null', 8),
(218, 'Cloud Security Basics', 'Cloud', 'Security in cloud systems', '{"Security": 3}', 'Online', 'Beginner', 'null', 6),
(219, 'Business Process Management', 'Business', 'Optimizing processes', '{"Analysis": 4}', 'Offline', 'Intermediate', 'null', 10),
(220, 'Design Systems Bootcamp', 'Design', 'Advanced design concepts', '{"Design Systems": 4}', 'Bootcamp', 'Advanced', '{"Figma": 3}', 14);

-- Insert sample KPI data (truncated for brevity - showing first few employees)
INSERT INTO t_emp_kpi VALUES
-- Arjun Verma
(101, '2024-01-01', 'Feedback', 4.5, 'Peers praised timely delivery'),
(101, '2024-02-01', 'Code Quality', 4.2, 'Clean modular code'),
(101, '2024-03-01', 'Bug Resolution', 4.6, 'Fixed critical issues fast'),
(101, '2024-04-01', 'Team Collaboration', 4.0, 'Great sync with frontend'),
(101, '2024-05-01', 'Documentation', 3.9, 'Needs slight improvement'),

-- Neha Sharma
(102, '2024-01-01', 'Feedback', 4.8, 'Excellent leadership feedback'),
(102, '2024-02-01', 'System Design', 4.7, 'Efficient design choices'),
(102, '2024-03-01', 'Mentoring', 4.5, 'Guided interns well'),
(102, '2024-04-01', 'Code Review', 4.6, 'Caught critical issues'),
(102, '2024-05-01', 'Client Communication', 4.4, 'Handled meetings effectively');

-- Insert sample course completion data
INSERT INTO t_course_completion (emp_id, course_id, start_date, duration, score) VALUES
(101, 201, '2024-01-01', 1.8, 4.6),
(102, 202, '2024-01-05', 2.0, 4.7),
(103, 203, '2024-02-10', 2.5, 4.3),
(104, 204, '2024-02-15', 1.5, 4.5),
(105, 206, '2024-03-01', 2.1, 4.8),
(106, 207, '2024-03-05', 1.7, 4.4),
(107, 213, '2024-03-10', 2.3, 4.5),
(108, 208, '2024-03-15', 2.0, 4.2),
(109, 219, '2024-03-20', 1.8, 4.6),
(110, 209, '2024-03-25', 2.4, 4.3);

-- Insert sample project data
INSERT INTO t_emp_projects VALUES
(1001, 'Inventory Automation Tool', 101, 'Backend Developer', 5, '2023-07-15', 'Python, Flask', '{"Python": 4, "SQL": 3}'),
(1002, 'AI Chatbot Integration', 101, 'Lead Developer', 4, '2024-01-20', 'Python, Rasa', '{"Python": 4, "NLP": 3}'),
(1003, 'Enterprise API Gateway', 102, 'System Architect', 6, '2023-06-01', 'Java, Spring Boot', '{"Java": 5, "System Design": 4}'),
(1004, 'Payments Platform Refactor', 102, 'Tech Lead', 5, '2024-02-10', 'Java, Kafka', '{"Java": 5, "Microservices": 4}'),
(1005, 'ML Sales Predictor', 103, 'ML Engineer', 4, '2023-08-10', 'Python, Scikit-Learn', '{"Machine Learning": 4, "Pandas": 3}'),
(1006, 'NLP Ticket Classifier', 103, 'Data Scientist', 5, '2024-03-05', 'Python, Transformers', '{"NLP": 4, "Deep Learning": 3}'),
(1007, 'Sales Dashboard', 104, 'Data Analyst', 3, '2023-05-20', 'Excel, Power BI', '{"Excel": 4, "Data Visualization": 3}'),
(1008, 'Retail KPI Tracker', 104, 'Senior Analyst', 4, '2024-04-01', 'Power BI, SQL', '{"Power BI": 4, "SQL": 4}'),
(1009, 'HRMS Implementation', 105, 'Project Manager', 6, '2023-03-01', 'JIRA, Excel', '{"Scrum": 4, "Project Management": 4}'),
(1010, 'Enterprise Workflow Revamp', 105, 'Senior PM', 5, '2024-05-10', 'MS Project, Azure DevOps', '{"Stakeholder Management": 5, "Agile": 4}');

-- Show all tables
SHOW TABLES;
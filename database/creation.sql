-- Create the database
-- DROP DATABASE recom_dummy;
CREATE DATABASE IF NOT EXISTS recom_dummy;
USE recom_dummy;

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
    manager_ids JSON,
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

-- Create trigger to set expected duration
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

-- Create ongoing courses table
CREATE TABLE t_ongoing_courses (
    emp_id INT,
    course_id INT,
    course_name VARCHAR(100),
    start_date DATE,
    current_progress INT CHECK (current_progress >= 0 AND current_progress < 100),
    FOREIGN KEY (emp_id) REFERENCES m_emp(emp_id),
    FOREIGN KEY (course_id) REFERENCES m_courses(course_id)
);

-- Create projects master table
CREATE TABLE m_projects (
    project_id INT PRIMARY KEY,
    project_name VARCHAR(100),
    client VARCHAR(100),
    duration FLOAT,
    start_date DATE,
    skills JSON,
    status VARCHAR(50),
    manager_ids JSON
);

-- Create employee projects table
CREATE TABLE t_emp_projects (
    tep_id INT PRIMARY KEY AUTO_INCREMENT,
    emp_id INT,
    project_id INT,
    role VARCHAR(100),
    skills JSON,
    FOREIGN KEY (emp_id) REFERENCES m_emp(emp_id),
    FOREIGN KEY (project_id) REFERENCES m_projects(project_id)
);

-- Create recommendations table
CREATE TABLE t_recommendation (
    recommendation_id INT PRIMARY KEY AUTO_INCREMENT,
    emp_id INT,
    goal VARCHAR(255),
    output JSON,
    analysis JSON,
    valid BOOLEAN,
    validation_summary JSON,
    last_updated_time DATETIME,
    FOREIGN KEY (emp_id) REFERENCES m_emp(emp_id)
);

-- Add unique constraint for employee-goal combination
ALTER TABLE t_recommendation 
ADD CONSTRAINT unique_emp_goal UNIQUE (emp_id, goal);

-- Show all tables
SHOW TABLES;
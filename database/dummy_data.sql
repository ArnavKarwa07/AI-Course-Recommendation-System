-- Insert roles data (avg_promotion_time between 12-60 months)
INSERT INTO m_roles VALUES
(1, 'Software Engineer', 'Engineering', 'Junior', '{"Python": 3, "Git": 3}', 18),
(2, 'Senior Software Engineer', 'Engineering', 'Mid', '{"Java": 4, "System Design": 3}', 30),
(3, 'Team Lead', 'Engineering', 'Senior', '{"Leadership": 4, "Agile": 4}', 42),
(4, 'Data Scientist', 'Data', 'Junior', '{"Python": 4, "Machine Learning": 3}', 24),
(5, 'Data Analyst', 'Data', 'Junior', '{"Excel": 4, "SQL": 3}', 20),
(6, 'Project Manager', 'Management', 'Senior', '{"Scrum": 4, "JIRA": 4}', 48),
(7, 'HR Executive', 'HR', 'Junior', '{"Communication": 4, "Recruitment": 3}', 22),
(8, 'HR Manager', 'HR', 'Senior', '{"Leadership": 4, "Conflict Resolution": 4}', 54),
(9, 'DevOps Engineer', 'Infrastructure', 'Mid', '{"AWS": 4, "Docker": 4}', 32),
(10, 'Business Analyst', 'Business', 'Mid', '{"Analysis": 4, "Excel": 4}', 28),
(11, 'UI/UX Designer', 'Design', 'Junior', '{"Figma": 4, "User Research": 3}', 26),
(12, 'Marketing Analyst', 'Marketing', 'Junior', '{"SEO": 4, "Analytics": 3}', 24),
(13, 'Finance Analyst', 'Finance', 'Junior', '{"Excel": 4, "Finance": 4}', 30),
(14, 'Tech Lead', 'Engineering', 'Senior', '{"Microservices": 4, "Leadership": 4}', 36),
(15, 'CTO', 'Executive', 'Executive', '{"Strategy": 4, "Technology": 4}', 60);

-- Insert employee data (experience between 0-72 months, manager_ids included)
INSERT INTO m_emp VALUES
(101, 'Arjun Verma', 1, 'Software Engineer', 'Engineering', '{"Python": 4, "Git": 4}', 'Online', 'AI, Web Dev', 'Senior Dev', '2021-07-10', '2023-07-10', 48, 'English, Hindi', JSON_ARRAY(113, 119)),
(102, 'Neha Sharma', 2, 'Senior Software Engineer', 'Engineering', '{"Java": 4, "System Design": 4}', 'Books', 'Backend Systems', 'Tech Lead', '2019-05-12', '2022-05-12', 72, 'English', JSON_ARRAY(113, 106)),
(103, 'Ravi Joshi', 4, 'Data Scientist', 'Data', '{"Python": 4, "ML": 3}', 'Videos', 'Healthcare AI', 'ML Engineer', '2022-01-01', '2024-01-01', 42, 'English', JSON_ARRAY(120)),
(104, 'Simran Kaur', 5, 'Data Analyst', 'Data', '{"SQL": 4, "Excel": 4}', 'Courses', 'Visualization', 'BI Analyst', '2020-09-15', '2023-09-15', 59, 'English', JSON_ARRAY(120, 103)),
(105, 'Manish Mehta', 6, 'Project Manager', 'Management', '{"Scrum": 4}', 'Mentorship', 'Program Management', 'Director', '2016-03-20', '2022-03-20', 72, 'English', JSON_ARRAY()),
(106, 'Priya Kapoor', 3, 'Team Lead', 'Engineering', '{"Leadership": 4, "Agile": 4}', 'Online', 'AI Ethics', 'Engineering Manager', '2017-07-01', '2020-07-01', 66, 'English', JSON_ARRAY(113)),
(107, 'Alok Singh', 7, 'HR Executive', 'HR', '{"Recruitment": 3}', 'Workshops', 'Employee Growth', 'HR Manager', '2022-02-28', '2023-08-28', 35, 'English', JSON_ARRAY(118, 105)),
(108, 'Tanvi Desai', 9, 'DevOps Engineer', 'Infrastructure', '{"Docker": 4, "Kubernetes": 3}', 'Online', 'Cloud', 'Infra Lead', '2021-06-18', '2023-06-18', 48, 'English', JSON_ARRAY(113, 105)),
(109, 'Karan Patel', 10, 'Business Analyst', 'Business', '{"Excel": 4}', 'Podcasts', 'BPM', 'Sr. BA', '2018-11-11', '2022-11-11', 72, 'English', JSON_ARRAY(105)),
(110, 'Megha Nair', 11, 'UI/UX Designer', 'Design', '{"Figma": 4}', 'Bootcamp', 'Design Systems', 'Sr. Designer', '2020-02-20', '2022-02-20', 60, 'English', JSON_ARRAY(116, 113)),
(111, 'Rahul Kumar', 12, 'Marketing Analyst', 'Marketing', '{"SEO": 4}', 'Webinars', 'Growth Hacking', 'Marketing Manager', '2021-09-05', '2023-09-05', 47, 'English', JSON_ARRAY(105, 113)),
(112, 'Sanya Rathi', 13, 'Finance Analyst', 'Finance', '{"Finance": 4}', 'Books', 'Stock Analysis', 'Finance Manager', '2022-04-04', '2024-04-04', 39, 'English', JSON_ARRAY(105)),
(113, 'Amit Thakur', 14, 'Tech Lead', 'Engineering', '{"Leadership": 4}', 'Online', 'Innovation', 'Engineering Head', '2016-01-10', '2019-01-10', 72, 'English', JSON_ARRAY(105)),
(114, 'Divya Shetty', 1, 'Software Engineer', 'Engineering', '{"Python": 4}', 'Online', 'Web3', 'Sr. Software Engineer', '2023-06-01', '2024-06-01', 25, 'English', JSON_ARRAY(113)),
(115, 'Jatin Grover', 5, 'Data Analyst', 'Data', '{"SQL": 4}', 'Courses', 'Retail Data', 'BI Consultant', '2020-10-10', '2022-10-10', 57, 'English', JSON_ARRAY(120)),
(116, 'Nidhi Rane', 11, 'UI/UX Designer', 'Design', '{"Figma": 4}', 'Workshops', 'Design Systems', 'UX Lead', '2021-12-12', '2023-12-12', 43, 'English', JSON_ARRAY(105)),
(117, 'Saurabh Dixit', 7, 'HR Executive', 'HR', '{"Recruitment": 4}', 'Mentorship', 'Culture Dev', 'HRBP', '2022-03-03', '2023-03-03', 40, 'English', JSON_ARRAY(118)),
(118, 'Ritika Jain', 8, 'HR Manager', 'HR', '{"Conflict Resolution": 4}', 'Online', 'People Strategy', 'HR Head', '2015-01-01', '2020-01-01', 72, 'English', JSON_ARRAY(105)),
(119, 'Ankit Rao', 2, 'Senior Software Engineer', 'Engineering', '{"Java": 4}', 'Books', 'Distributed Systems', 'Tech Lead', '2018-08-08', '2021-08-08', 72, 'English', JSON_ARRAY(113)),
(120, 'Isha Bhosale', 4, 'Data Scientist', 'Data', '{"ML": 4}', 'Courses', 'AI', 'AI Lead', '2020-05-05', '2023-05-05', 60, 'English', JSON_ARRAY(105));

-- Insert courses data (durations between 0.5-6 months)
INSERT INTO m_courses VALUES
(201, 'Intro to Python', 'Programming', 'Learn Python basics', '{"Python": 3}', 'Online', 'Beginner', '{}', 2.5),
(202, 'Advanced Java', 'Programming', 'Deep dive into Java', '{"Java": 4}', 'Online', 'Advanced', '{"Java": 3}', 4.0),
(203, 'Machine Learning A-Z', 'Data Science', 'Full ML course', '{"Machine Learning": 4, "Python": 3}', 'Online', 'Intermediate', '{"Python": 3}', 6.0),
(204, 'Data Analysis with Excel', 'Data Analysis', 'Excel for analysis', '{"Excel": 4}', 'Offline', 'Beginner', '{}', 1.5),
(205, 'SQL for Data Analysts', 'Data Analysis', 'SQL queries', '{"SQL": 4}', 'Online', 'Intermediate', '{"Excel": 3}', 2.0),
(206, 'Leadership Essentials', 'Management', 'Lead effectively', '{"Leadership": 4}', 'Workshop', 'Intermediate', '{}', 1.0),
(207, 'Agile & Scrum', 'Project Management', 'Agile methodology', '{"Agile": 4, "Scrum": 4}', 'Online', 'Beginner', '{}', 1.5),
(208, 'AWS Certified DevOps', 'Cloud', 'AWS for DevOps', '{"AWS": 4, "Docker": 3}', 'Online', 'Advanced', '{"Linux": 3}', 5.5),
(209, 'UI Design with Figma', 'Design', 'Design interfaces', '{"Figma": 4}', 'Online', 'Beginner', '{}', 2.0),
(210, 'JIRA for Project Managers', 'Project Management', 'Track projects', '{"JIRA": 4}', 'Online', 'Beginner', '{}', 0.5),
(211, 'Microservices Architecture', 'Software Architecture', 'Service-oriented systems', '{"Microservices": 4}', 'Online', 'Advanced', '{"Java": 3}', 4.5),
(212, 'Financial Modeling', 'Finance', 'Excel for finance', '{"Excel": 4, "Finance": 4}', 'Online', 'Advanced', '{}', 3.0),
(213, 'Conflict Resolution', 'HR', 'Managing workplace conflict', '{"Conflict Resolution": 4}', 'Workshop', 'Intermediate', '{}', 1.0),
(214, 'SEO Masterclass', 'Marketing', 'SEO techniques', '{"SEO": 4}', 'Online', 'Beginner', '{}', 2.5),
(215, 'Power BI Essentials', 'Data Analysis', 'Visualize data', '{"Power BI": 3}', 'Online', 'Intermediate', '{"Excel": 3}', 2.5),
(216, 'AI Ethics', 'AI', 'Ethical considerations in AI', '{"Ethics": 4}', 'Online', 'Intermediate', '{"Machine Learning": 3}', 1.5),
(217, 'Growth Hacking Tactics', 'Marketing', 'Growth strategies', '{"Analytics": 3}', 'Online', 'Intermediate', '{}', 2.0),
(218, 'Cloud Security Basics', 'Cloud', 'Security in cloud systems', '{"Security": 3}', 'Online', 'Beginner', '{}', 1.5),
(219, 'Business Process Management', 'Business', 'Optimizing processes', '{"Analysis": 4}', 'Offline', 'Intermediate', '{}', 3.5),
(220, 'Design Systems Bootcamp', 'Design', 'Advanced design concepts', '{"Design Systems": 4}', 'Bootcamp', 'Advanced', '{"Figma": 3}', 3.5);

-- Insert projects master data (durations between 2-12 months)
INSERT INTO m_projects VALUES
(1001, 'Inventory Automation Tool', 'TechCorp Inc', 6, '2024-07-15', '{"Python": 4, "SQL": 3, "Flask": 3}', 'Completed', JSON_ARRAY(113, 105)),
(1002, 'AI Chatbot Integration', 'E-Commerce Ltd', 4, '2025-06-20', '{"Python": 4, "NLP": 3, "Rasa": 3}', 'In Progress', JSON_ARRAY(113, 120)),
(1003, 'Smart Analytics Platform', 'DataInsights Co', 8, '2025-09-01', '{"Python": 4, "AI": 3, "TensorFlow": 4}', 'Planned', JSON_ARRAY(113, 120)),
(1004, 'Enterprise API Gateway', 'MegaCorp', 7, '2024-06-01', '{"Java": 4, "System Design": 4, "Spring Boot": 4}', 'Completed', JSON_ARRAY(113, 119)),
(1005, 'Payments Platform Refactor', 'FinTech Solutions', 6, '2025-05-10', '{"Java": 4, "Microservices": 4, "Kafka": 3}', 'In Progress', JSON_ARRAY(113, 119)),
(1006, 'Cloud Native Migration', 'CloudFirst Ltd', 10, '2025-08-15', '{"Java": 4, "Cloud": 4, "Kubernetes": 4}', 'Planned', JSON_ARRAY(113, 108)),
(1007, 'ML Sales Predictor', 'SalesBoost Inc', 5, '2024-08-10', '{"Machine Learning": 4, "Pandas": 3, "Scikit-Learn": 4}', 'Completed', JSON_ARRAY(120, 103)),
(1008, 'NLP Ticket Classifier', 'ServiceDesk Pro', 6, '2025-07-05', '{"NLP": 4, "Deep Learning": 3, "Transformers": 4}', 'In Progress', JSON_ARRAY(120, 103)),
(1009, 'Computer Vision Pipeline', 'VisionTech', 8, '2025-10-12', '{"ML": 4, "Vision": 4, "OpenCV": 3}', 'Planned', JSON_ARRAY(120, 103)),
(1010, 'Sales Dashboard', 'RetailChain', 4, '2024-05-20', '{"Excel": 4, "Data Visualization": 3, "Power BI": 4}', 'Completed', JSON_ARRAY(105, 120)),
(1011, 'Retail KPI Tracker', 'ShopSmart', 5, '2025-07-01', '{"Power BI": 4, "SQL": 4, "Analytics": 3}', 'In Progress', JSON_ARRAY(105, 120)),
(1012, 'Predictive Analytics Suite', 'FutureData', 7, '2025-11-20', '{"Analytics": 4, "Python": 3, "Tableau": 4}', 'Planned', JSON_ARRAY(105, 120)),
(1013, 'HRMS Implementation', 'HRTech Corp', 8, '2024-03-01', '{"Scrum": 4, "Project Management": 4, "JIRA": 3}', 'Completed', JSON_ARRAY(105, 118)),
(1014, 'Enterprise Workflow Revamp', 'WorkFlow Inc', 6, '2025-05-10', '{"Stakeholder Management": 4, "Agile": 4, "Process Design": 3}', 'In Progress', JSON_ARRAY(105)),
(1015, 'Digital Transformation Initiative', 'Transform Ltd', 12, '2025-09-15', '{"Strategy": 4, "Leadership": 4, "Change Management": 4}', 'Planned', JSON_ARRAY(105)),
(1016, 'Agile Migration', 'AgileCorp', 5, '2024-06-20', '{"Agile": 4, "Team Management": 3, "Scrum": 4}', 'Completed', JSON_ARRAY(113, 105)),
(1017, 'Team Productivity Optimizer', 'ProductivityPro', 6, '2025-06-15', '{"Leadership": 4, "Planning": 4, "Process Improvement": 3}', 'In Progress', JSON_ARRAY(113, 105)),
(1018, 'Innovation Framework Setup', 'InnovateTech', 8, '2025-10-01', '{"Innovation": 4, "Management": 4, "Strategy": 3}', 'Planned', JSON_ARRAY(113, 105)),
(1019, 'Campus Hiring Drive', 'TalentFirst', 3, '2024-07-10', '{"Recruitment": 4, "Coordination": 3, "Communication": 3}', 'Completed', JSON_ARRAY(118, 105)),
(1020, 'Talent Acquisition Strategy 2025', 'HireBest', 5, '2025-07-25', '{"Recruitment Strategy": 4, "Communication": 4, "Planning": 3}', 'In Progress', JSON_ARRAY(118, 105)),
(1021, 'Employee Engagement Program', 'EngageCorp', 6, '2025-12-01', '{"HR Strategy": 4, "Engagement": 3, "Culture": 3}', 'Planned', JSON_ARRAY(118, 105)),
(1022, 'CI/CD Setup', 'DevOpsFirst', 6, '2024-09-01', '{"CI/CD": 4, "Docker": 4, "Jenkins": 3}', 'Completed', JSON_ARRAY(113, 105)),
(1023, 'Cloud Migration Project', 'CloudMigrate', 8, '2025-06-10', '{"AWS": 4, "Kubernetes": 4, "DevOps": 4}', 'In Progress', JSON_ARRAY(113, 105)),
(1024, 'Security Automation Platform', 'SecureOps', 9, '2025-11-05', '{"Security": 4, "Automation": 4, "DevSecOps": 4}', 'Planned', JSON_ARRAY(113, 105)),
(1025, 'Market Research Dashboard', 'MarketInsight', 4, '2024-10-01', '{"Data Analysis": 4, "Visualization": 3, "Business Intelligence": 3}', 'Completed', JSON_ARRAY(105, 111)),
(1026, 'Customer Journey Mapping', 'CustomerFirst', 5, '2025-07-15', '{"Business Process": 4, "UX": 3, "Analytics": 3}', 'In Progress', JSON_ARRAY(105, 110)),
(1027, 'Process Optimization Initiative', 'OptimizePro', 6, '2025-10-30', '{"Process Design": 4, "Optimization": 4, "Analysis": 4}', 'Planned', JSON_ARRAY(105)),
(1028, 'UX Redesign 1.0', 'DesignFirst', 5, '2024-08-05', '{"Figma": 4, "Design Systems": 3, "UX": 4}', 'Completed', JSON_ARRAY(116, 113)),
(1029, 'Accessibility Audit 2.0', 'AccessibleDesign', 6, '2025-07-20', '{"Accessibility": 4, "UX": 4, "Design": 3}', 'In Progress', JSON_ARRAY(116, 113)),
(1030, 'Mobile App Redesign', 'MobileFirst', 8, '2025-12-10', '{"Mobile Design": 4, "Prototyping": 4, "UX": 4}', 'Planned', JSON_ARRAY(116, 113));

-- Insert KPI data
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
(102, '2024-05-01', 'Client Communication', 4.4, 'Handled meetings effectively'),

-- Ravi Joshi
(103, '2024-01-01', 'Feedback', 4.3, 'Recognized for ML innovation'),
(103, '2024-02-01', 'Model Accuracy', 4.2, 'Maintained 92%+ accuracy'),
(103, '2024-03-01', 'Data Cleaning', 4.0, 'Handled large datasets'),
(103, '2024-04-01', 'Research', 4.1, 'Cited sources and experiments'),
(103, '2024-05-01', 'Presentation', 3.8, 'Could simplify better'),

-- Simran Kaur
(104, '2024-01-01', 'Feedback', 4.4, 'Applauded for dashboards'),
(104, '2024-02-01', 'Excel Proficiency', 4.6, 'Advanced pivot work'),
(104, '2024-03-01', 'Reporting Accuracy', 4.2, 'High precision'),
(104, '2024-04-01', 'SQL Queries', 4.3, 'Optimized joins'),
(104, '2024-05-01', 'Time Management', 3.9, 'Good with deadlines'),

-- Manish Mehta
(105, '2024-01-01', 'Feedback', 4.9, 'Excellent cross-team leadership'),
(105, '2024-02-01', 'Budget Management', 4.7, 'Saved 10% costs'),
(105, '2024-03-01', 'Timeline Delivery', 4.6, 'Projects on time'),
(105, '2024-04-01', 'Conflict Resolution', 4.5, 'Handled escalation'),
(105, '2024-05-01', 'Stakeholder Sync', 4.3, 'Clear weekly syncs'),

-- Priya Kapoor
(106, '2024-01-01', 'Feedback', 4.6, 'Team trusts her leadership'),
(106, '2024-02-01', 'Sprint Planning', 4.2, 'Well-structured sprints'),
(106, '2024-03-01', 'Risk Mitigation', 4.4, 'Proactive issue resolution'),
(106, '2024-04-01', 'Retrospective Quality', 4.3, 'Insightful analysis'),
(106, '2024-05-01', 'Velocity', 4.0, 'Consistent delivery pace'),

-- Alok Singh
(107, '2024-01-01', 'Feedback', 4.1, 'Positively received by new hires'),
(107, '2024-02-01', 'Recruitment Speed', 4.3, 'Quick turnaround'),
(107, '2024-03-01', 'Candidate Experience', 4.5, 'Positive reviews'),
(107, '2024-04-01', 'Policy Knowledge', 4.2, 'Strong procedural clarity'),
(107, '2024-05-01', 'Onboarding Quality', 4.4, 'Structured orientation'),

-- Tanvi Desai
(108, '2024-01-01', 'Feedback', 4.2, 'Helped infra transition'),
(108, '2024-02-01', 'Deployment Time', 4.3, 'Quick container rollouts'),
(108, '2024-03-01', 'Monitoring Alerts', 4.0, 'Responds swiftly'),
(108, '2024-04-01', 'Downtime Handling', 4.5, 'Reduced production issues'),
(108, '2024-05-01', 'Automation Coverage', 4.1, 'Increased CI/CD use'),

-- Karan Patel
(109, '2024-01-01', 'Feedback', 4.3, 'Clear presentation of findings'),
(109, '2024-02-01', 'Requirement Gathering', 4.4, 'Stakeholder alignment'),
(109, '2024-03-01', 'Process Mapping', 4.1, 'Logical and precise'),
(109, '2024-04-01', 'Cost Optimization', 4.2, 'Highlighted key savings'),
(109, '2024-05-01', 'Client Reports', 4.0, 'Well received'),

-- Megha Nair
(110, '2024-01-01', 'Feedback', 4.4, 'Designs appreciated by users'),
(110, '2024-02-01', 'Wireframing', 4.2, 'Efficient layout'),
(110, '2024-03-01', 'User Testing', 4.3, 'Gathered insightful feedback'),
(110, '2024-04-01', 'Accessibility', 4.1, 'Implemented key fixes'),
(110, '2024-05-01', 'Design Consistency', 4.0, 'Aligned to brand'),

-- Rahul Kumar
(111, '2024-01-01', 'Feedback', 4.5, 'SEO results well regarded'),
(111, '2024-02-01', 'Traffic Growth', 4.4, '15% MoM increase'),
(111, '2024-03-01', 'Campaign ROI', 4.2, 'Strong returns'),
(111, '2024-04-01', 'Keyword Ranking', 4.3, 'Top 5 for 12 terms'),
(111, '2024-05-01', 'CTR', 4.1, 'Good click-through rate'),

-- Sanya Rathi
(112, '2024-01-01', 'Feedback', 4.6, 'Recognized for financial insights'),
(112, '2024-02-01', 'Budget Forecast', 4.3, 'Accurate quarterly projections'),
(112, '2024-03-01', 'Profitability Metrics', 4.5, 'Balanced risk/reward'),
(112, '2024-04-01', 'Compliance', 4.4, 'Well-documented records'),
(112, '2024-05-01', 'Audit Prep', 4.2, 'Clean handover'),

-- Amit Thakur
(113, '2024-01-01', 'Feedback', 4.7, 'Leadership recognized by CTO'),
(113, '2024-02-01', 'Architecture Design', 4.6, 'Highly scalable decisions'),
(113, '2024-03-01', 'Team Coaching', 4.5, 'Helped 3 juniors level up'),
(113, '2024-04-01', 'Tech Strategy', 4.4, 'Aligned with product goals'),
(113, '2024-05-01', 'Innovation', 4.2, 'Proposed ML integrations'),

-- Divya Shetty
(114, '2024-01-01', 'Feedback', 4.1, 'Good technical contributions'),
(114, '2024-02-01', 'Code Quality', 4.3, 'Clean implementations'),
(114, '2024-03-01', 'Learning Pace', 4.2, 'Quick to adapt'),
(114, '2024-04-01', 'Team Integration', 4.0, 'Collaborative approach'),
(114, '2024-05-01', 'Innovation', 3.9, 'Shows potential'),

-- Jatin Grover
(115, '2024-01-01', 'Feedback', 4.4, 'Timely report submissions'),
(115, '2024-02-01', 'SQL Optimization', 4.3, 'Queries run 30% faster'),
(115, '2024-03-01', 'ETL Monitoring', 4.2, 'No failed jobs'),
(115, '2024-04-01', 'Ad-hoc Reporting', 4.1, 'Quick turnaround'),
(115, '2024-05-01', 'Insight Delivery', 4.0, 'Useful business insights'),

-- Nidhi Rane
(116, '2024-01-01', 'Feedback', 4.5, 'Great user testing facilitation'),
(116, '2024-02-01', 'Design Systems', 4.4, 'Aligned with brand'),
(116, '2024-03-01', 'Style Guides', 4.3, 'Thorough documentation'),
(116, '2024-04-01', 'Motion Design', 4.0, 'Enhanced user flow'),
(116, '2024-05-01', 'Accessibility Audits', 4.2, 'Key gaps fixed'),

-- Saurabh Dixit
(117, '2024-01-01', 'Feedback', 4.4, 'Smooth onboarding for 10+ hires'),
(117, '2024-02-01', 'Hiring Accuracy', 4.2, 'Matched profiles well'),
(117, '2024-03-01', 'Referral Program', 4.1, 'Increased participation'),
(117, '2024-04-01', 'Training Sessions', 4.3, 'Well-received modules'),
(117, '2024-05-01', 'Attrition Rate Reduction', 4.0, 'Retained key staff'),

-- Ritika Jain
(118, '2024-01-01', 'Feedback', 4.8, 'Handled crises professionally'),
(118, '2024-02-01', 'HR Strategy', 4.7, 'Built roadmap for FY25'),
(118, '2024-03-01', 'Leadership Mentoring', 4.5, 'Supported succession plans'),
(118, '2024-04-01', 'Policy Updates', 4.6, 'Aligned with regulations'),
(118, '2024-05-01', 'Performance Reviews', 4.4, 'Bias-free evaluations'),

-- Ankit Rao
(119, '2024-01-01', 'Feedback', 4.4, 'Team values his insights'),
(119, '2024-02-01', 'Microservices', 4.6, 'Proper boundaries established'),
(119, '2024-03-01', 'API Design', 4.3, 'Clear and consistent'),
(119, '2024-04-01', 'System Load Testing', 4.2, 'Improved response time'),
(119, '2024-05-01', 'Code Reviews', 4.1, 'Detail-oriented'),

-- Isha Bhosale
(120, '2024-01-01', 'Feedback', 4.6, 'Strong AI delivery'),
(120, '2024-02-01', 'Pipeline Optimization', 4.4, 'Reduced training time'),
(120, '2024-03-01', 'Model Deployment', 4.3, 'CI/CD for ML live'),
(120, '2024-04-01', 'Experiment Tracking', 4.2, 'MLflow used well'),
(120, '2024-05-01', 'Post-Mortems', 4.1, 'Identified key fixes');

-- Insert course completion data (durations between 0.5-6 months)
INSERT INTO t_course_completion (emp_id, course_id, start_date, duration, score) VALUES
(101, 201, '2024-01-01', 2.3, 4.6),
(102, 202, '2024-01-05', 3.8, 4.7),
(103, 203, '2024-02-10', 5.8, 4.3),
(104, 204, '2024-02-15', 1.4, 4.5),
(105, 206, '2024-03-01', 1.1, 4.8),
(106, 207, '2024-03-05', 1.6, 4.4),
(107, 213, '2024-03-10', 1.2, 4.5),
(108, 208, '2024-03-15', 5.2, 4.2),
(109, 219, '2024-03-20', 3.2, 4.6),
(110, 209, '2024-03-25', 2.1, 4.3),
(111, 214, '2024-04-01', 2.4, 4.7),
(112, 212, '2024-04-05', 2.9, 4.5),
(113, 211, '2024-04-10', 4.2, 4.8),
(114, 220, '2024-04-15', 3.4, 4.4),
(115, 205, '2024-04-20', 2.2, 4.1),
(116, 210, '2024-04-25', 0.6, 4.6),
(117, 215, '2024-05-01', 2.3, 4.3),
(118, 216, '2024-05-05', 1.4, 4.7),
(119, 217, '2024-05-10', 1.9, 4.5),
(120, 218, '2024-05-15', 1.3, 4.4);

-- Insert employee projects data (linking employees to projects with their roles)
INSERT INTO t_emp_projects (emp_id, project_id, role, skills) VALUES
-- Arjun Verma (101) - Projects 1001, 1002, 1003
(101, 1001, 'Backend Developer', '{"Python": 4, "SQL": 3, "Flask": 3}'),
(101, 1002, 'Lead Developer', '{"Python": 4, "NLP": 3, "Rasa": 3}'),
(101, 1003, 'Senior Developer', '{"Python": 4, "AI": 3, "TensorFlow": 4}'),

-- Neha Sharma (102) - Projects 1004, 1005, 1006
(102, 1004, 'System Architect', '{"Java": 4, "System Design": 4, "Spring Boot": 4}'),
(102, 1005, 'Tech Lead', '{"Java": 4, "Microservices": 4, "Kafka": 3}'),
(102, 1006, 'Solution Architect', '{"Java": 4, "Cloud": 4, "Kubernetes": 4}'),

-- Ravi Joshi (103) - Projects 1007, 1008, 1009
(103, 1007, 'ML Engineer', '{"Machine Learning": 4, "Pandas": 3, "Scikit-Learn": 4}'),
(103, 1008, 'Data Scientist', '{"NLP": 4, "Deep Learning": 3, "Transformers": 4}'),
(103, 1009, 'AI Engineer', '{"ML": 4, "Vision": 4, "OpenCV": 3}'),

-- Simran Kaur (104) - Projects 1010, 1011, 1012
(104, 1010, 'Data Analyst', '{"Excel": 4, "Data Visualization": 3, "Power BI": 4}'),
(104, 1011, 'Senior Analyst', '{"Power BI": 4, "SQL": 4, "Analytics": 3}'),
(104, 1012, 'BI Analyst', '{"Analytics": 4, "Python": 3, "Tableau": 4}'),

-- Manish Mehta (105) - Projects 1013, 1014, 1015
(105, 1013, 'Project Manager', '{"Scrum": 4, "Project Management": 4, "JIRA": 3}'),
(105, 1014, 'Senior PM', '{"Stakeholder Management": 4, "Agile": 4, "Process Design": 3}'),
(105, 1015, 'Program Manager', '{"Strategy": 4, "Leadership": 4, "Change Management": 4}'),

-- Priya Kapoor (106) - Projects 1016, 1017, 1018
(106, 1016, 'Scrum Master', '{"Agile": 4, "Team Management": 3, "Scrum": 4}'),
(106, 1017, 'Project Lead', '{"Leadership": 4, "Planning": 4, "Process Improvement": 3}'),
(106, 1018, 'Engineering Manager', '{"Innovation": 4, "Management": 4, "Strategy": 3}'),

-- Alok Singh (107) - Projects 1019, 1020, 1021
(107, 1019, 'HR Coordinator', '{"Recruitment": 4, "Coordination": 3, "Communication": 3}'),
(107, 1020, 'HR Specialist', '{"Recruitment Strategy": 4, "Communication": 4, "Planning": 3}'),
(107, 1021, 'HR Business Partner', '{"HR Strategy": 4, "Engagement": 3, "Culture": 3}'),

-- Tanvi Desai (108) - Projects 1022, 1023, 1024
(108, 1022, 'DevOps Engineer', '{"CI/CD": 4, "Docker": 4, "Jenkins": 3}'),
(108, 1023, 'Infrastructure Lead', '{"AWS": 4, "Kubernetes": 4, "DevOps": 4}'),
(108, 1024, 'Senior DevOps', '{"Security": 4, "Automation": 4, "DevSecOps": 4}'),

-- Karan Patel (109) - Projects 1025, 1026, 1027
(109, 1025, 'Business Analyst', '{"Data Analysis": 4, "Visualization": 3, "Business Intelligence": 3}'),
(109, 1026, 'BA Lead', '{"Business Process": 4, "UX": 3, "Analytics": 3}'),
(109, 1027, 'Senior BA', '{"Process Design": 4, "Optimization": 4, "Analysis": 4}'),

-- Megha Nair (110) - Projects 1028, 1029, 1030
(110, 1028, 'UI Designer', '{"Figma": 4, "Design Systems": 3, "UX": 4}'),
(110, 1029, 'UX Lead', '{"Accessibility": 4, "UX": 4, "Design": 3}'),
(110, 1030, 'Senior Designer', '{"Mobile Design": 4, "Prototyping": 4, "UX": 4}'),

-- Additional employees on multiple projects for realistic overlap
-- Rahul Kumar (111) - SEO and Growth projects
(111, 1025, 'Marketing Analyst', '{"SEO": 4, "Analytics": 3, "Digital Marketing": 3}'),

-- Sanya Rathi (112) - Finance projects
(112, 1013, 'Finance Consultant', '{"Finance": 4, "Budgeting": 3, "Analysis": 3}'),

-- Amit Thakur (113) - Tech Lead on multiple engineering projects
(113, 1001, 'Technical Advisor', '{"Leadership": 4, "Architecture": 4, "Mentoring": 3}'),
(113, 1004, 'Tech Lead', '{"Leadership": 4, "System Design": 4, "Java": 3}'),
(113, 1016, 'Engineering Manager', '{"Leadership": 4, "Agile": 4, "Team Management": 4}'),

-- Divya Shetty (114) - Junior developer on projects
(114, 1002, 'Junior Developer', '{"Python": 3, "Learning": 4, "Development": 3}'),

-- Jatin Grover (115) - Data projects
(115, 1010, 'Data Analyst', '{"SQL": 4, "Excel": 3, "Reporting": 3}'),
(115, 1011, 'BI Specialist', '{"SQL": 4, "Power BI": 3, "Analytics": 3}'),

-- Nidhi Rane (116) - Design projects
(116, 1028, 'UI/UX Designer', '{"Figma": 4, "Design": 4, "Prototyping": 3}'),
(116, 1029, 'UX Designer', '{"UX": 4, "Accessibility": 3, "Research": 3}'),

-- Saurabh Dixit (117) - HR projects
(117, 1019, 'HR Analyst', '{"Recruitment": 3, "Analysis": 3, "Coordination": 3}'),
(117, 1020, 'Recruitment Specialist', '{"Recruitment": 4, "Strategy": 3, "Communication": 3}'),

-- Ritika Jain (118) - Senior HR on strategic projects
(118, 1013, 'HR Director', '{"HR Strategy": 4, "Leadership": 4, "Change Management": 4}'),
(118, 1021, 'Chief People Officer', '{"Strategy": 4, "Leadership": 4, "Culture": 4}'),

-- Ankit Rao (119) - Senior engineering projects
(119, 1004, 'Senior Software Engineer', '{"Java": 4, "Microservices": 3, "System Design": 4}'),
(119, 1005, 'System Architect', '{"Java": 4, "Microservices": 4, "Architecture": 4}'),

-- Isha Bhosale (120) - AI/ML projects
(120, 1007, 'Data Science Lead', '{"ML": 4, "Leadership": 3, "Mentoring": 3}'),
(120, 1008, 'AI Engineering Lead', '{"AI": 4, "NLP": 4, "Leadership": 3}'),
(120, 1009, 'AI Lead', '{"AI": 4, "Vision": 4, "Strategy": 3}');

-- Insert ongoing courses data
INSERT INTO t_ongoing_courses VALUES
-- Engineering department employees
(101, 202, 'Advanced Java', '2025-06-01', 75),
(101, 211, 'Microservices Architecture', '2025-07-15', 45),
(102, 206, 'Leadership Essentials', '2025-05-20', 60),
(106, 216, 'AI Ethics', '2025-06-10', 80),
(114, 201, 'Intro to Python', '2025-07-01', 30),
(119, 208, 'AWS Certified DevOps', '2025-05-15', 40),

-- Data department employees
(103, 216, 'AI Ethics', '2025-06-05', 85),
(103, 218, 'Cloud Security Basics', '2025-07-10', 50),
(104, 215, 'Power BI Essentials', '2025-06-20', 70),
(115, 203, 'Machine Learning A-Z', '2025-05-25', 35),
(120, 211, 'Microservices Architecture', '2025-07-05', 25),

-- HR department employees
(107, 206, 'Leadership Essentials', '2025-06-15', 40),
(117, 213, 'Conflict Resolution', '2025-07-20', 60),
(118, 217, 'Growth Hacking Tactics', '2025-05-30', 90),

-- Infrastructure department
(108, 218, 'Cloud Security Basics', '2025-06-25', 55),

-- Business department
(109, 215, 'Power BI Essentials', '2025-07-08', 65),

-- Design department
(110, 220, 'Design Systems Bootcamp', '2025-06-12', 50),
(116, 209, 'UI Design with Figma', '2025-07-18', 35),

-- Marketing department
(111, 217, 'Growth Hacking Tactics', '2025-06-30', 80),

-- Finance department
(112, 204, 'Data Analysis with Excel', '2025-07-12', 45),

-- Management department
(105, 219, 'Business Process Management', '2025-05-28', 70);
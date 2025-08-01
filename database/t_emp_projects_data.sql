-- Insert comprehensive employee projects data (3+ projects per employee)
INSERT INTO t_emp_projects (emp_id, project_id, role, skills) VALUES
-- Arjun Verma (101) - Software Engineer
(101, 1001, 'Backend Developer', '{"Python": 3, "SQL": 3, "Flask": 2}'),
(101, 1011, 'Backend Developer', '{"Python": 3, "APIs": 3, "Integration": 2}'),
(101, 1021, 'Senior Developer', '{"Python": 3, "Cloud": 2, "Microservices": 2}'),

-- Neha Sharma (102) - Senior Software Engineer
(102, 1004, 'System Architect', '{"Java": 4, "System Design": 4, "Architecture": 4}'),
(102, 1013, 'Tech Lead', '{"Java": 4, "Microservices": 4, "Leadership": 4}'),
(102, 1031, 'Principal Engineer', '{"Architecture": 4, "System Design": 4, "Leadership": 3}'),

-- Ravi Joshi (103) - Data Scientist
(103, 1003, 'Data Engineer', '{"Python": 4, "Spark": 3, "ML": 3}'),
(103, 1022, 'ML Engineer', '{"Machine Learning": 3, "Python": 4, "Statistics": 4}'),
(103, 1023, 'Senior Data Scientist', '{"NLP": 3, "Deep Learning": 2, "Python": 4}'),
(103, 1024, 'Computer Vision Lead', '{"ML": 3, "Vision": 2, "Python": 4}'),

-- Simran Kaur (104) - Data Analyst
(104, 1005, 'Data Analyst', '{"Power BI": 3, "SQL": 4, "Analytics": 3}'),
(104, 1012, 'Analytics Specialist', '{"Analytics": 3, "Power BI": 3, "SQL": 4}'),
(104, 1026, 'Senior Analyst', '{"Analytics": 3, "Visualization": 3, "SQL": 4}'),

-- Manish Mehta (105) - Project Manager
(105, 1001, 'Project Manager', '{"Project Management": 4, "Leadership": 4, "Risk Management": 3}'),
(105, 1007, 'Program Manager', '{"Program Management": 4, "Stakeholder Management": 4, "Budget": 2}'),
(105, 1020, 'Senior PM', '{"Project Management": 4, "Financial Planning": 3, "Leadership": 4}'),

-- Priya Kapoor (106) - Team Lead
(106, 1002, 'Engineering Lead', '{"Leadership": 4, "React": 3, "Team Management": 4}'),
(106, 1014, 'Tech Lead', '{"Leadership": 4, "Technical Guidance": 3, "Mentoring": 3}'),
(106, 1039, 'Engineering Manager', '{"Team Building": 4, "Leadership": 4, "Mentoring": 3}'),

-- Alok Singh (107) - HR Executive
(107, 1005, 'HR Coordinator', '{"HR Processes": 3, "Employee Relations": 2, "Recruitment": 3}'),
(107, 1014, 'HR Business Partner', '{"Employee Relations": 2, "Performance Management": 2, "Onboarding": 3}'),
(107, 1033, 'Change Agent', '{"Change Management": 2, "Communication": 4, "Training": 3}'),

-- Tanvi Desai (108) - DevOps Engineer
(108, 1009, 'Cloud Engineer', '{"AWS": 4, "Docker": 4, "Infrastructure": 3}'),
(108, 1015, 'DevOps Specialist', '{"Jenkins": 3, "Docker": 4, "Automation": 3}'),
(108, 1025, 'Senior DevOps', '{"Kubernetes": 3, "Docker": 4, "CI/CD": 3}'),

-- Karan Patel (109) - Business Analyst
(109, 1001, 'Business Analyst', '{"Requirements": 4, "Analysis": 4, "Excel": 3}'),
(109, 1019, 'Senior BA', '{"Process Mapping": 3, "Analysis": 4, "Optimization": 3}'),
(109, 1035, 'Process Analyst', '{"Process Analysis": 4, "Requirements": 4, "Documentation": 3}'),

-- Megha Nair (110) - UI/UX Designer
(110, 1002, 'UI Designer', '{"Figma": 4, "UI Design": 4, "Prototyping": 4}'),
(110, 1018, 'UX Designer', '{"User Research": 3, "Prototyping": 4, "Mobile Design": 3}'),
(110, 1030, 'Design Lead', '{"Design Systems": 4, "Figma": 4, "Leadership": 3}'),

-- Rahul Kumar (111) - Marketing Analyst
(111, 1006, 'Marketing Analyst', '{"SEO": 4, "Analytics": 3, "Campaign Analysis": 3}'),
(111, 1016, 'Digital Marketing Specialist', '{"SEO": 4, "Analytics": 3, "Social Media": 2}'),
(111, 1028, 'Marketing Lead', '{"Content Strategy": 3, "SEO": 4, "Analytics": 3}'),

-- Sanya Rathi (112) - Finance Analyst
(112, 1007, 'Financial Analyst', '{"Financial Modeling": 3, "Excel": 4, "Analysis": 3}'),
(112, 1020, 'Senior Finance Analyst', '{"Financial Modeling": 3, "Excel": 4, "Planning": 3}'),
(112, 1036, 'Finance Business Partner', '{"Financial Analysis": 3, "Budget Planning": 3, "Excel": 4}'),

-- Amit Thakur (113) - Tech Lead
(113, 1001, 'Technical Lead', '{"Leadership": 4, "Architecture": 4, "Mentoring": 4}'),
(113, 1004, 'Principal Engineer', '{"System Design": 4, "Leadership": 4, "Architecture": 4}'),
(113, 1011, 'Engineering Manager', '{"Technical Leadership": 4, "Team Management": 4, "Strategy": 3}'),
(113, 1012, 'Tech Lead', '{"Technical Strategy": 4, "Leadership": 4, "Innovation": 4}'),
(113, 1013, 'Senior Tech Lead', '{"Architecture": 4, "Leadership": 4, "System Design": 3}'),
(113, 1018, 'Mobile Tech Lead', '{"Technical Leadership": 4, "Mobile Strategy": 3, "Team Management": 4}'),
(113, 1021, 'Cloud Migration Lead', '{"Cloud Architecture": 3, "Leadership": 4, "Migration Strategy": 3}'),
(113, 1031, 'Chief Architect', '{"Enterprise Architecture": 4, "Strategic Planning": 4, "Leadership": 4}'),

-- Divya Shetty (114) - Software Engineer
(114, 1002, 'Frontend Developer', '{"React": 2, "JavaScript": 3, "UI Development": 2}'),
(114, 1018, 'Mobile Developer', '{"React Native": 2, "Mobile Development": 2, "JavaScript": 3}'),
(114, 1030, 'UI Developer', '{"Frontend": 2, "Design Implementation": 2, "React": 2}'),

-- Jatin Grover (115) - Data Analyst
(115, 1003, 'Data Analyst', '{"SQL": 4, "Data Processing": 3, "Analytics": 3}'),
(115, 1005, 'BI Analyst', '{"Power BI": 3, "SQL": 4, "Dashboard": 3}'),
(115, 1022, 'Data Specialist', '{"SQL": 4, "Data Analysis": 3, "Python": 2}'),

-- Nidhi Rane (116) - UI/UX Designer
(116, 1010, 'Senior Designer', '{"Design Systems": 4, "Figma": 4, "User Experience": 3}'),
(116, 1014, 'UX Lead', '{"User Experience": 3, "Design Systems": 4, "Leadership": 3}'),
(116, 1030, 'Design System Lead', '{"Design Systems": 4, "Leadership": 3, "Accessibility": 3}'),

-- Saurabh Dixit (117) - HR Executive
(117, 1005, 'HR Specialist', '{"Recruitment": 4, "Employee Engagement": 2, "Training": 3}'),
(117, 1014, 'HR Analyst', '{"HR Analytics": 2, "Performance Management": 2, "Recruitment": 4}'),
(117, 1033, 'HR Business Partner', '{"Culture Development": 2, "Change Management": 2, "Training": 3}'),

-- Ritika Jain (118) - HR Manager
(118, 1005, 'HR Manager', '{"Strategic HR": 4, "Leadership": 4, "Performance Management": 3}'),
(118, 1014, 'People Operations Lead', '{"Performance Systems": 3, "Leadership": 4, "Strategic Planning": 4}'),
(118, 1033, 'Change Management Lead', '{"Change Management": 4, "Leadership": 4, "Organizational Development": 3}'),

-- Ankit Rao (119) - Senior Software Engineer
(119, 1004, 'Senior Developer', '{"Java": 4, "Spring Boot": 4, "API Design": 3}'),
(119, 1013, 'Microservices Lead', '{"Microservices": 3, "Java": 4, "System Design": 4}'),
(119, 1031, 'Backend Architect', '{"System Design": 4, "Java": 4, "Architecture": 3}'),

-- Isha Bhosale (120) - Data Scientist
(120, 1003, 'Senior Data Scientist', '{"ML": 4, "Python": 4, "Leadership": 3}'),
(120, 1011, 'AI Lead', '{"AI": 4, "NLP": 4, "Python": 4}'),
(120, 1012, 'ML Platform Lead', '{"AI": 4, "Platform Design": 3, "Leadership": 3}'),
(120, 1022, 'ML Engineering Lead', '{"Machine Learning": 4, "Team Leadership": 3, "Python": 4}'),
(120, 1023, 'NLP Research Lead', '{"NLP": 4, "Deep Learning": 3, "Research": 4}'),
(120, 1024, 'Computer Vision Lead', '{"Computer Vision": 2, "ML": 4, "Research": 4}'),
(120, 1032, 'AI Research Director', '{"AI Strategy": 4, "Research Leadership": 4, "Innovation": 4}'),
(120, 1040, 'Data Science Head', '{"Data Science Strategy": 4, "Team Leadership": 4, "Center of Excellence": 4}'),

-- Vikram Singh (121) - Product Manager
(121, 1014, 'Product Manager', '{"Product Strategy": 4, "User Research": 3, "Analytics": 3}'),
(121, 1026, 'Senior Product Manager', '{"Product Strategy": 4, "Analytics": 3, "User Research": 3}'),
(121, 1037, 'Product Innovation Lead', '{"Product Strategy": 4, "Innovation": 4, "User Research": 3}'),

-- Kavya Reddy (122) - QA Engineer
(122, 1008, 'QA Analyst', '{"Testing": 4, "Mobile Testing": 3, "Bug Tracking": 3}'),
(122, 1015, 'QA Engineer', '{"Test Automation": 2, "Testing": 4, "Selenium": 2}'),
(122, 1027, 'Senior QA', '{"Test Strategy": 3, "Automation": 2, "Framework": 2}'),

-- Rohit Gupta (123) - Security Analyst
(123, 1008, 'Security Analyst', '{"Security Assessment": 4, "Penetration Testing": 2, "Compliance": 3}'),
(123, 1017, 'Cybersecurity Specialist', '{"Cybersecurity": 4, "Risk Assessment": 3, "Compliance": 3}'),
(123, 1034, 'Cloud Security Lead', '{"Cloud Security": 3, "AWS Security": 3, "Compliance": 3}'),

-- Sneha Patil (124) - Content Writer
(124, 1006, 'Content Specialist', '{"Content Writing": 4, "SEO": 3, "Marketing": 2}'),
(124, 1010, 'Content Writer', '{"Writing": 4, "Content Strategy": 2, "Research": 3}'),
(124, 1028, 'Content Strategy Lead', '{"Content Strategy": 2, "SEO": 3, "Writing": 4}'),

-- Arun Kumar (125) - Sales Executive
(125, 1006, 'Sales Representative', '{"Lead Generation": 2, "Communication": 4, "CRM": 3}'),
(125, 1016, 'Account Executive', '{"Client Relations": 3, "Sales Process": 2, "Communication": 4}'),
(125, 1029, 'Senior Sales Executive', '{"Sales Strategy": 2, "Account Management": 3, "CRM": 3}'),

-- Pooja Sharma (126) - Mobile Developer
(126, 1002, 'Mobile Developer', '{"React Native": 3, "Mobile UI": 3, "JavaScript": 4}'),
(126, 1018, 'Senior Mobile Developer', '{"React Native": 3, "iOS": 2, "Android": 3}'),
(126, 1030, 'Mobile UI Specialist', '{"Mobile UI": 3, "React Native": 3, "Design": 2}'),

-- Manoj Agarwal (127) - Cloud Architect
(127, 1009, 'Cloud Architect', '{"AWS": 4, "Cloud Design": 4, "Terraform": 4}'),
(127, 1021, 'Principal Cloud Architect', '{"Cloud Strategy": 4, "Kubernetes": 3, "Leadership": 3}'),
(127, 1025, 'DevOps Architecture Lead', '{"Cloud Architecture": 4, "DevOps Strategy": 4, "Leadership": 3}'),
(127, 1034, 'Cloud Security Architect', '{"Cloud Security": 4, "AWS": 4, "Security Design": 3}'),

-- Deepika Joshi (128) - Senior QA Engineer
(128, 1015, 'QA Lead', '{"Test Strategy": 4, "Team Leadership": 4, "Automation": 4}'),
(128, 1027, 'QA Framework Lead', '{"Framework Design": 4, "Test Strategy": 4, "Leadership": 3}'),
(128, 1038, 'Quality Manager', '{"Quality Strategy": 4, "Process Improvement": 4, "Leadership": 3}'),

-- Suresh Iyer (129) - Operations Manager
(129, 1019, 'Operations Lead', '{"Process Optimization": 4, "Team Leadership": 4, "Efficiency": 3}'),
(129, 1035, 'Operations Director', '{"Operations Strategy": 4, "Process Excellence": 4, "Leadership": 4}'),
(129, 1038, 'Process Excellence Manager', '{"Process Improvement": 4, "Quality Management": 3, "Leadership": 4}'),

-- Anjali Mishra (130) - Senior Sales Manager
(130, 1006, 'Sales Manager', '{"Sales Strategy": 4, "Team Management": 4, "Revenue Planning": 3}'),
(130, 1016, 'Regional Sales Director', '{"Sales Leadership": 4, "Market Strategy": 4, "Team Development": 4}'),
(130, 1028, 'Marketing Sales Lead', '{"Sales Strategy": 4, "Marketing Alignment": 3, "Team Leadership": 4}'),
(130, 1029, 'Sales Operations Director', '{"Sales Strategy": 4, "CRM Strategy": 3, "Team Leadership": 4}'),
(130, 1036, 'VP Sales', '{"Strategic Sales": 4, "Market Expansion": 4, "Executive Leadership": 4}'),

-- Junior employees (131-140) with growth trajectory projects
(131, 1002, 'Junior Developer', '{"Python": 2, "Git": 3, "Learning": 3}'),
(131, 1021, 'Software Developer', '{"Python": 2, "Cloud Basics": 1, "Development": 2}'),
(131, 1031, 'Full Stack Developer', '{"Full Stack": 2, "Python": 2, "Learning": 3}'),

(132, 1005, 'Junior Data Analyst', '{"Excel": 4, "SQL": 3, "Reporting": 2}'),
(132, 1022, 'Data Analyst', '{"SQL": 3, "Analytics": 2, "Excel": 4}'),
(132, 1040, 'Senior Data Analyst', '{"Advanced Analytics": 2, "SQL": 3, "Business Intelligence": 2}'),

(133, 1009, 'DevOps Trainee', '{"Linux": 4, "Docker": 3, "AWS": 3}'),
(133, 1025, 'DevOps Engineer', '{"Docker": 3, "AWS": 3, "Automation": 3}'),
(133, 1034, 'Senior DevOps', '{"Cloud DevOps": 3, "Security": 2, "Leadership": 2}'),

(134, 1010, 'Junior Designer', '{"Figma": 3, "Design": 2, "Learning": 3}'),
(134, 1018, 'Product Designer', '{"Mobile Design": 2, "Figma": 3, "User Research": 2}'),
(134, 1030, 'UI/UX Designer', '{"Design Systems": 2, "Figma": 3, "Accessibility": 2}'),

(135, 1008, 'QA Trainee', '{"Manual Testing": 4, "Bug Tracking": 3, "Learning": 3}'),
(135, 1015, 'QA Engineer', '{"Testing": 4, "Test Cases": 4, "Automation": 2}'),
(135, 1027, 'Senior QA Engineer', '{"Advanced Testing": 3, "Test Strategy": 2, "Leadership": 2}'),

(136, 1006, 'Marketing Trainee', '{"SEO": 3, "Analytics": 4, "Learning": 3}'),
(136, 1016, 'Digital Marketing Analyst', '{"SEO": 3, "Google Ads": 3, "Analytics": 4}'),
(136, 1028, 'Marketing Specialist', '{"Digital Marketing": 3, "Content": 2, "SEO": 3}'),

(137, 1006, 'Sales Trainee', '{"Communication": 3, "Learning": 3, "CRM": 2}'),
(137, 1029, 'Sales Executive', '{"Sales Process": 2, "Communication": 3, "CRM": 2}'),
(137, 1036, 'Account Executive', '{"Account Management": 2, "Sales Strategy": 2, "Communication": 3}'),

(138, 1014, 'Associate PM', '{"Product Management": 3, "Analytics": 3, "Learning": 3}'),
(138, 1026, 'Product Manager', '{"Product Strategy": 3, "User Research": 2, "Analytics": 3}'),
(138, 1037, 'Senior Product Manager', '{"Product Innovation": 2, "Strategy": 3, "Leadership": 2}'),

(139, 1008, 'Security Trainee', '{"Security Basics": 3, "Compliance": 3, "Learning": 3}'),
(139, 1017, 'Security Analyst', '{"Network Security": 3, "Vulnerability Assessment": 3, "Compliance": 3}'),
(139, 1034, 'Cloud Security Specialist', '{"Cloud Security": 2, "Security Analysis": 3, "Compliance": 3}'),

(140, 1007, 'Junior Finance Analyst', '{"Excel": 4, "Financial Analysis": 3, "Learning": 2}'),
(140, 1020, 'Finance Analyst', '{"Financial Modeling": 3, "Excel": 4, "Analysis": 3}'),
(140, 1036, 'Senior Finance Analyst', '{"Advanced Analysis": 2, "Financial Planning": 3, "Excel": 4}');
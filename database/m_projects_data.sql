-- Insert expanded projects data with past, current, and future projects
INSERT INTO m_projects VALUES
-- Completed Projects (Past)
(1001, 'Inventory Automation Tool', 'TechCorp Inc', 6, '2023-07-15', '{"Python": 4, "SQL": 3, "Flask": 3}', 'Completed', JSON_ARRAY(113, 105)),
(1002, 'Customer Portal Redesign', 'RetailChain', 4, '2023-08-20', '{"React": 4, "Node.js": 3, "MongoDB": 3}', 'Completed', JSON_ARRAY(113, 106)),
(1003, 'Data Pipeline Optimization', 'DataInsights Co', 5, '2023-09-01', '{"Python": 4, "Apache Spark": 4, "AWS": 3}', 'Completed', JSON_ARRAY(120, 127)),
(1004, 'Enterprise API Gateway', 'MegaCorp', 7, '2023-06-01', '{"Java": 4, "System Design": 4, "Spring Boot": 4}', 'Completed', JSON_ARRAY(113, 119)),
(1005, 'HR Analytics Dashboard', 'InternalProject', 3, '2023-10-15', '{"Power BI": 4, "SQL": 3, "Excel": 3}', 'Completed', JSON_ARRAY(118, 105)),
(1006, 'Marketing Automation System', 'GrowthTech', 4, '2023-11-01', '{"Python": 3, "REST APIs": 3, "Marketing": 4}', 'Completed', JSON_ARRAY(130, 111)),
(1007, 'Financial Reporting Platform', 'FinanceFirst', 5, '2023-05-10', '{"Excel": 4, "SQL": 4, "Tableau": 3}', 'Completed', JSON_ARRAY(105, 112)),
(1008, 'Mobile App Security Audit', 'SecureMobile', 2, '2023-12-01', '{"Security": 4, "Mobile": 3, "Penetration Testing": 4}', 'Completed', JSON_ARRAY(123)),
(1009, 'Cloud Infrastructure Setup', 'CloudFirst Ltd', 6, '2023-04-15', '{"AWS": 4, "Terraform": 4, "Docker": 3}', 'Completed', JSON_ARRAY(127, 108)),
(1010, 'Content Management System', 'ContentCorp', 4, '2023-07-01', '{"PHP": 3, "MySQL": 3, "WordPress": 4}', 'Completed', JSON_ARRAY(113, 124)),

-- Current Projects (In Progress)
(1011, 'AI Chatbot Integration', 'E-Commerce Ltd', 4, '2025-06-20', '{"Python": 4, "NLP": 3, "Rasa": 3}', 'In Progress', JSON_ARRAY(113, 120)),
(1012, 'Smart Analytics Platform', 'DataInsights Co', 8, '2025-05-01', '{"Python": 4, "AI": 3, "TensorFlow": 4}', 'In Progress', JSON_ARRAY(113, 120)),
(1013, 'Payments Platform Refactor', 'FinTech Solutions', 6, '2025-05-10', '{"Java": 4, "Microservices": 4, "Kafka": 3}', 'In Progress', JSON_ARRAY(113, 119)),
(1014, 'Employee Performance System', 'InternalProject', 5, '2025-06-01', '{"React": 4, "Node.js": 3, "PostgreSQL": 3}', 'In Progress', JSON_ARRAY(118, 121)),
(1015, 'Quality Assurance Automation', 'QualityFirst', 3, '2025-06-15', '{"Selenium": 4, "TestNG": 3, "Jenkins": 3}', 'In Progress', JSON_ARRAY(128, 122)),
(1016, 'Digital Marketing Platform', 'MarketLeader', 4, '2025-07-01', '{"SEO": 4, "Analytics": 4, "Social Media": 3}', 'In Progress', JSON_ARRAY(130, 111)),
(1017, 'Security Compliance Framework', 'SecureOrg', 6, '2025-05-20', '{"Cybersecurity": 4, "Compliance": 4, "Risk Assessment": 3}', 'In Progress', JSON_ARRAY(123)),
(1018, 'Mobile App Development', 'AppInnovate', 5, '2025-06-10', '{"React Native": 4, "iOS": 3, "Android": 3}', 'In Progress', JSON_ARRAY(113, 126)),
(1019, 'Business Process Optimization', 'EfficiencyPro', 4, '2025-07-05', '{"Process Mapping": 4, "Analysis": 4, "Lean": 3}', 'In Progress', JSON_ARRAY(129, 109)),
(1020, 'Financial Planning Tool', 'PlanningCorp', 3, '2025-06-25', '{"Excel": 4, "Financial Modeling": 4, "VBA": 3}', 'In Progress', JSON_ARRAY(105, 112)),

-- Future Projects (Planned)
(1021, 'Cloud Native Migration', 'CloudFirst Ltd', 10, '2025-08-15', '{"Java": 4, "Cloud": 4, "Kubernetes": 4}', 'Planned', JSON_ARRAY(113, 127)),
(1022, 'ML Sales Predictor', 'SalesBoost Inc', 5, '2025-09-01', '{"Machine Learning": 4, "Pandas": 3, "Scikit-Learn": 4}', 'Planned', JSON_ARRAY(120, 103)),
(1023, 'NLP Ticket Classifier', 'ServiceDesk Pro', 6, '2025-08-05', '{"NLP": 4, "Deep Learning": 3, "Transformers": 4}', 'Planned', JSON_ARRAY(120, 103)),
(1024, 'Computer Vision Pipeline', 'VisionTech', 8, '2025-09-12', '{"ML": 4, "Vision": 4, "OpenCV": 3}', 'Planned', JSON_ARRAY(120, 103)),
(1025, 'DevOps Transformation', 'DevOpsCorp', 7, '2025-08-20', '{"Docker": 4, "Kubernetes": 4, "Jenkins": 4}', 'Planned', JSON_ARRAY(127, 108)),
(1026, 'Product Analytics Suite', 'ProductFirst', 6, '2025-09-15', '{"Product Strategy": 4, "Analytics": 4, "User Research": 3}', 'Planned', JSON_ARRAY(121)),
(1027, 'Advanced QA Framework', 'QualityPro', 4, '2025-08-30', '{"Test Automation": 4, "Framework Design": 4, "CI/CD": 3}', 'Planned', JSON_ARRAY(128)),
(1028, 'Content Strategy Platform', 'ContentMaster', 5, '2025-09-10', '{"Content Strategy": 4, "SEO": 4, "Analytics": 3}', 'Planned', JSON_ARRAY(130, 124)),
(1029, 'Sales CRM Enhancement', 'SalesMax', 4, '2025-08-25', '{"CRM": 4, "Sales Process": 4, "Analytics": 3}', 'Planned', JSON_ARRAY(130)),
(1030, 'UI/UX Design System', 'DesignCorp', 3, '2025-09-05', '{"Design Systems": 4, "Figma": 4, "Accessibility": 3}', 'Planned', JSON_ARRAY(116)),

-- Additional Manager-led Future Projects
(1031, 'Enterprise Architecture Modernization', 'TechGiant', 12, '2025-10-01', '{"Architecture": 4, "System Design": 4, "Leadership": 4}', 'Planned', JSON_ARRAY(113)),
(1032, 'AI Research Initiative', 'InnovateAI', 8, '2025-09-20', '{"AI": 4, "Research": 4, "Innovation": 4}', 'Planned', JSON_ARRAY(120)),
(1033, 'Organizational Change Management', 'InternalProject', 6, '2025-08-15', '{"Change Management": 4, "Leadership": 4, "Training": 3}', 'Planned', JSON_ARRAY(118)),
(1034, 'Cloud Security Framework', 'SecureCloud', 7, '2025-09-01', '{"Cloud Security": 4, "AWS": 4, "Compliance": 4}', 'Planned', JSON_ARRAY(127)),
(1035, 'Operations Excellence Program', 'EfficiencyMax', 5, '2025-08-10', '{"Operations": 4, "Process Improvement": 4, "Leadership": 3}', 'Planned', JSON_ARRAY(129)),
(1036, 'Strategic Sales Expansion', 'GrowthVenture', 9, '2025-09-25', '{"Sales Strategy": 4, "Market Expansion": 4, "Team Leadership": 4}', 'Planned', JSON_ARRAY(130)),
(1037, 'Product Innovation Lab', 'InnovateProduct', 6, '2025-08-20', '{"Product Strategy": 4, "Innovation": 4, "User Research": 3}', 'Planned', JSON_ARRAY(121)),
(1038, 'Quality Transformation Initiative', 'QualityExcellence', 5, '2025-09-15', '{"Quality Management": 4, "Process Improvement": 4, "Leadership": 3}', 'Planned', JSON_ARRAY(128)),
(1039, 'Engineering Team Expansion', 'TechScale', 4, '2025-08-05', '{"Team Building": 4, "Technical Leadership": 4, "Mentoring": 4}', 'Planned', JSON_ARRAY(106)),
(1040, 'Data Science Center of Excellence', 'DataExcellence', 7, '2025-09-30', '{"Data Science": 4, "Team Leadership": 4, "Strategy": 4}', 'Planned', JSON_ARRAY(120));
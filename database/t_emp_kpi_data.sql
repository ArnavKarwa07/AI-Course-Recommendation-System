-- Insert comprehensive KPI data (5 KPIs per employee)
INSERT INTO t_emp_kpi(emp_id, month, kpi_metric, kpi_score, review) VALUES
-- Arjun Verma (101) - Software Engineer
(101, '2024-01-01', 'Code Quality', 4.2, 'Clean and modular code with good commenting practices'),
(101, '2024-01-01', 'Bug Resolution', 4.5, 'Quick turnaround on bug fixes, proactive debugging approach'),
(101, '2024-01-01', 'Team Collaboration', 4.0, 'Good sync with frontend team, participates well in standups'),
(101, '2024-01-01', 'Learning Agility', 4.3, 'Quickly adapts to new frameworks and technologies'),
(101, '2024-01-01', 'Project Delivery', 4.1, 'Meets deadlines consistently, minor scope creep issues'),

-- Neha Sharma (102) - Senior Software Engineer
(102, '2024-01-01', 'Technical Leadership', 4.8, 'Excellent mentoring of junior developers and interns'),
(102, '2024-01-01', 'System Design', 4.7, 'Creates scalable and maintainable architectures'),
(102, '2024-01-01', 'Code Review Quality', 4.6, 'Thorough reviews that catch critical issues early'),
(102, '2024-01-01', 'Client Communication', 4.4, 'Handles technical discussions with clients effectively'),
(102, '2024-01-01', 'Innovation', 4.3, 'Proposes creative solutions to complex problems'),

-- Ravi Joshi (103) - Data Scientist
(103, '2024-01-01', 'Model Accuracy', 4.2, 'Consistently achieves 90%+ accuracy on ML models'),
(103, '2024-01-01', 'Data Analysis', 4.3, 'Thorough exploratory data analysis and feature engineering'),
(103, '2024-01-01', 'Research Skills', 4.1, 'Stays updated with latest ML research and techniques'),
(103, '2024-01-01', 'Presentation Skills', 3.8, 'Could improve in explaining complex concepts to non-tech audience'),
(103, '2024-01-01', 'Collaboration', 4.0, 'Works well with data engineering and product teams'),

-- Simran Kaur (104) - Data Analyst
(104, '2024-01-01', 'Dashboard Creation', 4.4, 'Creates insightful and user-friendly dashboards'),
(104, '2024-01-01', 'SQL Proficiency', 4.3, 'Writes optimized queries for complex data retrieval'),
(104, '2024-01-01', 'Business Insight', 4.2, 'Provides actionable insights that drive business decisions'),
(104, '2024-01-01', 'Report Accuracy', 4.5, 'High precision in data reporting with minimal errors'),
(104, '2024-01-01', 'Stakeholder Management', 3.9, 'Good communication with business stakeholders'),

-- Manish Mehta (105) - Project Manager
(105, '2024-01-01', 'Project Delivery', 4.9, 'Consistently delivers projects on time and within budget'),
(105, '2024-01-01', 'Team Leadership', 4.7, 'Excellent at motivating and coordinating cross-functional teams'),
(105, '2024-01-01', 'Risk Management', 4.6, 'Proactive identification and mitigation of project risks'),
(105, '2024-01-01', 'Budget Management', 4.5, 'Effective cost control, achieved 8% savings last quarter'),
(105, '2024-01-01', 'Stakeholder Communication', 4.8, 'Clear and timely communication with all stakeholders'),

-- Priya Kapoor (106) - Team Lead
(106, '2024-01-01', 'Team Management', 4.6, 'Strong leadership skills, team members feel supported'),
(106, '2024-01-01', 'Sprint Planning', 4.2, 'Well-structured sprint planning with realistic estimates'),
(106, '2024-01-01', 'Conflict Resolution', 4.4, 'Effectively resolves team conflicts and maintains harmony'),
(106, '2024-01-01', 'Process Improvement', 4.3, 'Continuously improves team processes and efficiency'),
(106, '2024-01-01', 'Technical Guidance', 4.1, 'Provides valuable technical direction to team members'),

-- Alok Singh (107) - HR Executive
(107, '2024-01-01', 'Recruitment Efficiency', 4.1, 'Good turnaround time for filling open positions'),
(107, '2024-01-01', 'Candidate Experience', 4.3, 'Positive feedback from candidates about interview process'),
(107, '2024-01-01', 'Employee Onboarding', 4.4, 'Smooth and comprehensive onboarding process'),
(107, '2024-01-01', 'Policy Knowledge', 4.2, 'Strong understanding of HR policies and procedures'),
(107, '2024-01-01', 'Communication Skills', 4.0, 'Clear communication but could be more proactive'),

-- Tanvi Desai (108) - DevOps Engineer
(108, '2024-01-01', 'Deployment Efficiency', 4.2, 'Streamlined deployment processes, reduced deployment time'),
(108, '2024-01-01', 'System Monitoring', 4.3, 'Proactive monitoring and quick response to alerts'),
(108, '2024-01-01', 'Automation Skills', 4.1, 'Good automation coverage, continuing to expand CI/CD'),
(108, '2024-01-01', 'Infrastructure Management', 4.5, 'Excellent management of cloud infrastructure'),
(108, '2024-01-01', 'Incident Response', 4.0, 'Quick resolution of production incidents'),

-- Karan Patel (109) - Business Analyst
(109, '2024-01-01', 'Requirement Gathering', 4.3, 'Thorough and accurate requirement documentation'),
(109, '2024-01-01', 'Process Analysis', 4.4, 'Excellent at identifying process improvements'),
(109, '2024-01-01', 'Stakeholder Management', 4.1, 'Good relationships with business stakeholders'),
(109, '2024-01-01', 'Documentation Quality', 4.2, 'Clear and comprehensive documentation'),
(109, '2024-01-01', 'Solution Design', 4.0, 'Practical solutions that meet business needs'),

-- Megha Nair (110) - UI/UX Designer
(110, '2024-01-01', 'Design Quality', 4.4, 'Creates visually appealing and user-friendly designs'),
(110, '2024-01-01', 'User Research', 4.2, 'Conducts thorough user research to inform design decisions'),
(110, '2024-01-01', 'Prototyping Speed', 4.3, 'Quick turnaround on prototypes and wireframes'),
(110, '2024-01-01', 'Design System Adherence', 4.1, 'Consistent with established design systems'),
(110, '2024-01-01', 'Collaboration', 4.0, 'Works well with development team on implementation'),

-- Rahul Kumar (111) - Marketing Analyst
(111, '2024-01-01', 'SEO Performance', 4.5, 'Achieved 15% increase in organic traffic'),
(111, '2024-01-01', 'Campaign Analysis', 4.4, 'Thorough analysis of marketing campaign effectiveness'),
(111, '2024-01-01', 'Content Strategy', 4.2, 'Develops effective content strategies that drive engagement'),
(111, '2024-01-01', 'ROI Tracking', 4.3, 'Accurate tracking and reporting of marketing ROI'),
(111, '2024-01-01', 'Market Research', 4.1, 'Good insights into market trends and competitor analysis'),

-- Sanya Rathi (112) - Finance Analyst
(112, '2024-01-01', 'Financial Modeling', 4.6, 'Creates accurate and detailed financial models'),
(112, '2024-01-01', 'Budget Analysis', 4.3, 'Thorough analysis of budget variance and forecasting'),
(112, '2024-01-01', 'Risk Assessment', 4.5, 'Excellent at identifying and quantifying financial risks'),
(112, '2024-01-01', 'Compliance', 4.4, 'Strong adherence to financial regulations and standards'),
(112, '2024-01-01', 'Reporting Accuracy', 4.2, 'High accuracy in financial reporting with minimal errors'),

-- Amit Thakur (113) - Tech Lead
(113, '2024-01-01', 'Technical Leadership', 4.7, 'Outstanding technical guidance and mentoring'),
(113, '2024-01-01', 'Architecture Design', 4.6, 'Creates robust and scalable system architectures'),
(113, '2024-01-01', 'Team Development', 4.5, 'Excellent at developing junior team members'),
(113, '2024-01-01', 'Innovation', 4.4, 'Drives technical innovation and best practices'),
(113, '2024-01-01', 'Strategic Planning', 4.3, 'Strong alignment of technical strategy with business goals'),

-- Divya Shetty (114) - Software Engineer
(114, '2024-01-01', 'Code Quality', 4.1, 'Good coding practices, room for improvement in optimization'),
(114, '2024-01-01', 'Learning Speed', 4.2, 'Quick to learn new technologies and frameworks'),
(114, '2024-01-01', 'Task Completion', 4.3, 'Reliable task completion within estimated timeframes'),
(114, '2024-01-01', 'Team Integration', 4.0, 'Good team player, participates actively in discussions'),
(114, '2024-01-01', 'Initiative', 3.9, 'Shows good potential, could take more initiative'),

-- Jatin Grover (115) - Data Analyst
(115, '2024-01-01', 'SQL Expertise', 4.4, 'Advanced SQL skills with query optimization'),
(115, '2024-01-01', 'Data Visualization', 4.3, 'Creates clear and meaningful data visualizations'),
(115, '2024-01-01', 'ETL Processes', 4.2, 'Efficient data extraction and transformation processes'),
(115, '2024-01-01', 'Business Understanding', 4.1, 'Good grasp of business context for data analysis'),
(115, '2024-01-01', 'Report Timeliness', 4.0, 'Meets reporting deadlines consistently'),

-- Nidhi Rane (116) - UI/UX Designer
(116, '2024-01-01', 'Design Systems', 4.5, 'Excellent work on maintaining and expanding design systems'),
(116, '2024-01-01', 'User Experience', 4.4, 'Strong focus on user experience and usability'),
(116, '2024-01-01', 'Design Tools Proficiency', 4.3, 'Advanced skills in Figma and other design tools'),
(116, '2024-01-01', 'Accessibility Standards', 4.2, 'Good implementation of accessibility guidelines'),
(116, '2024-01-01', 'Cross-team Collaboration', 4.1, 'Effective collaboration with product and engineering teams'),

-- Saurabh Dixit (117) - HR Executive
(117, '2024-01-01', 'Recruitment Success', 4.4, 'High success rate in placing quality candidates'),
(117, '2024-01-01', 'Employee Engagement', 4.2, 'Good initiatives for improving employee engagement'),
(117, '2024-01-01', 'Training Coordination', 4.3, 'Effective coordination of employee training programs'),
(117, '2024-01-01', 'HR Analytics', 4.1, 'Growing expertise in HR data analysis and metrics'),
(117, '2024-01-01', 'Culture Development', 4.0, 'Contributes positively to company culture initiatives'),

-- Ritika Jain (118) - HR Manager
(118, '2024-01-01', 'Strategic HR Planning', 4.8, 'Excellent strategic planning for HR initiatives'),
(118, '2024-01-01', 'Leadership Development', 4.7, 'Outstanding leadership development programs'),
(118, '2024-01-01', 'Conflict Resolution', 4.6, 'Highly effective at resolving workplace conflicts'),
(118, '2024-01-01', 'Performance Management', 4.5, 'Strong performance management and review processes'),
(118, '2024-01-01', 'Change Management', 4.4, 'Excellent at managing organizational changes'),

-- Ankit Rao (119) - Senior Software Engineer
(119, '2024-01-01', 'Microservices Design', 4.4, 'Strong expertise in microservices architecture'),
(119, '2024-01-01', 'API Development', 4.6, 'Excellent API design and development skills'),
(119, '2024-01-01', 'System Performance', 4.3, 'Good focus on system performance optimization'),
(119, '2024-01-01', 'Code Reviews', 4.2, 'Thorough and constructive code reviews'),
(119, '2024-01-01', 'Technical Documentation', 4.1, 'Good technical documentation practices'),

-- Isha Bhosale (120) - Data Scientist
(120, '2024-01-01', 'AI Model Development', 4.6, 'Outstanding AI and ML model development skills'),
(120, '2024-01-01', 'Research Excellence', 4.4, 'Strong research capabilities and innovation'),
(120, '2024-01-01', 'Team Leadership', 4.3, 'Good leadership of data science initiatives'),
(120, '2024-01-01', 'Model Deployment', 4.2, 'Effective deployment of ML models to production'),
(120, '2024-01-01', 'Cross-functional Collaboration', 4.1, 'Good collaboration with engineering and product teams'),

-- Vikram Singh (121) - Product Manager
(121, '2024-01-01', 'Product Strategy', 4.5, 'Excellent product roadmap and strategic planning'),
(121, '2024-01-01', 'User Research', 4.2, 'Conducts thorough user research and analysis'),
(121, '2024-01-01', 'Stakeholder Management', 4.4, 'Effective communication with all stakeholders'),
(121, '2024-01-01', 'Feature Prioritization', 4.1, 'Good at prioritizing features based on impact'),
(121, '2024-01-01', 'Market Analysis', 4.0, 'Solid understanding of market trends and competition'),

-- Kavya Reddy (122) - QA Engineer
(122, '2024-01-01', 'Test Coverage', 4.3, 'Comprehensive test coverage across all features'),
(122, '2024-01-01', 'Bug Detection', 4.4, 'Excellent at finding critical bugs before release'),
(122, '2024-01-01', 'Test Documentation', 4.2, 'Clear and detailed test case documentation'),
(122, '2024-01-01', 'Automation Skills', 3.8, 'Learning automation tools, making good progress'),
(122, '2024-01-01', 'Process Improvement', 4.0, 'Suggests valuable improvements to QA processes'),

-- Rohit Gupta (123) - Security Analyst
(123, '2024-01-01', 'Threat Analysis', 4.4, 'Excellent at identifying and analyzing security threats'),
(123, '2024-01-01', 'Compliance Management', 4.3, 'Strong adherence to security compliance standards'),
(123, '2024-01-01', 'Incident Response', 4.2, 'Quick and effective response to security incidents'),
(123, '2024-01-01', 'Security Audits', 4.1, 'Thorough security audits and vulnerability assessments'),
(123, '2024-01-01', 'Risk Assessment', 4.0, 'Good at assessing and prioritizing security risks'),

-- Sneha Patil (124) - Content Writer
(124, '2024-01-01', 'Content Quality', 4.4, 'High-quality, engaging content that drives results'),
(124, '2024-01-01', 'SEO Optimization', 4.2, 'Good understanding of SEO best practices'),
(124, '2024-01-01', 'Research Skills', 4.3, 'Thorough research for accurate and relevant content'),
(124, '2024-01-01', 'Meeting Deadlines', 4.1, 'Consistently meets content delivery deadlines'),
(124, '2024-01-01', 'Brand Voice', 3.9, 'Good understanding of brand voice, room for improvement'),

-- Arun Kumar (125) - Sales Executive
(125, '2024-01-01', 'Lead Generation', 4.1, 'Good at identifying and qualifying potential leads'),
(125, '2024-01-01', 'Client Communication', 4.3, 'Excellent communication skills with clients'),
(125, '2024-01-01', 'Sales Targets', 3.9, 'Meeting targets consistently, room for growth'),
(125, '2024-01-01', 'CRM Usage', 4.0, 'Good use of CRM tools for tracking and follow-up'),
(125, '2024-01-01', 'Negotiation Skills', 3.8, 'Developing negotiation skills, shows promise'),

-- Pooja Sharma (126) - Mobile Developer
(126, '2024-01-01', 'Mobile UI Design', 4.2, 'Creates intuitive and responsive mobile interfaces'),
(126, '2024-01-01', 'Cross-platform Development', 4.1, 'Good skills in React Native development'),
(126, '2024-01-01', 'Performance Optimization', 4.0, 'Focuses on app performance and user experience'),
(126, '2024-01-01', 'Code Quality', 4.3, 'Clean and maintainable mobile code'),
(126, '2024-01-01', 'Testing', 3.9, 'Good testing practices, could improve automation'),

-- Manoj Agarwal (127) - Cloud Architect
(127, '2024-01-01', 'Cloud Architecture', 4.7, 'Excellent cloud solution design and implementation'),
(127, '2024-01-01', 'Cost Optimization', 4.5, 'Achieved 20% cost reduction in cloud spending'),
(127, '2024-01-01', 'Security Implementation', 4.4, 'Strong focus on cloud security best practices'),
(127, '2024-01-01', 'Team Mentoring', 4.3, 'Great at mentoring team on cloud technologies'),
(127, '2024-01-01', 'Innovation', 4.2, 'Brings innovative solutions to complex cloud challenges'),

-- Deepika Joshi (128) - Senior QA Engineer
(128, '2024-01-01', 'Test Strategy', 4.6, 'Excellent test strategy and planning capabilities'),
(128, '2024-01-01', 'Team Leadership', 4.4, 'Strong leadership of QA team and processes'),
(128, '2024-01-01', 'Automation Framework', 4.5, 'Built robust automation framework for team'),
(128, '2024-01-01', 'Quality Metrics', 4.3, 'Effective tracking and reporting of quality metrics'),
(128, '2024-01-01', 'Process Improvement', 4.2, 'Continuously improves QA processes and efficiency'),

-- Suresh Iyer (129) - Operations Manager
(129, '2024-01-01', 'Process Optimization', 4.7, 'Excellent at streamlining operational processes'),
(129, '2024-01-01', 'Team Management', 4.6, 'Strong leadership of operations team'),
(129, '2024-01-01', 'Cost Control', 4.5, 'Effective cost management and budget optimization'),
(129, '2024-01-01', 'Vendor Management', 4.4, 'Good relationships and negotiations with vendors'),
(129, '2024-01-01', 'Quality Assurance', 4.3, 'Maintains high quality standards in operations'),

-- Anjali Mishra (130) - Senior Sales Manager
(130, '2024-01-01', 'Sales Leadership', 4.8, 'Outstanding leadership of sales team'),
(130, '2024-01-01', 'Revenue Generation', 4.7, 'Consistently exceeds revenue targets'),
(130, '2024-01-01', 'Client Relationships', 4.6, 'Excellent long-term client relationship management'),
(130, '2024-01-01', 'Team Development', 4.5, 'Great at developing sales team capabilities'),
(130, '2024-01-01', 'Market Strategy', 4.4, 'Strong strategic thinking for market expansion'),

-- Kiran Bhatt (131) - Software Engineer
(131, '2024-01-01', 'Learning Enthusiasm', 4.2, 'Highly motivated to learn new technologies'),
(131, '2024-01-01', 'Code Quality', 3.8, 'Good coding practices for a junior developer'),
(131, '2024-01-01', 'Team Integration', 4.0, 'Integrates well with team, asks good questions'),
(131, '2024-01-01', 'Task Completion', 3.9, 'Completes assigned tasks with minimal guidance'),
(131, '2024-01-01', 'Growth Potential', 4.1, 'Shows strong potential for rapid growth'),

-- Ritu Agarwal (132) - Data Analyst
(132, '2024-01-01', 'Excel Proficiency', 4.3, 'Advanced Excel skills for data analysis'),
(132, '2024-01-01', 'SQL Development', 3.9, 'Good SQL skills, continuing to develop'),
(132, '2024-01-01', 'Report Generation', 4.1, 'Creates clear and accurate reports'),
(132, '2024-01-01', 'Attention to Detail', 4.2, 'High attention to detail in data work'),
(132, '2024-01-01', 'Business Acumen', 3.8, 'Developing understanding of business context'),

-- Harsh Pandey (133) - DevOps Engineer
(133, '2024-01-01', 'Infrastructure Management', 4.1, 'Good management of development infrastructure'),
(133, '2024-01-01', 'Automation Skills', 4.0, 'Developing automation skills in CI/CD'),
(133, '2024-01-01', 'Problem Solving', 4.2, 'Good troubleshooting and problem-solving skills'),
(133, '2024-01-01', 'Documentation', 3.9, 'Documents processes well, could be more comprehensive'),
(133, '2024-01-01', 'Cloud Knowledge', 4.0, 'Solid understanding of cloud platforms'),

-- Priyanka Das (134) - UI/UX Designer
(134, '2024-01-01', 'Design Creativity', 4.1, 'Shows creativity in design solutions'),
(134, '2024-01-01', 'User Research', 3.8, 'Learning user research methodologies'),
(134, '2024-01-01', 'Tool Proficiency', 4.0, 'Good proficiency in design tools'),
(134, '2024-01-01', 'Feedback Integration', 4.2, 'Excellent at incorporating feedback into designs'),
(134, '2024-01-01', 'Design Consistency', 3.9, 'Maintains good consistency in design work'),

-- Gaurav Mehta (135) - QA Engineer
(135, '2024-01-01', 'Test Execution', 4.3, 'Thorough and methodical test execution'),
(135, '2024-01-01', 'Bug Reporting', 4.2, 'Clear and detailed bug reports'),
(135, '2024-01-01', 'Test Case Design', 4.1, 'Good at designing comprehensive test cases'),
(135, '2024-01-01', 'Domain Knowledge', 4.0, 'Developing good understanding of application domain'),
(135, '2024-01-01', 'Process Adherence', 4.3, 'Excellent adherence to QA processes'),

-- Swati Jain (136) - Marketing Analyst
(136, '2024-01-01', 'Campaign Analysis', 4.2, 'Good analysis of marketing campaign performance'),
(136, '2024-01-01', 'SEO Knowledge', 4.0, 'Solid understanding of SEO principles'),
(136, '2024-01-01', 'Data Analysis', 4.3, 'Strong analytical skills for marketing data'),
(136, '2024-01-01', 'Reporting Skills', 4.1, 'Creates clear and actionable marketing reports'),
(136, '2024-01-01', 'Tool Proficiency', 3.9, 'Good with marketing analytics tools'),

-- Nikhil Saxena (137) - Sales Executive
(137, '2024-01-01', 'Communication Skills', 4.1, 'Strong communication skills with prospects'),
(137, '2024-01-01', 'Lead Qualification', 3.9, 'Learning to effectively qualify leads'),
(137, '2024-01-01', 'CRM Usage', 3.8, 'Developing proficiency in CRM tools'),
(137, '2024-01-01', 'Product Knowledge', 4.0, 'Good understanding of company products'),
(137, '2024-01-01', 'Learning Attitude', 4.2, 'Excellent attitude towards learning sales skills'),

-- Shweta Goyal (138) - Product Manager
(138, '2024-01-01', 'Feature Analysis', 4.1, 'Good analysis of feature requirements and impact'),
(138, '2024-01-01', 'User Story Writing', 4.0, 'Creates clear and actionable user stories'),
(138, '2024-01-01', 'Stakeholder Communication', 3.9, 'Developing communication skills with stakeholders'),
(138, '2024-01-01', 'Market Research', 4.2, 'Excellent research skills for market analysis'),
(138, '2024-01-01', 'Product Vision', 3.8, 'Learning to develop comprehensive product vision'),

-- Ravi Choudhary (139) - Security Analyst
(139, '2024-01-01', 'Security Awareness', 4.1, 'Good understanding of security principles'),
(139, '2024-01-01', 'Vulnerability Assessment', 4.0, 'Competent in vulnerability identification'),
(139, '2024-01-01', 'Compliance Knowledge', 4.2, 'Strong understanding of compliance requirements'),
(139, '2024-01-01', 'Incident Documentation', 3.9, 'Good documentation of security incidents'),
(139, '2024-01-01', 'Tool Proficiency', 3.8, 'Learning security tools and technologies'),

-- Madhuri Rao (140) - Finance Analyst
(140, '2024-01-01', 'Financial Analysis', 4.2, 'Strong analytical skills for financial data'),
(140, '2024-01-01', 'Excel Expertise', 4.4, 'Advanced Excel skills for financial modeling'),
(140, '2024-01-01', 'Report Accuracy', 4.3, 'High accuracy in financial reporting'),
(140, '2024-01-01', 'Process Efficiency', 4.1, 'Good at streamlining financial processes'),
(140, '2024-01-01', 'Regulatory Knowledge', 4.0, 'Solid understanding of financial regulations');
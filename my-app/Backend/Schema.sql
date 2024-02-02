use DFS_Pro_new ;

CREATE TABLE IF NOT EXISTS Course1 (
    user_id INT PRIMARY KEY,
    role VARCHAR(255),
    name VARCHAR(255),
    email VARCHAR(255)
);
ALTER TABLE Course1
ADD COLUMN team_id VARCHAR(100) DEFAULT NULL,
ADD COLUMN project_id VARCHAR(100) DEFAULT NULL,
ADD COLUMN task1 INT DEFAULT NULL,
ADD COLUMN task2 INT DEFAULT NULL,
ADD COLUMN task3 INT DEFAULT NULL,
ADD COLUMN task4 INT DEFAULT NULL,
ADD COLUMN task5 INT DEFAULT NULL,
ADD COLUMN ta_userid VARCHAR(100) DEFAULT NULL,
ADD COLUMN Final_grade VARCHAR(30) DEFAULT NULL;
ADD COLUMN github_link VARCHAR(500) DEFAULT NULL;
CREATE TABLE Course1_comments (
    team_id VARCHAR(100),
    comment VARCHAR(400),
    timestamp TIME
);
CREATE TABLE Course1_projects (
    project_id VARCHAR(30),
    template_id VARCHAR(30),
    num_tasks INT
);

INSERT INTO DSA_ (user_id, role, name, email)
VALUES
    (1, 'student', 'Amit Patel', 'amit.patel@example.com'),
    (2, 'student', 'Sneha Sharma', 'sneha.sharma@example.com'),
    (3, 'student', 'Rahul Singh', 'rahul.singh@example.com'),
    (4, 'student', 'Neha Kapoor', 'neha.kapoor@example.com'),
    (5, 'student', 'Vikram Reddy', 'vikram.reddy@example.com'),
    (6, 'student', 'Pooja Gupta', 'pooja.gupta@example.com'),
    (7, 'student', 'Rajesh Kumar', 'rajesh.kumar@example.com'),
    (8, 'student', 'Ananya Mishra', 'ananya.mishra@example.com'),
    (9, 'student', 'Arjun Verma', 'arjun.verma@example.com'),
    (10, 'student', 'Shreya Joshi', 'shreya.joshi@example.com');

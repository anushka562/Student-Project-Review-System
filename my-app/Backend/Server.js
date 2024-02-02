const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const port = 3003;

// Create a MySQL database connection
app.use(cors());
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'DFS_Pro_new',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection error: ' + err.message);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.use(express.json());

app.post('/register', async (req, res) => {
  const { name, email, userType, password } = req.body;
  console.log(req.body)
  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10); // You can adjust the number of salt rounds as needed

  // Insert the user data into the "users" table
  const sql = 'INSERT INTO users (Name, Email, UserType, Password) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, userType, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      res.status(500).json({ error: 'Failed to register user' });
    } else {
      res.json({ message: 'User registered successfully' });
    }
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Retrieve the hashed password from the database
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {

    
    if (err) {
      
      console.error(err);
      return res.status(500).json({ message: 'An error occurred' });
    }
    console.log("hiii")
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    console.log(results[0])
    const hashedPassword = results[0].Password;
    
   user = results[0]

    // Hash the provided password and then compare
    bcrypt.compare(password, hashedPassword, (err, passwordMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'An error occurred' });
      }

      if (passwordMatch) {
        const userData = {
          id: user.id,
          Name: user.Name,
          Email: user.Email,
          UserType: user.UserType,
        };

        res.status(200).json({ message: 'Login successful', user: userData });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    });
  });
});

app.use('/professor-courses', (req, res) => {
  const { professorEmail } = req.body; // Assuming you pass the professor's email as a query parameter
  console.log(professorEmail)
  if (!professorEmail) {
    return res.status(400).json({ message: 'Professor email is required' });
  }

  // Query the database to fetch the courses associated with the professor
  const sql = `SELECT course_code, course_name FROM sem_courses WHERE professor_email = ?`;

  db.query(sql, [professorEmail], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred' });
    }
    console.log(results)
    return res.status(200).json(results); // Return the list of courses for the professor
  });
});

app.use('/student-project', (req, res) => {
  const { studentEmail, courseName } = req.body;
  console.log(studentEmail, courseName)
  if (!studentEmail || !courseName) {
    return res.status(400).json({ message: 'Student email and course name are required' });
  }

  // Construct the table name dynamically
  const tableName = `${courseName}_`;

  // Query the database to fetch the project details for the student
  const sql = `
    SELECT project_id
    FROM ${tableName}
    WHERE email = ? AND role = 'student';
  `;

  db.query(sql, [studentEmail], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred' });
    }
    console.log(results)
    return res.status(200).json(results); // Return the list of projects for the student
  });
});

app.use('/student-courses', (req, res) => {
  const { studentEmail } = req.body; // Assuming you pass the student's email as a query parameter
  console.log(studentEmail);

  if (!studentEmail) {
    return res.status(400).json({ message: 'Student email is required' });
  }

  // Query the database to fetch the courses associated with the student
  const sql = `SELECT course_code, course_name FROM sem_courses`;

  db.query(sql, (err, courses) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred' });
    }

    const studentCourses = [];

    // Iterate through the courses and check each corresponding student table
    courses.forEach((course) => {
      const courseTableName = `${course.course_name}_`; // Assuming the student table name follows a specific pattern
      const studentSql = `SELECT * FROM ${courseTableName} WHERE role = 'student' AND email = ?`;

      // Query the student table to check if the student email exists
      db.query(studentSql, [studentEmail], (studentErr, studentResults) => {
        if (studentErr) {
          console.error(studentErr);
          return res.status(500).json({ message: 'An error occurred while checking student table' });
        }

        // If the student is found in the course, add it to the result
        if (studentResults.length > 0) {
          studentCourses.push({
            course_code: course.course_code,
            course_name: course.course_name,
          });
        }

        // If this is the last iteration, return the result
        if (course === courses[courses.length - 1]) {
          console.log(studentCourses);
          return res.status(200).json(studentCourses);
        }
      });
    });
  });
});

app.use('/ta-courses', (req, res) => {
  const { studentEmail } = req.body; // Assuming you pass the student's email as a query parameter
  console.log(studentEmail);

  if (!studentEmail) {
    return res.status(400).json({ message: 'Student email is required' });
  }

  // Query the database to fetch the courses associated with the student
  const sql = `SELECT course_code, course_name FROM sem_courses`;

  db.query(sql, (err, courses) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred' });
    }

    const studentCourses = [];

    // Iterate through the courses and check each corresponding student table
    courses.forEach((course) => {
      const courseTableName = `${course.course_name}_`; // Assuming the student table name follows a specific pattern
      const studentSql = `SELECT * FROM ${courseTableName} WHERE role = 'ta' AND email = ?`;

      // Query the student table to check if the student email exists
      db.query(studentSql, [studentEmail], (studentErr, studentResults) => {
        if (studentErr) {
          console.error(studentErr);
          return res.status(500).json({ message: 'An error occurred while checking student table' });
        }

        // If the student is found in the course, add it to the result
        if (studentResults.length > 0) {
          studentCourses.push({
            course_code: course.course_code,
            course_name: course.course_name,
          });
        }

        // If this is the last iteration, return the result
        if (course === courses[courses.length - 1]) {
          console.log(studentCourses);
          return res.status(200).json(studentCourses);
        }
      });
    });
  });
});
app.use('/get-comments', (req, res) => {
  const { courseName, team_id } = req.query;
  console.log(courseName, team_id)
  if (!courseName || !team_id) {
    return res.status(400).json({ message: 'Course name and team_id are required' });
  }

  // Construct the table name dynamically
  const tableName = `${courseName}__comments`;

  // Query the database to fetch comments associated with the team_id
  const sql = `
    SELECT user_type, comment, timestamp
    FROM ${tableName}
    WHERE team_id = ?;
  `;

  db.query(sql, [team_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred' });
    }
    console.log(results)
    return res.status(200).json(results); // Return the list of comments for the specified team_id
  });
});


app.use('/project-details', (req, res) => {
  const { courseName } = req.query; // Assuming you pass the course name as a query parameter
  console.log(courseName);
  
  if (!courseName) {
    return res.status(400).json({ message: 'Course name is required' });
  }

  // Query the database to fetch project details associated with the course
  const sql = `SELECT project_id, project_name, template_id FROM ${courseName}__projects `;

  db.query(sql, [courseName], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred' });
    }

    
    return res.status(200).json(results); // Return the list of projects for the given course
  });
});

app.use('/project-detail', (req, res) => {
  const { projectId, courseName, projecttype } = req.query;

  if (!courseName || !projecttype) {
    return res.status(400).json({ message: 'Course name and project type are required' });
  }

  // Construct the table name dynamically
  const tableName = `${courseName}__${projecttype}project`;

  // Query the database to fetch project details associated with the course
  const sql = `
    SELECT
      task1_description,
      task2_description,
      task3_description,
      task4_description,
      task5_description,
      task1_commit_message,
      task2_commit_message,
      task3_commit_message,
      task4_commit_message,
      task5_commit_message
    
    FROM ${tableName}
    WHERE project_id = ?
  `;

  db.query(sql, [projectId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred' });
    }

    console.log(results);
    return res.status(200).json(results); // Return the list of projects for the given course
  });
});


app.post('/get-students', (req, res) => {
  const { courseName } = req.body;

  if (!courseName) {
    return res.status(400).json({ message: 'Course name is required' });
  }

  // Construct the table name based on the provided course name
  const tableName = `${courseName}_`;

  // Query the database to fetch the students from the specified course table
  const sql = `SELECT name, email FROM ${tableName} WHERE role = 'student'`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred' });
    }

    return res.status(200).json(results); // Return the list of students for the specified course
  });
});
app.use('/teams_for_project', (req, res) => {
  const { project_id, course_name} = req.query;

  const tableName =  `${course_name}_`;
  // SQL query to retrieve all team names associated with the provided project ID
  const sqlQuery = `
    SELECT DISTINCT team_id
    FROM ${tableName}
    WHERE project_id = '${project_id}';
  `;

  // Execute SQL query
  db.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const teamNames = results.map((result) => result.team_id);
    return res.json({ team_names: teamNames });
    
  });
});

app.use('/get-project-type', (req, res) => {
  const { projectID, courseName } = req.query;
   console.log(projectID, courseName)
  if (!courseName) {
    return res.status(400).json({ message: 'Course name is required' });
  }

  // Construct the table name dynamically
  const tableName = `${courseName}__projects`;
 

  // Query the database to fetch project details associated with the course
  const sql = `
    SELECT template_id
    FROM ${tableName}
    WHERE project_id = ?
  `;

  db.query(sql, [projectID], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred' });
    }

     console.log(results);
    return res.status(200).json(results); // Return the list of projects for the given course
  });
});

app.use('/get-project-status', (req, res) => {
  const{projecttype,courseName, projectID}=req.query;
  console.log(projecttype);
  if(!courseName){
    return res.status(400).json({message:'Course name is required'});
  }
  const tableName = `${courseName}__${projecttype}project`;
   console.log(tableName);
  const sql = ` SELECT project_id, project_name, task1_status, task2_status, task3_status, task4_status, task5_status FROM ${tableName} WHERE project_id = '${projectID}'`;
  db.query(sql, [projectID], (err, results) => {
    if(err){
      console.error(err);
      return res.status(500).json({message:'An error occurred'});
    }
    console.log(results);
    return res.status(200).json(results);
  });
});
app.use('/get-students-for-project', (req, res) => {
  const { projectID, courseName } = req.query;

  if (!courseName || !projectID) {
    return res.status(400).json({ message: 'Course name and project ID are required' });
  }

  // Construct the table name dynamically
  const tableName = `${courseName}_`;

  // Query the database to fetch student details associated with the project
  const sql = `
    SELECT name, email
    FROM ${tableName}
    WHERE project_id = ? AND role = 'student';
  `;

  db.query(sql, [projectID], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred' });
    }

    return res.status(200).json(results); // Return the list of students for the specified project
  });
});
app.use('/get-student-grades', (req, res) => {
  const { studentEmail, courseName } = req.body;

  if (!courseName || !studentEmail) {
    return res.status(400).json({ message: 'Course name and Student Email are required' });
  }

  // Construct the table name dynamically
  const tableName = `${courseName}_`;

  // Query the database to fetch student details associated with the project
  const sql = `
    SELECT project_id,task1, task2,task3,task4,task5, final_grade
    FROM ${tableName}
    WHERE email = ?;
  `;

  db.query(sql, [studentEmail], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred' });
    }
    console.log(results)
    return res.status(200).json(results); // Return the list of students for the specified project
  });
});
// Add this endpoint in your Express server
app.post('/update-marks', (req, res) => {
  const { courseName, taskNumber, marks } = req.body;

  if (!courseName || !taskNumber || !marks) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  // Construct the table name dynamically
  const tableName = `${courseName}_`;

  // Construct the SQL query to update marks in the specified course table
  const updateQuery = `
    UPDATE ${tableName}
    SET task${taskNumber} = ?
    WHERE email = ?;
  `;

  // Iterate over the provided marks and update each student's marks
  Object.entries(marks).forEach(([email, mark]) => {
    db.query(updateQuery, [mark, email], (err, result) => {
      if (err) {
        console.error('Error updating marks:', err);
        // Handle the error if needed
      }
    });
  });

  return res.status(200).json({ message: 'Marks updated successfully' });
});

app.post('/add-github-link', (req, res) => {
  const { courseName, students, githubLink } = req.body;

  if (!courseName || !students || !githubLink) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  // Construct the table name dynamically
  const tableName = `${courseName}_`;

  // Construct the SQL query to update GitHub link in the specified course table
  const updateQuery = `
    UPDATE ${tableName}
    SET github_link = ?
    WHERE email = ?;
  `;

  // Iterate over the provided students and update each student's GitHub link
  students.forEach(async (student) => {
    try {
      await db.promise().execute(updateQuery, [githubLink, student.email]);
    } catch (error) {
      console.error('Error updating GitHub link:', error);
      // Handle the error if needed
    }
  });

  return res.status(200).json({ message: 'GitHub link added successfully' });
});


app.use('/get-github-link', (req, res) => {
  const { courseName, studentEmail } = req.body;

  if (!courseName || !studentEmail) {
    return res.status(400).json({ message: 'Course name and student email are required' });
  }

  // Construct the table name dynamically
  const tableName = `${courseName}_`;

  // Query the database to fetch the GitHub link associated with the student
  const sql = `
    SELECT github_link
    FROM ${tableName}
    WHERE email = ?;
  `;

  db.query(sql, [studentEmail], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred' });
    }

    if (results.length > 0 && results[0].github_link) {
      const githubLink = results[0].github_link;
      console.log(githubLink);
      return res.status(200).json({ github_link: githubLink });
    } else {
      return res.status(404).json({ message: 'GitHub link not found for the specified student' });
    }
  });
});

app.use('/get-team-name', (req, res) => {
  const { courseName, studentEmail } = req.query;

  if (!courseName || !studentEmail) {
    return res.status(400).json({ message: 'Course name and student email are required' });
  }

  // Construct the table name dynamically
  const tableName = `${courseName}_`;

  // Query the database to fetch the team name associated with the student
  const sql = `
    SELECT team_id
    FROM ${tableName}
    WHERE email = ?;
  `;

  db.query(sql, [studentEmail], (err, results) => {
    if (err) {
      console.error('Error fetching team name:', err);
      return res.status(500).json({ message: 'An error occurred' });
    }

    if (results.length > 0 && results[0].team_id) {
      const teamName = results[0].team_id;
      console.log(teamName);
      return res.status(200).json({ team_name: teamName });
    } else {
      return res.status(404).json({ message: 'Team name not found for the specified student' });
    }
  });
}
);


app.use('/drop-student', (req, res) => {
  const { courseName, studentEmail } = req.body;
  console.log(courseName, studentEmail)
  if (!courseName || !studentEmail) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  // Construct the table name dynamically
  const tableName = `${courseName}_`;
  
  // Construct the SQL query to delete the student from the specified course table
  const deleteQuery = `
  DELETE FROM ${tableName}
  WHERE CONVERT(email USING utf8) = ?;
  `;
  console.log('SQL Query:', deleteQuery); 
  db.query(deleteQuery, [studentEmail], (err, result) => {
    if (err) {
      console.error('Error deleting student:', err);
      return res.status(500).json({ message: 'An error occurred' });
    }
    console.log('Rows affected:', result.affectedRows); 
    return res.status(200).json({ message: 'Student deleted successfully' });
  });
})



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

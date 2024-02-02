// TeamProjectStatus.js
import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import GradePopup from './GradePopup';

function TeamProjectStatus() {
  const projectID = localStorage.getItem('projectID');
  const [projectStatus, setProjectStatus] = useState(null);
  const [projecttype, setProjecttype] = useState(null);
  const [students, setStudents] = useState(null);
  const courseName = localStorage.getItem('currcourse');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [taskNumber, setTaskNumber] = useState(null);
  const [comment, setComment] = useState('');
  const [githubLink, setGithubLink] = useState(''); // Single state variable for the GitHub link
  const [githubLinkInput, setGithubLinkInput] = useState('');
  const [commitMessages, setCommitMessages] = useState([]);

  const openPopup = (student, taskNumber) => {
    setSelectedStudent(student);
    setTaskNumber(taskNumber);
    setIsPopupOpen(true);
  };
  const submitComment = async () => {
    try {
      // Retrieve necessary information from localStorage
      const courseName = localStorage.getItem('currcourse');
      const user_type = localStorage.getItem('currusertype');
      const team_id = localStorage.getItem('teamName');
  
      // If user_type is "Student", send it as "TA"
      const actual_user_type = user_type === 'Student' ? 'TA' : user_type;
      
  
      // Create a FormData object
      const formData = new FormData();
      formData.append('course_name', courseName);
      formData.append('team_id', team_id);
      formData.append('comment', comment);
      formData.append('user_type', actual_user_type);
  
      // Make a call to the API endpoint to insert the comment
      const response = await fetch('http://localhost:8000/insert-comment', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      console.log(data);
  
      // Clear the comment textbox after submission
      setComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const closePopup = () => {
    setSelectedStudent(null);
    setTaskNumber(null);
    setIsPopupOpen(false);
  };

  const submitGrade = async (marks) => {
    console.log(`Grades for Task ${taskNumber}: ${JSON.stringify(marks)}`);

    try {
      const response = await fetch('http://localhost:3003/update-marks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName: courseName,
          taskNumber: taskNumber,
          marks: marks,
        }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error updating marks:', error);
    }

    closePopup();
  };

  const addRepository = async () => {
    if (githubLinkInput) {
      try {
        const response = await fetch('http://localhost:3003/add-github-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseName: courseName,
            students: students,
            githubLink: githubLinkInput,
          }),
        });

        const data = await response.json();
        console.log(data);

        // Set the GitHub link in the state
        setGithubLink(githubLinkInput);

        // Fetch commits when githubLink changes
        fetchCommits();

        setGithubLinkInput('');
        setShowPopup(false); // Close the popup after adding the repository
      } catch (error) {
        console.error('Error adding GitHub link:', error);
      }
    }
  };

  const fetchCommits = async () => {
    try {
      // Fetch commit messages using the obtained GitHub link
      const githubCommitsResponse = await fetch('http://localhost:8000/get-github-commits/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `repo_url=${githubLink}`, // Use githubLink state variable here
      });

      if (githubCommitsResponse.ok) {
        const githubCommitsData = await githubCommitsResponse.json();
        const commits = githubCommitsData.commits;

        // Extract only the "message" part of the commits
        const commitMessages = commits.map((commit) => commit.message);

        setCommitMessages(commitMessages);
        console.log(commitMessages);
      } else {
        console.error('Error fetching GitHub commits:', githubCommitsResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching GitHub commits:', error);
    }
  };
  const updateTaskStatus = async () => {
    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('course_name', courseName); // Use state variable or prop
      formData.append('project_type', projecttype); // Use state variable or prop
      formData.append('project_id', projectID); // Use state variable or prop
  
      // Append each commit message to the form data
      formData.append('commit_messages', JSON.stringify(commitMessages));
      const response = await fetch('http://127.0.0.1:8000/update-task-status/', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      window.location.reload();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const typeResponse = await fetch(`http://localhost:3003/get-project-type?projectID=${projectID}&courseName=${courseName}`);
        const typeData = await typeResponse.json();
        setProjecttype(typeData[0].template_id);
  
        const statusResponse = await fetch(`http://localhost:3003/get-project-status?projecttype=${projecttype}&courseName=${courseName}&projectID=${projectID}`);
        const statusData = await statusResponse.json();
        setProjectStatus(statusData);
  
        const studentsResponse = await fetch(`http://localhost:3003/get-students-for-project?projectID=${projectID}&courseName=${courseName}`);
        const studentsData = await studentsResponse.json();
        setStudents(studentsData);
  
        // Fetch GitHub link for the team (assuming all teammates have the same repository)
        const response = await fetch('http://localhost:3003/get-github-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseName: courseName,
            studentEmail: studentsData[0].email, // Use the email of any team member
          }),
        });
  
        if (response.status === 200) {
          const data = await response.json();
          setGithubLink(data.github_link);
  
          // Fetch commits when githubLink changes
          fetchCommits(); // Call fetchCommits here
        } else {
          console.error('Error fetching GitHub link:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchData();
  }, [projectID, courseName, projecttype]);
  
  useEffect(() => {
    // Call fetchCommits only if githubLink is available
    if (githubLink) {
      fetchCommits();
    }
    
  }, [githubLink]);

  

  return (
    <div>
      <Nav />
      <h1>Project Status</h1>
      {projectStatus && projectStatus.length > 0 ? (
        <div className="border p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Project Name: {projectStatus[0].project_name}</h2>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Task Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                {githubLink && (
                  <th scope="col" className="px-6 py-3">
                    View GitHub
                  </th>
                )}
                <th scope="col" className="px-6 py-3">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(projectStatus[0]).map((key) => {
                if (key.startsWith('task') && key.endsWith('_status')) {
                  const taskNumber = key.replace('task', '').replace('_status', '');
                  const studentEmail = selectedStudent ? selectedStudent.email : null;
                  const githubLinkKey = `${studentEmail}-${taskNumber}`;

                  return (
                    <tr key={key}>
                      <td className="px-6 py-4 font-medium">Task {taskNumber}</td>
                      <td className={`px-6 py-4 ${projectStatus[0][key] === 'completed' ? 'text-green-500' : 'text-red-500'}`}>
                        {projectStatus[0][key] ? projectStatus[0][key] : 'Not Completed'}
                      </td>
                      {githubLink && (
                        <td className="px-6 py-4">
                          {githubLink ? (
                            <a href={githubLink} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-4 py-2 rounded">
                              View GitHub
                            </a>
                          ) : (
                            <span className="text-gray-500">GitHub link not available</span>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => openPopup(projectStatus[0], taskNumber)}>
                          Grade
                        </button>
                      </td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading project status...</p>
      )}

      {isPopupOpen && students && (
        <GradePopup students={students} taskNumber={taskNumber} onClose={closePopup} onSubmit={submitGrade} />
      )}

      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">Add GitHub Repository</h2>
            <input
              type="text"
              placeholder="Enter GitHub link"
              value={githubLinkInput}
              onChange={(e) => setGithubLinkInput(e.target.value)}
              className="p-2 border rounded mb-4 w-full"
            />
            <div className="flex justify-end">
              <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={addRepository}>
                Add
              </button>
              <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={() => setShowPopup(true)}>
        Add Repository
      </button>

      <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-5" onClick={updateTaskStatus}>
        Update Task Status
      </button>

      <div className="mt-4">
  <h1 className="text-lg font-semibold mb-2">
    Leave Comment
  </h1>
  <textarea
    id="comment"
    name="comment"
    rows="3"
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    className="mt-1 p-2 border rounded w-1/2 text-base" // Adjusted font size
  ></textarea>
</div>

{/* Add a submit button for comments */}
<button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={submitComment}>
  Submit Comment
</button>
       
     
    </div>
  );
}

export default TeamProjectStatus;

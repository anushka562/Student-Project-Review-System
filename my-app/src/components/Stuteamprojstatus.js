
import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import GradePopup from './GradePopup';
import Stunav from './Stunav';
function Stuteamprojstatus() {
  const projectID = localStorage.getItem('currprojectid');
  const [projectStatus, setProjectStatus] = useState(null);
  const [projecttype, setProjecttype] = useState(null);
  const [students, setStudents] = useState(null);
  const courseName = localStorage.getItem('currcourse');
  const [team_id, setTeam_id] = useState(null);
  const studentEmail = localStorage.getItem('curruserEmail');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [taskNumber, setTaskNumber] = useState(null);
  const [comments, setComments] = useState(null); // New st
    // console.log(projectID);
    const openPopup = (student, taskNumber) => {
      setSelectedStudent(student);
      setTaskNumber(taskNumber);
      setIsPopupOpen(true);
    };
    
   const getTeamID = async () => {
      try {
        const response = await fetch(`http://localhost:3003/get-team-name?studentEmail=${studentEmail}&courseName=${courseName}`);
        const data = await response.json();
        console.log(data.team_name);
        setTeam_id(data.team_name);
        // getComments();
      } catch (error) {
        console.error('Error:', error);
      }
    };

    
    const getComments = async () => {
      try {
        const response = await fetch(`http://localhost:3003/get-comments?courseName=${courseName}&team_id=${team_id}`);
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    useEffect(() => {
      getTeamID();
      // Fetch comments when team_id changes
    }, []);

    useEffect(() => {
      
        getComments();
      
    }, [team_id]);


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
        } catch (error) {
          console.error('Error:', error);
        }
      };
  
      fetchData();
    }, [projectID, courseName, projecttype]);
  
    return (
      <div>
        <Stunav/>
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
                
                 
                </tr>
              </thead>
              <tbody>
                {Object.keys(projectStatus[0]).map((key) => {
                  if (key.startsWith('task') && key.endsWith('_status')) {
                    const taskNumber = key.replace('task', '').replace('_status', '');
                    return (
                      <tr key={key}>
                        <td className="px-6 py-4 font-medium">Task {taskNumber}</td>
                        <td className={`px-6 py-4 ${projectStatus[0][key] === 'completed' ? 'text-green-500' : 'text-red-500'}`}>
                          {projectStatus[0][key] ? projectStatus[0][key] : 'Not Completed'}
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

{comments && comments.length > 0 && (
        <div className="border p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Comments</h2>
          <div className="comments-scrollable overflow-y-auto max-h-60"> {/* Adjust max-h-60 as needed */}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Commented By
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Comment
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment.timestamp}>
                    <td className="px-6 py-4 font-medium">{comment.user_type}</td>
                    <td className="px-6 py-4">{comment.comment}</td>
                    <td className="px-6 py-4">{comment.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    );
}

export default Stuteamprojstatus
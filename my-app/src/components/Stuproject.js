import React, { useState, useEffect } from 'react';
import Stunav from './Stunav';
import { useNavigate } from 'react-router-dom';

function Stuproject() {
  const [projectDetails, setProjectDetails] = useState([]);
  const [projectID, setProjectId] = useState(null);
  const [projectType, setProjectType] = useState('');
  const courseName = localStorage.getItem('currcourse');
  const studentEmail = localStorage.getItem('curruserEmail');
  const navigate = useNavigate();
  const fetchProjectId = async () => {
    try {
      const response = await fetch('http://localhost:3003/student-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentEmail,
          courseName,
        }),
      });
      const responseJson = await response.json();
      if (response.status === 200) {
        setProjectId(responseJson[0].project_id);
        localStorage.setItem('currprojectid', responseJson[0].project_id);
      }
    } catch (error) {
      console.error('An error occurred while fetching project ID:', error);
    }
  };

  console.log(projectID);
  console.log(courseName);
  
  const fetchProjectType = async () => {
    try {
        const typeResponse = await fetch(`http://localhost:3003/get-project-type?projectID=${projectID}&courseName=${courseName}`);
        const typeData = await typeResponse.json();
        setProjectType(typeData[0].template_id);
    } catch (error) {
      console.error('An error occurred while fetching project type:', error);
    }
  };

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3003/project-detail?projectId=${projectID}&courseName=${courseName}&projecttype=${projectType}`
      );
      const responseJson = await response.json();

      if (response.status === 200) {
        setProjectDetails(responseJson);
      } else {
        console.error('Error fetching project details:', responseJson);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  useEffect(() => {
    fetchProjectId();
  }, [studentEmail, courseName]);

  useEffect(() => {
    if (projectID) {
      fetchProjectType();
    }
  }, [projectID, courseName]);

  useEffect(() => {
    if (projectID && projectType) {
      fetchProjectDetails();
    }
  }, [projectID, projectType, courseName]);

  return (
    <div>
      <Stunav />
      <h1 className='mb-5 text-3xl font-bold'></h1>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Task No
            </th>
            <th scope="col" className="px-6 py-3">
              Task Description
            </th>
            <th scope="col" className="px-6 py-3">
              Task Commit Message
            </th>
          </tr>
        </thead>
        <tbody>
          {projectDetails.map((project, projectIndex) => (
            <React.Fragment key={projectIndex}>
              {Array.from({ length: 5 }, (_, taskIndex) => {
                const taskNumber = taskIndex + 1;
                const isDescription = project.hasOwnProperty(`task${taskNumber}_description`);
                const isCommitMessage = project.hasOwnProperty(`task${taskNumber}_commit_message`);

                if (isDescription || isCommitMessage) {
                  return (
                    <tr
                      key={taskNumber}
                      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {taskNumber}
                      </td>
                      <td className="px-6 py-4">{project[`task${taskNumber}_description`]}</td>
                      <td className="px-6 py-4">{project[`task${taskNumber}_commit_message`]}</td>
                    </tr>
                  );
                }

                return null;
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
   
    </div>
  );
}

export default Stuproject;

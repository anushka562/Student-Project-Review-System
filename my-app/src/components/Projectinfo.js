import React, { useState, useEffect } from 'react';
import Nav from './Nav';

function Projectinfo() {
  const [projectDetails, setProjectDetails] = useState([]);
  const [teamNames, setTeamNames] = useState([]);
  const projectId = localStorage.getItem("currproject");
  const courseName = localStorage.getItem("currcourse");
  const projectType = localStorage.getItem("currtemplate");
  const projectname = localStorage.getItem("currprojectname");

  useEffect(() => {
    // Make a fetch call to your API to get project details based on projectId, courseName, and projectType
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3003/project-detail?projectId=${projectId}&courseName=${courseName}&projecttype=${projectType}`);
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
    const fetchTeamNames = async () => {
        try {
          const teamResponse = await fetch(`http://localhost:3003/teams_for_project?project_id=${projectId}&course_name=${courseName}`);
          const teamResponseJson = await teamResponse.json();
  
          if (teamResponse.status === 200) {
            setTeamNames(teamResponseJson.team_names);
          } else {
            console.error('Error fetching team names:', teamResponseJson);
          }
        } catch (error) {
          console.error('An error occurred while fetching team names:', error);
        }
      };
      fetchTeamNames();
    fetchProjectDetails();
    
  }, []);

  return (
    <div>
      <Nav />
      <h1 className='mb-5 text-3xl font-bold'>{projectname}</h1>
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
          <tr key={taskNumber} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {taskNumber}
            </td>
            <td className="px-6 py-4">
              {project[`task${taskNumber}_description`]}
            </td>
            <td className="px-6 py-4">
              {project[`task${taskNumber}_commit_message`]}
            </td>
          </tr>
        );
      }

      return null;
    })}
  </React.Fragment>
))}
        </tbody>
      </table>
      <div className="mt-5">
        <h2 className="text-xl font-semibold">Team Names:</h2>
        <ul>
          {teamNames.map((teamName, index) => (
            <li key={index}>{teamName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Projectinfo;

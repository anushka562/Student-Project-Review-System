import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Nav from './Nav';
function Tateamcard({ teamDetails }) {
    const [projectID, setProjectID] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [statusRedirect, setStatusRedirect] = useState(null);
    const navigate = useNavigate();
  
  
    useEffect(() => {
      // Check if there's a statusRedirect value and redirect accordingly
      if (statusRedirect) {
        window.location.href = statusRedirect;
      }
    }, [statusRedirect]);
  
    const handleAllotProject = () => {
      const formData = new FormData();
      formData.append('course_name', localStorage.getItem('currcourse'));
      formData.append('proj_Id', projectID);
      formData.append('team', selectedTeam);
  
      fetch('http://localhost:8000/allot-project/', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // Handle the response as needed
          // For example, close the popup and reset state
          setShowPopup(false);
          setProjectID('');
          setSelectedTeam(null);
        })
        .catch((error) => {
          console.error('Error:', error);
          // Handle error if needed
        });
    };
  
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Team Details</h1>
        {Object.keys(teamDetails).map((teamName) => (
          <div key={teamName} className="border p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">Team Name: {teamName}</h2>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Student Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {teamDetails[teamName].map((member, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {member[2]}
                    </td>
                    <td className="px-6 py-4">{member[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4>
              Assigned Project:{' '}
              <span style={{ color: teamDetails[teamName][0][5] ? 'black' : 'red' }}>
                {teamDetails[teamName][0][5] || 'No project assigned'}
              </span>
            </h4>
            {teamDetails[teamName][0][5] && (
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                onClick={() => {
                  // Redirect to /teamprojectstatus with the teamName and projectID
                  localStorage.setItem('projectID', teamDetails[teamName][0][5]);
                  localStorage.setItem('teamName', teamName);
                  navigate('/tateamprojectstatus');
                }}
              >
                View Status
              </button>
            )}
            {!teamDetails[teamName][0][5] && (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                onClick={() => {
                  setSelectedTeam(teamName);
                  setShowPopup(true);
                }}
              >
                Assign Project
              </button>
            )}
          </div>
        ))}
  
        {/* Pop-up for allotting project */}
        {showPopup && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <label className="block mb-2">
                Project ID:
                <input
                  type="text"
                  value={projectID}
                  onChange={(e) => setProjectID(e.target.value)}
                  className="border p-2 w-full"
                />
              </label>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                onClick={handleAllotProject}
              >
                Allot Project
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2 ml-2"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
}

export default Tateamcard
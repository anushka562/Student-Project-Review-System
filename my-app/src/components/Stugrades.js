import React, { useState, useEffect } from 'react';
import Stunav from './Stunav';

function Stugrades() {
  const [grades, setGrades] = useState([]);
  const courseName = localStorage.getItem('currcourse');
  const studentEmail = localStorage.getItem('curruserEmail');

  const fetchGrades = async () => {
    try {
      const response = await fetch('http://localhost:3003/get-student-grades', {
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
        setGrades(responseJson);
      }
    } catch (error) {
      console.error('An error occurred while fetching grades:', error);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  return (
    <div>
      <Stunav />
      <h1 className="mb-5 text-3xl font-bold">Student Grades</h1>
      <div className="flex flex-col mb-5">
        <h2 className="text-xl font-semibold mb-2">Project ID: {grades.length > 0 ? grades[0].project_id || '-' : '-'}</h2>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold">
                Task
              </th>
              <th scope="col" className="px-6 py-3 font-semibold">
                Grade
              </th>
            </tr>
          </thead>
          <tbody>
            {grades.length > 0 &&
              Array.from({ length: 5 }, (_, taskIndex) => {
                const taskNumber = taskIndex + 1;
                return (
                  <tr key={taskNumber} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      Task {taskNumber}
                    </td>
                    <td className="px-6 py-4 font-medium">{grades[0][`task${taskNumber}`] || <span className="font-bold">-</span>}</td>
                  </tr>
                );
              })}
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white font-semibold">Final Grade</td>
              <td className="px-6 py-4 font-medium">{grades.length > 0 ? grades[0].final_grade || <span className="font-bold">-</span> : <span className="font-bold">-</span>}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Stugrades;

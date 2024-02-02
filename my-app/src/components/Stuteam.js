import React, { useState, useEffect } from 'react';
import Stunav from './Stunav';

function Stuteam() {
    const [students, setStudents] = useState([]);
    const projectID = localStorage.getItem('currprojectid');
    const courseName = localStorage.getItem('currcourse');
    useEffect(() => {
        const fetchData = async () => {
          try {
            
            const studentsResponse = await fetch(`http://localhost:3003/get-students-for-project?projectID=${projectID}&courseName=${courseName}`);
            const studentsData = await studentsResponse.json();
            setStudents(studentsData);
          } catch (error) {
            console.error('Error:', error);
          }
        };
    
        fetchData();
      }, [projectID, courseName]);
    
  return (
    <div>
        <Stunav/>
      <table style={{ width: '100%', fontSize: '0.875rem' }}>
          <thead style={{ fontSize: '0.75rem', backgroundColor: '#edf2f7', color: '#718096' }}>
            <tr>
              <th style={{ padding: '0.75rem' }}>Name</th>
              <th style={{ padding: '0.75rem' }}>Email</th>
              
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.email}>
                <td style={{ padding: '0.75rem' }}>{student.name}</td>
                <td style={{ padding: '0.75rem' }}>{student.email}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  )
}

export default Stuteam
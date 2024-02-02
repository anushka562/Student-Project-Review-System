// GradePopup.js
import React, { useState } from 'react';

const GradePopup = ({ students, taskNumber, onClose, onSubmit }) => {
  const [marks, setMarks] = useState({});

  const handleInputChange = (email, e) => {
    setMarks((prevMarks) => ({ ...prevMarks, [email]: e.target.value }));
  };

  const handleSubmit = () => {
    onSubmit(marks);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        padding: '20px',
        zIndex: '1000',
      }}
    >
      <div>
        <h2>Grade Entry for Task {taskNumber}</h2>
        <table style={{ width: '100%', fontSize: '0.875rem' }}>
          <thead style={{ fontSize: '0.75rem', backgroundColor: '#edf2f7', color: '#718096' }}>
            <tr>
              <th style={{ padding: '0.75rem' }}>Name</th>
              <th style={{ padding: '0.75rem' }}>Email</th>
              <th style={{ padding: '0.75rem' }}>Marks</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.email}>
                <td style={{ padding: '0.75rem' }}>{student.name}</td>
                <td style={{ padding: '0.75rem' }}>{student.email}</td>
                <td style={{ padding: '0.75rem' }}>
                  <input
                    type="text"
                    value={marks[student.email] || ''}
                    onChange={(e) => handleInputChange(student.email, e)}
                    style={{
                      border: '1px solid black',
                      borderRadius: '4px',
                      padding: '0.5rem',
                      outline: 'none',
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '1rem' }}>
          <button
            style={{ backgroundColor: '#3490dc', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', marginLeft: '0.5rem' }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradePopup;

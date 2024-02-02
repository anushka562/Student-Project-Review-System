import React, { useState } from 'react';

function CourseForm({ onSubmit }) {
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = () => {
    // Call the onSubmit prop to handle the form data
    onSubmit({ courseCode, courseName });
    // Clear the form fields
    setCourseCode('');
    setCourseName('');
    // Close the form
    setIsFormOpen(false);
  };

  return (
    <div className={`popup ${isFormOpen ? 'open' : ''}`}>
      <label htmlFor="courseCodeInput">Course Code:</label>
      <input
        type="text"
        id="courseCodeInput"
        value={courseCode}
        onChange={(e) => setCourseCode(e.target.value)}
      />

      <label htmlFor="courseNameInput">Course Name:</label>
      <input
        type="text"
        id="courseNameInput"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
      />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default CourseForm;

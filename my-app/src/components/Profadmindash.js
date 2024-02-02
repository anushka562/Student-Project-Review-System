import React, { useEffect, useState } from 'react';
import Projectcard from './Projectcard';
import Navbar from './Navbar';

function Profadmindash() {
  const [courses, setCourses] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDataFormOpen, setIsDataFormOpen] = useState(false); // Add state for data form
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [dataCourseName, setDataCourseName] = useState(''); // Add state for data form
  const professorEmail = localStorage.getItem('curruserEmail');
  const [csvFile, setCSVFile] = useState(null);

  const handleDisplay = () => {
    if (!isFormOpen) {
      setIsFormOpen(true);
    } else {
      setIsFormOpen(false);
    }
  };

  const handleDisplayDataForm = () => {
    if (!isDataFormOpen) {
      setIsDataFormOpen(true);
    } else {
      setIsDataFormOpen(false);
    }
  };

  const handleAddCourse = async () => {
    try {
      const formData = new FormData();
      formData.append('course_name', courseName);
      formData.append('professor_email', professorEmail);
      formData.append('course_code', courseCode);

      const response = await fetch('http://localhost:8000/create-coursetable/', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 200) {
        setCourses([...courses, { course_code: courseCode, course_name: courseName }]);
        setCourseCode('');
        setCourseName('');
        setIsFormOpen(false);
      } else {
        const data = await response.json();
        console.error('Error adding course:', data);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleAddData = async () => {
    try {
      const formData = new FormData();
      formData.append('course_name', dataCourseName);
      //formData.append('professor_email', professorEmail);
      formData.append('file', csvFile);  // Assuming csvFile is the CSV file input
  
      const response = await fetch('http://localhost:8000/insert-data/', {
        method: 'POST',
        body: formData,
      });
  
      if (response.status === 200) {
        // Handle success, e.g., clear form fields, update state, etc.
        setDataCourseName('');
        setCSVFile(null); // Assuming setCSVFile is a function to clear the CSV file input
        // Handle other form field resets as needed
        setIsDataFormOpen(false);
      } else {
        const data = await response.json();
        console.error('Error adding data:', data);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  
  // Add event handler for file input changes
  const handleFileChange = (files) => {
    if (files.length > 0) {
      setCSVFile(files[0]);
    }
  };
  const fetchCourse = async () => {
    const response = await fetch('http://localhost:3003/professor-courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        professorEmail,
      }),
    });
    const responseJson = await response.json();
    if (response.status === 200) {
      setCourses(responseJson);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="mt-10 ml-10">
        <div className="flex flex-wrap md:-m-2 -m-1">
          <div className="flex flex-wrap ">
            {courses.map((course) => (
              <Projectcard coursecode={course.course_code} courseName={course.course_name} />
            ))}
          </div>
        </div>
        {isFormOpen ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-md">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <label htmlFor="courseCodeInput" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Course Code:
              </label>
              <input
                type="text"
                id="courseCodeInput"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter course code"
              />
              <label htmlFor="courseNameInput">Course Name:</label>
              <input
                type="text"
                id="courseNameInput"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter course name"
              />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  className="mt-2 bg-blue-500 hover-bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  onClick={handleAddCourse}
                >
                  Add Course
                </button>
                <button
                  className="mt-2 ml-2 bg-red-500 hover-bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  onClick={handleDisplay}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {isDataFormOpen ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-md">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <label htmlFor="csvFileInput">CSV File:</label>
              <input
                type="file"
                id="csvFileInput"
                // Add event handler to handle file input changes
                onChange={(e) => handleFileChange(e.target.files)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <label htmlFor="dataCourseNameInput">Course Name:</label>
              <input
                type="text"
                id="dataCourseNameInput"
                // Add state and event handler for course name
                value={dataCourseName}
                onChange={(e) => setDataCourseName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter course name"
              />
              {/* Add other form elements as needed */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  className="mt-2 bg-blue-500 hover-bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  onClick={handleAddData}
                >
                  Add Data
                </button>
                <button
                  className="mt-2 ml-2 bg-red-500 hover-bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  onClick={handleDisplayDataForm}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <button
          className="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleDisplay}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '1rem',
            transform: 'translateX(-50%)',
          }}
        >
          Add Course
        </button>
        <button
          className="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleDisplayDataForm}
          style={{
            position: 'absolute',
            left: '60%', // Adjust the position as needed
            bottom: '1rem',
            transform: 'translateX(-50%)',
          }}
        >
          Add Data
        </button>
      </div>
    </div>
  );
}

export default Profadmindash;

import React, { useEffect, useState } from 'react';
import Stunavb from './Stunavb'
import Projectcard from './Projectcard';
import Taprojectcard from './Taprojectcard';
import TaNav from './TaNav';
function Stutaadmindash() {
    const [courses, setCourses] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDataFormOpen, setIsDataFormOpen] = useState(false); // Add state for data form
    const [courseCode, setCourseCode] = useState('');
    const [courseName, setCourseName] = useState('');
    const [dataCourseName, setDataCourseName] = useState(''); // Add state for data form
    const studentEmail = localStorage.getItem('curruserEmail');
    const [csvFile, setCSVFile] = useState(null);
    console.log(studentEmail);
    const fetchCourse = async () => {
      const response = await fetch('http://localhost:3003/ta-courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentEmail,
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
        <Stunavb/>
        <h1 className="text-3xl text-center font-bold mt-10">TA Dashboard</h1>
        <div className="mt-10 ml-10">
          <div className="flex flex-wrap md:-m-2 -m-1">
            <div className="flex flex-wrap ">
              {courses.map((course) => (
                <Taprojectcard coursecode={course.course_code} courseName={course.course_name} />
              ))}
            </div>
          </div>
      </div>
      </div>
    )
}

export default Stutaadmindash
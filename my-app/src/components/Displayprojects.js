import React, { useEffect, useState } from 'react';
import Procard from './Procard';
import Nav from './Nav';

function Displayprojects() {
  const [projects, setProjects] = useState([]);
  const courseName = localStorage.getItem('currcourse');

  const fetchProjects = async () => {
    try {
      const response = await fetch(`http://localhost:3003/project-details?courseName=${courseName}`);
      const responseJson = await response.json();
      if (response.status === 200) {
        setProjects(responseJson);
      } else {
        console.error('Error fetching projects:', responseJson);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [projectType, setProjectType] = useState('');
  const [file, setFile] = useState(null);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleProjectTypeChange = (event) => {
    setProjectType(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadProjectDetails = async () => {
    try {
      const formData = new FormData();
      formData.append('course_name', courseName);
      formData.append('project_type', projectType);
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/insert-projectdetail/', {
        method: 'POST',
        body: formData,
      });

      const responseJson = await response.json();
      if (response.status === 200) {
        console.log(responseJson.message);
        // Close the popup after successful upload
        closePopup();
        // Refresh projects after uploading
        fetchProjects();
      } else {
        console.error('Error uploading project details:', responseJson);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteStudentEmail, setDeleteStudentEmail] = useState('');

  const openDeletePopup = () => {
    setIsDeletePopupOpen(true);
  };

  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    // Optionally, you can clear the input value when closing the popup
    setDeleteStudentEmail('');
  };

  const handleDeleteStudentEmailChange = (event) => {
    setDeleteStudentEmail(event.target.value);
  };

  const deleteStudent = async () => {
    try {
      // Get courseName from local storage
      const courseName = localStorage.getItem('currcourse');

      // Validate student email
      if (!deleteStudentEmail) {
        console.error('Invalid student email');
        return;
      }

      const response = await fetch('http://localhost:3003/drop-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName: courseName,
          studentEmail: deleteStudentEmail,
        }),
      });

      const responseJson = await response.json();
      if (response.status === 200) {
        console.log(responseJson.message);
        // Close the popup after successful deletion
        closeDeletePopup();
      } else {
        console.error('Error deleting student:', responseJson);
      }
    } catch (error) {
      console.error('An error occurred while deleting student:', error);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <Nav />
      <div className="flex flex-wrap">
        {projects.map((project) => (
          <Procard
            key={project.project_id}
            projectName={project.project_name}
            projectId={project.project_id}
            templateId={project.template_id}
          />
        ))}
      </div>

      {/* Centered Add Project Button */}
      <button onClick={openPopup} className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-2 rounded">
        Add Project
      </button>

      {/* Centered Delete Student Button */}
      <button onClick={openDeletePopup} className="fixed bottom-4 right-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded">
        Delete Student
      </button>

      {/* Vertically Centered Add Project Popup */}
      {isPopupOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-white p-4 rounded shadow-md">
          <label className="block mb-2">
            Project Type:
            <select className="border p-1 w-full" value={projectType} onChange={handleProjectTypeChange}>
              <option value="">Select Project Type</option>
              <option value="code">Code</option>
              <option value="research">Research</option>
              <option value="normal">Normal</option>
            </select>
          </label>

          <label className="block mb-2">
            Upload File:
            <input type="file" onChange={handleFileChange} className="border p-1 w-full" />
          </label>

          <button onClick={uploadProjectDetails} className="bg-blue-500 text-white p-2 rounded mt-4 w-full">
            Upload
          </button>

          <button onClick={closePopup} className="bg-gray-500 text-white p-2 rounded mt-2 w-full">
            Close
          </button>
        </div>
      )}

      {/* Vertically Centered Delete Student Popup */}
      {isDeletePopupOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-white p-4 rounded shadow-md">
          <label className="block mb-2">
            Student Email:
            <input type="text" value={deleteStudentEmail} onChange={handleDeleteStudentEmailChange} className="border p-1 w-full" />
          </label>

          <button onClick={deleteStudent} className="bg-red-500 text-white p-2 rounded mt-4 w-full">
            Delete
          </button>

          <button onClick={closeDeletePopup} className="bg-gray-500 text-white p-2 rounded mt-2 w-full">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default Displayprojects;

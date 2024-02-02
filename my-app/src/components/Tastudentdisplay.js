import React from 'react'
import { useEffect, useState } from 'react';
import TaNav from './TaNav';

function Tastudentdisplay() {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [teamName, setTeamName] = useState('');
    const [selectedCheckboxes, setSelectedCheckboxes] = useState('');

    // Fetch students data
    const fetchData = async (courseName) => {
        try {
            const response = await fetch('http://localhost:3003/get-students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ courseName }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            setStudents(data);
        } catch (error) {
            setError('An error occurred while fetching data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const courseName = localStorage.getItem('currcourse');
        if (courseName) {
            fetchData(courseName);
        }
    }, []);

    // Append data of checked students
    const appendCheckedStudentsData = async () => {
        const selectedStudents = students
            .filter((student) => selectedCheckboxes.includes(student.email))
            .map((student) => student.email);

        // Ensure that teamName is not empty before proceeding
        if (teamName.trim() === '') {
            setError('Please enter a team name.');
            return;
        }

        // Get the course name from localStorage
        const courseName = localStorage.getItem('currcourse');

        // Create form data
        const formData = new FormData();
        formData.append('course_name', courseName);
        formData.append('team_id', teamName);
        console.log(selectedStudents);

        // Append selected student emails to the form data
        formData.append('selected_students', selectedStudents.join(','));

        // Log FormData entries and values
        for (const pair of formData.entries()) {
            console.log(`FormData entry: ${pair[0]}, value: ${pair[1]}`);
        }

        // Call the createTeamAPI with form data
        try {
            const response = await fetch('http://localhost:8000/create-team/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to create team');
            }

            console.log('Team created successfully!');
        } catch (error) {
            setError('An error occurred while creating the team. Please try again later.');
        }
    };

    // Handle checkbox change
    const handleCheckboxChange = (studentEmail) => {
        setSelectedCheckboxes((prevCheckboxes) => {
            if (prevCheckboxes.includes(studentEmail)) {
                // If email is already in the list, remove it
                return prevCheckboxes.replace(studentEmail + ',', '');
            } else {
                // If email is not in the list, add it
                return prevCheckboxes + studentEmail + ',';
            }
        });
    };

    return (
        <div>
            <TaNav />

            <div className="container mx-auto mt-8">
                {isLoading && <div className="spinner">Loading...</div>}
                {error && <p className="text-red-500">{error}</p>}
                {!isLoading && !error && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Students in Current Course</h1>

                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Student Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Add to a team
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {student.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {student.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    id={`selectStudent_${student.id}`}
                                                    checked={selectedCheckboxes.includes(student.email)}
                                                    onChange={() => handleCheckboxChange(student.email)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Input field for team name */}
                        <div className="mt-4">
                            <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
                                Team Name:
                            </label>
                            <input
                                type="text"
                                id="teamName"
                                className="mt-1 p-2 border border-gray-300 rounded-md"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                            />
                        </div>

                        {/* Create Team button */}
                        <div className="mt-4">
                            <button onClick={appendCheckedStudentsData} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Create Team
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tastudentdisplay
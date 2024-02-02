import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import Teamcard from './Teamcard';

function DIsplayteams() {
  const [teamDetails, setTeamDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const formData = new FormData();
        formData.append('course_name', localStorage.getItem('currcourse'));

        const response = await fetch('http://localhost:8000/team-details/', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch team details');
        }

        const data = await response.json();
        setTeamDetails(data.team_details);
      } catch (error) {
        setError('An error occurred while fetching team details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamDetails();
  }, []);

  return (
    <div>
      <Nav />
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && <Teamcard teamDetails={teamDetails} />}
    </div>
  );
}

export default DIsplayteams;

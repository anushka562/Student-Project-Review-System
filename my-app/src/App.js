import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Admindash from './components/Admindash';
import Login from './components/Login'
import Stuadmindash from './components/Stuadmindash';
import Taadmindash from './components/Taadmindash';
import Profadmindash from './components/Profadmindash';
import Courseinfo from './components/Courseinfo';
import Studentdisplay from './components/Studentsdisplay';
import DIsplayteams from './components/DIsplayteams';
import Displayprojects from './components/Displayprojects';
import Projectinfo from './components/Projectinfo';
import Teamprojectstatus from './components/Teamprojectstatus';
import Stucourseinfo from './components/Stucourseinfo';
import Stuproject from './components/Stuproject';
import Stuteam from './components/Stuteam';
import Stugrades from './components/Stugrades';
import Stuteamprojstatus from './components/Stuteamprojstatus';
import Stutaadmindash from './components/Stutaadmindash';
import Tadisplayprojects from './components/Tadisplayprojects';
import Tadisplayteams from './components/Tadisplayteams';
import Taprojectinfo from './components/Taprojectinfo';
import Tateamstatus from './components/Tateamstatus';
import Tastudentdisplay from './components/Tastudentdisplay';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/admindash" element={<Admindash />} />
          <Route path="/login" element={<Login />} />
          <Route path='/stuadmindash' element={<Stuadmindash/>}/>
          <Route path='/taadmindash' element={<Taadmindash/>}/>
          <Route path='/profadmindash' element={<Profadmindash/>}/>
          <Route path='/courseinfo' element={<Courseinfo/>}/>
          <Route path ='/students' element={<Studentdisplay/>}/> 
          <Route path ='/team' element={<DIsplayteams/>}/>
          <Route path = '/projects' element={<Displayprojects/>}/>
          <Route path = '/projectinfo' element={<Projectinfo/>}/>
          <Route path = '/teamprojectstatus' element={<Teamprojectstatus/>}/>
          <Route path = '/stucourseinfo' element={<Stucourseinfo/>}/>
          <Route path = '/stuproject' element={<Stuproject/>}/>
          <Route path = '/stuteam' element={<Stuteam/>}/>
          <Route path = '/stugrades' element={<Stugrades/>}/>
          <Route path = '/stuprojectstatus' element={<Stuteamprojstatus/>}/>
          <Route path = '/stutaadmindash' element={<Stutaadmindash/>}/>
          <Route path = '/taprojects' element={<Tadisplayprojects/>}/>
          <Route path = '/tateam' element={<Tadisplayteams/>}/>
          <Route path = '/taprojectinfo' element={<Taprojectinfo/>}/>
          <Route path = '/tateamprojectstatus' element={<Tateamstatus/>}/>
          <Route path ='/tastudents' element={<Tastudentdisplay/>}/> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;

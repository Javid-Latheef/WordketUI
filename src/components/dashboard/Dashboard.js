import React, { useState } from 'react';
import '../../App.css';
import SideBar from '../sidebar/SideBar';
import Content from '../content/Content';
import { BrowserRouter as Router } from 'react-router-dom';
import './Dashboard.css';


function Dashboard() {

    const [isOpen, setOpen] = useState(true)
    const toggle = () => setOpen(!isOpen)
  
    return (
      <Router>
        <div>
        <div className="App wrapper">
          <SideBar toggle={toggle} isOpen={isOpen}/>
          <Content toggle={toggle} isOpen={isOpen}/>
        </div>
        </div>
      </Router>
    );
  }
  
  export default Dashboard;
import React from 'react';
import './CoursesMain.css';

const Dashboard = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const  headers= {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userDetails.token}`
      }
    return (
        <div className='maindashboarddiv m-3'>
            <h1>dashboard page</h1>
        </div>
    );
};

export default Dashboard;
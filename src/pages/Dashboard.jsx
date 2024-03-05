import React from 'react';

const Dashboard = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const  headers= {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userDetails.token}`
      }
    return (
        <div className='m-3'>
            <h1>dashboard page</h1>
        </div>
    );
};

export default Dashboard;
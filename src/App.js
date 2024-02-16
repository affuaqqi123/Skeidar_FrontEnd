import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Footer from './components/Footer.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Courses from './pages/Courses.jsx';
import Groups from './pages/Groups.jsx';
import Login from './pages/Login.jsx';
import CoursesMain from './pages/CoursesMain.jsx';
import StartCoursePage from './pages/StartCoursePage.jsx';
import Users from './pages/Users.jsx';
import Quiz from './pages/Quiz.jsx';
import Questions from './pages/Questions.jsx';
import UserGroup from './pages/UserGroup.jsx';
import Navbar from './components/Navbar.jsx';
import { Navigate } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLoggedInStatus = localStorage.getItem('isLoggedIn');
    if (storedLoggedInStatus) {
      setIsLoggedIn(JSON.parse(storedLoggedInStatus));
    }
    console.log(storedLoggedInStatus);
  }, []);

  const handleLogout = () => {
    console.log("handle logout called")
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <div >
      {!isLoggedIn && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login setLoggedIn={setIsLoggedIn} />} />
          </Routes>
        </BrowserRouter>
      )}
      {isLoggedIn && (
        <BrowserRouter>
        
          <div className="header">
            <Navbar onLogout={handleLogout} />
          </div>

          <div className="main-container" >
            <div className="sidebar">
              <Sidebar />
            </div>
            <div className="main-content">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/users" element={<Users />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/questions/:quizid" element={<Questions />} />
                <Route path="/usergroup" element={<UserGroup />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/coursesmain/:id" element={<CoursesMain />} />
                <Route path="/startcoursepage/:id" element={<StartCoursePage />} />
              </Routes>
            </div>
          </div>

          <div className="footer">
            <Footer />
          </div>
          
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
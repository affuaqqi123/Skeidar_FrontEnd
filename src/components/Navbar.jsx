import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavbarFooter.css';
import companylogo from '../Assets/skeidar-logo_white.webp';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', JSON.stringify(false));
    onLogout();
    navigate('/');
    window.location.reload();
  };
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  return (
    <div className='headerpage'>
      <div className='navbar'>
        <img src={companylogo} alt="" className='logo' />
        <ul>
          <li>
            <u>Welcome</u>
            <span style={{ fontWeight: "800", marginLeft: "10px" }}>{userDetails ? userDetails.userName : 'User'}</span>
          </li>
          <li>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;

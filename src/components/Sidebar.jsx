import React, { useState } from 'react';
import './Sidebar.css';
import {
    FaTh,
    FaBars,
    FaUser,
    FaUsers,
    FaPeopleRoof,
    FaChalkboard,
    FaGraduationCap,
    FaUserGroup
} from "react-icons/fa";
import { NavLink } from 'react-router-dom';




const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userRole = userDetails.role;
    const headers = { 'Authorization': userDetails.token }; // auth header with bearer token

    let menuItem;

    if (userRole === 'Admin') {
        menuItem = [
            {
                path: "/dashboard",
                name: "Dashboard",
                icon: <FaTh />
            },
            {
                path: "/groups",
                name: "Groups",
                icon: <FaUsers />
            },
            {
                path: "/users",
                name: "Users",
                icon: <FaUser />
            },
            {
                path: "/quiz",
                name: "Quiz",
                icon: <FaGraduationCap />
            },
            {
                path: "/usergroup",
                name: "UserGroup",
                icon: <FaUsers />
            },
            {
                path: "/courses",
                name: "Courses",
                icon: <FaChalkboard />
            }
        ];
    } else
    {
        menuItem = [
            {
                path: "/dashboard",
                name: "Dashboard",
                icon: <FaTh />
            },
            {
                path: "/courses",
                name: "Courses",
                icon: <FaChalkboard />
            }
        ];
    }
    return (

        <div className="cont">
            <div style={{ width: isOpen ? "200%" : "50%" }} className="sideb">
                <div className="top_section">
                    <div style={{ marginLeft: isOpen ? "0px" : "0px" }} className="bars">
                        <FaBars onClick={toggle} />
                    </div>
                </div>
                {
                    menuItem.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link" activeclassname="active">
                            <div className="icon">{item.icon}</div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                        </NavLink>
                    ))
                }
            </div>
            <main>{children}</main>
        </div>
    );
};

export default Sidebar;
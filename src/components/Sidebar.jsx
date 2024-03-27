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
import { Tooltip } from 'react-tooltip';
// import { Tooltip as ReactTooltip } from 'react-tooltip';





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
                icon: <FaTh />,
                tooltip: "Dashboard",
                backgroundColor: "blue"
            },
            {
                path: "/groups",
                name: "Groups",
                icon: <FaUsers />,
                tooltip: "Groups",
                
            },
            {
                path: "/users",
                name: "Users",
                icon: <FaUser />,
                tooltip: "Users"
            },
            {
                path: "/quiz",
                name: "Quiz",
                icon: <FaGraduationCap />,
                tooltip: "Quiz"
            },
            {
                path: "/usergroup",
                name: "UserGroup",
                icon: <FaUsers />,
                tooltip: "UserGroup"
            },
            {
                path: "/courses",
                name: "Courses",
                icon: <FaChalkboard />,
                tooltip: "Courses"
            }


        ];
    } else {
        menuItem = [
            {
                path: "/dashboard",
                name: "Dashboard",
                icon: <FaTh />,
                tooltip: "Dashboard"
            },
            {
                path: "/courses",
                name: "Courses",
                icon: <FaChalkboard />,
                tooltip: "Courses"
            }
        ];
    }
    return (

        <div className="cont">

            <Tooltip id="my-tooltip" style={{ zIndex: 9999 }} opacity={1} border="1px solid red" />
            <div style={{ width: isOpen ? "200%" : "100%" }} className="sideb">
                <div className="top_section">
                    <div style={{ marginLeft: isOpen ? "0px" : "0px" }} className="bars">
                        <FaBars onClick={toggle} />
                    </div>
                </div>
                {
                    menuItem.map((item, index) => (
                        
                        <NavLink to={item.path} key={index} className="link" activeclassname="active" title={item.tooltip}>
                            <div className="icon icon-box">{item.icon} </div>
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
import React, { useState, useEffect, Fragment } from "react";
import { BrowserRouter, Route, Routes, Link, useNavigate } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Container from 'react-bootstrap/Container';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CoursesMain from "./CoursesMain";
//  import CoursesMain from './pages/CoursesMain.jsx';



const Courses = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userRole = userDetails.role;
    const headers = { 'Authorization': userDetails.token }; // auth header with bearer token

    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showadd, setShowAdd] = useState(false);
    const handleCloseAdd = () => setShowAdd(false);
    const handleShowAdd = () => setShowAdd(true);

    //For filters option
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState('');

    //For Adding new Course
    const [coursename, setCourseName] = useState('')
    const [coursedes, setCourseDes] = useState('')
    const [coursegrpname, setCoursegrpname] = useState('')

    //For Updating existing Course
    const [editID, setEditId] = useState('')
    const [editCourseName, setEditCourseName] = useState('')
    const [editCourseDes, setEditCourseDes] = useState('')
    const [editCoursegrpname, setEditCoursegrpname] = useState('')
    const [values, setValues] = useState([])

    const [data, setData] = useState([]);
    const [userGroupData, setUserGroupData] = useState([]);
    const [userGroupName, setUserGroupName] = useState('');
    const [groupData, setGroupData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGroupData();
    }, []);

    useEffect(() => {
        fetchUserGroupData();
    }, [groupData]);

    useEffect(() => {
        getData();
    }, [userGroupData]);


    const fetchGroupData = () => {
        axios.get('https://localhost:7295/api/Group', { headers })
            .then((result) => {
                setGroupData(result.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const fetchUserGroupData = () => {
        const currentUserId = userDetails.userID;
        if(userRole !== "Admin"){
        axios.get('https://localhost:7295/api/UserGroup', { headers })
            .then((result) => {
                const filteredUserGroup = result.data.filter(userGroup => userGroup.userID === currentUserId);
                setUserGroupData(filteredUserGroup);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    };

    const getGroupById = (groupId) => {
        const group = groupData.find((group) => group.groupID === groupId);
        console.log("groupdata",groupData);
        return group ? group.groupName : 'Unknown Group';
    };

    const getData = () => {
        axios.get('https://localhost:7295/api/Course', { headers })
            .then((result) => {
                const userDetails = JSON.parse(localStorage.getItem('userDetails'));
                const userRole = userDetails.role;
                if (userRole !== 'Admin') {
                const userGroupId = userGroupData[0].groupID;
                console.log("id",userGroupId)
                setUserGroupName(getGroupById(userGroupId));
                console.log(groupData);
                }
                if (userRole !== 'Admin') {
                    const filteredData = result.data.filter(course => {
                        return course.groupName === userGroupName;
                    });
                    setData(filteredData);
                } else {
                    setData(result.data);
                }
                console.log("data",data);
                clear();
            })
            .catch((error) => {
                console.log(error);
            });
    };


    useEffect(() => {
        //update filtered data whenever search changes
        const filteredUsers = data.filter(user => {
            const coursenameMatch = user.courseName.toLowerCase().includes(search.toLowerCase());
            return coursenameMatch;
        });

        //set the filtered data
        setFilteredData(filteredUsers);
    }, [search, data]);


    const handleEdit = (id) => {
        //alert(id);
        handleShow();
        axios.get(`https://localhost:7295/api/Course/${id}`, { headers })
            .then((result) => {
                setEditCourseName(result.data.courseName);
                setEditCourseDes(result.data.description);
                setEditCoursegrpname(result.data.groupName);

                setEditId(id);
            })
            .catch((error) => {
                console.log(error)
            })

    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this Course") == true) {
            axios.delete(`https://localhost:7295/api/Course/${id}`, { headers })
                .then((result) => {
                    toast.success('Course has been deleted');
                    getData();
                    /*  if(result.status === 200)
                     {
                         alert(id);
                         toast.success('User has been deleted');
                         getData();
                     } */
                })
                .catch((error) => {
                    toast.error(error);
                })
        }
    }

    const handleDetails = (id) => {

        navigate(`/coursesmain/${id}`);

    }
    const handleStart = (id) => {
        navigate(`/startcoursepage/${id}`);
    }

    const handleUpdate = () => {

        const url = `https://localhost:7295/api/Course/${editID}`;
        const data = {
            "courseID": editID,
            "courseName": editCourseName,
            "description": editCourseDes,
            "groupName": editCoursegrpname
        }

        axios.put(url, data, { headers })
            .then((result) => {
                handleClose();
                getData();
                clear();
                toast.success('Course has been updated');
            }).catch((error) => {
                toast.error(error);
            })

    }
    const handleSave = () => {
        const url = 'https://localhost:7295/api/Course';
        const data = {
            "courseName": coursename,
            "description": coursedes,
            "groupName": coursegrpname
        }

        axios.post(url, data, { headers })
            .then((result) => {
                handleCloseAdd();
                getData();
                clear();
                toast.success('Course has been added');
            }).catch((error) => {
                toast.error(error);
            })
    }
    const handleClearFilters = () => {
        setSearch('');

    }

    const clear = () => {
        setCourseName('');
        setCourseDes('');
        setCoursegrpname('');
        setEditCourseName('');
        setEditCourseDes('');
        setEditCoursegrpname('');
        setEditId('');

    }


    return (
        <div className='d-flex flex-column justify-content-center align-items-center bg-light m-3'>
            <h1>List of Courses</h1>
            <div className='w-75 rounded bg-white border shadow p-4 align-items-center'>
                <ToastContainer />

                <br></br>

                {/* Filter inputs */}
                <div className="w-100 rounded bg-white border-bottom border-info  p-8 mt-0" >

                    {/* Filter input row */}
                    <div className="row mb-2 " style={{ paddingTop: "15px", paddingLeft: "15px" }} >
                        {/* Search input column */}
                        <div className="col-md-4 mb-2">
                            <input type="text" className="form-control" placeholder="Search by CourseName" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        {/* Clear filters button column */}
                        <div className="col-md-4 mb-2">
                            <button className="btn btn-secondary" onClick={handleClearFilters}>Clear Filters</button>
                        </div>
                        <div className="col-md-4 mb-2" style={{ float: "right" }}>
                            {userRole === 'Admin' && (
                                <button style={{ padding: "10px" }} className='btn btn-sm btn-success me-2 px-3' onClick={() => handleShowAdd()}>Add a New Course</button>
                            )}
                        </div>
                    </div>
                </div>
                <br></br>

                <Table striped bordered hover size="sm" className="text-center" responsive="sm" >
                    <thead className="thead-dark">
                        <tr>
                            <th className="text-center">#</th>
                            <th className="text-center">Course Name</th>
                            <th className="text-center">Course Description</th>
                            <th className="text-center">
                                {userRole === 'Admin' && (
                                    <>Course Group </>
                                )}
                            </th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {

                            filteredData && filteredData.length > 0 ?
                                filteredData.map((d, i) => (
                                    <tr key={i}>
                                        <td className="text-center">{i + 1}</td>
                                        {/* <td className="text-center">{d.courseID}</td> */}
                                        <td className="text-center">{d.courseName}</td>
                                        <td className="text-center">{d.description}</td>
                                        <td className="text-center">
                                            {userRole === 'Admin' && (
                                                <>
                                                    {d.groupName}
                                                </>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            {userRole === 'Admin' && (
                                                <>
                                                    <button className='btn btn-sm btn-primary me-2 px-3' onClick={() => handleEdit(d.courseID)}>Edit</button>
                                                    <button className='btn btn-sm btn-danger me-2' onClick={() => handleDelete(d.courseID)}>Delete</button>
                                                    <button className='btn btn-sm btn-info me-2 px-2' onClick={() => handleDetails(d.courseID)}>Details</button>
                                                </>
                                            )}
                                            <button className='btn btn-sm btn-primary me-2 px-3' onClick={() => handleStart(d.courseID)}>Start</button>
                                        </td>

                                    </tr>
                                )

                                )
                                :
                                <tr><td colSpan={"5"}><h4 style={{ paddingTop: "25px", textAlign: "center" }}> 'No Courses Found, please try again'</h4></td></tr>
                        }
                    </tbody>
                </Table>
                {/* Modal pop for updating user */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update details of the Course</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <input type="text" className="form-control" placeholder="Enter Course Name"
                                    value={editCourseName} onChange={(e) => setEditCourseName(e.target.value)} />
                            </Col>
                            <Col>
                                <input type="text" className="form-control" placeholder="Enter Course Description"
                                    value={editCourseDes} onChange={(e) => setEditCourseDes(e.target.value)} />
                            </Col>

                            <Col>
                                <input type="text" className="form-control" placeholder="Enter Course Description"
                                    value={editCoursegrpname} onChange={(e) => setEditCoursegrpname(e.target.value)} />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleUpdate}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal pop for adding new user */}
                <Modal show={showadd} onHide={handleCloseAdd} >
                    <Modal.Header closeButton>
                        <Modal.Title>Add a new Course</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <input type="text" className="form-control" placeholder="Enter Course Name"
                                    value={coursename} onChange={(e) => setCourseName(e.target.value)} />
                            </Col>
                            <Col>
                                <input type="text" className="form-control" placeholder="Enter Description"
                                    value={coursedes} onChange={(e) => setCourseDes(e.target.value)} />
                            </Col>
                            <Col>
                                <input type="text" className="form-control" placeholder="Enter Group Name"
                                    value={coursegrpname} onChange={(e) => setCoursegrpname(e.target.value)} />
                            </Col>

                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAdd}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Add Course
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

        </div>
    )

}

export default Courses
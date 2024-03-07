import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate } from 'react-router-dom';
import './CoursesMain.css';

const Quiz = () => {
    
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    
    const headers = { 
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${userDetails.token}`
    }; // auth header with bearer token

    const headerjsondata = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userDetails.token}`
    }; // auth header with bearer token

    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showAdd, setShowAdd] = useState(false);
    const handleCloseAdd = () => {
        setShowAdd(false);
        clear();
        clearErrors();
    };
    const handleShowAdd = () => setShowAdd(true);

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [editID, setEditID] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editCourseID, setEditCourseID] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newCourseID, setNewCourseID] = useState('');
    const [courseData, setCourseData] = useState([]);
    const [courseID, setCourseID] = useState('');
    const [courseName, setCourseName]=useState('');


    //Error Handling
    const [courseNameError, setCourseNameError] = useState('');
    const [quizTitleError, setQuizTitleError] = useState('');

    const [editCourseNameError, setEditCourseNameError] = useState('');
    const [editQuizTitleError, setEditQuizTitleError] = useState('');

    //Environment variables
    const apiUrl=process.env.REACT_APP_API_URL;

    useEffect(() => {
        getData();
        fetchCourseData();
    }, []);

    const getData = () => {
        axios.get(`${apiUrl}/Quiz`, { headerjsondata })
            .then((result) => {
                setData(result.data);
                clear();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const fetchCourseData = () => {       
        axios.get(`${apiUrl}/Course`, { headers })
            .then((result) => {                
                setCourseData(result.data);
                console.log("the value of coursename is :",result.data[0].courseName);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleEdit = (id) => {
        axios.get(`${apiUrl}/Quiz/${id}`, { headerjsondata })
            .then((result) => {
                setEditID(id);
                setEditTitle(result.data.title);
                setEditDescription(result.data.description);
                setEditCourseID(result.data.courseID);
                handleShow();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            axios.delete(`${apiUrl}/Quiz/${id}`, { headerjsondata })
                .then((result) => {
                    toast.success('Quiz has been deleted');
                    getData();
                })
                .catch((error) => {
                    toast.error(error);
                });
        }
    };

    const handleUpdate = () => {

        let formIsValid = true;


        if (!editCourseID) {
            setEditCourseNameError('Please select a CourseName');
            formIsValid = false;
        } else {
            setEditCourseNameError('');
        }

        if (!editTitle) {
            setEditQuizTitleError('Quiz Title is required');
            formIsValid = false;
        } else {
            setEditQuizTitleError('');
        }

        if (formIsValid) {
        const url = `${apiUrl}/Quiz/${editID}`;
        const data = {
            "quizID": editID,
            "courseID": editCourseID,
            "title": editTitle,
            "description": editDescription
           
        };
        axios.put(url, data,{ headerjsondata })
            .then((result) => {
                handleClose();
                getData();
                clear();
                toast.success('Quiz has been updated');
            })
            .catch((error) => {
                toast.error(error);
            });
        }
    };

    const handleSave = () => {
        let formIsValid = true;


        if (!newCourseID) {
            setCourseNameError('Please select a CourseName');
            formIsValid = false;
        } else {
            setCourseNameError('');
        }

        if (!newTitle) {
            setQuizTitleError('Quiz Title is required');
            formIsValid = false;
        } else {
            setQuizTitleError('');
        }

        if (formIsValid) {
        const url = `${apiUrl}/Quiz`;      
        const data = {
            "quizID": 0,
            "courseID": newCourseID,
            "title": newTitle,
            "description": newDescription
            
        };
        axios.post(url, data,{ headerjsondata })
       
            .then((result) => {
                handleCloseAdd();
                getData();
                clear();
                toast.success('New quiz has been added');
            })
            .catch((error) => {
                toast.error(error);
            });
        }
    };
    const handleAddQuestions = (quizid) => {

        navigate(`/questions/${quizid}`);
    }

    const getCourseNameById = (courseId) => {
        const crs = courseData.find((crsdt) => crsdt.courseID === courseId);
        return crs ? crs.courseName : 'No Course';
    };

    const clearErrors = () => {
        setCourseNameError('');
        setQuizTitleError('');
        setEditCourseNameError('');
        setEditQuizTitleError('');
        
    };

    const clear = () => {
        setEditID('');
        setEditTitle('');
        setEditDescription('');
        setEditCourseID('');
        setNewTitle('');
        setNewDescription('');
        setNewCourseID('');
    };

    return (
        <div className='quizdiv d-flex flex-column align-items-center bg-light m-3'>
            <br />
            <h1>List of Quizzes</h1>
            <div className='w-75 rounded bg-white border shadow p-4'>
                <ToastContainer />

                <button style={{ paddingLeft: '15px', width: '135px' }} className='btn btn-success' onClick={handleShowAdd}>Add</button>

                <Table striped bordered hover size='sm' responsive="sm" style={{ marginTop: '15px' }}>
                    <thead>
                        <tr>
                            <th className='text-center'>#</th>
                            <th className='text-center'>CourseName</th>
                            <th className='text-center'>Quiz Title</th>
                            <th className='text-center'>Description</th>
                            <th className='text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((d, i) => (
                            <tr key={i}>
                                <td className='text-center'>{i + 1}</td>
                                <td className='text-center'>{
                                getCourseNameById(d.courseID)
                                }</td>
                                <td className='text-center'>{d.title}</td>
                                <td className='text-center'>{d.description}</td>
                                <td className='text-center'>
                                    <button className='btn btn-sm btn-primary me-2 px-3' onClick={() => handleEdit(d.quizID)}>Edit</button>
                                    <button className='btn btn-sm btn-danger' onClick={() => handleDelete(d.quizID)}>Delete</button>
                                    <button className='btn btn-sm btn-primary me-2 px-3' onClick={() => handleAddQuestions(d.quizID)}>Add Questions</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Quiz</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div >
                    <label >Select Course:</label>
                                  <br />
                                  <select
                                      className='form-control mb-3'
                                      value={editCourseID}
                                      onChange={(e) => setEditCourseID(e.target.value)}
                                  >
                                      <option value='' >Select Course</option>
                                      {courseData.map((data) => (
                                          <option key={data.courseID} value={data.courseID}>
                                              {data.courseName}
                                          </option>
                                      ))}
                                  </select>

                            {/* <label htmlFor="editCourseID" className="form-label">Course ID</label>
                            <input type="text" className="form-control" id="editCourseID" value={editCourseID} onChange={(e) => setEditCourseID(e.target.value)} />
                        */}
                        <div className="text-danger">{editCourseNameError}</div>
                        </div> 
                        <div className="mb-3">
                            <label htmlFor="editTitle" className="form-label">Title</label>
                            <input type="text" className="form-control" id="editTitle" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                            <div className="text-danger">{editQuizTitleError}</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="editDescription" className="form-label">Description</label>
                            <textarea className="form-control" id="editDescription" rows="3" value={editDescription} onChange={(e) => setEditDescription(e.target.value)}></textarea>
                        </div>
                        
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

                <Modal show={showAdd} onHide={handleCloseAdd}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Quiz</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div >
                    <select
                                      className='form-control mb-3'
                                      value={newCourseID}
                                      onChange={(e) => setNewCourseID(e.target.value)}
                                  >
                                      <option value=''>Select Course Name</option>
                                      {courseData.map((data) => (
                                          <option key={data.courseID} value={data.courseID}>
                                              {data.courseName}
                                          </option>
                                      ))}
                                  </select>
                                  <div className="text-danger">{courseNameError}</div>
                            {/* <label htmlFor="newCourseID" className="form-label">Course ID</label>
                            <input type="text" className="form-control" id="newCourseID" value={newCourseID} onChange={(e) => setNewCourseID(e.target.value)} /> */}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newTitle" className="form-label">Title</label>
                            <input type="text" className="form-control" id="newTitle" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                            <div className="text-danger">{quizTitleError}</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newDescription" className="form-label">Description</label>
                            <textarea className="form-control" id="newDescription" rows="3" value={newDescription} onChange={(e) => setNewDescription(e.target.value)}></textarea>
                        </div>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAdd}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Add Quiz
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default Quiz;

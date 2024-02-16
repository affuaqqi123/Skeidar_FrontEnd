import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate } from 'react-router-dom';

const Quiz = () => {
    const navigate = useNavigate();
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const headers = { 'Authorization': userDetails.token }; // auth header with bearer token

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showAdd, setShowAdd] = useState(false);
    const handleCloseAdd = () => {
        setShowAdd(false);
        clear();
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

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios.get('https://localhost:7295/api/Quiz', { headers })
            .then((result) => {
                setData(result.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleEdit = (id) => {
        axios.get(`https://localhost:7295/api/Quiz/${id}`, { headers })
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
            axios.delete(`https://localhost:7295/api/Quiz/${id}`, { headers })
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
        const url = `https://localhost:7295/api/Quiz/${editID}`;
        const data = {
            quizID: editID,
            title: editTitle,
            description: editDescription,
            courseID: editCourseID
        };
        axios.put(url, data, { headers })
            .then((result) => {
                handleClose();
                getData();
                clear();
                toast.success('Quiz has been updated');
            })
            .catch((error) => {
                toast.error(error);
            });
    };

    const handleSave = () => {
        const url = 'https://localhost:7295/api/Quiz';
        const data = {
            title: newTitle,
            description: newDescription,
            courseID: newCourseID
        };
        axios.post(url, data, { headers })
            .then((result) => {
                handleCloseAdd();
                getData();
                clear();
                toast.success('New quiz has been added');
            })
            .catch((error) => {
                toast.error(error);
            });
    };
    const handleAddQuestions = (quizid) => {

        navigate(`/questions/${quizid}`);
    }

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
        <div className='d-flex flex-column justify-content-center align-items-center bg-light m-3'>
            <br />
            <h1>List of Quizzes</h1>
            <div className='w-75 rounded bg-white border shadow p-4'>
                <ToastContainer />

                <button style={{ paddingLeft: '15px', width: '135px' }} className='btn btn-success' onClick={handleShowAdd}>Add</button>

                <Table striped bordered hover size='sm' style={{ marginTop: '15px' }}>
                    <thead>
                        <tr>
                            <th className='text-center'>#</th>
                            <th className='text-center'>CourseID</th>
                            <th className='text-center'>Title</th>
                            <th className='text-center'>Description</th>
                            <th className='text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((d, i) => (
                            <tr key={i}>
                                <td className='text-center'>{i + 1}</td>
                                <td className='text-center'>{d.courseID}</td>
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
                        <div className="mb-3">
                            <label htmlFor="editTitle" className="form-label">Title</label>
                            <input type="text" className="form-control" id="editTitle" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="editDescription" className="form-label">Description</label>
                            <textarea className="form-control" id="editDescription" rows="3" value={editDescription} onChange={(e) => setEditDescription(e.target.value)}></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="editCourseID" className="form-label">Course ID</label>
                            <input type="text" className="form-control" id="editCourseID" value={editCourseID} onChange={(e) => setEditCourseID(e.target.value)} />
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
                        <div className="mb-3">
                            <label htmlFor="newTitle" className="form-label">Title</label>
                            <input type="text" className="form-control" id="newTitle" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newDescription" className="form-label">Description</label>
                            <textarea className="form-control" id="newDescription" rows="3" value={newDescription} onChange={(e) => setNewDescription(e.target.value)}></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newCourseID" className="form-label">Course ID</label>
                            <input type="text" className="form-control" id="newCourseID" value={newCourseID} onChange={(e) => setNewCourseID(e.target.value)} />
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

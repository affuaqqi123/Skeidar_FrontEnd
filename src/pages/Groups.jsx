import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, Form, FormGroup, FormLabel, FormControl } from 'react-bootstrap';

const Groups = () => {

    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userDetails.token}`
    }
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Validation Variable
    const [groupNameError, setGroupNameError] = useState('');
    const [editGroupNameError, setEditGroupNameError] = useState('');

    const [showadd, setShowAdd] = useState(false);
    const handleCloseAdd = () => {
        setShowAdd(false);
        clear();
        clearErrors();
    };
    const handleShowAdd = () => setShowAdd(true);

    //For Adding new Group
    const [group, setGroup] = useState('')

    //For Updating existing Group
    const [editID, setEditId] = useState('')
    const [editGroup, setEditGroup] = useState('')

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    //Environment variables
    const apiUrl=process.env.REACT_APP_API_URL;

    useEffect(() => {
        getData();
    }, [])

    const getData = () => {
        axios.get(`${apiUrl}/Group`, { headers })
            .then((result) => {
                setData(result.data)
                console.log(result.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleEdit = (id) => {
        handleShow();
        axios.get(`${apiUrl}/Group/${id}`, { headers })
            .then((result) => {
                setEditGroup(result.data.groupName);
                setEditId(id);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this Group") == true) {
            axios.delete(`${apiUrl}/Group/${id}`, { headers })
                .then((result) => {
                    toast.success('Group has been deleted');
                    getData();
                })
                .catch((error) => {
                    toast.error(error);
                })
        }
    }
    const handleUpdate = () => {
        let formIsValid = true;

        if (!editGroup) {
            setEditGroupNameError('Name is required');
            formIsValid = false;
        } else {
            setEditGroupNameError('');
        }

        if (formIsValid) {
            const url = `${apiUrl}/Group/${editID}`;
            const data = {
                "groupID": editID,
                "groupName": editGroup
            }
            axios.put(url, data, { headers })
                .then((result) => {
                    handleClose();
                    getData();
                    clear();
                    toast.success('Group has been updated');
                }).catch((error) => {
                    toast.error(error);
                })
        }
    }

    const handleSave = () => {
        let formIsValid = true;

        if (!group) {
            setGroupNameError('GroupName is required');
            formIsValid = false;
        } else {
            setGroupNameError('');
        }

        if (formIsValid) {
            const url = `${apiUrl}/Group`;
            const data = {
                "groupname": group,

            }
            axios.post(url, data, { headers })
                .then((result) => {
                    handleCloseAdd();
                    getData();
                    clear();
                    toast.success('Group has been added');
                }).catch((error) => {
                    toast.error(error);
                })
        }
    }
    const clearErrors = () => {
        setGroupNameError('');
    }
    const clear = () => {
        setGroup('');
        setEditGroup('');
        setEditId('');
        setGroupNameError('');
    }
    return (
        <div className='d-flex flex-column justify-content-center align-items-center bg-light m-3'>
            <br></br>
            <h1>List of Groups</h1>
            <div className='w-75 rounded bg-white border shadow p-4'>
                <ToastContainer />

                <button style={{ paddingLeft: "15px", width: "135px" }} className="btn btn-success" onClick={() => handleShowAdd()}>Add</button>

                <Table striped bordered hover size="sm" style={{ marginTop: "15px" }}>
                    <thead >
                        <tr>
                            <th className="text-center">#</th>
                            <th className="text-center">Group Name</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((d, i) => (

                                <tr key={i}>
                                    <td className="text-center">{i + 1}</td>
                                    <td className="text-center">{d.groupName}</td>
                                    <td className="text-center">
                                        <button className='btn btn-sm btn-primary me-2 px-3' onClick={() => handleEdit(d.groupID)}>Edit</button>
                                        <button className='btn btn-sm btn-danger ' onClick={() => handleDelete(d.groupID)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update details of a Group</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <FormGroup>
                                <FormLabel>Group Name</FormLabel>
                                <FormControl
                                    type="text"
                                    placeholder="Enter Group Name"
                                    value={editGroup}
                                    onChange={(e) => setEditGroup(e.target.value)}
                                />
                                <div className="text-danger">{editGroupNameError}</div>
                            </FormGroup>
                        </Form>
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
                <Modal show={showadd} onHide={handleCloseAdd}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create a new Group</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <FormGroup>
                                <FormLabel>Group Name</FormLabel>
                                <FormControl
                                    type="text"
                                    placeholder="Enter Group Name"
                                    value={group}
                                    onChange={(e) => setGroup(e.target.value)}
                                />
                                
                                <div className="text-danger">{groupNameError}</div>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAdd}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Create
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

export default Groups

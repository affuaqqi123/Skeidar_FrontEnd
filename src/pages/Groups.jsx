import React, { useState, useEffect, Fragment } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Groups = () => {

    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const headers = { 'Authorization': userDetails.token }; // auth header with bearer token

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showadd, setShowAdd] = useState(false);
    const handleCloseAdd = () => {
        setShowAdd(false);
        clear();
    };
    const handleShowAdd = () => setShowAdd(true);

    //For Adding new Group
    const [group, setGroup] = useState('')

    //For Updating existing Group
    const [editID, setEditId] = useState('')
    const [editGroup, setEditGroup] = useState('')

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        getData();
    }, [])

    const getData = () => {
        axios.get('https://localhost:7295/api/Group', { headers })
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
        axios.get(`https://localhost:7295/api/Group/${id}`, { headers })
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
            axios.delete(`https://localhost:7295/api/Group/${id}`, { headers })
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

        const url = `https://localhost:7295/api/Group/${editID}`;
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

    const handleSave = () => {
        const url = 'https://localhost:7295/api/Group';
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

    const clear = () => {
        setGroup('');
        setEditGroup('');
        setEditId('');

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
                        <Row>
                            <Col>
                                <input type="text" className="form-control" placeholder="Enter Group"
                                    value={editGroup} onChange={(e) => setEditGroup(e.target.value)} />
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
                <Modal show={showadd} onHide={handleCloseAdd}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create a new Group</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <input type="text" className="form-control" placeholder="Enter Group Name"
                                    value={group} onChange={(e) => setGroup(e.target.value)} />
                            </Col>
                        </Row>
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

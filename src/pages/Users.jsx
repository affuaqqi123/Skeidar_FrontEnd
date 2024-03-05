import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Modal, Button, Col, Form, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
// import Container from 'react-bootstrap/Container';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Users = () => {

    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userDetails.token}`
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showadd, setShowAdd] = useState(false);
    const handleCloseAdd = () => {
        setShowAdd(false);
        clear();
        clearErrors();
    };
    const handleShowAdd = () => setShowAdd(true);

    const [eName, setEName] = useState('');
    const [ePassword, setEPassword] = useState('');
    const [eEmail, setEEmail] = useState('');


    //For filters option
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [filteredData, setFilteredData] = useState('');

    //For Adding new User
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [store, setStore] = useState('')

    //Error Handling
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [roleError, setRoleError] = useState('');
    const [storeError, setStoreError] = useState('');

    const [editNameError, setEditNameError] = useState('');
    const [editEmailError, setEditEmailError] = useState('');
    const [editPasswordError, setEditPasswordError] = useState('');
    const [editRoleError, setEditRoleError] = useState('');
    const [editStoreError, setEditStoreError] = useState('');

    //For Updating existing User
    const [editID, setEditId] = useState('')
    const [editName, setEditName] = useState('')
    const [editEmail, setEditEmail] = useState('')
    const [editPassword, setEditPassword] = useState('')
    const [editRole, setEditRole] = useState('')
    const [editStore, setEditStore] = useState('')

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    //for dropdown list
    const [rolelist, setRolelist] = useState([{}])

    useEffect(() => {
        getData();
    }, []);


    const getData = () => {
        axios.get('https://localhost:7295/api/User', { headers })
            .then((result) => {
                setData(result.data)
                setRolelist(result.data)
                clear();
            })
            .catch((error) => {
                console.log(error)
            })
    }
    // useEffect(()=>{
    //     console.log("hello all");
    // },[eEmail, eName, ePassword])

    useEffect(() => {
        //update filtered data whenever search or rolefilter changes
        const filteredUsers = data.filter(user => {
            const usernameMatch = user.username.toLowerCase().includes(search.toLowerCase());
            const roleMatch = user.role.toLowerCase().includes(roleFilter.toLowerCase());

            return usernameMatch && roleMatch;
        });

        //set the filtered data
        setFilteredData(filteredUsers);
    }, [search, roleFilter, data]);

    /* useEffect(() => {
        axios.get('https://localhost:7295/api/User')
            .then(response => {
                console.log(response.data);
                setData(response.data);

            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError(error);

            });
    }, []) */
    const handleEdit = (id) => {
        //alert(id);
        handleShow();
        axios.get(`https://localhost:7295/api/User/${id}`, { headers })
            .then((result) => {
                setEditName(result.data.username);
                setEditEmail(result.data.userEmail);
                setEditPassword(result.data.password);
                setEditRole(result.data.role);
                setEditStore(result.data.storeID);
                setEditId(id);

            })
            .catch((error) => {
                console.log(error)
            })
        console.log({ editName });
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this User") == true) {
            axios.delete(`https://localhost:7295/api/User/${id}`, { headers })
                .then((result) => {
                    toast.success('User has been deleted');
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
    const handleUpdate = () => {
        let formIsValid = true;

        if (!editName) {
            setEditNameError('Name is required');
            formIsValid = false;
        } else {
            setEditNameError('');
        }

        if (!editEmail) {
            setEditEmailError('Email is required');
            formIsValid = false;
        } else {
            setEditEmailError('');
        }

        if (!editPassword) {
            setEditPasswordError('Password is required');
            formIsValid = false;
        } else {
            setEditPasswordError('');
        }

        if (!editRole) {
            setEditRoleError('Role is required');
            formIsValid = false;
        } else {
            setEditRoleError('');
        }

        if (!editStore) {
            setEditStoreError('Store ID is required');
            formIsValid = false;
        } else {
            setEditStoreError('');
        }

        if (formIsValid) {
            const url = `https://localhost:7295/api/User/${editID}`;
            const data = {
                "userID": editID,
                "username": editName,
                "userEmail": editEmail,
                "password": editPassword,
                "role": editRole,
                "storeID": editStore
            };

            axios.put(url, data, { headers })
                .then((result) => {
                    handleClose();
                    getData();
                    clear();
                    toast.success('User has been updated');
                })
                .catch((error) => {
                    toast.error(error);
                });
        }
    };


    const handlesend = async (id) => {
        try {
            const result = await axios.get(`https://localhost:7295/api/User/${id}`, { headers });
            console.log(result.data);
            // Set state variables
            setEName(result.data.username);
            setEPassword(result.data.password);
            setEEmail(result.data.userEmail);
            // Perform the second API call after setting state
            const url = `https://localhost:7295/api/User/slgemail?recipientEmail=${result.data.userEmail}&username=${result.data.username}&password=${result.data.password}`;
            console.log({ url });
            await axios.post(url, {}, { headers });
            toast.success('Email has been sent');
        } catch (error) {
            console.log(error);
            toast.error('Error sending email');
        }
    }


    const handleSave = () => {
        let formIsValid = true;

        if (!name) {
            setNameError('Name is required');
            formIsValid = false;
        } else {
            setNameError('');
        }

        if (!email) {
            setEmailError('Email is required');
            formIsValid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Password is required');
            formIsValid = false;
        } else {
            setPasswordError('');
        }

        if (!role) {
            setRoleError('Role is required');
            formIsValid = false;
        } else {
            setRoleError('');
        }

        if (!store) {
            setStoreError('Store ID is required');
            formIsValid = false;
        } else {
            setStoreError('');
        }

        if (formIsValid) {
            // Proceed with saving the user
            const url = 'https://localhost:7295/api/User';
            const data = {
                "userID": 0,
                "username": name,
                "userEmail": email,
                "password": password,
                "role": role,
                "StoreID": store
            };
            axios.post(url, data, { headers })
                .then((result) => {
                    handleCloseAdd();
                    getData();
                    clear();
                    toast.success('User has been added');
                })
                .catch((error) => {
                    toast.error(error);
                });
        }
    };

    const handleClearFilters = () => {
        setSearch('');
        setRoleFilter('');
    }

    const clearErrors = () => {
        setNameError('');
        setEmailError('');
        setPasswordError('');
        setRoleError('');
        setStoreError('');
    };

    const clear = () => {
        setName('');
        setEmail('');
        setPassword('');
        setRole('');
        setStore('');
        setEditName('');
        setEditEmail('');
        setEditPassword('');
        setEditRole('');
        setStore('');
        setEditId('');

    }

    return (
        <div className='d-flex flex-column justify-content-center align-items-center bg-light m-3'>
            <br></br>
            <h1>List of Users</h1>
            <ToastContainer />
            <div className='w-100 rounded bg-white border shadow p-4 mt-4'>

                <div style={{ float: "right" }}>
                    <button style={{ padding: "10px" }} className='btn btn-sm btn-success me-2 px-3' onClick={() => handleShowAdd()}>Add a New User</button>
                </div>
                <br></br>

                {/* Filter inputs */}
                <div className="w-100 rounded bg-white border-bottom border-info  p-8 mt-0" >

                    {/* Filter input row */}
                    <div className="row mb-2 " style={{ paddingTop: "15px", paddingLeft: "15px" }} >
                        {/* Search input column */}
                        <div className="col-md-4 mb-2">
                            <input type="text" className="form-control" placeholder="Search by Username" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        {/* Role filter input column */}
                        <div className="col-md-4 mb-2">
                            <select className="form-control" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                                <option value="" disabled>--Search by Role--</option>
                                <option value="Admin">Admin</option>
                                <option value="Information Officer">Information Officer</option>
                                <option value="User">User</option>
                                <option value="Manager">Manager</option>
                                <option value="HR">HR</option>
                                <option value="Supervisor">Supervisor</option>
                                <option value="TeamLead">TeamLead</option>
                            </select>
                        </div>
                        {/* Clear filters button column */}
                        <div className="col-md-4 mb-2">
                            <button className="btn btn-secondary" onClick={handleClearFilters}>Clear Filters</button>

                        </div>
                    </div>
                </div>
                <br></br>

                <Table striped bordered hover size="sm" className="text-center" responsive="sm" >
                    <thead className="thead-dark">
                        <tr>
                            <th className="text-center">#</th>
                            {/* <th className="text-center">User ID</th> */}
                            <th className="text-center">User Name</th>
                            <th className="text-center">User Email</th>
                            {<th className="text-center">User Password</th>}
                            <th className="text-center">User Role</th>
                            <th className="text-center">StoreID</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            /* data && data.length > 0 ?
                                data.map((d, i) => ( */
                            filteredData && filteredData.length > 0 ?
                                filteredData.map((d, i) => (
                                    <tr key={i}>
                                        <td className="text-center">{i + 1}</td>
                                        {/* <td className="text-center">{d.username}</td> */}
                                        <td className="text-center">{d.username}</td>
                                        <td className="text-center">{d.userEmail}</td>
                                        <td className="text-center">{d.password}</td>
                                        <td className="text-center">{d.role}</td>
                                        <td className="text-center">{d.storeID}</td>
                                        <td className="text-center">
                                            <button className='btn btn-sm btn-primary' onClick={() => handleEdit(d.userID)}>Edit</button>
                                            <button className='btn btn-sm btn-danger ' onClick={() => handleDelete(d.userID)}>Delete</button>
                                            <button className='btn btn-sm btn-info ' onClick={() => handlesend(d.userID)}>Send</button>
                                        </td>
                                    </tr>
                                )

                                )
                                :
                                <tr><td colSpan={"5"}><h4 style={{ paddingTop: "25px", textAlign: "center" }}> 'No Records Found, please try again'</h4></td></tr>
                        }
                    </tbody>
                </Table>
                {/* Modal pop for updating user */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update details of the User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <FormGroup>
                                <FormLabel>Name</FormLabel>
                                <FormControl
                                    type="text"
                                    placeholder="Enter Name"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                                <div className="text-danger">{editNameError}</div>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Email</FormLabel>
                                <FormControl
                                    type="text"
                                    placeholder="Enter UserEmail"
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                />
                                <div className="text-danger">{editEmailError}</div>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Password</FormLabel>
                                <FormControl
                                    type="text"
                                    placeholder="Enter Password"
                                    value={editPassword}
                                    onChange={(e) => setEditPassword(e.target.value)}
                                />
                                <div className="text-danger">{editPasswordError}</div>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Role</FormLabel>
                                <FormControl
                                    as="select"
                                    value={editRole}
                                    onChange={(e) => setEditRole(e.target.value)}
                                >
                                    <option value=""> --Select Role--</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Information Officer">Information Officer</option>
                                    <option value="User">User</option>
                                    <option value="Manager">Manager</option>
                                    <option value="HR">HR</option>
                                    <option value="Supervisor">Supervisor</option>
                                    <option value="TeamLead">TeamLead</option>
                                </FormControl>
                                <div className="text-danger">{editRoleError}</div>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Store ID</FormLabel>
                                <FormControl
                                    type="text"
                                    placeholder="Enter StoreID"
                                    value={editStore}
                                    onChange={(e) => setEditStore(e.target.value)}
                                />
                                <div className="text-danger">{editStoreError}</div>
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



                {/* Modal pop for adding new user */}
                <Modal show={showadd} onHide={handleCloseAdd}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add a new User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <FormGroup>
                                <FormLabel>Name</FormLabel>
                                <FormControl
                                    type="text"
                                    placeholder="Enter Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <div className="text-danger">{nameError}</div>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Email</FormLabel>
                                <FormControl
                                    type="text"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="text-danger">{emailError}</div>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Password</FormLabel>
                                <FormControl
                                    type="password"
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="text-danger">{passwordError}</div>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Role</FormLabel>
                                <FormControl
                                    as="select"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value=""> --Select Role--</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Information Officer">Information Officer</option>
                                    <option value="User">User</option>
                                    <option value="Manager">Manager</option>
                                    <option value="HR">HR</option>
                                    <option value="Supervisor">Supervisor</option>
                                    <option value="TeamLead">TeamLead</option>
                                </FormControl>
                                <div className="text-danger">{roleError}</div>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Store ID</FormLabel>
                                <FormControl
                                    type="number"
                                    placeholder="Enter Store ID"
                                    value={store}
                                    onChange={(e) => setStore(e.target.value)}
                                />
                                <div className="text-danger">{storeError}</div>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAdd}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Add User
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

        </div>
    )

}

export default Users
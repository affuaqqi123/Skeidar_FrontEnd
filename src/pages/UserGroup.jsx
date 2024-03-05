import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserGroups = () => {

    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const  headers= {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userDetails.token}`
      }

      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
  
      const [showAdd, setShowAdd] = useState(false);
      const handleCloseAdd = () => setShowAdd(false);
      const handleShowAdd = () => setShowAdd(true);
  
      // For filters option
      const [search, setSearch] = useState('');
      const [filteredData, setFilteredData] = useState('');
  
      // For Adding new UserGroup
      const [userID, setUserID] = useState('');
      const [groupID, setGroupID] = useState('');
  
      // For Updating existing UserGroup
      const [editID, setEditID] = useState('');
      const [editUserID, setEditUserID] = useState('');
      const [editGroupID, setEditGroupID] = useState('');
  
      const [userData, setUserData] = useState([]);
      const [groupData, setGroupData] = useState([]);
      const [data, setData] = useState([]);
      const [error, setError] = useState(null);
  
      useEffect(() => {
          getData();
          fetchUserData();
          fetchGroupData();
      }, []);
  
      const getData = () => {
          axios.get('https://localhost:7295/api/UserGroup', { headers })
              .then((result) => {
                  setData(result.data);
                  clear();
              })
              .catch((error) => {
                  console.log(error);
              });
      };
  
      const fetchUserData = () => {
          axios.get('https://localhost:7295/api/User', { headers })
              .then((result) => {
                  setUserData(result.data);
              })
              .catch((error) => {
                  console.log(error);
              });
      };
  
      const fetchGroupData = () => {
          axios.get('https://localhost:7295/api/Group', { headers })
              .then((result) => {
                  setGroupData(result.data);
              })
              .catch((error) => {
                  console.log(error);
              });
      };
  
      const getUserById = (userId) => {
          const user = userData.find((user) => user.userID === userId);
          return user ? user.username : 'Unknown User';
      };
  
      const getGroupById = (groupId) => {
          const group = groupData.find((group) => group.groupID === groupId);
          return group ? group.groupName : 'Unknown Group';
      };
  
  
      useEffect(() => {
          // Update filtered data whenever search changes
          const filteredUserGroups = data.filter((userGroup) => {
              const userName = getUserById(userGroup.userID).toLowerCase();
              const groupName = getGroupById(userGroup.groupID).toLowerCase();
              const searchLower = search.toLowerCase();
  
              return userName.includes(searchLower) || groupName.includes(searchLower);
          });
  
          // Set the filtered data
          setFilteredData(filteredUserGroups);
      }, [search, data]);
  
  
  
      const handleEdit = (id) => {
          handleShow();
          axios.get(`https://localhost:7295/api/UserGroup/${id}`, { headers })
              .then((result) => {
                  setEditUserID(result.data.userID);
                  setEditGroupID(result.data.groupID);
                  setEditID(id);
              })
              .catch((error) => {
                  console.log(error);
              });
      };
  
      const handleDelete = (id) => {
          if (window.confirm('Are you sure to delete this UserGroup?')) {
              axios.delete(`https://localhost:7295/api/UserGroup/${id}`, { headers })
                  .then(() => {
                      toast.success('UserGroup has been deleted');
                      getData();
                  })
                  .catch((error) => {
                      toast.error(error);
                  });
          }
      };
  
      const handleUpdate = () => {
          const url = `https://localhost:7295/api/UserGroup/${editID}`;
          const updatedData = {
              userGroupID: editID,
              userID: editUserID,
              groupID: editGroupID,
          };
  
          axios.put(url, updatedData, { headers })
              .then(() => {
                  handleClose();
                  getData();
                  clear();
                  toast.success('UserGroup has been updated');
              })
              .catch((error) => {
                  toast.error(error);
              });
      };
  
      const handleSave = () => {
          const url = 'https://localhost:7295/api/UserGroup';
          const newData = {
              userID,
              groupID,
          };
          console.log("newData", newData)
          axios.post(url, newData, { headers })
              .then(() => {
                  handleCloseAdd();
                  getData();
                  clear();
                  toast.success('UserGroup has been added');
              })
              .catch((error) => {
                  toast.error(error);
              });
      };
  
      const handleClearFilters = () => {
          setSearch('');
      };
  
      const clear = () => {
          setUserID('');
          setGroupID('');
          setEditUserID('');
          setEditGroupID('');
          setEditID('');
      };
  
      return (
          <div className='d-flex flex-column justify-content-center align-items-center bg-light m-3'>
              <h1>List of UserGroups</h1>
              <div className='w-75 rounded bg-white border shadow p-4 align-items-center'>
                  <ToastContainer />
  
                  {/* Filter inputs */}
                  <div className='w-100 rounded bg-white border-bottom border-info p-8 mt-0'>
  
                      {/* Filter input row */}
                      <div className='row mb-2' style={{ paddingTop: '15px', paddingLeft: '15px' }}>
                          {/* Search input column */}
                          <div className='col-md-4 mb-2'>
                              <input
                                  type='text'
                                  className='form-control'
                                  placeholder='Search by UserName or GroupName'
                                  value={search}
                                  onChange={(e) => setSearch(e.target.value)}
                              />
                          </div>
                          {/* Clear filters button column */}
                          <div className='col-md-4 mb-2'>
                              <button className='btn btn-secondary' onClick={handleClearFilters}>
                                  Clear Filters
                              </button>
                          </div>
                          <div className='col-md-4 mb-2' style={{ float: 'right' }}>
                              <button
                                  style={{ padding: '10px' }}
                                  className='btn btn-sm btn-success me-2 px-3'
                                  onClick={() => handleShowAdd()}
                              >
                                  Add a New UserGroup
                              </button>
                          </div>
                      </div>
                  </div>
                  <br />
  
                  <Table striped bordered hover size='sm' className='text-center' responsive='sm'>
                      <thead className='thead-dark'>
                          <tr>
                              <th className='text-center'>#</th>
                              <th className='text-center'>User</th>
                              <th className='text-center'>Group</th>
                              <th className='text-center'>Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredData && filteredData.length > 0 ? (
                              filteredData.map((d, i) => (
                                  <tr key={i}>
                                      <td className='text-center'>{i + 1}</td>
                                      <td className='text-center'>{getUserById(d.userID)}</td>
                                      <td className='text-center'>{getGroupById(d.groupID)}</td>
                                      <td className='text-center'>
                                          <button className='btn btn-sm btn-primary me-2 px-3' onClick={() => handleEdit(d.userGroupID)}>
                                              Edit
                                          </button>
                                          <button className='btn btn-sm btn-danger me-2' onClick={() => handleDelete(d.userGroupID)}>
                                              Delete
                                          </button>
                                      </td>
  
                                  </tr>
                              ))
                          ) : (
                              <tr>
                                  <td colSpan={'4'}>
                                      <h4 style={{ paddingTop: '25px', textAlign: 'center' }}> 'No UserGroups Found, please try again'</h4>
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </Table>
  
                  {/* Modal pop for updating user */}
                  <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                          <Modal.Title>Update details of the UserGroup</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                         <div>
                                  <label >Select User:</label>
                                  <br />
                                  <select
                                      className='form-control mb-3'
                                      value={editUserID}
                                      onChange={(e) => setEditUserID(e.target.value)}
                                  >
                                      <option value='' >Select User</option>
                                      {userData.map((user) => (
                                          <option key={user.userID} value={user.userID}>
                                              {user.username}
                                          </option>
                                      ))}
                                  </select>
                                  </div>
                                  <div>
                                  <label>Select Group:</label>
                                  <select
                                      className='form-control mb-3'
                                      value={editGroupID}
                                      onChange={(e) => setEditGroupID(e.target.value)}
                                  >
                                      <option value=''>Select Group</option>
                                      {groupData.map((group) => (
                                          <option key={group.groupID} value={group.groupID}>
                                              {group.groupName}
                                          </option>
                                      ))}
                                  </select>
                                  </div>
                         
                      </Modal.Body>
                      <Modal.Footer>
                          <Button variant='secondary' onClick={handleClose}>
                              Close
                          </Button>
                          <Button variant='primary' onClick={handleUpdate}>
                              Save Changes
                          </Button>
                      </Modal.Footer>
                  </Modal>
  
                  {/* Modal pop for adding new user */}
                  <Modal show={showAdd} onHide={handleCloseAdd}>
                      <Modal.Header closeButton>
                          <Modal.Title>Add a new UserGroup</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                          
                          <div>
                                  <label>Select User:</label>
                                  <select
                                      className='form-control mb-3'
                                      value={userID}
                                      onChange={(e) => setUserID(e.target.value)}
                                  >
                                      <option value=''>Select User</option>
                                      {userData.map((user) => (
                                          <option key={user.userID} value={user.userID}>
                                              {user.username}
                                          </option>
                                      ))}
                                  </select>
                                  </div>
                                  <div>
                                  <label>Select Group:</label>
                                  <select
                                      className='form-control mb-3'
                                      value={groupID}
                                      onChange={(e) => setGroupID(e.target.value)}
                                  >
                                      <option value=''>Select Group</option>
                                      {groupData.map((group) => (
                                          <option key={group.groupID} value={group.groupID}>
                                              {group.groupName}
                                          </option>
                                      ))}
                                  </select>
                                  </div>
                          
                      </Modal.Body>
                      <Modal.Footer>
                          <Button variant='secondary' onClick={handleCloseAdd}>
                              Close
                          </Button>
                          <Button variant='primary' onClick={handleSave}>
                              Add UserGroup
                          </Button>
                      </Modal.Footer>
                  </Modal>
              </div>
          </div>
      );
  };
  
  export default UserGroups;
  
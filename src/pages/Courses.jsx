import React, { useState, useEffect, useRef } from "react";
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
import './CoursesMain.css';
//  import CoursesMain from './pages/CoursesMain.jsx';

const Courses = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const lngsltd=JSON.parse(localStorage.getItem('languageSelected'));
    const userRole = userDetails.role;
    //const headers = { 'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiU3VqaXROYXRoIiwianRpIjoiZWRlYWJlMDUtYTIzYi00OGEzLTk2YTgtODg4OWI5YjdjN2FkIiwiaWF0IjoiMTkvMDIvMjAyNCA1OjEzOjU3IFBNIiwiVXNlck5hbWUiOiJTY2FuZGFuYXZpYW4iLCJEaXNwbGF5TmFtZSI6IlNrZWlkYXIgTGl2aW5nIEdyb3VwIiwiZXhwIjoxNzA4MzY2NDM3LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3Mjk1LyIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC8ifQ.piYhGXB_aNr7J94Ym16jaD-eRBlIOMRpKfdMn8jhx7E' }; // auth header with bearer token
    const  headers= {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userDetails.token}`
      };
      const navigate = useNavigate();
      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
  
      const [showadd, setShowAdd] = useState(false);
      const handleCloseAdd = () => {
        setShowAdd(false);
        clear();
        clearErrors();
      }
      const handleShowAdd = () => setShowAdd(true);
  
      //For filters option
      const [search, setSearch] = useState('');
      const [filteredData, setFilteredData] = useState('');
  
      //For Adding new Course
      const [courseID, setCourseID] = useState('')
      const [coursename, setCourseName] = useState('')
      const [coursedes, setCourseDes] = useState('')
      const [coursegrpname, setCoursegrpname] = useState('')
  
      //For Updating existing Course
      const [editID, setEditId] = useState('')
      const [editCourseName, setEditCourseName] = useState('')
      const [editCourseDes, setEditCourseDes] = useState('')
      const [editCoursegrpname, setEditCoursegrpname] = useState('')
      const [editGrpName, setEditGrpName] = useState('')
      const [values, setValues] = useState([])
      
      //For binding Group as a dropdown list
      const [groupID, setGroupID] = useState('');

      //For updating group from the dropdown list
      const [editGroupID, setEditGroupID] = useState('');

      const [data, setData] = useState([]);
      const [userGroupData, setUserGroupData] = useState([]);
      const [userGroupName, setUserGroupName] = useState('');
      const [grpName, setGrpName] = useState('');
      const [groupData, setGroupData] = useState([]);
      const [error, setError] = useState(null);

      //Validation Variable
  const [courseNameError, setCourseNameError] = useState('');
  const [grpNameError, setGrpNameError] = useState('');

  const buttonRef = useRef(null);

  const [editGrpNameError, setEditGrpNameError] = useState('');
  const [editCourseNameError, setEditCourseNameError] = useState('');

    //Environment variables
    const apiUrl=process.env.REACT_APP_API_URL;
  
      useEffect(() => {
          fetchGroupData();
          console.log("env value :",apiUrl);
          console.log("process . evn testing",process.env);
      }, []);
  
      useEffect(() => {
          fetchUserGroupData();
      }, [groupData]);
  
      useEffect(() => {
          getData();
      }, [userGroupData]);
  
  
      const fetchGroupData = () => {        
          axios.get(`${apiUrl}/Group`, { headers })
              .then((result) => {                             
                console.log('fecthgroupdata : ', result.data);
                  setGroupData(result.data);
              })
              .catch((error) => {
                  console.log(error);
              });
      };
  
      const fetchUserGroupData =async () => {
        const currentUserId = userDetails.userID;
        if (userRole !== "Admin") {
           await axios.get(`${apiUrl}/UserGroup`, { headers })
                .then((result) => {
                    
                    console.log('fetchusergroupdata : ', result.data)
                    const filteredUserGroup = result.data.filter(userGroup => userGroup.userID === currentUserId);
                   setUserGroupData(filteredUserGroup);
                    console.log('filteredUserGroup data', filteredUserGroup);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };
  
      const getGroupById = (groupId) => {
          const group = groupData.find((group) => group.groupID === groupId);
          console.log("groupdata", groupData);
          return group ? group.groupName : 'Unknown Group';
      };
  
      const getData = () => {
        axios.get(`${apiUrl}/Course`, { headers })
            .then((result) => {
                const userDetails = JSON.parse(localStorage.getItem('userDetails'));
                const userRole = userDetails.role;
                console.log('course list',result.data);
                if (userRole !== 'Admin') {
                    const userGroupId = userGroupData.length > 0 ? userGroupData[0].groupID : null;
                    console.log("UserGroupID is : ", userGroupId);
                    if (userGroupId && groupData) {
                        setUserGroupName(getGroupById(userGroupId));
                        console.log("UserGroupName value is :",userGroupName)
                    }
                    const filteredData = result.data.filter(course => course.groupName === userGroupName);
                    console.log('filtered data', filteredData);
                    setData(filteredData);
                } else {
                    setData(result.data);
                }
                
                //for changing the name of the button after completion of course
            //     if(filteredData){
            //         debugger;
            //     const cid=filteredData[0].courseID;
                
            //     console.log("cid value is : ",cid);
            //     const crsbtn =  axios.get(`https://localhost:7295/api/UserCourseStep/IsCourseCompleted?userId=${userDetails.userID}&courseId=${cid}`,{headers});
      
            //   const isCompleted = crsbtn.data;
            //   console.log("isCompleted", isCompleted);
      
            //   if (isCompleted) {
            //     buttonRef.current.innerText = 'Course Completed';
            //   }
            // }
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

        console.log("filtered data",filteredUsers )
        //set the filtered data
        setFilteredData(filteredUsers);
    }, [search, data]);
  
      const handleEdit = (id) => {
          //alert(id);
          handleShow();
          axios.get(`${apiUrl}/Course/${id}`, { headers })
              .then((result) => {
                  setEditCourseName(result.data.courseName);
                  setEditCourseDes(result.data.description);
                  setEditGrpName(result.data.groupName);
                  setEditId(id);
              })
              .catch((error) => {
                  console.log(error);
              })
  
      }
  
      const handleDelete = (id) => {
          if (window.confirm("Are you sure to delete this Course") == true) {
              axios.delete(`${apiUrl}/Course/${id}`, { headers })
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
  
      const handleStart = async (id) => {
          try {
              const response = await axios.get(`${apiUrl}/UserCourseStep/IsCourseCompleted?userId=${userDetails.userID}&courseId=${id}`,{headers});
      
              const isCompleted = response.data;
              console.log("isCompleted", isCompleted);
      
              if (!isCompleted) {
                  navigate(`/startcoursepage/${id}`);
              } else {
                  const confirmResponse = window.alert("You have already completed the course.");
                 

                  if (confirmResponse) {
                      
                  }
              }
          } catch (error) {
              console.error('Error checking course completion status:', error);
          }
      };
      
  
      const handleAttend = async(courseid) => {
          try {
              const response = await axios.get(`${apiUrl}/UserCourseStep/IsCourseCompleted?userId=${userDetails.userID}&courseId=${courseid}`,{headers});
      
              const isCompleted = response.data;
              console.log("isCompleted", isCompleted);
      
              if (isCompleted) {
                  navigate(`/startquiz/${courseid}`);
                  
              } else {
                  const confirmResponse = window.confirm("You have to complete the Course before attending the Quiz");
                  if (confirmResponse) {
  
                      navigate(`/startcoursepage/${courseid}`);
                  } else {
                  }
              }
          } catch (error) {
              console.error('Error checking course completion status:', error);
          }
      }
  
      const handleUpdate = () => {
        let formIsValid = true;
        
        if (!editCourseName) {
            setEditCourseNameError('Name is required');
            formIsValid = false;
        } else {
            setEditCourseNameError('');
        }

        if (!editGrpName) {
            setEditGrpNameError('');
            formIsValid = false;
        } else {
            setEditGrpNameError('');
        }
        if (formIsValid) {
          const url = `${apiUrl}/Course/${editID}`;
          const data = {
              "courseID": editID,
              "courseName": editCourseName,
              "description": editCourseDes,
              "groupName": editGrpName
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
      }
      const handleSave = () => {
        let formIsValid = true;

        if (!coursename) {
            setCourseNameError('CourseName is required');
            formIsValid = false;
        } else {
            setCourseNameError('');
        }
        if (!grpName) {
            setGrpNameError('GroupName is required');
            formIsValid = false;
        } else {
            setGrpNameError('');
        }

        
        if (formIsValid) {
            // Proceed with saving the user

          const url = `${apiUrl}/Course`;
          const data = {
              "courseID":0,
              "courseName": coursename,
              "description": coursedes,
              "groupName": grpName
          }
  
          console.log("handlesave",data)
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
      }
      const handleClearFilters = () => {
          setSearch('');
  
      }

      const validateCourseName = (value) => {
        // Required validation
        if (!value.trim()) {
           return 'Coursename is required';
        }
         return '';
       };
   
     const handleCourseNameChange=(e)=>{
       const value = e.target.value;
           const errorMessage = validateCourseName(value);   
           setCourseNameError(errorMessage);
           setCourseName(value);
     };

     const clearErrors = () => {
        setCourseNameError('');
        setGrpNameError('');
        setEditGrpNameError('');
        setEditCourseNameError('');
        
    };

  
      const clear = () => {
          setCourseName('');
          setCourseDes('');
          setGrpName('');
          setEditCourseName('');
          setEditCourseDes('');
          setEditGrpName('');
          setEditId('');
  
      }
  
  
      return (
          <div className='maincntn d-flex flex-column justify-content-center align-items-center bg-light m-3'>
              <h1>{lngsltd["List of Courses"]}</h1>
              <div className='w-75 rounded bg-white border shadow p-4 align-items-center'>
                  <ToastContainer />
  
                  <br></br>
  
                  {/* Filter inputs */}
                  <div className="w-100 rounded bg-white border-bottom border-info  p-8 mt-0" >
  
                      {/* Filter input row */}
                      <div className="row mb-2 " style={{ paddingTop: "15px", paddingLeft: "15px" }} >
                          {/* Search input column */}
                          <div className="col-md-4 mb-2">
                              <input type="text" className="form-control" placeholder={lngsltd["Search by CourseName"]} value={search} onChange={(e) => setSearch(e.target.value)} />
                          </div>
                          {/* Clear filters button column */}
                          <div className="col-md-4 mb-2">
                              <button className="btn btn-secondary" onClick={handleClearFilters}>{lngsltd["Clear Filters"]}</button>
                          </div>
                          <div className="col-md-4 mb-2" style={{ float: "right" }}>
                              {userRole === 'Admin' && (
                                  <button style={{ padding: "10px" }} className='btn btn-sm btn-success me-2 px-3' onClick={() => handleShowAdd()}>{lngsltd["Add a New Course"]}</button>
                              )}
                          </div>
                      </div>
                  </div>
                  <br></br>
  
                  <Table striped bordered hover size="sm" className="text-center" responsive="sm" >
                      <thead className="thead-dark">
                          <tr>
                              <th className="text-center">#</th>
                              <th className="text-center">{lngsltd["Course Name"]}</th>
                              <th className="text-center">{lngsltd["Course Description"]}</th>
                              <th className="text-center">
                                  {userRole === 'Admin' && (
                                      <>{lngsltd["Course Group"]} </>
                                  )}
                              </th>
                              <th className="text-center">{lngsltd["Actions"]}</th>
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
                                                      <button className='btn btn-sm btn-primary me-2 px-3' onClick={() => handleEdit(d.courseID)}>{lngsltd["Edit"]} </button>
                                                      <button className='btn btn-sm btn-danger me-2' onClick={() => handleDelete(d.courseID)}>{lngsltd["Delete"]} </button>
                                                      <button className='btn btn-sm btn-info me-2 px-2' onClick={() => handleDetails(d.courseID)}>{lngsltd["Details"]} </button>
                                                  </>
                                              )}
                                              {userRole !== 'Admin' && (
                                                  <>
                                                  
                                                      <button className='btn btn-sm btn-primary me-2 px-3' ref={buttonRef} onClick={() => handleStart(d.courseID)}>{lngsltd["StartCourse"]} </button>
                                                      <button className='btn btn-sm btn-info me-2 px-3' onClick={() => handleAttend(d.courseID)}>{lngsltd["Quiz"]} </button>
                                                  </>
                                              )}
                                          </td>
  
  
                                      </tr>
                                  )
  
                                  )
                                  :
                                  <tr><td colSpan={"5"}><h4 style={{ paddingTop: "25px", textAlign: "center" }}> {lngsltd["No Courses Found, please try again"]}</h4></td></tr>
                          }
                      </tbody>
                  </Table>
                  {/* Modal pop for updating user */}
                  <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                          <Modal.Title>{lngsltd["Update details of the Course"]}</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                         <div>
                                  <input type="text" className="form-control mb-3" placeholder={lngsltd["Enter Course Name"]}
                                      value={editCourseName} onChange={(e) => setEditCourseName(e.target.value)} />
                              </div>
                              <div className="text-danger">{editCourseNameError}</div>
                              <div>
                                  <input type="text" className="form-control mb-3" placeholder={lngsltd["Enter Course Description"]}
                                      value={editCourseDes} onChange={(e) => setEditCourseDes(e.target.value)} />
                              </div>
  
                              <div>
                                  
                              <select
                                className='form-control mb-3'
                                value={editGrpName}
                                onChange={(e) => setEditGrpName(e.target.value)}
                            >
                                <option value=''>{lngsltd["Select Group"]}</option>
                                {groupData.map((group) => (
                                    <option key={group.groupID} value={group.groupName}>
                                        {group.groupName}
                                    </option>
                                ))}
                            </select>
                                  <div className="text-danger">{editGrpNameError}</div>
                                  </div>
                          
                      </Modal.Body>
                      <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                          {lngsltd["Close"]} 
                          </Button>
                          <Button variant="primary" onClick={handleUpdate}>
                          {lngsltd["Save Changes"]} 
                          </Button>
                      </Modal.Footer>
                  </Modal>
  
                  {/* Modal pop for adding new user */}
                  <Modal show={showadd} onHide={handleCloseAdd} >
                      <Modal.Header closeButton>
                          <Modal.Title>{lngsltd["Add a new Course"]} </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                              <div>
                                  <input type="text" className="form-control mb-3" placeholder={lngsltd["Enter Course Name"]}
                                      value={coursename} onChange={handleCourseNameChange} />
                                      {courseNameError && <p className="text-danger">{courseNameError}</p>}
                              </div>
                              <div>
                                  <input type="text" className="form-control mb-3" placeholder={lngsltd["Enter Description"]}
                                      value={coursedes} onChange={(e) => setCourseDes(e.target.value)} />
                              </div>
                              <div>
                                  
                              <select
                                className='form-control mb-3'
                                value={grpName}
                                onChange={(e) => setGrpName(e.target.value)}
                            >
                                <option value=''>{lngsltd["Select Group"]}</option>
                                {groupData.map((group) => (
                                    <option key={group.groupID} value={group.groupName}>
                                        {group.groupName}
                                    </option>
                                ))}
                            </select>
                                  {grpNameError && <p className="text-danger">{grpNameError}</p>}
                                  </div>
  
                      </Modal.Body>
                      <Modal.Footer>
                          <Button variant="secondary" onClick={handleCloseAdd}>
                          {lngsltd["Close"]}
                          </Button>
                          <Button variant="primary" onClick={handleSave}>
                          {lngsltd["Add Course"]}
                          </Button>
                      </Modal.Footer>
                  </Modal>
              </div>
  
          </div>
      )
  
  }
  
  export default Courses
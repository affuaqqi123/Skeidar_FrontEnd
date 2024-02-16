// import React from 'react'
// import './CoursesMain.css'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/css/bootstrap.css';
// import Button from 'react-bootstrap/Button';
// import { useState, useEffect, useRef } from "react";
// import { useParams } from 'react-router-dom';
// import JoditEditor, { Jodit } from 'jodit-react';
// import axios from "axios";
// import ReactPlayer from 'react-player';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Modal from 'react-bootstrap/Modal';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

// const CoursesMain = () => {
//   const { id } = useParams();
//   const [courseStepDetails, setCourseStepDetails] = useState([]);
//   const [rightContainerContent, setRightContainerContent] = useState("");
//   const [ContentType, setContentType] = useState("");
//   const [descriptionContent, setDescriptionContent] = useState("");
//   const [selectedStep, setSelectedStep] = useState(null);
//   const [activeDiv, setActiveDiv] = useState(1);

//   const editorContent = useRef();
//   const editorDescription = useRef();

//   const [mediaFiles, setMediaFiles] = useState([]);
//   const [videoFile, setVideoFile] = useState([]);


//   const [videoUrls, setVideoUrls] = useState([]);

//   const [imageUrl, setImageUrl] = useState([]);
//   const [videoUrl, setVideoUrl] = useState([]);
//   const [mediaInputRef, setMediaInputReference] = useState(React.createRef());


//   const [imageFiles, setImageFiles] = useState([]);
//   const [imageUrls, setImageUrls] = useState([]);


//   const [showadd, setShowAdd] = useState(false);
//   const handleCloseAdd = () => setShowAdd(false);
//   const handleShowAdd = () => setShowAdd(true);

//   const [showedit, setShowEdit] = useState(false);
//   const handleCloseEdit = () => setShowEdit(false);
//   const handleShowEdit = () => setShowEdit(true);

//   //For Updating existing User

//   const [editID, setEditID] = useState('')
//   const [editCourseID, setEditCourseID] = useState('')
//   const [editStepNo, setEditStepNo] = useState('')
//   const [editStepTitle, setEditStepTitle] = useState('')
//   const [editStepContent, setEditStepContent] = useState('')
//   const [editContentType, setEditContentType] = useState('')
//   const [editDescription, setEditDescription] = useState('')


//   const [newStepData, setNewStepData] = useState({
//     courseNumber: id,
//     stepNumber: "",
//     stepTitle: ""

//   });

//   const fetchCourseSteps = async () => {
//     try {
//       const response = await axios.get(`https://localhost:7295/api/CourseStep/Course/${id}`);
//       //Steps in ascending order
//       const sortedData = response.data.slice().sort((a, b) => a.stepNo - b.stepNo);
//       setCourseStepDetails(sortedData);
//     }
//     catch (error) {
//       console.error('Error fetching course steps: ', error)
//     }
//   };

//   useEffect(() => {
//     fetchCourseSteps();
//   }, [id]);


//   const handleStepClick = async (step) => {
//     try {
//       setDescriptionContent(step.description);
//       setContentType(step.contentType);
//       setSelectedStep(step);
//       setActiveDiv('');
//       setVideoUrls('');
//       if (step.contentType === 'Image') {
//         setActiveDiv('Image');

//         const fileNames = step.stepContent.split(',');

//         const responses = await Promise.all(
//           fileNames.map(async (fileName) => {
//             return await axios.get(`https://localhost:7295/api/CourseStep/filecontent?CourseID=${step.courseID}&StepNo=${step.stepNo}&ContentType=${step.contentType}&FileName=${fileName}`, { responseType: 'arraybuffer' });
//           })
//         );

//         const imageBlobUrls = Array.isArray(responses)
//           ? responses.map((response) => {
//             const blob = new Blob([response.data], { type: 'image/jpeg' });
//             return URL.createObjectURL(blob);
//           })
//           : [];

//         setImageUrls(imageBlobUrls);
//       } else if (step.contentType === 'Video') {
//         setActiveDiv('Video');

//         const fileNames = step.stepContent.split(',');
//         const responses = await Promise.all(
//           fileNames.map(async (fileName) => {
//             return await axios.get(`https://localhost:7295/api/CourseStep/filecontent?CourseID=${step.courseID}&StepNo=${step.stepNo}&ContentType=${step.contentType}&FileName=${fileName}`, { responseType: 'arraybuffer' });
//           })
//         );

//         const videoBlobUrls = Array.isArray(responses)
//         ? responses.map((response) => {
//           const blob = new Blob([response.data], { type: 'video/mp4' });
//           return URL.createObjectURL(blob);
//         })
//         : [];

//       setVideoUrls(videoBlobUrls);
//     }
//   } catch (error) {
//     console.error('Error fetching file content: ', error);
//     toast.error('Error fetching file content');
//   }
// };


//   if (!courseStepDetails) {
//     return <div>No Data</div>;
//   }

//   const removemedia = async (index) => {
//     // if (window.confirm("Are you sure to delete this Media File?") === true)
//     // {
//     // setImageUrls([]);
//     setVideoUrls([]);
//     // setMediaFiles([]);
//     setVideoFile(null);

//     if (imageUrls && imageUrls.length > index) {
//       const removedFileName = getFileNameFromUrl(imageUrls[index]);
//       if (selectedStep) {
//         //const apiEndpoint = https://localhost:7295/api/CourseStep/removefile?CourseID=${selectedStep.courseID}&StepID=${selectedStep.stepNo};
//         const apiEndpoint = `https://localhost:7295/api/CourseStep/removefile?CourseID=${selectedStep.courseID}&StepID=${selectedStep.stepNo}&ContentType=${selectedStep.contentType}&FileName=${removedFileName}`;

//         try {
//           await axios.delete(apiEndpoint);
//           setImageUrls((prevImageUrls) => {
//             const updatedImageUrls = [...prevImageUrls];
//             updatedImageUrls.splice(index, 1);
//             return updatedImageUrls;
//           });
//           fetchCourseSteps();
//         } catch (error) {
//           console.error('Error deleting file and data:', error);
//         }
//       }
//     }
//     //}
//   };

//   const getFileNameFromUrl = (imageUrl) => {
//     const urlParts = imageUrl.split('/');
//     return urlParts[urlParts.length - 1];
//   };


//   const saveContentAndDescription = () => {
//     if (selectedStep) {
//       const apiEndpoint = `https://localhost:7295/api/CourseStep/fileupload?CourseID=${selectedStep.courseID}&StepNo=${selectedStep.stepNo}&StepTitle=${selectedStep.stepTitle}&ContentType=${ContentType}&Description=${descriptionContent}`;

//       const formData = new FormData();

//       if (ContentType === "Image" && imageFiles) {

//         for (const file of imageFiles) {
//           formData.append("StepContents", file);
//         }
//       } else if (ContentType === "Video" && videoFile) {
//         formData.append("StepContents", videoFile);
//       }



//       axios.post(apiEndpoint, formData)
//         .then(response => {
//           console.log('Saved Successfully:', response.data);
//           console.log(apiEndpoint, videoFile, formData);
//           toast.success('Saved Successfully');
//           fetchCourseSteps();
//         })
//         .catch(error => {
//           console.error('Save failed', error);
//           toast.error('Save failed');
//         });
//     } else {
//       return alert('Sorry, you did not select the step, please refresh the page and then select a step and proceed');
//     }
//   };


//   const handleMediaUpload = (e) => {
//     const files = mediaInputRef.current.files;
//     const urls = Array.from(files).map(file => URL.createObjectURL(file));
//     setImageUrls(urls);
//     setImageFiles(files);
//   };

//   const handleVideoUpload = (e) => {
//     const file = e.target.files[0];
//     const Url = URL.createObjectURL(file);
//     setVideoUrls([Url]);
//     setVideoFile(file);
//   };

//   const handleImageButtonClick = () => {
//     setActiveDiv('Image');
//     setContentType("Image");
//     setImageUrls(0);
//     setImageUrl(null);
//   };

//   const handleVideoButtonClick = (e) => {
//     setActiveDiv('Video');
//     setContentType("Video");
//     setVideoUrls(0);
//     setVideoUrl(null);
//   };



//   const renderRightTopContent = () => {
//     switch (activeDiv) {
//       case 'Image':
//         return (
//           <div style={{height:'100%'}}>
//             {/* <h3>Image Upload</h3> */}
//             <input type='file' accept='image/*' className='btn btn-info btn-sm mb-3' multiple ref={mediaInputRef} onChange={handleMediaUpload} style={{ float: 'right', marginTop: '-40px', width:'30%' }}/>
//             {imageUrls.length > 0 && (
//               <div>
//                 <h4>Selected Image:</h4>
//                 {imageUrls.map((imageUrl, index) => (
//                   <div key={index} className='media-item'>
//                     <div>
//                       <img src={imageUrl} className='uploaded-image m-3' style={{ width: '90%', height: 'auto' }} />
//                     </div>
//                     <div>
//                       <button className='remove-media-button btn btn-secondary btn-sm m-3' onClick={removemedia}>
//                         Remove
//                       </button>
//                     </div>
//                     <hr></hr>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         );


//       case 'Video':
//         return (
//           <div>
//             {/* <h3>Video Upload</h3> */}
//             <input type='file' className='btn btn-info btn-sm mb-3' accept='video/*' onChange={handleVideoUpload} style={{ float: 'right', marginTop: '-40px', width:'30%' }}/>
//             {videoUrls.length > 0 && (
//               <div>
//                 <h3>Selected Video: </h3>
//                 <div className='media-item'>
//                   <div>
//                     <video controls autoPlay width='100%' height='350'>
//                       <source src={videoUrls[0]} type='video/mp4' />
//                       Your browser does not support the video tag.
//                     </video>
//                   </div>
//                   <div className='d-flex justify-content-center'>
//                     <button className='remove-media-button btn btn-info' onClick={removemedia}>
//                       Remove Video
//                     </button>
//                   </div>
//                   <hr></hr>
//                 </div>
//               </div>
//             )}
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   //Deletion of step
//   const handleDelete = async (step) => {
//     if (window.confirm("Are you sure to delete this Course Step") === true) {
//       await axios.delete(`https://localhost:7295/api/CourseStep/deletestepno?CourseID=${step.courseID}&StepNo=${step.stepNo}`)
//         .then((result) => {
//           toast.success('Course Step has been deleted');
//           setActiveDiv('');
//           setImageUrl('');
//           setVideoUrl('');
//           fetchCourseSteps();
//         })
//         .catch((error) => {
//           toast.error(error);
//         })
//     }
//   }

//   //Edit step
//   const handleEdit = async (id) => {

//     handleShowEdit();
//     axios.get(`https://localhost:7295/api/CourseStep/${id}`)
//       .then((result) => {
//         setEditCourseID(result.data.courseID);
//         setEditStepNo(result.data.stepNo);
//         setEditStepTitle(result.data.stepTitle);
//         setEditStepContent(result.data.stepContent);
//         setEditContentType(result.data.contentType);
//         setEditDescription(result.data.description);
//         setEditID(id);
//         console.log(result);
//         console.log(editCourseID)
//       })
//       .catch((error) => {
//         console.log(error)
//       })

//   }

//   const handleUpdate = (step) => {

//     const url = `https://localhost:7295/api/CourseStep/${editID}`;
//     const data = {
//       "id": editID,
//       "courseID": editCourseID,
//       "stepNo": editStepNo,
//       "stepTitle": editStepTitle,
//       "stepContent": editStepContent,
//       "contentType": editContentType,
//       "description": editDescription
//     }
//     console.log({ editCourseID }, { editStepNo }, { editStepTitle }, { editStepContent }, { editContentType }, { editDescription }, { editID })
//     axios.put(url, data)
//       .then((result) => {
//         handleCloseEdit();
//         fetchCourseSteps();
//         toast.success('Step Title has been updated');
//       }).catch((error) => {
//         toast.error(error);
//       })
//   }

//   //Add New Step
//   const handleSave = () => {
//     if (!newStepData.courseNumber || !newStepData.stepNumber || !newStepData.stepTitle) {
//       toast.error('Please fill in all the required fields.');
//       return;
//     }
//     const newStep = {
//       courseID: parseInt(newStepData.courseNumber),
//       stepNo: parseInt(newStepData.stepNumber),
//       stepTitle: newStepData.stepTitle,
//       stepContent: "<p>Add content here</p>",
//       contentType: "Text",
//       description: "<p>Add Description here</p>"
//     };
//     axios.post(`https://localhost:7295/api/CourseStep`, newStep)
//       .then(response => {

//         toast.success('New step added successfully.');

//         handleCloseAdd();

//         fetchCourseSteps();
//          //Make input fields of a Modal popup empty
//          newStepData.stepNumber="";
//          newStepData.stepTitle="";
//       })
//       .catch(error => {
//         toast.error('Error while adding new step, please try again.');
//         console.error('Error adding new step:', error);
//       });
//   };
//   return (
//     <div className="container">
//       <div className="left-container">
//         <div className="left-content">

//           <div className="content-heading">
//             <h2>Course Steps</h2>
//           </div>

//           <div>
//             {courseStepDetails.map((step, index) => (
//               <div key={index} className="clickable-title" onClick={() => handleStepClick(step)}>
//                 <div className='editable-div'>
//                   <span className="step-title">{step.stepTitle}</span>
//                 </div>
//                 <div className='float-right'>
//                   <span className='mx-3'> <FontAwesomeIcon className='editicon' icon={faPenToSquare} onClick={() => handleEdit(step.id)} /></span>
//                   <span > <FontAwesomeIcon className='trashicon' icon={faTrash} onClick={() => handleDelete(step)} /></span>
//                 </div>
//               </div>
//             ))}

//             <div className="add-step-button-container d-flex justify-content-center my-3">
//               <button className='add-step-button btn btn-outline-secondary px-3 rounded-pill' onClick={() => handleShowAdd()}>
//                 Add Step
//               </button>
//             </div>

//           </div>
//         </div>
//       </div>

//       <div className="right-container">
//         <ToastContainer />
//         <div className='right-content-top h-100 d-inline-block'>

//           <div className="section-title">
//             {/* <button className='btn btn-sm btn-success me-2 px-2 py-2 fw-bold fs-8' onClick={()=> setActiveDiv(1)}>Text</button> */}
//             <button className='btn btn-sm btn-success me-2 px-2 py-2 fw-bold fs-8' onClick={handleImageButtonClick}>Image</button>
//             <button className='btn btn-sm btn-success me-2 px-2 py-2 fw-bold fs-8' onClick={handleVideoButtonClick}>Video</button>
//           </div>
//           {renderRightTopContent()}
//         </div>
//         <div className='right-content-bottom'>
//           <div className="section-title">Description</div>
//           <div>
//             <JoditEditor
//               ref={editorDescription}
//               value={descriptionContent}
//               onChange={newContent => setDescriptionContent(newContent)}
//             />
//           </div>
//           <div className='text-center'>
//             <button className='btn btn-sm btn-success me-2 px-3 py-2 fw-bold fs-6 mt-3' onClick={saveContentAndDescription}>Save</button>
//           </div>
//         </div>
//       </div>
//       {/* Modal pop-up for adding new User */}
//       <Modal show={showadd} onHide={handleCloseAdd}>
//         <Modal.Header className='bg-light justify-content-center' closeButton>
//           <Modal.Title>Add a new step</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Row>
//             <Col>
//               <input type='text' className='form-control' placeholder='Enter Course Number' value={newStepData.courseNumber} disabled />
//             </Col>
//             <Col>
//               <input type='text' className='form-control' placeholder='Enter Step Number' value={newStepData.stepNumber} onChange={(e) => setNewStepData(prevData => ({ ...prevData, stepNumber: e.target.value }))} />
//             </Col>
//           </Row>
//           <Row>
//             <Col>
//               <input type='text' className='form-control my-3' placeholder='Enter Step Title' value={newStepData.stepTitle} onChange={(e) => setNewStepData(prevData => ({ ...prevData, stepTitle: e.target.value }))} />
//             </Col>
//           </Row>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant='secondary' onClick={handleCloseAdd}>
//             Close
//           </Button>
//           <Button variant='primary' onClick={handleSave}>
//             Add Step
//           </Button>
//         </Modal.Footer>

//       </Modal>
//       <Modal show={showedit} onHide={handleCloseEdit}>
//         <Modal.Header>
//           <Modal.Title>Edit the Step Title</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Row>
//             <Col>
//               <input type="text" className="form-control" placeholder="Step Title" value={editStepTitle} onChange={(e) => setEditStepTitle(e.target.value)} />
//             </Col>
//           </Row>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseEdit}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleUpdate}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>

//     </div>
//   );
// };

// export default CoursesMain;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import './StartCoursePage.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {faRightLong, faLeftLong, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';


// const StartCoursePage = () => {
//     const navigate = useNavigate();
//     const { id } = useParams();

//     const [currentStep, setCurrentStep] = useState(1);
//     const [courseData, setCourseData] = useState([]);

//     const fetchCourseData = async () => {
//         try {
//             const response = await axios.get(`https://localhost:7295/api/CourseStep/Course/${id}`);
//             setCourseData(response.data);
//         } catch (error) {
//             console.error('Error fetching course data:', error);
//         }
//     };

//     useEffect(() => {
//         fetchCourseData();
//     }, [id]);

//     const handleNext = () => setCurrentStep((prevStep) => Math.min(prevStep + 1, courseData.length));
//     const handlePrevious = () => setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));

//     return (
//         <div>
            
//             {courseData && (
//                 <div>

//                     {/* Stepper */}
                   
//                     <div className="stepper mb-5 border border-secondary p-3 rounded">
                        
//                         {courseData.map((courseStep, index) => (
                           
//                            <div
//                                 key={index}
//                                 className={`step ${courseStep.stepNo === currentStep ? 'active' : ''}`}
//                                 onClick={() => setCurrentStep(courseStep.stepNo)}
//                             >
//                                 {courseStep.stepNo}
                                
//                             </div>
                            
                            
                            
//                         ))}
//                         <div className="progressline"></div>
                       
//                     </div>
                    
                    


//                     {/* Content Section */}
//                     <div className="content-section">
//                         {courseData[currentStep - 1] && (
//                             <>
//                                 {courseData[currentStep - 1].contentType === 'Image' && (
//                                     <>
//                                         {courseData[currentStep - 1].stepContent.split(',').map((fileName, index) => (
//                                             <div className='d-flex justify-content-center pb-5'>
//                                                 <img
//                                                     key={index}
//                                                     src={`https://localhost:7295/api/CourseStep/filecontent?CourseID=${courseData[currentStep - 1].courseID}&StepNo=${courseData[currentStep - 1].stepNo}&ContentType=${courseData[currentStep - 1].contentType}&FileName=${fileName}`}
//                                                     alt={`Step ${courseData[currentStep - 1].stepNo} Image ${index + 1}`}
//                                                 />
//                                                 <hr></hr>
//                                             </div>


//                                         ))}
//                                     </>
//                                 )}

//                                 {courseData[currentStep - 1].contentType === 'Video' && (
//                                     <div className='d-flex justify-content-center'>
//                                         <video controls autoPlay width="80%">
//                                             <source
//                                                 src={`https://localhost:7295/api/CourseStep/filecontent?CourseID=${courseData[currentStep - 1].courseID}&StepNo=${courseData[currentStep - 1].stepNo}&ContentType=${courseData[currentStep - 1].contentType}&FileName=${courseData[currentStep - 1].stepContent}`}
//                                                 type="video/mp4"
//                                             />
//                                             Your browser does not support the video tag.
//                                         </video>
//                                     </div>
//                                 )}
//                             </>
//                         )}
//                     </div>

//                     <hr></hr>

//                     {/* Description Section */}

//                     <div className="description-section m-5 border border-secondary p-3 " dangerouslySetInnerHTML={{ __html: courseData[currentStep - 1]?.description }}></div>


//                     {/* Navigation Buttons */}
//                     <div className="navigation-buttons">
//                     <button className="btn btn-danger" onClick={() => navigate(`/courses`)}>
//                         <FontAwesomeIcon className='iconstyle' icon={faRightFromBracket} />Exit
//                         </button>
//                         <div style={{float:"right"}}>
//                         <button className="btn btn-info" onClick={handlePrevious} disabled={currentStep === 1}>
//                         <FontAwesomeIcon className='iconstyle' icon={faLeftLong} /> Previous
//                         </button>
//                         <button className="btn btn-info" onClick={handleNext} disabled={currentStep === courseData.length}>
//                         <FontAwesomeIcon className='iconstyle' icon={faRightLong} /> Next
//                         </button>
//                        </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default StartCoursePage;
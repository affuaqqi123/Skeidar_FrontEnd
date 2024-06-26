import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './StartCoursePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightLong,
  faLeftLong,
  faRightFromBracket,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const StartCoursePage = () => {

  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const lngsltd = JSON.parse(localStorage.getItem('languageSelected'));
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userDetails.token}`
  }
  const navigate = useNavigate();
  const { id } = useParams();
  const userID = userDetails.userID;

  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState([]);
  const [userCourseSteps, setUserCourseSteps] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [videoWatched, setVideoWatched] = useState(false);

  //Environment variables
  const apiUrl = process.env.REACT_APP_API_URL;


  const fetchCourseData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/CourseStep/Course/${id}`, { headers });
      if (response) {
        const sortedData = response.data.slice().sort((a, b) => a.stepNo - b.stepNo);
        let userCourseStepsResponse = await axios.get(`${apiUrl}/UserCourseStep/ByCourseAndUser/${id}/${userID}`, { headers });
        let userSteps = userCourseStepsResponse.data;
        if (userSteps.length === 0) {
          userSteps = sortedData.map((step) => ({
            courseStepID: 0,
            userID: userID,
            courseID: step.courseID,
            stepNumber: step.stepNo,
            status: "InComplete",
          }));
          createuserCourseStep(userSteps);
        }

        const firstIncompleteStep = userSteps.find(step => step.status !== 'Completed');

        if (firstIncompleteStep) {
          setCurrentStep(firstIncompleteStep.stepNumber);
          setCourseData(sortedData);
          // videoRef.current.currentTime = firstIncompleteStep.status;
        } else {
          setCurrentStep(0);
        }

        if (response.data.length > 0 && response.data[0].contentType === 'Video' && response.data[0].stepNo === firstIncompleteStep.stepNumber) {
          const res = await axios.get(
            `${apiUrl}/CourseStep/filecontent?CourseID=${response.data[0].courseID}&StepNo=${response.data[0].stepNo}&ContentType=${response.data[0].contentType}&FileName=${response.data[0].stepContent}`,
            { responseType: 'arraybuffer', headers }
          );
          const blob = new Blob([res.data], { type: 'video/mp4' });
          const bloburl = URL.createObjectURL(blob);
          setVideoUrl(bloburl);
        }
        else {
          const fileNames = response.data[0].stepContent.split(',');
          const responses = await Promise.all(
            fileNames.map(async (fileName) => {
              return await axios.get(
                `${apiUrl}/CourseStep/filecontent?CourseID=${response.data[0].courseID}&StepNo=${response.data[0].stepNo}&ContentType=${response.data[0].contentType}&FileName=${fileName}`,
                { responseType: 'arraybuffer', headers }
              );
            })
          );

          const imageBlobUrls = Array.isArray(responses)
            ? responses.map((response) => {
              const blob = new Blob([response.data], { type: 'image/jpeg' });
              return URL.createObjectURL(blob);
            })
            : [];

          setImageUrls(imageBlobUrls);
        }
      }


    } catch (error) {
      console.error('Error fetching course data:', error);
    }

  };

  const createuserCourseStep = async (userSteps) => {
    try {
      for (const Step of userSteps) {
        await axios.post(`${apiUrl}/UserCourseStep`, Step, { headers });
      }
      let userCourseStepsResponse = await axios.get(`${apiUrl}/UserCourseStep/ByCourseAndUser/${id}/${userID}`, { headers });
    } catch (error) {
      console.error('Error creating user course steps:', error);
    }
  }

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  useEffect(() => {
    if (courseData.length > 0) {
      updateVideoUrl();
      updateImageUrl();
    }
  }, [currentStep]);

  const updateVideoUrl = async () => {

    if (courseData[currentStep - 1]?.contentType === 'Video') {
      try {
        setVideoUrl('');
        const response = await axios.get(
          `${apiUrl}/CourseStep/filecontent?CourseID=${courseData[currentStep - 1].courseID}&StepNo=${courseData[currentStep - 1].stepNo}&ContentType=${courseData[currentStep - 1].contentType}&FileName=${courseData[currentStep - 1].stepContent}`,
          { responseType: 'arraybuffer', headers }
        );

        const blob = new Blob([response.data], { type: 'video/mp4' });
        const bloburl = URL.createObjectURL(blob);
        setVideoUrl(bloburl);


      } catch (error) {

        console.error('Error fetching video data:', error);
        setVideoUrl('');
      }
    } else {
      setVideoUrl('');
    }
  };
  const updateImageUrl = async () => {


    if (courseData[currentStep - 1]?.contentType === 'Image') {
      try {

        setImageUrls('');
        const fileNames = courseData[currentStep - 1].stepContent.split(',');
        const responses = await Promise.all(
          fileNames.map(async (fileName) => {
            return await axios.get(`${apiUrl}/CourseStep/filecontent?CourseID=${courseData[currentStep - 1].courseID}&StepNo=${courseData[currentStep - 1].stepNo}&ContentType=${courseData[currentStep - 1].contentType}&FileName=${fileName}`
              , { responseType: 'arraybuffer', headers });
          })
        );

        const imageBlobUrls = Array.isArray(responses)
          ? responses.map((response) => {
            const blob = new Blob([response.data], { type: 'image/jpeg' });
            return URL.createObjectURL(blob);
          })
          : [];

        setImageUrls(imageBlobUrls);


      } catch (error) {

        console.error('Error fetching Image data:', error);
        setImageUrls('');
      }
    } else {
      setImageUrls('');
    }
  };

  const handleExit = async () => {
    if (courseData[currentStep - 1]?.contentType === 'Video' && !videoWatched) {
      try {
        let status = 'InComplete';
        const courseId = courseData[currentStep - 1].courseID;
        const stepNo = courseData[currentStep - 1].stepNo;
        await axios.put(
          `${apiUrl}/UserCourseStep/UpdateStatus?courseId=${courseId}&userId=${userID}&stepNumber=${stepNo}&status=${status}`, { headers }
        );
        navigate('/courses');
      } catch (error) {
        console.error('Error updating status and video time:', error);
      }
    }
    navigate('/courses');
  };

  const handleNext = async () => {
    if (courseData[currentStep - 1]?.contentType === 'Video' && !videoWatched) {
      toast.info(lngsltd["Please complete the video before proceeding to the next step"]);
    } else {
      try {
        let status = "Completed";
        const courseId = courseData[currentStep - 1].courseID;
        const stepNo = courseData[currentStep - 1].stepNo;

        const response = await fetch(`${apiUrl}/UserCourseStep/UpdateStatus?courseId=${courseId}&userId=${userID}&stepNumber=${stepNo}&status=${status}`, {
          method: 'PUT',
          headers: {

            // 'Content-Type': 'application/json',
            'Authorization': `Bearer ${userDetails.token}`,
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
            'Access-Control-Max-Age': '3600',
            'Access-Control-Allow-Headers': 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With'

          },

          //  mode:'no-cors'
        });

        if (!response.ok) {
          throw new Error(lngsltd['Network response was not ok']);
        }

        setCurrentStep((prevStep) => Math.min(prevStep + 1, courseData.length));
        setVideoWatched(false);
        window.scrollTo({
          top: 60,
          left: 60,
          behavior: "smooth"
        });
      } catch (error) {
        console.error('Error updating status and video time:', error);
      }
    }
  };


  const handlePrevious = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
    window.scrollTo({
      top: 60,
      left: 60,
      behavior: "smooth"
    });
  };

  const handleSubmission = async () => {
    if (courseData[currentStep - 1]?.contentType === 'Video' && !videoWatched) {
      toast.info(lngsltd["Please complete the video before submitting"]);
    } else {
      try {
        let status = "Completed";
        const courseId = courseData[currentStep - 1].courseID;
        const stepNo = courseData[currentStep - 1].stepNo;
        axios.put(`${apiUrl}/UserCourseStep/UpdateStatus?courseId=${courseId}&userId=${userID}&stepNumber=${stepNo}&status=${status}`, {}, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userDetails.token}`
          }
        }).then((result) => {
          console.log("entered", result);
          toast.success(lngsltd['Course submitted successfully']);
        })
          .catch((error) => {
            toast.error(lngsltd['Failed to submit course']);
          })
        navigate('/courses');
      } catch (error) {
        console.error('Error updating status and video time:', error);
      }
    }
  }



  // Function to generate image URL with headers
  // const getImageUrl = (courseID, stepNo, contentType, fileName) => {
  //   const url = `${COURSE_API_URL}/CourseStep/filecontent?CourseID=${courseID}&StepNo=${stepNo}&ContentType=${contentType}&FileName=${fileName}`;
  //   return `${url}&headers=${headers}`;
  // }


  return (
    <div className='startcoursepagediv w-100 m-3'>
      <ToastContainer
        position="top-center" // Position at the bottom right corner
        autoClose={5000} // Close after 5 seconds
        // hideProgressBar={false} // Show progress bar
        newestOnTop={false} // Display newer notifications below older ones
        closeOnClick // Close the notification when clicked
      />
      {/* Stepper */}
      <div className="stepper-container mb-5 p-3 rounded">
        {courseData.map((courseStep, index) => (
          <div key={index} className="stepper-step">
            <div
              className={`step ${courseStep.stepNo <= currentStep ? 'active' : ''}`}
            >
              {courseStep.stepNo}
            </div>
            {index < currentStep - 1 && (
              <div className="progress-line"></div>
            )}
          </div>
        ))}
      </div>

      {/* Content Section */}
      <div className="content-section">
        {courseData[currentStep - 1] && (
          <>
            {courseData[currentStep - 1].contentType === 'Image' && (
              <>
                {imageUrls.length > 0 && (
                  <div >
                    {imageUrls.map((imageUrl, index) => (
                      <div key={index} className='media-item'>
                        <div>
                          <img src={imageUrl} className='uploaded-image m-3' style={{ width: '90%', height: 'auto' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {courseData[currentStep - 1].contentType === 'Video' && (
              <div className='d-flex justify-content-center'>
                {videoUrl ? (
                  <>
                    <video

                      controls
                      autoPlay
                      width="80%"
                      onEnded={() => setVideoWatched(true)}
                    >
                      <source src={videoUrl} type="video/mp4" />
                      {lngsltd["Your browser does not support the video tag"]}
                    </video>

                  </>
                ) : (
                  <p>{lngsltd["Loading...Please wait"]}</p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <hr className='border border-danger h-1'></hr>

      {/* Description Section */}
      <div className="description-section m-2 border border-secondary p-3 " dangerouslySetInnerHTML={{ __html: courseData[currentStep - 1]?.description }}></div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button className="btn btn-danger" onClick={handleExit}>
          <FontAwesomeIcon className='iconstyle' icon={faRightFromBracket} />{lngsltd["Exit"]}
        </button>
        <div style={{ float: "right" }}>
          <button className="btn btn-info" onClick={handlePrevious} disabled={currentStep === 1}>
            <FontAwesomeIcon className='iconstyle' icon={faLeftLong} /> {lngsltd["Previous"]}
          </button>
          <button className="btn btn-info" onClick={handleNext} hidden={currentStep === courseData.length}>
            <FontAwesomeIcon className='iconstyle' icon={faRightLong} /> {lngsltd["Next"]}
          </button>
          <button className="btn btn-outline-success border " hidden={currentStep < courseData.length} onClick={handleSubmission}>
            Submit <FontAwesomeIcon className='iconstyle px-1' icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartCoursePage;

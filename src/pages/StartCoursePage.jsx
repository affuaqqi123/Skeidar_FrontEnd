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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const COURSE_API_URL = 'https://localhost:7295/api';

const StartCoursePage = () => {

  const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  const headers = { 'Authorization': userDetails.token }; // auth header with bearer token
  const navigate = useNavigate();
  const { id } = useParams();
  const userID = 1;

  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState([]);
  const [userCourseSteps, setUserCourseSteps] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoWatched, setVideoWatched] = useState(false);

  const fetchCourseData = async () => {

   
    console.log("Entered Fetch");
    try {
      const response = await axios.get(`${COURSE_API_URL}/CourseStep/Course/${id}`,{headers});
      if(response){
      const sortedData = response.data.slice().sort((a, b) => a.stepNo - b.stepNo);

      console.log("CourseData", sortedData);

     
      let userCourseStepsResponse = await axios.get(`${COURSE_API_URL}/UserCourseStep/ByCourseAndUser/${id}/${userID}`, { headers });
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

      console.log("userCourseStep", userCourseSteps);
      console.log("userStep", userSteps);

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
          `${COURSE_API_URL}/CourseStep/filecontent?CourseID=${response.data[0].courseID}&StepNo=${response.data[0].stepNo}&ContentType=${response.data[0].contentType}&FileName=${response.data[0].stepContent}`,
          { responseType: 'arraybuffer' },{headers}
        );
        const blob = new Blob([res.data], { type: 'video/mp4' });
        const bloburl = URL.createObjectURL(blob);
        setVideoUrl(bloburl);
      }
      }


    } catch (error) {
      console.error('Error fetching course data:', error);
    }

  };

  const createuserCourseStep = async (userSteps) => {
    try {
      for (const Step of userSteps) {
        await axios.post(`${COURSE_API_URL}/UserCourseStep`, Step);
      }
      let userCourseStepsResponse = await axios.get(`${COURSE_API_URL}/UserCourseStep/ByCourseAndUser/${id}/${userID}`,{headers});
    } catch (error) {
      console.error('Error creating user course steps:', error);
    }
  }

  useEffect(() => {
    console.log('Effect triggered with id:', id);
    fetchCourseData();
  }, [id]);

  useEffect(() => {
    console.log('Effect 2 triggered');
    if (courseData.length > 0) {
      updateVideoUrl();
    }
  }, [currentStep]);

  const updateVideoUrl = async () => {
    console.log("called");

    if (courseData[currentStep - 1]?.contentType === 'Video') {
      try {
        console.log("try");
        setVideoUrl('');
        const response = await axios.get(
          `${COURSE_API_URL}/CourseStep/filecontent?CourseID=${courseData[currentStep - 1].courseID}&StepNo=${courseData[currentStep - 1].stepNo}&ContentType=${courseData[currentStep - 1].contentType}&FileName=${courseData[currentStep - 1].stepContent}`,
          { responseType: 'arraybuffer' },{headers}
        );

        const blob = new Blob([response.data], { type: 'video/mp4' });
        const bloburl = URL.createObjectURL(blob);
        setVideoUrl(bloburl);


      } catch (error) {
        console.log("catch");
        console.error('Error fetching video data:', error);
        setVideoUrl('');
      }
    } else {
      setVideoUrl('');
    }
  };

  const handleExit = async () => {
    if (courseData[currentStep - 1]?.contentType === 'Video' && !videoWatched) {
      try {
        let status = 'InComplete';
        const courseId = courseData[currentStep - 1].courseID;
        const stepNo = courseData[currentStep - 1].stepNo;
        console.log(status, courseId, stepNo);
        await axios.put(
          `${COURSE_API_URL}/UserCourseStep/UpdateStatus?courseId=${courseId}&userId=${userID}&stepNumber=${stepNo}&status=${status}`,{headers}
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
      window.alert("Please complete the video before proceeding to the next step");
    } else {
      try {
        let status = "Completed";
        const courseId = courseData[currentStep - 1].courseID;
        const stepNo = courseData[currentStep - 1].stepNo;
        await axios.put(
          `${COURSE_API_URL}/UserCourseStep/UpdateStatus?courseId=${courseId}&userId=${userID}&stepNumber=${stepNo}&status=${status}`,{headers}
        );
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
      window.alert("Please complete the video before submitting");
    } else {
      try {
        let status = "Completed";
        const courseId = courseData[currentStep - 1].courseID;
        const stepNo = courseData[currentStep - 1].stepNo;
        await axios.put(
          `${COURSE_API_URL}/UserCourseStep/UpdateStatus?courseId=${courseId}&userId=${userID}&stepNumber=${stepNo}&status=${status}`,{headers}
        );
        toast.success('Course submitted successfully!', {
          position: toast.POSITION.TOP_CENTER,
        });
        navigate('/courses');
      } catch (error) {
        console.error('Error updating status and video time:', error);
      }
    }
  }

  return (
    <div className='m-3'>
      {/* Stepper */}
      <div className="stepper-container mb-5 border border-secondary p-3 rounded">
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
                {courseData[currentStep - 1].stepContent.split(',').map((fileName, index) => (
                  <div className='d-flex justify-content-center pb-5' key={index}>
                    <img
                      src={`${COURSE_API_URL}/CourseStep/filecontent?CourseID=${courseData[currentStep - 1].courseID}&StepNo=${courseData[currentStep - 1].stepNo}&ContentType=${courseData[currentStep - 1].contentType}&FileName=${fileName}`}
                      alt={`Step ${courseData[currentStep - 1].stepNo} Image ${index + 1}`}
                    />
                    <hr></hr>
                  </div>
                ))}
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
                      Your browser does not support the video tag.
                    </video>

                  </>
                ) : (
                  <p>No video available for this step.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <hr className='border border-danger h-1'></hr>

      {/* Description Section */}
      <div className="description-section m-5 border border-secondary p-3 " dangerouslySetInnerHTML={{ __html: courseData[currentStep - 1]?.description }}></div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button className="btn btn-danger" onClick={handleExit}>
          <FontAwesomeIcon className='iconstyle' icon={faRightFromBracket} />Exit
        </button>
        <div style={{ float: "right" }}>
          <button className="btn btn-info" onClick={handlePrevious} disabled={currentStep === 1}>
            <FontAwesomeIcon className='iconstyle' icon={faLeftLong} /> Previous
          </button>
          <button className="btn btn-info" onClick={handleNext} hidden={currentStep === courseData.length}>
            <FontAwesomeIcon className='iconstyle' icon={faRightLong} /> Next
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

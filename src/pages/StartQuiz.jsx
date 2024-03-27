import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StartQuiz.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StartQuiz = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const lngsltd=JSON.parse(localStorage.getItem('languageSelected'));
    const  headers= {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userDetails.token}`
      };
    const navigate = useNavigate();
    const { courseid } = useParams();
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [userQuiz, setUserQuiz] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);

    //Environment variables
    const apiUrl=process.env.REACT_APP_API_URL;

    useEffect(() => {        
        fetchQuiz();
    }, [courseid]);

    const fetchQuiz = async () => {
        try {
            const response = await axios.get(`${apiUrl}/Quiz/ByCourse/${courseid}`, { headers });
            setCurrentQuiz(response.data);
            const questionsResponse = await axios.get(`${apiUrl}/Question/QuizID/${response.data.quizID}`, { headers });
            setQuestions(questionsResponse.data);            
            createUserQuiz(response.data.quizID);
        } catch (error) {
            console.error('Error fetching quiz:', error);
        }
    };

    const createUserQuiz = async (quizId) => {
        try {
            const currentTime = new Date();
            const userId = userDetails.userID;

            const userQuizData = {
                userQuizID: 0,
                userID: userId,
                quizID: quizId,
                startTime: currentTime,
                endTime: currentTime,
                score: 0
            };

            const response = await axios.post(`${apiUrl}/UserQuiz`, userQuizData, { headers });            

            setUserQuiz(response.data);
        } catch (error) {
            console.error('Error creating user quiz:', error);
        }
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const UpdateUserQuiz = async () => {
        try {
            const userAnswersResponse = await axios.get(`${apiUrl}/UserAnswer/userQuizID/${userQuiz.userQuizID}`, { headers });
            const userAnswers = userAnswersResponse.data;

            const score = calculateScore(userAnswers);

            const currentTime = new Date();

            const userQuizData = {
                userQuizID: userQuiz.userQuizID,
                userID: userQuiz.userID,
                quizID: userQuiz.quizID,
                startTime: userQuiz.startTime,
                endTime: currentTime,
                score: score
            };

            const response = await axios.put(`${apiUrl}/UserQuiz/${userQuizData.userQuizID}`, userQuizData, { headers });            
            window.alert(`You Scored/Du scoret: ${score}`);
            // window.alert(lngsltd[`You Scored: ${score}`]);
            setUserQuiz(null);
            navigate(`/courses`);
        } catch (error) {
            console.error('Error creating user quiz:', error);
        }
    };

    const calculateScore = (userAnswers) => {
        let score = 0;
        for (let i = 0; i < userAnswers.length; i++) {
            const userAnswer = userAnswers[i];
            if (userAnswer.isCorrect) {
                score++;
            }
        }
        return score;
    };
    

    const handleSubmit = async () => {
        const userAnswerData = {
            userAnswerID: 0,
            userQuizID: userQuiz.userQuizID,
            questionID: currentQuestion.id,
            selectedOption: selectedOption,
            correctOption: currentQuestion.correctOption,
            isCorrect: selectedOption === currentQuestion.correctOption
        };        
        const response = await axios.post(`${apiUrl}/UserAnswer`, userAnswerData, { headers });        
        setSelectedOption(null);
        UpdateUserQuiz();
    }

    const handleNextQuestion = async () => {
        if (selectedOption !== null) {
            if (currentQuestionIndex === questions.length - 1) {                
                handleSubmit();
            } else {                
                try {
                    const userAnswerData = {
                        userAnswerID: 0,
                        userQuizID: userQuiz.userQuizID,
                        questionID: currentQuestion.id,
                        selectedOption: selectedOption,
                        correctOption: currentQuestion.correctOption,
                        isCorrect: selectedOption === currentQuestion.correctOption
                    };                    
                    const response = await axios.post(`${apiUrl}/UserAnswer`, userAnswerData, { headers });                    
                    setSelectedOption(null);
                } catch (error) {
                    console.error('Error saving user answer:', error);
                }
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                const userQuizID = userQuiz.userQuizID; 
            const questionID = questions[currentQuestionIndex + 1].id; 
            await fetchSelectedOption(userQuizID, questionID);
            }
        } else {
            toast.info(lngsltd["Please select an option before proceeding to the next question."])
            // console.log("Please select an option before proceeding to the next question.");
        }
    };
    const fetchSelectedOption = async (userQuizID, questionID) => {
        try {
            // console.log("fetch selected option", userQuizID, questionID);
            const response = await axios.get(`${apiUrl}/UserAnswer/${userQuizID}/${questionID}`);
            setSelectedOption(response.data);
            // console.log("selected option", response.data, userQuizID, questionID);
        } catch (error) {
            console.error('Error fetching selected option:', error);
        }
    };

    const handlePrevious = () => {
        setCurrentQuestionIndex((prevIndex) =>prevIndex - 1);
        const userQuizID = userQuiz.userQuizID; 
        const questionID = questions[currentQuestionIndex - 1].id;
        fetchSelectedOption(userQuizID, questionID);
    }
    const handleExit = () => {
        const confirmed = window.confirm(lngsltd['Are you sure you want to exit the quiz?']);
        if (confirmed) {
            navigate(`/courses`);
        }
    };

    useEffect(() => {
        if (questions.length > 0) {
            setCurrentQuestion(questions[currentQuestionIndex]);
        }
    }, [currentQuestionIndex, questions]);

    return (
        <div className="startquiz-container">
             <ToastContainer 
            position="top-center" 
            autoClose={5000}             
            newestOnTop={false} 
            closeOnClick 
            />  
            <div className="quiz-title">
                {currentQuiz ? currentQuiz.title : "Loading..."}
            </div>
            {/* <div className="quiz-box" style={{ maxWidth: "1000px" }}> */}
            <div className="quiz-box ">
                <div className="question-container">
                    {currentQuestion ? (
                        <div className="datacontainer">
                            <p className="qstn">{lngsltd["Question"]} {currentQuestion.questionNo}: {currentQuestion.questionText}</p>
                            {currentQuestion.imageName !== "No Image" && currentQuestion.imageName ? (
                                <div className="image-container">
                                    <img
                                        src={`${apiUrl}/Question/Image/${currentQuestion.quizID}/${currentQuestion.questionNo}/${currentQuestion.imageName}`}
                                        alt="Image"
                                        style={{ maxWidth:"600px",width: "100%", height: "auto" }}
                                    />
                                </div>
                            ) : null}

                            <div className="options-container">
                                <div className="option">
                                    <input className='rdbtn'
                                        type="radio"
                                        id="option-1"
                                        name="option"
                                        value={currentQuestion.option1}
                                        checked={selectedOption === 1}
                                        onChange={() => handleOptionChange(1)}
                                    />
                                    <label htmlFor="option-1">{currentQuestion.option1}</label>
                                </div>
                                <div className="option">
                                    <input className='rdbtn'
                                        type="radio"
                                        id="option-2"
                                        name="option"
                                        value={currentQuestion.option2}
                                        checked={selectedOption === 2}
                                        onChange={() => handleOptionChange(2)}
                                    />
                                    <label htmlFor="option-2">{currentQuestion.option2}</label>
                                </div>
                                <div className="option">
                                    <input className='rdbtn'
                                        type="radio"
                                        id="option-3"
                                        name="option"
                                        value={currentQuestion.option3}
                                        checked={selectedOption === 3}
                                        onChange={() => handleOptionChange(3)}
                                    />
                                    <label htmlFor="option-3">{currentQuestion.option3}</label>
                                </div>
                                <div className="option">
                                    <input className='rdbtn'
                                        type="radio"
                                        id="option-4"
                                        name="option"
                                        value={currentQuestion.option4}
                                        checked={selectedOption === 4}
                                        onChange={() => handleOptionChange(4)}
                                    />
                                    <label htmlFor="option-4">{currentQuestion.option4}</label>
                                </div>
                            </div>


                        </div>
                    ) : (
                        <p>{lngsltd["Loading....Please wait"]}</p>
                    )}
                </div>
                <br></br>
                <div className="navigation-buttons">
                    <button
                        className="exit-button"
                        onClick={handleExit}
                    >
                        {lngsltd["Exit"]}
                    </button>
                    <button
                     className="previous-button" 
                     onClick={handlePrevious}  disabled={currentQuestionIndex === 0}>
                        {lngsltd["Previous"]}
                     </button>
                    <button
                        className="next-button"
                        onClick={handleNextQuestion}
                    >
                       {lngsltd["Next"]} 
                    </button>
                   
                </div>
            </div>
        </div>

    );
};

export default StartQuiz;
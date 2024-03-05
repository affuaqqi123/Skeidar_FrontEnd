import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StartQuiz.css'

const StartQuiz = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
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

    useEffect(() => {
        console.log("courseID", courseid);
        fetchQuiz();
    }, [courseid]);

    const fetchQuiz = async () => {
        try {
            const response = await axios.get(`https://localhost:7295/api/Quiz/ByCourse/${courseid}`, { headers });
            setCurrentQuiz(response.data);
            const questionsResponse = await axios.get(`https://localhost:7295/api/Question/QuizID/${response.data.quizID}`, { headers });
            setQuestions(questionsResponse.data);
            console.log("Questions", questionsResponse.data)
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

            const response = await axios.post('https://localhost:7295/api/UserQuiz', userQuizData, { headers });
            console.log('User quiz data', response.data);

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
            const userAnswersResponse = await axios.get(`https://localhost:7295/api/UserAnswer/userQuizID/${userQuiz.userQuizID}`, { headers });
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

            const response = await axios.put(`https://localhost:7295/api/UserQuiz/${userQuizData.userQuizID}`, userQuizData, { headers });
            console.log('Updated User quiz data', response.data);
            window.alert(`You Scored: ${score}`);
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
        console.log("useranswerdata", userAnswerData)
        const response = await axios.post('https://localhost:7295/api/UserAnswer', userAnswerData, { headers });
        console.log('User answer saved successfully:', response.data);
        setSelectedOption(null);
        UpdateUserQuiz();
    }

    const handleNextQuestion = async () => {
        if (selectedOption !== null) {
            if (currentQuestionIndex === questions.length - 1) {
                console.log(questions);
                handleSubmit();
            } else {
                console.log("handle next");
                try {
                    const userAnswerData = {
                        userAnswerID: 0,
                        userQuizID: userQuiz.userQuizID,
                        questionID: currentQuestion.id,
                        selectedOption: selectedOption,
                        correctOption: currentQuestion.correctOption,
                        isCorrect: selectedOption === currentQuestion.correctOption
                    };
                    console.log("useranswerdata", userAnswerData)
                    const response = await axios.post('https://localhost:7295/api/UserAnswer', userAnswerData, { headers });
                    console.log('User answer saved successfully:', response.data);
                    setSelectedOption(null);
                } catch (error) {
                    console.error('Error saving user answer:', error);
                }
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            }
        } else {
            console.log("Please select an option before proceeding to the next question.");
        }
    };

    const handlePrevious = () => {
        setCurrentQuestionIndex((prevIndex) =>prevIndex - 1);
    }
    const handleExit = () => {
        const confirmed = window.confirm('Are you sure you want to exit the quiz? Your progress will not be saved.');
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

            <div className="quiz-title">
                {currentQuiz ? currentQuiz.title : "Loading..."}
            </div>
            <div className="quiz-box">
                <div className="question-container ">
                    {currentQuestion ? (
                        <div>
                            <p>Question {currentQuestion.questionNo}: {currentQuestion.questionText}</p>
                            {currentQuestion.imageName !== "No Image" && currentQuestion.imageName ? (
                                <div className="image-container">
                                    <img
                                        src={`https://localhost:7295/api/Question/Image/${currentQuestion.quizID}/${currentQuestion.questionNo}/${currentQuestion.imageName}`}
                                        alt="Question"
                                        style={{ maxWidth: "500px", maxHeight: "400px", width: "auto", height: "auto" }}
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
                        <p>No questions available</p>
                    )}
                </div>
                <br></br>
                <div className="navigation-buttons">
                    <button
                        className="exit-button"
                        onClick={handleExit}
                    >
                        Exit
                    </button>
                    <button
                     className="previous-button" 
                     onClick={handlePrevious}  disabled={currentQuestionIndex === 0}>
                        Previous
                     </button>
                    <button
                        className="next-button"
                        onClick={handleNextQuestion}
                    >
                        Next
                    </button>
                   
                </div>
            </div>
        </div>

    );
};

export default StartQuiz;
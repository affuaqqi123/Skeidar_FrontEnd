import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import './Questions.css'

const Questions = () => {
    const { quizid } = useParams();

    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const headers = { 
        'Content-Type': 'multipart/form-data',
        'Authorization': userDetails.token };

    const [questions, setQuestions] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        id: 0,
        quizID: quizid,
        questionText: '',
        questionNo: '',
        imageName: 'No Image',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correctOption: 0,
        imageFile: null
    });

    const [showEdit, setShowEdit] = useState(false);
    const [editQuestion, setEditQuestion] = useState({
        id: 0,
        quizID: quizid,
        questionText: '',
        questionNo: '',
        imageName: 'No Image',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correctOption: 0,
        imageFile: null
    });
    const [editQuestionId, setEditQuestionId] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, [quizid]);

    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`https://localhost:7295/api/Question/QuizID/${quizid}`,{headers});
            const sortedData = response.data.slice().sort((a, b) => a.questionNo - b.questionNo);
            setQuestions(sortedData);
            console.log("QuestionData", response.data)
        } catch (error) {
            console.error('Error fetching questions: ', error)
        }
    };

    const handleAdd = () => {
        const formData = new FormData();
        formData.append('quizID', newQuestion.quizID);
        formData.append('questionText', newQuestion.questionText);
        formData.append('questionNo', newQuestion.questionNo);
        formData.append('option1', newQuestion.option1);
        formData.append('option2', newQuestion.option2);
        formData.append('option3', newQuestion.option3);
        formData.append('option4', newQuestion.option4);
        formData.append('correctOption', newQuestion.correctOption);

        if (newQuestion.imageFile) {
            formData.append('imageFile', newQuestion.imageFile);
            formData.append('imageName', "Image");
        } else {
            formData.append('imageName', "No Image");
        }

        axios.post('https://localhost:7295/api/Question', formData,{headers})
            .then((result) => {
                setShowAdd(false);
                fetchQuestions();
                clear();
                toast.success('New question has been added');
            })
            .catch((error) => {
                toast.error(error);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewQuestion(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditQuestion(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditClick = async (question) => {
        if (question.imageName !== "No Image") {
            try {
                const response = await axios.get(`https://localhost:7295/api/Question/Image/${question.quizID}/${question.questionNo}/${question.imageName}`, {
                    responseType: 'arraybuffer',headers
                });

                const blob = new Blob([response.data], { type: 'image/jpeg' });
                const imageFile = new File([blob], question.imageName, { type: 'image/jpeg' });

                console.log(imageFile);
                setEditQuestion({
                    id: question.id,
                    quizID: question.quizID,
                    questionText: question.questionText,
                    questionNo: question.questionNo,
                    imageName: question.imageName,
                    option1: question.option1,
                    option2: question.option2,
                    option3: question.option3,
                    option4: question.option4,
                    correctOption: question.correctOption,
                    imageFile: imageFile
                });

            } catch (error) {
                console.error('Error fetching image:', error);
            }
        }
        else {
            setEditQuestion({
                id: question.id,
                quizID: question.quizID,
                questionText: question.questionText,
                questionNo: question.questionNo,
                imageName: question.imageName,
                option1: question.option1,
                option2: question.option2,
                option3: question.option3,
                option4: question.option4,
                correctOption: question.correctOption
            });
        }
        setEditQuestionId(question.id);
        setShowEdit(true);
    };

    const handleEdit = () => {
        const formData = new FormData();
        formData.append('id', editQuestion.id);
        formData.append('quizID', editQuestion.quizID);
        formData.append('questionText', editQuestion.questionText);
        formData.append('questionNo', editQuestion.questionNo);
        formData.append('option1', editQuestion.option1);
        formData.append('option2', editQuestion.option2);
        formData.append('option3', editQuestion.option3);
        formData.append('option4', editQuestion.option4);
        formData.append('correctOption', editQuestion.correctOption);

        if (editQuestion.imageFile) {
            formData.append('imageFile', editQuestion.imageFile);
            formData.append('imageName', "Image");
        } else {

            formData.append('imageName', "No Image");
        }

        axios.put(`https://localhost:7295/api/Question/${editQuestionId}`, formData,{headers})
            .then((result) => {
                fetchQuestions();
                clearEdit();
                setShowEdit(false);
                toast.success('Question has been updated');
            })
            .catch((error) => {
                toast.error('Failed to update question');
                console.error('Error updating question: ', error);
            });
    };


    const handleDelete = (questionId) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            axios.delete(`https://localhost:7295/api/Question/${questionId}`,{headers})
                .then((result) => {
                    fetchQuestions();
                    toast.success('Question has been deleted');
                })
                .catch((error) => {
                    toast.error('Failed to delete question');
                    console.error('Error deleting question: ', error);
                });
        }
    };


    const clear = () => {
        setNewQuestion({
            quizID: quizid,
            questionText: '',
            questionNo: '',
            imageName: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            correctOption: '',
            imageFile: ''
        });
    };

    const clearEdit = () => {
        setEditQuestion({
            id: '',
            quizID: '',
            questionText: '',
            questionNo: '',
            imageName: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            correctOption: '',
            imageFile: ''
        });
    };

    const handleRemoveImage = () => {
        setNewQuestion(prevState => ({
            ...prevState,
            imageFile: null,
            imageName: "No Image"
        }));
        setEditQuestion(prevState => ({
            ...prevState,
            imageFile: null,
            imageName: "No Image"
        }));
    };
    
    return (
        <div className='questions-container'>
            <h1 className='questions-heading'>List of Questions</h1>
            <div className='questions-table-container'>
                <ToastContainer />
                <Button className='add-button' onClick={() => setShowAdd(true)}>Add Question</Button>
                <Table className='questions-table' striped bordered hover size='sm'>
                    <thead>
                        <tr>
                            <th>QuestionNo</th>
                            <th>Question Text</th>
                            <th>Options</th>
                            <th>Correct Option</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((question, index) => (
                            <tr key={index}>
                                <td>{question.questionNo}</td>
                                <td>{question.questionText}</td>
                                <td>{question.option1}, {question.option2}, {question.option3}, {question.option4}</td>
                                <td>{question.correctOption}</td>
                                <td>
                                    {question.imageName !== 'No Image' && (
                                        <img src={`https://localhost:7295/api/Question/Image/${quizid}/${question.questionNo}/${question.imageName}`} alt="Question Image" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                    )}
                                </td>

                                <td>
                                    <Button variant="info" onClick={() => handleEditClick(question)}>Edit</Button>{' '}
                                    <Button variant="danger" onClick={() => handleDelete(question.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Modal show={showAdd} onHide={() => setShowAdd(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Question</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group mb-3">
                            <label htmlFor="questionNo">Question Number:</label>
                            <input type="text" className="form-control" placeholder="Enter Question No" name="questionNo" value={newQuestion.questionNo} onChange={handleInputChange} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="questionText">Question Text:</label>
                            <input type="text" className="form-control" placeholder="Enter Question Text" name="questionText" value={newQuestion.questionText} onChange={handleInputChange} />
                        </div>

                        {newQuestion.imageFile && (
                            <div className="form-group mb-3">
                                <label>Selected Image Preview:</label><br />
                                <img src={URL.createObjectURL(newQuestion.imageFile)} alt="Selected Image Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                <button className="btn btn-danger" onClick={() => handleRemoveImage()}>Remove Image</button>
                            </div>
                        )}
                        <div className="form-group mb-3">
                            <label htmlFor="imageFile">Image File:</label>
                            <input type="file" className="form-control-file" name="imageFile" onChange={(e) => setNewQuestion({ ...newQuestion, imageFile: e.target.files[0] })} />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="option1">Option 1:</label>
                            <input type="text" className="form-control" placeholder="Enter Option 1" name="option1" value={newQuestion.option1} onChange={handleInputChange} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="option2">Option 2:</label>
                            <input type="text" className="form-control" placeholder="Enter Option 2" name="option2" value={newQuestion.option2} onChange={handleInputChange} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="option3">Option 3:</label>
                            <input type="text" className="form-control" placeholder="Enter Option 3" name="option3" value={newQuestion.option3} onChange={handleInputChange} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="option4">Option 4:</label>
                            <input type="text" className="form-control" placeholder="Enter Option 4" name="option4" value={newQuestion.option4} onChange={handleInputChange} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="correctOption">Correct Option:</label>
                            <select id="correctOption" className="form-control" name="correctOption" value={newQuestion.correctOption} onChange={handleInputChange}>
                                <option value="" disabled hidden>Select Correct Option</option>
                                <option value="1">Option 1</option>
                                <option value="2">Option 2</option>
                                <option value="3">Option 3</option>
                                <option value="4">Option 4</option>
                            </select>
                        </div>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleAdd}>Add Question</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showEdit} onHide={() => setShowEdit(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Question</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group mb-3">
                            <label htmlFor="questionNo">Question Number:</label>
                            <input type="text" className="form-control" placeholder="Enter Question No" name="questionNo" value={editQuestion.questionNo} onChange={handleEditInputChange} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="questionText">Question Text:</label>
                            <input type="text" className="form-control" placeholder="Enter Question Text" name="questionText" value={editQuestion.questionText} onChange={handleEditInputChange} />
                        </div>

                        {editQuestion.imageFile && (
                            <div className="form-group mb-3">
                                <label>Selected Image Preview:</label><br />
                                <img src={URL.createObjectURL(editQuestion.imageFile)} alt="Selected Image Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                <button className="btn btn-danger" onClick={() => handleRemoveImage()}>Remove Image</button>
                            </div>
                        )}

                        <div className="form-group mb-3">
                            <label htmlFor="imageFile">Image File:</label>
                            <input type="file" className="form-control-file" name="imageFile" onChange={(e) => setEditQuestion({ ...editQuestion, imageFile: e.target.files[0] })} />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="option1">Option 1:</label>
                            <input type="text" className="form-control" placeholder="Enter Option 1" name="option1" value={editQuestion.option1} onChange={handleEditInputChange} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="option2">Option 2:</label>
                            <input type="text" className="form-control" placeholder="Enter Option 2" name="option2" value={editQuestion.option2} onChange={handleEditInputChange} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="option3">Option 3:</label>
                            <input type="text" className="form-control" placeholder="Enter Option 3" name="option3" value={editQuestion.option3} onChange={handleEditInputChange} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="option4">Option 4:</label>
                            <input type="text" className="form-control" placeholder="Enter Option 4" name="option4" value={editQuestion.option4} onChange={handleEditInputChange} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="correctOption">Correct Option:</label>
                            <select id="correctOption" className="form-control" name="correctOption" value={editQuestion.correctOption} onChange={handleEditInputChange}>
                                <option value="" disabled hidden>Select Correct Option</option>
                                <option value="1">Option 1</option>
                                <option value="2">Option 2</option>
                                <option value="3">Option 3</option>
                                <option value="4">Option 4</option>
                            </select>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleEdit}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </div>

    );
};

export default Questions;

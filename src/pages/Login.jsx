import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import '../App.css';

function Login(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    const [localizedStrings, setLocalizedStrings] = useState({});

    useEffect(() => {
        // Fetch localized strings when component mounts
        fetchLocalizedStrings('en-US');
    }, []); // Fetch data only once when component mounts

    const fetchLocalizedStrings = async (culture) => {
        try {

            const response = await axios.get(`https://localhost:7295/api/Localization/${culture}`, {
                headers: {
                    'Accept-Language': culture
                }
            });
            setLocalizedStrings(response.data);
            localStorage.setItem('languageSelected',JSON.stringify(response.data));
        } catch (error) {
            console.error('Error fetching localized strings:', error);
        }
    };

    const handleLogin = () => {

        axios.post('https://localhost:7295/api/Login', { username, password })
            .then(response => {
                console.log('Login successful:', response.data);
                localStorage.setItem('userDetails', JSON.stringify(response.data));
                setLoggedIn(true);
                props.setLoggedIn(true);
                localStorage.setItem('isLoggedIn', JSON.stringify(true));
                navigate('/dashboard');

            })
            .catch(error => {
                alert('please enter valid userName and password')
                props.setLoggedIn(false);
            });
    };

    return (
        <>
            <div className='loginheader' style={{ color: "red" }}>SKEIDAR LIVING |<span style={{ color: "white" }}> GROUP</span></div>

            <div className='btncltrs'>
                    <button className='btnenglish' onClick={() => fetchLocalizedStrings('en-US')}>English</button>
                    <button className='btnnorwagian' onClick={() => fetchLocalizedStrings('nb-NO')}>Norwegian</button>
                </div>
            <Container fluid className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: 'white' }}>
                {/* <h1>{localizedStrings.Welcome}</h1> */}
                {/* <p>{localizedStrings.Sorry}</p> */}
                
                <Row style={{ maxWidth: '600px' }} className="justify-content-md-center mt-1 w-100 border border-4 p-5">
                    <Col xs={12} md={6} style={{ maxWidth: '600px' }} >
                        <h2 className="text-center mb-4">{localizedStrings.Login}</h2>
                        <Form>
                            <Form.Group controlId="formUsername">
                                <Form.Label>{localizedStrings.UserName}:</Form.Label>
                                <Form.Control
                                    className='border border-4'
                                    type="text"
                                    placeholder={localizedStrings["Enter your username"]}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="formPassword">
                                <Form.Label className='mt-3'>{localizedStrings.Password}:</Form.Label>
                                <Form.Control
                                    className='border border-4'
                                    type="password"
                                    placeholder={localizedStrings["Enter your password"]}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <div className='text-center '>
                                <Button variant="primary" type="button" className='mt-3 justify-content-md-center mt-5 w-50 ' onClick={handleLogin}>
                                {localizedStrings.Login}
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Login;
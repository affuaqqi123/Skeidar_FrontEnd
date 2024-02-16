import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Navigate,useNavigate } from 'react-router-dom';

function Login(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

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
         <div className='loginheader' style={{color:"red"}}>SKEIDAR LIVING |<span style={{color:"white"}}> GROUP</span></div>
        <Container fluid className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: 'white' }}>
   
            <Row style={{ maxWidth: '600px' }} className="justify-content-md-center mt-1 w-100 border border-4 p-5">
                <Col xs={12} md={6} style={{ maxWidth: '600px' }} >
                    <h2 className="text-center mb-4">Login</h2>
                    <Form>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username:</Form.Label>
                            <Form.Control
                                className='border border-4'
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label className='mt-3'>Password:</Form.Label>
                            <Form.Control
                                className='border border-4'
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <div className='text-center '>
                            <Button variant="primary" type="button" className='mt-3 justify-content-md-center mt-5 w-50 ' onClick={handleLogin}>
                                Login
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
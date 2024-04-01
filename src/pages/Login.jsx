import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import englishFlag from '../Assets/United-Kingdom-Flag.png';
import norwegian from '../Assets/NorwegianFlag.png';

function Login(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [culture, setCulture] = useState('en-US');

    // const [localizedStrings, setLocalizedStrings] = useState({});
    const [localizedStrings, setLocalizedStrings] = useState({"Login": "Login","UserName": "UserName","Password": "Password","Enter your username": "Enter your username","Enter your password":"Enter your password"});
    localStorage.setItem('isLoggedIn','null');

    //Environment variables
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        // Fetch localized strings when component mounts
        fetchLocalizedStrings(culture);
    }, [culture]); // Fetch data only once when component mounts

    const fetchLocalizedStrings = async (culture) => {
        try {

            const response = await axios.get(`${apiUrl}/Localization/${culture}`, {
                headers: {
                    'Accept-Language': culture
                }
            });
            setLocalizedStrings(response.data);
            localStorage.setItem('languageSelected', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            // toast.error('Error fetching data:', error);
            toast.error(localizedStrings['Something went wrong while loading the page'], error);
        }
    };
    const lang = useMemo(() => localizedStrings, [localizedStrings]);

    const handleLogin = () => {

        axios.post(`${apiUrl}/Login`, { username, password })
            .then(response => {
                localStorage.setItem('userDetails', JSON.stringify(response.data));
                setLoggedIn(true);
                props.setLoggedIn(true);
                localStorage.setItem('isLoggedIn', JSON.stringify(true));
                navigate('/dashboard');

            })
            .catch(error => {
                toast.error(localizedStrings['Please enter valid UserName and Password'])
                props.setLoggedIn(false);
            });
    };

    return (
        <div className="vh-100 d-flex flex-column">
            <div className='loginheader' style={{ color: "red" }}>SKEIDAR LIVING |<span style={{ color: "white" }}> GROUP</span></div>
            <ToastContainer
                position="bottom-right" // Position at the bottom right corner
                autoClose={5000} // Close after 5 seconds
                // hideProgressBar={false} // Show progress bar
                newestOnTop={false} // Display newer notifications below older ones
                closeOnClick // Close the notification when clicked
            />
            {/* <div className='btncltrs' style={{float:'right'}}>
                <button className='btnenglish' onClick={() => setCulture('en-US')}>English</button>
                <button className='btnnorwagian' onClick={() => setCulture('nb-NO')}>Norwegian</button>
            </div> */}
            <div className='btncltrs'>
            <div className='button-wrapper' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className='btnenglish' onClick={() => setCulture('en-US')} style={{
                    backgroundImage: `url(${englishFlag})`,                    
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center', 
                    backgroundRepeat: 'no-repeat', 
                    width: '60px', 
                    height: '30px'
                }}
                title="English"
                >
         
                </button>
                <button className='btnnorwagian' onClick={() => setCulture('nb-NO')}
                style={{
                    backgroundImage: `url(${norwegian})`,
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center', 
                    backgroundRepeat: 'no-repeat',
                    width: '60px', 
                    height: '30px'
                }}
                title="Norwegian"
                ></button>
                </div>
            </div>
            <Container fluid className="cntnr d-flex align-items-center justify-content-center " style={{ backgroundColor: 'white' }}>
                {/* <h1>{localizedStrings.Welcome}</h1> */}
                {/* <p>{localizedStrings.Sorry}</p> */}

                <Row style={{ maxWidth: '600px' }} className="loginbox justify-content-md-center mt-1 w-100 border border-4">
                    <Col xs={12} md={6} style={{ maxWidth: '600px' }} >
                        <h2 className="logintitle text-center">{lang.Login}</h2>
                        <Form>
                            <Form.Group controlId="formUsername">
                                <Form.Label>{lang.UserName}:</Form.Label>
                                <Form.Control
                                    className='border border-4'
                                    type="text"
                                    placeholder={localizedStrings["Enter your username"]}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="formPassword">
                                <Form.Label className='mt-3'>{lang.Password}:</Form.Label>
                                <Form.Control
                                    className='border border-4'
                                    type="password"
                                    placeholder={localizedStrings["Enter your password"]}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="off"
                                />
                            </Form.Group>
                            <div className='text-center '>
                                <Button variant="primary" type="button" className='btnlgn justify-content-md-center w-50 ' onClick={handleLogin}>
                                    {localizedStrings.Login}
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;
import { Form, Button, Container, Card, Col, Row } from 'react-bootstrap';
import { useState } from "react";
import { setCookie } from "../helpers";
import { config } from "../config";
import { Link } from "react-router-dom";
const bcrypt = require('bcryptjs');
const axios = require('axios');
const qs = require('querystring');

function Signup(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [retypedPassword, setRetypedPassword] = useState("");
    const [displayName, setDisplayName] = useState("");

    function signupHandler() {
        if (password.length < 4) {
            alert("Password must contain at least 4 characters.");
            return;
        }
        else if (password !== retypedPassword) {
            alert("Password does not match.");
            return;
        }
        bcrypt.hash(password, 10, function (err, hashedPassword) {
            const requestBody = {
                username: username,
                password: hashedPassword,
                displayName: displayName,
            }
            const reqConfig = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            axios.post(`${config.api_url}/signup`, qs.stringify(requestBody), reqConfig)
                .then((res) => {
                    setCookie(config.cookie_token, res.data.token);
                    setCookie(config.cookie_username, res.data.user.username);
                    window.location.href = "/";
                })
                .catch((err) => {
                    console.log(err);
                })
        });

    }

    return (
        <Card style={{ padding: "40px", width: "400px", margin: "80px auto auto auto" }}>
            <h2 className="text-center">Sign Up</h2>
            <Form>
                <Form.Group controlId="username">
                    <Form.Label>Username *</Form.Label>
                    <Form.Control required type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} required />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password *</Form.Label>
                    <Form.Control required type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
                </Form.Group>
                <Form.Group controlId="retypedPassword">
                    <Form.Label>Retype your password *</Form.Label>
                    <Form.Control required type="password" placeholder="Retype your password" onChange={e => setRetypedPassword(e.target.value)} required />
                </Form.Group>

                <Form.Group controlId="displayName">
                    <Form.Label>Display Name *</Form.Label>
                    <Form.Control required type="text" placeholder="Display Name" onChange={e => setDisplayName(e.target.value)} />
                </Form.Group>

                <Button onClick={signupHandler} variant="primary" type="button">Submit</Button>
                <Link style={{ marginLeft: "20px" }} to="/login">Login</Link>
            </Form>
        </Card>
    );
}

export default Signup;

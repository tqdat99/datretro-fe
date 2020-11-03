import { Form, Button, Container, Card } from 'react-bootstrap';
import { useState } from "react";
import { callAPI, setCookie } from "../helpers";
import { config } from "../config";
import { Link } from "react-router-dom";
const axios = require('axios');
const qs = require('querystring');
const bcrypt = require('bcryptjs');

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const requestBody = {
        username: username,
    }
    const reqConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    function actionLogin() {
        axios.get(`${config.api_url}/users/${username}/password`)
            .then(res => {
                console.log(res);
                bcrypt.compare(password, res.data, function (err, success) {
                    if (success) {
                        console.log(requestBody);
                        axios.post(`${config.api_url}/signin`, qs.stringify(requestBody), reqConfig)
                            .then((res) => {
                                setCookie(config.cookie_token, res.data.token);
                                setCookie(config.cookie_username, res.data.user.username);
                                window.location.href = "/";
                            })
                            .catch((err) => {
                                console.log(err);
                            })
                    }
                    else {
                        alert('Đăng nhập thất bại!')
                    }
                });
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <Card style={{ padding: "40px", width: "400px", margin: "80px auto auto auto" }}>
            <h2 className="text-center">Login</h2>
            <Form>
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} required />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
                </Form.Group>
                <Button onClick={actionLogin} variant="primary" type="button">Login</Button>
                <Link style={{ marginLeft: "20px" }} to="/signup">Sign up</Link>
            </Form>
        </Card>
    );
}

export default Login;

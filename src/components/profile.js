import { Form, Button, Container, Card, Col, Row } from 'react-bootstrap';
import React, { useEffect, useState } from "react";
import { callAPI, getCookie, quickCheckToken, setCookie } from "../helpers";
import { config } from "../config";
import { Link, Redirect } from "react-router-dom";
import Header from "./header";
const axios = require('axios');
const qs = require('querystring');

function Profile() {
    const logined = quickCheckToken();

    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");

    useEffect(() => {
        let mounted = true;

        axios.get(`${config.api_url}/users/${getCookie(config.cookie_username)}`)
            .then(res => {
                console.log(res);
                if (mounted) {
                    setUsername(res.data['username']);
                    setDisplayName(res.data['displayName']);
                    setUserId(res.data['_id']);
                }
            })
            .catch((err) => {
                console.log(err);
            })

        return () => {
            mounted = false;
        };
    }, []);

    function updateProfileHandler() {
        if (displayName === "") {
            alert("Please input all required fields!");
            return;
        }

        const requestBody = {
            displayName: displayName,
        }
        const reqConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        axios.patch(`${config.api_url}/users/${userId}/update`, qs.stringify(requestBody), reqConfig)
            .then((res) => {
                window.location.reload(false);
                alert('Display name updated!');
            })
            .catch((err) => {
                console.log(err);
            })
    }
    if (logined) {
        return (
            <Container fluid>
                <Header />
                <Container style={{ paddingTop: "40px" }}>
                    <h2 className="text-center">Profile</h2>
                    <Form>
                        <Form.Group controlId="username" readOnly >
                            <Form.Label>Username</Form.Label><br />
                            <Form.Label>{username}</Form.Label>
                        </Form.Group>
                        <Form.Group controlId="displayName">
                            <Form.Label>Display name *</Form.Label>
                            <Form.Control value={displayName} type="text" placeholder="Display name" onChange={e => setDisplayName(e.target.value)} required />
                        </Form.Group>
                        <Button onClick={updateProfileHandler} variant="primary" type="button">Save changes</Button>
                    </Form>
                </Container>
            </Container>
        );
    } else {
        return (<Redirect to="/login" />);
    }
}

export default Profile;

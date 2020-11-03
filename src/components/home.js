import { getCookie, quickCheckToken, setCookie } from "../helpers";
import { BrowserRouter, Redirect, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Navbar, Nav, Button, Modal, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { config } from "../config";
import Header from "./header";
const axios = require('axios');
const qs = require('querystring');

function Home() {
    const logined = quickCheckToken();
    const [boards, setBoards] = useState([]);
    const [show, setShow] = useState(false);
    const [newBoardTitle, setNewBoardTitle] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const requestBody = {
        title: newBoardTitle,
        user: getCookie(config.cookie_username)
    }

    const reqConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    function createNewBoardHandler() {
        axios.post(`${config.api_url}/boards/create`, qs.stringify(requestBody), reqConfig)
            .then((res) => {
                window.location.reload(false);
            })
            .catch((err) => {
                console.log(err);
            })
    };

    useEffect(() => {
        let mounted = true;

        console.log(getCookie(config.cookie_username));

        axios.get(`${config.api_url}/${getCookie(config.cookie_username)}/boards`)
            .then(res => {
                console.log(res);
                if (mounted) {
                    setBoards(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            })

        return () => {
            mounted = false;
        };
    }, []);

    if (logined) {
        return (
            <Container fluid>
                <Header />

                <div style={{ padding: "80px 80px" }}>
                    <span style={{ fontSize: "24px" }}>{getCookie(config.cookie_username)}'s boards</span>
                    <Button variant="primary" onClick={handleShow} style={{ marginLeft: "24px" }}>Create new board</Button>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create new board</Modal.Title>
                        </Modal.Header>
                        <Modal.Body><Form>
                            <Form.Group controlId="boardTitle">
                                <Form.Label>New board title</Form.Label>
                                <Form.Control type="text" placeholder="New board title" onChange={e => setNewBoardTitle(e.target.value)} required />
                            </Form.Group>
                        </Form></Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>Close</Button>
                            <Button variant="primary" onClick={createNewBoardHandler}>Create</Button>
                        </Modal.Footer>
                    </Modal>

                    <Row>
                        {boards.map(board =>
                            <Link to={'/' + board['_id']}>
                                <Card style={{ width: '18rem', margin: '24px' }}>
                                    <Card.Body>
                                        <Card.Title>{board['title']}</Card.Title>

                                    </Card.Body>
                                </Card>
                            </Link>
                        )}
                    </Row>
                </div>
            </Container >
        );
    } else {
        return (<Redirect to="/login" />);
    }
}

export default Home;

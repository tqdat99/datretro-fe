import { callAPI, getCookie, quickCheckToken } from "../helpers";
import { Redirect } from 'react-router-dom';
import { Container, Row, Button, Modal, Form } from "react-bootstrap";
import React, { useEffect, useState, Component } from "react";
import { config } from "../config";
import Header from "./header";

import Board from 'react-trello'

const axios = require('axios');
const qs = require('querystring');

const data = {}

function MyBoard(props) {
    const logined = quickCheckToken();
    //const [detail, setDetail] = useState([]);
    const [boardName, setBoardName] = useState();
    const boardId = props.match.params.boardId;
    const [renameModalShow, setRenameModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [newBoardTitle, setNewBoardTitle] = useState("");
    const handleCloseRenameModal = () => setRenameModalShow(false);
    const handleShowRenameModal = () => setRenameModalShow(true);
    const handleCloseDeleteModal = () => setDeleteModalShow(false);
    const handleShowDeleteModal = () => setDeleteModalShow(true);
    const [boardData, setBoardData] = useState({
        lanes: [
            {
                id: "went-well",
                title: "Went Well",
                cards: []
            },
            {
                id: "to-improve",
                title: "To Improve",
                cards: []
            },
            {
                id: "action-items",
                title: "Action Items",
                cards: []
            },
        ]
    });


    const requestBody = {
        title: newBoardTitle,
    }

    const reqConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    let mounted = true;

    useEffect(async () => {
        loadBoardData();
        return () => {
            mounted = false;
        };
    }, []);

    const loadBoardData = async () => {
        await axios.get(`${config.api_url}/boards/${boardId}`)
            .then(async (res) => {
                setBoardName(res.data["title"]);
                await axios.get(`${config.api_url}/boards/${boardId}/cards`)
                    .then((res) => {
                        for (let item of res.data) {
                            let card = {
                                id: item._id,
                                title: item.title,
                                description: item.content,
                            };
                            boardData.lanes.find(x => x.id === item.column).cards.push(card);
                        }
                        console.log(boardData);
                        if (mounted) {
                            setBoardData(boardData);
                            mounted = false;
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const shouldReceiveNewData = (nextData) => {
        // console.log("shouldReceiveNewData");
        // console.log('New card has been added')
        // console.log(nextData)
    }

    const handleCardAdd = (card, laneId) => {

        const requestBody = {
            boardId: boardId,
            title: card['title'],
            content: card['description'],
            column: laneId
        }

        const reqConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        console.log(requestBody);

        axios.post(`${config.api_url}/cards/create`, qs.stringify(requestBody), reqConfig)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleCardDelete = (card, laneId) => {
        axios.delete(`${config.api_url}/cards/${card}/delete`)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleDeleteBoard = () => {
        axios.delete(`${config.api_url}/boards/${boardId}/delete`)
            .then((res) => {
                window.location.href = '/';
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleRenameBoard = () => {
        console.log("clicked");
        axios.patch(`${config.api_url}/boards/${boardId}/update`, qs.stringify(requestBody), reqConfig)
            .then((res) => {
                window.location.reload(false);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    if (logined) {
        return (
            <Container fluid>
                <Header />
                <div style={{ margin: "80px" }}>
                    <div>
                        <span style={{ fontSize: "30px" }}>{boardName}</span>
                        <Button style={{ marginLeft: "24px" }} variant="secondary" onClick={handleShowRenameModal}>Rename board</Button>
                        <Modal show={renameModalShow} onHide={handleCloseRenameModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Rename board</Modal.Title>
                            </Modal.Header>
                            <Modal.Body><Form>
                                <Form.Group controlId="boardTitle">
                                    <Form.Label>New board title</Form.Label>
                                    <Form.Control required type="text" placeholder="New board title" defaultValue={boardName} onChange={e => setNewBoardTitle(e.target.value)} />
                                </Form.Group>
                            </Form></Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseRenameModal}>Close</Button>
                                <Button variant="primary" onClick={handleRenameBoard}>Save</Button>
                            </Modal.Footer>
                        </Modal>

                        <Button style={{ marginLeft: "24px" }} variant="danger" onClick={handleShowDeleteModal}>Delete board</Button>
                        <Modal show={deleteModalShow} onHide={handleCloseDeleteModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Delete board</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Delete {boardName}</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseDeleteModal}>Close</Button>
                                <Button variant="danger" onClick={handleDeleteBoard}>Delete</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                    <Row style={{ margin: "40px 0 0 0 ", display: "block" }}>
                        <Board
                            editable
                            onCardAdd={handleCardAdd}
                            data={boardData}
                            onDataChange={shouldReceiveNewData}
                            //eventBusHandle={setEventBus}
                            onCardDelete={handleCardDelete}
                        />
                    </Row>
                </div>
            </Container>
        )
    }
    else {
        window.location.href = '/';
    }
}

const addEditEntryPoint = () => {
    console.log("addEditEntryPoint");
    var x = document.getElementsByClassName("smooth-dnd-draggable-wrapper");
    console.log(x);
}



export default MyBoard

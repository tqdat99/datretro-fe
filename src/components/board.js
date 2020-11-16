import { getCookie, checkToken, setCookie } from "../helpers";
import { Redirect } from 'react-router-dom';
import { Container, Row, Button, Modal, Form, CardColumns } from "react-bootstrap";
import React, { useEffect, useState, Component } from "react";
import { config } from "../config";
import Header from "./header";

import Board from 'react-trello'

const axios = require('axios');
const qs = require('querystring');

const data = {}

function MyBoard(props) {
    const logined = checkToken();

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

    const [boardTitle, setBoardTitle] = useState();
    const boardId = props.match.params.boardId;
    const [renameModalShow, setRenameModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [newBoardTitle, setNewBoardTitle] = useState("");
    const handleCloseRenameModal = () => setRenameModalShow(false);
    const handleShowRenameModal = () => setRenameModalShow(true);
    const handleCloseDeleteModal = () => setDeleteModalShow(false);
    const handleShowDeleteModal = () => setDeleteModalShow(true);

    const [cardId, setCardId] = useState();
    const [cardTitle, setCardTitle] = useState();
    const [cardContent, setCardContent] = useState();
    const [cardColumn, setCardColumn] = useState();
    const [newCardTitle, setNewCardTitle] = useState();
    const [newCardContent, setNewCardContent] = useState();
    const [newCardColumn, setNewCardColumn] = useState();
    const [editCardModalShow, setEditCardModalShow] = useState(false);
    const handleCloseEditCardModal = () => setEditCardModalShow(false);
    const handleShowEditCardModal = () => setEditCardModalShow(true);

    const [mounted, setMounted] = useState(true);

    useEffect(() => {
        if (mounted) {
            //Get board data (title and cards)
            axios.get(`${config.api_url}/boards/${boardId}`)
                .then(async (res) => {
                    setBoardTitle(res.data["title"]);
                    axios.get(`${config.api_url}/boards/${boardId}/cards`)
                        .then((res) => {
                            for (let item of res.data) {
                                let card = {
                                    id: item._id,
                                    title: item.title,
                                    description: item.content,
                                };
                                boardData.lanes.find(x => x.id === item.column).cards.push(card);
                            }
                            console.log('boardData:', boardData);
                            setBoardData(boardData);
                            setMounted(false);
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, []);

    const reloadBoardData = () => {
        let newBoardData = {
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
        };
        axios.get(`${config.api_url}/boards/${boardId}`)
            .then(async (res) => {
                setBoardTitle(res.data["title"]);
                axios.get(`${config.api_url}/boards/${boardId}/cards`)
                    .then((res) => {
                        for (let item of res.data) {
                            let card = {
                                id: item._id,
                                title: item.title,
                                description: item.content,
                            };
                            newBoardData.lanes.find(x => x.id === item.column).cards.push(card);
                        }
                        console.log('newBoardData:', newBoardData);
                        setBoardData(newBoardData);
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
        // console.log('New card has been added');
        // console.log('here:', nextData);
        //reloadBoardData();

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
                reloadBoardData();
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleCardDelete = (card, laneId) => {
        axios.delete(`${config.api_url}/cards/${card}/delete`)
            .then((res) => {
                reloadBoardData();
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
        const requestBody = {
            title: newBoardTitle || boardTitle,
        }

        const reqConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        axios.patch(`${config.api_url}/boards/${boardId}/update`, qs.stringify(requestBody), reqConfig)
            .then((res) => {
                reloadBoardData();
                handleCloseRenameModal();
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleCardClick = (cardId, metadata, laneId) => {
        let selectedCard = findCardByIdInBoardData(cardId);
        setCardId(selectedCard['id']);
        setCardTitle(selectedCard['title'])
        setCardContent(selectedCard['description']);
        setCardColumn(selectedCard['column']);
        handleShowEditCardModal();
    }

    const findCardByIdInBoardData = (cardId) => {
        var i, j;
        for (i = 0; i < 3; i++) {
            for (j = 0; j < boardData.lanes[i].cards.length; j++) {
                if (boardData.lanes[i].cards[j]['id'] == cardId) {
                    boardData.lanes[i].cards[j]['column'] = boardData.lanes[i]['id'];
                    return boardData.lanes[i].cards[j];
                }
            }
        }
        return null;
    }

    const handleDragStart = (cardId, laneId) => {
        //console.log('handleDragStart', cardId, laneId);
    }

    const handleDragEnd = (cardId, sourceLaneId, targetLaneId, position, cardDetails) => {
        //console.log('handleDragEnd', cardId, sourceLaneId, targetLaneId, position, cardDetails);
        const requestBody = {
            title: cardDetails['title'],
            content: cardDetails['description'],
            column: cardDetails['laneId']
        }
        const reqConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        axios.patch(`${config.api_url}/cards/${cardDetails['id']}/update`, qs.stringify(requestBody), reqConfig)
            .then((res) => {
                reloadBoardData();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const handleEditCard = () => {
        const requestBody = {
            title: newCardTitle || cardTitle,
            content: newCardContent || cardContent,
            column: newCardColumn || cardColumn
        }
        const reqConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        console.log('here:', cardId);
        axios.patch(`${config.api_url}/cards/${cardId}/update`, qs.stringify(requestBody), reqConfig)
            .then((res) => {
                reloadBoardData();
                handleCloseEditCardModal();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    if (logined) {
        return (
            <Container fluid>
                <Header />
                <div style={{ margin: "80px" }}>
                    <div>
                        <span style={{ fontSize: "30px" }}>{boardTitle}</span>
                        <Button style={{ marginLeft: "24px" }} variant="secondary" onClick={handleShowRenameModal}>Rename board</Button>
                        <Modal show={renameModalShow} onHide={handleCloseRenameModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Rename board</Modal.Title>
                            </Modal.Header>
                            <Modal.Body><Form>
                                <Form.Group controlId="boardTitle">
                                    <Form.Label>New board title</Form.Label>
                                    <Form.Control required type="text" placeholder="New board title" defaultValue={boardTitle} onChange={e => setNewBoardTitle(e.target.value)} />
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
                                <p>Delete {boardTitle}</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseDeleteModal}>Close</Button>
                                <Button variant="danger" onClick={handleDeleteBoard}>Delete</Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={editCardModalShow} onHide={handleCloseEditCardModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit card</Modal.Title>
                            </Modal.Header>
                            <Modal.Body><Form>
                                <Form.Group>
                                    <Form.Label>Card title</Form.Label>
                                    <Form.Control required type="text" defaultValue={cardTitle} onChange={e => setNewCardTitle(e.target.value)} />
                                    <Form.Label>Content</Form.Label>
                                    <Form.Control required type="text" defaultValue={cardContent} onChange={e => setNewCardContent(e.target.value)} />
                                </Form.Group>
                            </Form></Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseEditCardModal}>Close</Button>
                                <Button variant="primary" onClick={handleEditCard}>Save</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                    <Row style={{ margin: "40px 0 0 0 ", display: "block" }}>
                        <Board
                            editable={true}
                            draggable={true}
                            laneDraggable={false}
                            cardDraggable={true}
                            onCardAdd={handleCardAdd}
                            data={boardData}
                            onDataChange={shouldReceiveNewData}
                            onCardClick={handleCardClick}
                            onCardDelete={handleCardDelete}
                            handleDragStart={handleDragStart}
                            handleDragEnd={handleDragEnd}
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

export default MyBoard
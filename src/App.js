import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Row, Col, Form, FormGroup, Input } from 'reactstrap'
import Socket from './utilities/Socket'

const App = () => {
  const [message, setMessage] = useState('')
  const [username, SetUsername] = useState('')
  const [onlineUsers, SetOnlineUsers] = useState([])
  const [chat, setChat] = useState([])

  const inputBox = (e) => {
    setMessage(e.target.value)
  }

  useEffect(() => {
    Socket.emit('NEW_USER')

    Socket.on("GET_CURRENT_USER", user => {
      SetUsername(user.username)
    })

    Socket.on('UPDATE_USER_LIST', users => {
      SetOnlineUsers(users)
    })

  }, [])

  const addNewMessage = e => {
    e.preventDefault()
    if (message === '') {
      alert('Enter something!')
      setMessage('')
    } else {
      const timeNow = Date.now()
      let data = {
        username: username,
        message: message,
        timestamp: timeNow
      }
      Socket.emit('BROADCAST_MESSAGE', data)
      setMessage('');
    }
  }

  Socket.on('RECEIVE_BROADCAST', fromChat => {
    setChat([...chat, fromChat])

  })

  return (
    <>
      <Container fluid>
        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <h1>Next Chatroom</h1><hr className="line" />
          </Col>
        </Row>
        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <h3 className="dark">Online users</h3>
            {onlineUsers.map((onlineUser, index) => {
              return (
                <h5 key={index}>{onlineUser.username}</h5>
              )
            })}
            <hr className="line" />
          </Col>
        </Row>
        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <h3 className="dark">Message Board</h3>
            {chat.map((log, index) => {
              return (
                <div className="messageContainer" key={index}>
                  <h2 className="underline">{log.username}</h2>
                  <h3>{log.message}</h3>
                  <hr className="line" />
                  <h6>{Date(log.timestamp)}</h6>
                </div>
              )
            })}
            <hr className="line" />
          </Col>
        </Row>

        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Form onSubmit={addNewMessage}>
              <FormGroup>
                <Input type="textarea" name="text" id="exampleText" onChange={inputBox} value={message} />
                <button className="btn btn-secondary">Add Message</button>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Container>

    </>
  )
}

export default App;

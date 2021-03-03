import axios from 'axios';
import { useEffect, useReducer } from 'react';
import './App.css';
import { Chat } from './components/Chat';
import { JoinBlock } from './components/JoinBlock';
import reducer from './reducer'
import socket from './socket'

export function App() {

  const [state, dispatch] = useReducer(reducer, {
    roomId: null,
    userName: null,
    isAuth: false,
    users: [],
    messages: []
  })

  const addPerson = users => {
    dispatch({
      type: 'ADD_PERSON',
      payload: users
    })
  }

  useEffect(() => {
    socket.on('ROOM:JOINED', addPerson)
    socket.on('ROOM:LEAVE', addPerson)
    socket.on('ROOM:NEW_MESSAGE', onAddMessage)
  }, [])

  const onLogin = async obj => {
    dispatch({
      type: 'IS_AUTH',
      payload: obj
    })

    const { data } = await axios.get(`/rooms/${obj.roomId}`)
    addPerson(data.users)
  }

  const onAddMessage = obj => {
    dispatch({
      type: 'SEND_MESSAGE',
      payload: obj
    })
  }

  return (
    <div className="wrapper">
      {!state.isAuth ? <JoinBlock onLogin={onLogin} /> : <Chat {...state} onAddMessage={onAddMessage} />}
    </div>
  );
}


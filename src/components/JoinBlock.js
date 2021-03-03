import axios from 'axios'
import React, { useState } from 'react'
import socket from '../socket'

export const JoinBlock = ({ onLogin }) => {

    const [roomId, setRoomId] = useState('')
    const [userName, setUserName] = useState('')
    const [isLoading, setLoading] = useState(false)

    const onEnter = async () => {
        if (!roomId || !userName) {
            alert('Некоректные данные')
        }
        const obj = {
            roomId,
            userName
        }
        setLoading(true)
        await axios.post('/rooms', { roomId, userName })
        onLogin(obj)
        socket.emit('ROOM:JOIN', obj)
    }

    return (
        <div className='join-block'>
            <input
                type='text'
                placeholder='Room ID'
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
            />
            <input
                type='text'
                placeholder='Ваше имя'
                value={userName}
                onChange={e => setUserName(e.target.value)}
            />
            <button disabled={isLoading} onClick={onEnter} className='btn btn-success'>
                {!isLoading ? 'ВХОД' : '...ВХОД'}
            </button>
        </div>
    )
}
import React, { useEffect } from 'react';
import socket from '../socket';

export function Chat({ roomId, users, messages, onAddMessage, userName }) {
    const [messageValue, setMessageValue] = React.useState('');
    const messagesRef = React.useRef(null);

    const sendMessage = () => {
        socket.emit('ROOM:NEW_MESSAGE', {
            text: messageValue,
            userName,
            roomId
        })
        onAddMessage({ text: messageValue, userName })
        setMessageValue('')
    }

    useEffect(() => {
        messagesRef.current.scrollTo(0, 999999)
    }, [messages])

    return (
        <div className="chat">
            <div className="chat-users">
                Комната: <b>{roomId}</b>
                <hr />
                <b>Онлайн ({users.length}):</b>
                <ul>
                    {users.map(name => {
                        return <li>{name}</li>
                    })}
                </ul>
            </div>
            <div className="chat-messages">
                <div ref={messagesRef} className="messages">
                    {
                        messages.map(message => {
                            return (
                                <div className="message">
                                    <p>{message.text}</p>
                                    <div>
                                        <span>{message.userName}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <form>
                    <textarea
                        value={messageValue}
                        onChange={e => setMessageValue(e.target.value)}
                        className="form-control"
                        rows="3"></textarea>
                    <button onClick={sendMessage} type="button" className="btn btn-primary">
                        Отправить
          </button>
                </form>
            </div>
        </div>
    );
}
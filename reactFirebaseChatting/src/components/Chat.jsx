// src/Chat.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  doc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';

function Chat({ currentUser, chatUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const chatId = getChatId();
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });

    return () => unsubscribe();
  }, [currentUser, chatUser]);

  const getChatId = () => {
    return [currentUser.uid, chatUser.uid].sort().join('_');
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const chatId = getChatId();
    const messagesRef = collection(db, 'chats', chatId, 'messages');

    await addDoc(messagesRef, {
      text: input,
      sender: currentUser.uid,
      timestamp: serverTimestamp()
    });

    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img src={chatUser.photoURL || 'default-avatar.png'} alt={chatUser.displayName} />
        <h2>{chatUser.displayName}</h2>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === currentUser.uid ? 'sent' : 'received'}`}
          >
            <div className="message-content">{message.text}</div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="chat-form">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지 보내기..."
        />
        <button type="submit" disabled={input.trim() === ''}>보내기</button>
      </form>
    </div>
  );
}

export default Chat;

// src/App.jsx
import React, { useState } from 'react';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [currentUser] = useState({ uid: 'user1' }); // 현재 사용자
  const [chatUser] = useState({ uid: 'user2' });    // 채팅 상대

  return (
    <div className="App">
      <h1>Instagram DM Clone</h1>
      <Chat currentUser={currentUser} chatUser={chatUser} />
    </div>
  );
}

export default App;

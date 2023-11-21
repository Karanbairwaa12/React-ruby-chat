import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import Profile from './Profile';
import io from 'socket.io-client'
import App from './App';
// const socket = io.connect("http://localhost:3001")
export default function ChatWindow() {
  const [username, setUsername] = useState("")
  // const [room, setRoom] = useState("")
  const [showChat, setShowChat] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  
  const handleProfile = ()=> {
    setShowProfile(!showProfile)
  }
  const joinRoom =() => {
    
      // socket.emit("join_room",123)
      setShowChat(true)
  }
  return (
    <>
      <div className='w-[96%] h-full flex shadow[0px_0px_1px_0px_rgba(0, 0, 0, 0.15)]'>
        <div className='w-full h-full flex'>
        {
        !showChat ? (
          <div className="join-chat">
            <h3>Join a Chat</h3>
            <input
            type="text"
            placeholder="jhon...."
            onChange={(event) => {
              setUsername(event.target.value)
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter" || event.keyCode === 13) {
                joinRoom();
              }
            }}
            />
            <button onClick={joinRoom}>Join</button>
          </div>
      
          ): (
            <App username={username} handleProfile={handleProfile} showProfile={showProfile}/>
          )
        }
        {
          showProfile && <Profile/>
        } 
        
        </div>
      </div>
    </>
  )
}

// import { useState, useEffect } from "react";
// import "./App.css";

// const ws = new WebSocket("ws://localhost:3000/cable");

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [guid, setGuid] = useState("");
//   const messagesContainer = document.getElementById("messages");

//   ws.onopen = () => {
//     console.log("Connected to websocket server");
//     setGuid(Math.random().toString(36).substring(2, 15));

//     ws.send(
//       JSON.stringify({
//         command: "subscribe",
//         identifier: JSON.stringify({
//           id: guid,
//           channel: "MessagesChannel",
//         }),
//       })
//     );
//   };

//   ws.onmessage = (e) => {
//     const data = JSON.parse(e.data);
//     if (data.type === "ping") return;
//     if (data.type === "welcome") return;
//     if (data.type === "confirm_subscription") return;

//     const message = data.message;
//     setMessagesAndScrollDown([...messages, message]);
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   useEffect(() => {
//     resetScroll();
//   }, [messages]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const body = e.target.message.value;
//     e.target.message.value = "";

//     await fetch("http://localhost:3000/messages", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ body }),
//     });
//   };

//   const fetchMessages = async () => {
//     const response = await fetch("http://localhost:3000/messages");
//     const data = await response.json();
//     setMessagesAndScrollDown(data);
//   };

//   const setMessagesAndScrollDown = (data) => {
//     setMessages(data);
//     resetScroll();
//   };

//   const resetScroll = () => {
//     if (!messagesContainer) return;
//     messagesContainer.scrollTop = messagesContainer.scrollHeight;
//   };

//   return (
//     <div className="App">
//       <div className="messageHeader">
//         <h1>Messages</h1>
//         <p>Guid: {guid}</p>
//       </div>
//       <div className="messages" id="messages">
//         {messages.map((message) => (
//           <div className="message" key={message.id}>
//             <p>{message.body}</p>
//           </div>
//         ))}
//       </div>
//       <div className="messageForm">
//         <form onSubmit={handleSubmit}>
//           <input className="messageInput" type="text" name="message" />
//           <button className="messageButton" type="submit">
//             Send
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default App;







// import { useState, useEffect } from "react";
// import ActionCable from "actioncable";
// import "./App.css";

// const cable = ActionCable.createConsumer("ws://localhost:3000/cable");

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [guid, setGuid] = useState("");

//   useEffect(() => {
//     // Open the WebSocket connection
//     const subscription = cable.subscriptions.create(
//       { channel: "MessagesChannel" },
//       {
//         connected: () => {
//           console.log("Connected to Action Cable server");
//           setGuid(Math.random().toString(36).substring(2, 15));
//         },
//         received: (data) => {
//           const message = data.message;
//           setMessagesAndScrollDown([...messages, message]);
//         },
//       }
//     );

//     // Fetch initial messages
//     fetchMessages();

//     // Clean up WebSocket connection when component unmounts
//     return () => {
//       subscription.unsubscribe();
//     };
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const body = e.target.message.value;
//     e.target.message.value = "";

//     await fetch("http://localhost:3000/messages", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ body }),
//     });
//   };

//   const fetchMessages = async () => {
//     const response = await fetch("http://localhost:3000/messages");
//     const data = await response.json();
//     setMessagesAndScrollDown(data);
//   };

//   const setMessagesAndScrollDown = (data) => {
//     setMessages(data);
//     resetScroll();
//   };

//   const resetScroll = () => {
//     const messagesContainer = document.getElementById("messages");
//     if (messagesContainer) {
//       messagesContainer.scrollTop = messagesContainer.scrollHeight;
//     }
//   };

//   return (
//     <div className="App">
//       <div className="messageHeader">
//         <h1>Messages</h1>
//         <p>Guid: {guid}</p>
//       </div>
//       <div className="messages" id="messages">
//         {messages.map((message) => (
//           <div className="message" key={message.id}>
//             <p>{message.body}</p>
//           </div>
//         ))}
//       </div>
//       <div className="messageForm">
//         <form onSubmit={handleSubmit}>
//           <input className="messageInput" type="text" name="message" />
//           <button className="messageButton" type="submit">
//             Send
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default App;








import React, { useState, useEffect } from 'react';
import ActionCable from 'actioncable';

const cable = ActionCable.createConsumer('ws://localhost:3000/cable');

const App = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const room =123
  useEffect(() => {
    const channel = cable.subscriptions.create(
      { channel: 'MessagesChannel', room: room },
      {
        connected() {
          console.log(`Connected to Action Cable in room: ${room}`);
          // Join the room when connected
          channel.perform('join_room', { room: room });
        },
        disconnected() {
          console.log('Disconnected from Action Cable');
          // Leave the room when disconnected
          channel.perform('leave_room', { room: room });
        },
        received(data) {
          console.log('Received data from Action Cable:', data);
          setMessages((prevMessages) => [...prevMessages, data.content]);
        },
      }
    );

    return () => {
      // Leave the room when the component unmounts
      channel.perform('leave_room', { room: room });
      channel.unsubscribe();
    };
  }, [room]);

  const sendMessage = () => {
    cable.subscriptions.subscriptions[0].perform('send_message', { message: newMessage, room: '123' });
    setNewMessage('');
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <>
          {console.log(message)}
          <div key={index}>{message}</div>
          </>
          
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;
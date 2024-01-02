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
import { AiOutlinePushpin } from "react-icons/ai";
import ReactQuill from "react-quill";
import ActionCable from 'actioncable';

const cable = ActionCable.createConsumer('ws://localhost:3000/cable');

const App = () => {
  const [username, setUsername] = useState("")
  // const [room, setRoom] = useState("")
  const [showChat, setShowChat] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [text, setText] = useState('');
  const [messageList, setMessageList] = useState([])
  const [room, setRoom] = useState(null)
  const author = "karan"

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      sendMessage(); // Call the sendMessage function only when Enter is pressed without Shift
    }
  };

  const sendMessage = async () => {
    if (text !== '') {
      const messageData = {
        room: room,
        author: username,
        message: text,
      };

      try {
        console.log("sendddingg///////")
        await cable.subscriptions.subscriptions[0].perform('send_message', messageData);
        console.log(messageData)
        // setMessageList((list) => [...list, messageData]);
        setText('');
      } catch (err) {
        console.log(err);
      }
    }
  };
  const handleChange = (value) => {
    setText(value);
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'font',
    'list',
    'bold',
    'italic',
    'underline',
    'link',
    'image',
  ];

  const joinRoom =() => {
    
    // socket.emit("join_room",123)
    setShowChat(true)
}
  useEffect(() => {
    const channel = cable.subscriptions.create(
      { channel: 'MessagesChannel', room: room },
      {
        connected() {
          console.log(`Connected to Action Cable in room: ${room}`);
          channel.perform('join_room', { room: room });
        },
        disconnected() {
          console.log('Disconnected from Action Cable');
          channel.perform('leave_room', { room: room });
        },
        received(data) {
          console.log("this is data",data)
          setMessageList((list) => [...list, data]);
        },
      }
    );

    return () => {
      // Leave the room when the component unmounts
      channel.perform('leave_room', { room: room });
      channel.unsubscribe();
    };
  }, [room]);

  // const sendMessage = () => {
  //   cable.subscriptions.subscriptions[0].perform('send_message', { message: newMessage, room: '123', author: 'karan' });
  //   setNewMessage('');
  // };

  return (
    // <div className='text-tahiti'>
    //   <div>
    //     {messages.map((message, index) => (
    //       <>
    //       {console.log(message)}
    //       <div key={index}>{message}</div>
    //       </>
          
    //     ))}
    //   </div>
    //   <div>
    //     <input
    //       type="text"
    //       value={newMessage}
    //       onChange={(e) => setNewMessage(e.target.value)}
    //     />
    //     <button onClick={sendMessage}>Send</button>
    //   </div>
    // </div>
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
            <input
            type="text"
            placeholder="room...."
            value={room}
            onChange={(event) => {
              setRoom(event.target.value)
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
            <div className={`w-full h-[48.625rem] flex flex-col justify-start items-start bg-[#fff] rounded-lg shadow-[0_0px_10px_0px] shadow-black/10`}>
                <div className="w-full h-[4.5rem] p-5 flex justify-between items-center space-x-2 border-b-[1px] border-[#f3f3f3]">
                  <div className="w-full flex space-x-2 cursor-pointer">
                    <div className="w-full flex flex-col">
                      <h4 className="text-[#191919]">{username}</h4>
                      <h6 className="text-xs text-[#A1A1A1]">Active Now</h6>
                    </div>
                  </div>
                  <div className="w-full h-full flex items-center justify-end">
                    <button type="submit" className="w-[2.313rem] h-[2.313rem] flex items-center justify-center rounded-[30px] border border-[#f3f3f3]">
                      <AiOutlinePushpin className="w-6 h-6"/>
                    </button>
                  </div>
                </div>
                <div className="h-2/4 overflow-y-scroll no-scrollbar display-none w-full" style={{display:"nonexo"}}>
                  {
                      messageList.map((item,i)=> {
                        return (
                          <div className={username === item.author ?"w-full flex justify-end items-center px-5":"w-full flex justify-start items-center px-5 "}
                          >
                            {/* {console.log("this is my items",item)}
                            {console.log(messageList)} */}
                            <div dangerouslySetInnerHTML={{__html:item.content}}/>
                          </div>
                        )
                      })
                      
                    }
                    <>
                    {console.log(messageList)}
                    </>
                  </div>
                  <div className="w-full p-5">
                    <form>
                      <textarea
                        className="border border-black"
                        name="message"
                        value={text}
                        onChange={(e) => handleChange(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e)}
                      />
                      <button className="messageButton" type="submit">
                        Send
                      </button>
                    </form>
                  </div>
            </div>
          )
        }
       
        
        </div>
      </div>
    </>
    
  );
};

export default App;
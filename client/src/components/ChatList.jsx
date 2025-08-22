// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import PropTypes from "prop-types";

// const BACKEND_URL = import.meta.env.PROD
//   ? "https://thread-1yni.onrender.com"
//   : "http://localhost:5000";

// const ChatList = ({ currentUserId }) => {
//   const [chatUsers, setChatUsers] = useState([]);
//   const listRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!currentUserId) return;

//     const fetchChats = async () => {
//       try {
//         const res = await axios.get(
//           `${BACKEND_URL}/api/message/user-chats/${currentUserId}`,
//           { withCredentials: true }
//         );
//         // Logging response to confirm API data
//         console.log("getUserChats response:", res.data.users);
//         setChatUsers(res.data.users || []);
//       } catch (err) {
//         console.error("Failed to load chat users", err);
//       }
//     };

//     fetchChats();
//   }, [currentUserId]);

//   const openChat = (userId) => {
//     navigate(`/chat/${userId}`);
//   };

//   const openProfile = (userId) => {
//     navigate(`/profile/${userId}`);
//   };

//   return (
//     <div
//       ref={listRef}
//       style={{
//         width: "300px",
//         borderRight: "1px solid #ccc",
//         height: "100vh",
//         overflowY: "auto",
//         padding: "1rem",
//         backgroundColor: "#f9f9f9",
//         scrollbarWidth: "thin",
//       }}
//     >
//       <h3 style={{ textAlign: "center" }}>Chats</h3>
//       {chatUsers.length === 0 ? (
//         <p style={{ textAlign: "center" }}>No chats yet</p>
//       ) : (
//         chatUsers.map((chat) => (
//           <div
//             key={chat._id}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//               padding: "10px",
//               cursor: "pointer",
//               borderBottom: "1px solid #ddd",
//               borderRadius: "8px",
//               background: "#fff",
//               transition: "background 0.2s",
//             }}
//             onClick={() => openChat(chat._id)}
//           >
//             <img
//               src={
//                 chat.profilePic?.startsWith("http")
//                   ? chat.profilePic
//                   : `${BACKEND_URL}/${chat.profilePic}`
//               }
//               alt={chat.userName}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 openProfile(chat._id);
//               }}
//               style={{
//                 width: 45,
//                 height: 45,
//                 borderRadius: "50%",
//                 objectFit: "cover",
//                 border: "2px solid #ccc",
//               }}
//             />
//             <div>
//               <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
//                 {chat.userName}
//               </div>
//               <div style={{ fontSize: "0.8rem", color: "gray" }}>
//                 {chat.lastMessage || "Start conversation"}
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// ChatList.propTypes = {
//   currentUserId: PropTypes.string.isRequired,
// };

// export default ChatList;

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

const BACKEND_URL = import.meta.env.PROD
  ? "https://thread-1yni.onrender.com"
  : "http://localhost:5000";

const ChatList = ({ currentUserId }) => {
  const [chatUsers, setChatUsers] = useState([]);
  const listRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUserId) return;

    const fetchChats = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/message/user-chats/${currentUserId}`,
          { withCredentials: true }
        );
        setChatUsers(res.data.users || []);
      } catch (err) {
        console.error("Failed to load chat users", err);
      }
    };

    fetchChats();
  }, [currentUserId]);

  const openChat = (userId) => {
    navigate(`/chat/${userId}`);
  };

  const openProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div
      ref={listRef}
      style={{
        width: "100%",
        maxWidth: "350px", // Same as sidebar in Home.jsx
        borderRight: "1px solid #e0e0e0",
        height: "100vh",
        overflowY: "auto",
        padding: "1rem",
        backgroundColor: "#ffffff",
        scrollbarWidth: "thin",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#222" }}>
        Chats
      </h2>
      {chatUsers.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777" }}>No chats yet</p>
      ) : (
        chatUsers.map((chat) => (
          <div
            key={chat._id}
            onClick={() => openChat(chat._id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px",
              marginBottom: "8px",
              cursor: "pointer",
              borderRadius: "10px",
              backgroundColor: "#f5f5f5",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#eaeaea")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#f5f5f5")
            }
          >
            <img
              src={
                chat.profilePic?.startsWith("http")
                  ? chat.profilePic
                  : `${BACKEND_URL}/${chat.profilePic}`
              }
              alt={chat.userName}
              onClick={(e) => {
                e.stopPropagation();
                openProfile(chat._id);
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ddd",
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "1rem", color: "#333" }}>
                {chat.userName}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#666" }}>
                {chat.lastMessage?.slice(0, 30) || "Start conversation"}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

ChatList.propTypes = {
  currentUserId: PropTypes.string.isRequired,
};

export default ChatList;

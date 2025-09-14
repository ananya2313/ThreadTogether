
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import PropTypes from "prop-types";
import io from "socket.io-client";

// const BACKEND_URL = "http://localhost:5000";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ChatList = ({ currentUserId }) => {
  const [chatUsers, setChatUsers] = useState([]);
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const { darkMode } = useSelector((state) => state.service);

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

    // Initialize socket once
    if (!socketRef.current) {
      socketRef.current = io(BACKEND_URL);
    }
    const socket = socketRef.current;
    socket.emit("user_connected", currentUserId);

    const handleNewMessage = (msg) => {
      if (msg.senderId === currentUserId || msg.receiverId === currentUserId) {
        fetchChats();
      }
    };

    socket.on("receive_message", handleNewMessage);

    return () => {
      socket.off("receive_message", handleNewMessage);
    };
  }, [currentUserId]);

  const openChat = (userId) => navigate(`/chat/${userId}`);
  const openProfile = (userId) => navigate(`/profile/${userId}`);

  const containerStyle = {
    width: "100%",
    maxWidth: "350px",
    borderRight: darkMode 
      ? "1px solid rgba(255, 255, 255, 0.1)" 
      : "1px solid rgba(102, 126, 234, 0.1)",
    height: "100vh",
    overflowY: "auto",
    padding: "1rem",
    background: darkMode
      ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)"
      : "linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%)",
    scrollbarWidth: "thin",
    scrollbarColor: darkMode 
      ? "rgba(102, 126, 234, 0.3) rgba(15, 23, 42, 0.1)"
      : "rgba(102, 126, 234, 0.3) rgba(248, 250, 252, 0.1)",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: darkMode ? "#e2e8f0" : "#667eea",
    fontSize: "1.5rem",
    fontWeight: 700,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textShadow: darkMode 
      ? "0 2px 10px rgba(102, 126, 234, 0.3)"
      : "0 2px 10px rgba(102, 126, 234, 0.2)",
  };

  const emptyChatStyle = {
    textAlign: "center",
    color: darkMode ? "#94a3b8" : "#64748b",
    fontSize: "1rem",
    padding: "2rem 1rem",
    background: darkMode
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(102, 126, 234, 0.05)",
    borderRadius: "16px",
    border: darkMode 
      ? "1px solid rgba(255, 255, 255, 0.1)" 
      : "1px solid rgba(102, 126, 234, 0.1)",
  };

  const getChatItemStyle = (isHovered) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    marginBottom: "12px",
    cursor: "pointer",
    borderRadius: "16px",
    background: isHovered
      ? (darkMode
        ? "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)"
        : "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)")
      : (darkMode
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(102, 126, 234, 0.05)"),
    border: darkMode 
      ? "1px solid rgba(255, 255, 255, 0.1)" 
      : "1px solid rgba(102, 126, 234, 0.1)",
    transition: "all 0.3s ease",
    transform: isHovered ? "translateY(-2px) scale(1.02)" : "translateY(0) scale(1)",
    boxShadow: isHovered
      ? (darkMode
        ? "0 8px 25px rgba(102, 126, 234, 0.3)"
        : "0 8px 25px rgba(102, 126, 234, 0.2)")
      : (darkMode
        ? "0 2px 10px rgba(0, 0, 0, 0.2)"
        : "0 2px 10px rgba(102, 126, 234, 0.1)"),
  });

  const profilePicStyle = {
    width: 48,
    height: 48,
    borderRadius: "50%",
    objectFit: "cover",
    transition: "all 0.3s ease",
    boxShadow: darkMode
      ? "0 4px 15px rgba(102, 126, 234, 0.3)"
      : "0 4px 15px rgba(102, 126, 234, 0.2)",
  };

  const userNameStyle = {
    fontWeight: 700,
    fontSize: "1rem",
    color: darkMode ? "#e2e8f0" : "#1e293b",
    marginBottom: "4px",
  };

  const lastMessageStyle = {
    fontSize: "0.85rem",
    color: darkMode ? "#94a3b8" : "#64748b",
    lineHeight: 1.4,
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Chats</h2>
      {chatUsers.length === 0 ? (
        <p style={emptyChatStyle}>No chats yet</p>
      ) : (
        chatUsers.map((chat) => {
          const isHovered = hoveredChatId === chat._id;
          
          return (
            <div
              key={chat._id}
              onClick={() => openChat(chat._id)}
              style={getChatItemStyle(isHovered)}
              onMouseEnter={() => setHoveredChatId(chat._id)}
              onMouseLeave={() => setHoveredChatId(null)}
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
                  ...profilePicStyle,
                  transform: isHovered ? "scale(1.1)" : "scale(1)",
                  border: isHovered 
                    ? "2px solid #667eea"
                    : (darkMode 
                      ? "2px solid rgba(102, 126, 234, 0.4)" 
                      : "2px solid rgba(102, 126, 234, 0.3)"),
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={userNameStyle}>
                  {chat.userName}
                </div>
                <div style={lastMessageStyle}>
                  {chat.lastMessage
                    ? chat.lastMessage.length > 30
                      ? chat.lastMessage.slice(0, 30) + "..."
                      : chat.lastMessage
                    : "Start conversation"}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

ChatList.propTypes = {
  currentUserId: PropTypes.string.isRequired,
};

export default ChatList;
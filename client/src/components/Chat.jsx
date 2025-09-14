import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { isToxicMessage } from "./../utils/isToxicMessage";

const BACKEND_URL = import.meta.env.PROD
  ? import.meta.env.VITE_BACKEND_URL
  : "http://localhost:5000";

const socket = io(BACKEND_URL);

const Chat = ({
  currentUserId,
  currentUserName,
  chatWithUserId,
  chatWithUserName,
  chatWithUserPic,
}) => {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [isToxic, setIsToxic] = useState(false);
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  const navigate = useNavigate();
  const containerRef = useRef();
  const inputRef = useRef();
  const endRef = useRef();
  const typingTimeoutRef = useRef();
  const { darkMode } = useSelector((state) => state.service);

  // Set room
  useEffect(() => {
    if (currentUserId && chatWithUserId) {
      const sorted = [currentUserId, chatWithUserId].sort();
      setRoom(`${sorted[0]}_${sorted[1]}`);
    }
  }, [currentUserId, chatWithUserId]);

  // Socket events
  useEffect(() => {
    if (!room) return;

    socket.emit("join_room", room);
    socket.emit("user_connected", currentUserId);
    socket.emit("check_online", chatWithUserId);

    const receiveHandler = (data) => setMessages((prev) => [...prev, data]);
    const typingHandler = (name) =>
      name !== currentUserName && setTypingUser(name);
    const stopTypingHandler = () => setTypingUser(null);
    const onlineHandler = ({ userId, online, lastSeenTs }) => {
      if (userId === chatWithUserId) {
        setIsOnline(online);
        if (!online && lastSeenTs) setLastSeen(new Date(lastSeenTs));
      }
    };
    const connectBroadcast = (userId) => {
      if (userId === chatWithUserId) socket.emit("check_online", userId);
    };
    const disconnectBroadcast = ({ userId, lastSeenTs }) => {
      if (userId === chatWithUserId) {
        setIsOnline(false);
        if (lastSeenTs) setLastSeen(new Date(lastSeenTs));
      }
    };

    socket.on("receive_message", receiveHandler);
    socket.on("user_typing", typingHandler);
    socket.on("user_stopped_typing", stopTypingHandler);
    socket.on("user_online_status", onlineHandler);
    socket.on("user_connected_broadcast", connectBroadcast);
    socket.on("user_disconnected_broadcast", disconnectBroadcast);

    return () => {
      socket.off("receive_message", receiveHandler);
      socket.off("user_typing", typingHandler);
      socket.off("user_stopped_typing", stopTypingHandler);
      socket.off("user_online_status", onlineHandler);
      socket.off("user_connected_broadcast", connectBroadcast);
      socket.off("user_disconnected_broadcast", disconnectBroadcast);
    };
  }, [room, currentUserId, currentUserName, chatWithUserId]);

  // Fetch initial messages
  useEffect(() => {
    if (!room) return;
    const fetchInitial = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/message/${room}?limit=20`,
          { withCredentials: true }
        );
        setMessages(res.data);
        if (res.data.length < 20) setHasMore(false);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchInitial();
  }, [room]);

  // Handle scrolling to fetch older messages
  const handleScroll = async () => {
    const el = containerRef.current;
    if (!el || el.scrollTop > 50 || !hasMore || loadingMore) return;
    setLoadingMore(true);
    const oldest = messages[0]?.timestamp;
    if (!oldest) return setLoadingMore(false);

    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/message/${room}?before=${oldest}&limit=20`,
        { withCredentials: true }
      );
      setMessages((prev) => [...res.data, ...prev]);
      if (res.data.length < 20) setHasMore(false);
    } catch (err) {
      console.error("Failed to load older messages", err);
    }
    setLoadingMore(false);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as seen
  useEffect(() => {
    if (!room || messages.length === 0) return;

    const unseen = messages.some(
      (msg) => msg.senderId === chatWithUserId && !msg.seen
    );
    if (!unseen) return;

    const markSeen = async () => {
      try {
        await axios.put(
          `${BACKEND_URL}/api/message/seen`,
          {
            senderId: chatWithUserId,
            receiverId: currentUserId,
          },
          { withCredentials: true }
        );
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === chatWithUserId ? { ...msg, seen: true } : msg
          )
        );
      } catch (err) {
        console.error("Failed to mark seen", err);
      }
    };

    markSeen();
  }, [messages, room, chatWithUserId, currentUserId]);

  const handleSend = async () => {
    if (!message.trim() || isToxic) return;

    const newMsg = {
      senderId: currentUserId,
      receiverId: chatWithUserId,
      message: message, // DB field
      text: message,    // For moderation
      room,
      timestamp: new Date().toISOString(),
    };

    // Emit socket
    socket.emit("send_message", { ...newMsg, senderName: currentUserName });
    socket.emit("stop_typing", { room });

    try {
      await axios.post(`${BACKEND_URL}/api/message`, newMsg, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Failed to save message", err);
    }

    setMessage("");
    setIsToxic(false);
  };

  // Typing handler
  const handleTyping = async (e) => {
    const inputText = e.target.value;
    setMessage(inputText);
    socket.emit("typing", { room, senderName: currentUserName });

    if (inputText.trim()) {
      const toxic = await isToxicMessage(inputText);
      setIsToxic(toxic);
    } else {
      setIsToxic(false);
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { room });
    }, 1500);
  };

  // Emoji handler
  const handleEmojiClick = (emojiData) => {
    const pos = inputRef.current.selectionStart;
    const newText =
      message.slice(0, pos) + emojiData.emoji + message.slice(pos);
    setMessage(newText);
    setTimeout(() => {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        pos + emojiData.emoji.length,
        pos + emojiData.emoji.length
      );
    }, 0);
  };
   
  
  // Styled components
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: darkMode
      ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)"
      : "linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%)",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: darkMode
      ? "0 20px 50px rgba(0, 0, 0, 0.3)"
      : "0 20px 50px rgba(102, 126, 234, 0.1)",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    padding: "16px 20px",
    background: darkMode
      ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
      : "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
    borderBottom: darkMode 
      ? "1px solid rgba(255, 255, 255, 0.1)" 
      : "1px solid rgba(102, 126, 234, 0.1)",
    backdropFilter: "blur(10px)",
  };

  const profileImageStyle = {
    width: 48,
    height: 48,
    borderRadius: "50%",
    cursor: "pointer",
    border: darkMode 
      ? "2px solid rgba(102, 126, 234, 0.4)" 
      : "2px solid rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s ease",
    boxShadow: darkMode
      ? "0 6px 20px rgba(102, 126, 234, 0.3)"
      : "0 6px 20px rgba(102, 126, 234, 0.2)",
  };

  const userNameStyle = {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: darkMode ? "#e2e8f0" : "#1e293b",
    marginBottom: "4px",
  };

  const statusStyle = {
    fontSize: "0.85rem",
    color: isOnline ? "#10b981" : (darkMode ? "#94a3b8" : "#64748b"),
    fontWeight: 500,
  };

  const messagesContainerStyle = {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    background: darkMode
      ? "linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 41, 59, 0.5) 100%)"
      : "linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%)",
    scrollbarWidth: "thin",
    scrollbarColor: darkMode 
      ? "rgba(102, 126, 234, 0.3) rgba(15, 23, 42, 0.1)"
      : "rgba(102, 126, 234, 0.3) rgba(248, 250, 252, 0.1)",
  };

  const getMessageStyle = (sent) => ({
    display: "flex",
    justifyContent: sent ? "flex-end" : "flex-start",
    marginBottom: "16px",
  });

  const getMessageBubbleStyle = (sent) => ({
    background: sent 
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : (darkMode
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(255, 255, 255, 0.9)"),
    padding: "12px 16px",
    borderRadius: "16px",
    maxWidth: "70%",
    color: sent ? "white" : (darkMode ? "#e2e8f0" : "#1e293b"),
    border: sent 
      ? "none"
      : (darkMode 
        ? "1px solid rgba(255, 255, 255, 0.1)" 
        : "1px solid rgba(102, 126, 234, 0.1)"),
    boxShadow: sent
      ? "0 6px 20px rgba(102, 126, 234, 0.3)"
      : (darkMode
        ? "0 4px 15px rgba(0, 0, 0, 0.2)"
        : "0 4px 15px rgba(102, 126, 234, 0.1)"),
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
  });

  const senderNameStyle = {
    fontWeight: 600,
    marginBottom: "6px",
    fontSize: "0.9rem",
    opacity: 0.8,
  };

  const messageTextStyle = {
    lineHeight: 1.4,
    marginBottom: "6px",
  };

  const timestampStyle = {
    fontSize: "0.75rem",
    opacity: 0.7,
    textAlign: "right",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "4px",
  };
const inputContainerStyle = {
  display: "flex",
  alignItems: "center",
  padding: "16px 20px",
  background: darkMode
    ? "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)"
    : "linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)",
  borderTop: darkMode 
    ? "1px solid rgba(255, 255, 255, 0.1)" 
    : "1px solid rgba(102, 126, 234, 0.1)",
  position: "relative",
  backdropFilter: "blur(10px)",

  // 👇 ye add karo
  marginBottom: "60px", // bottom navbar ke liye space
};


  const emojiButtonStyle = {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    border: "none",
    background: darkMode
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(102, 126, 234, 0.1)",
    color: darkMode ? "#e2e8f0" : "#667eea",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    marginRight: "12px",
  };

  const inputStyle = {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "12px",
    border: isToxic 
      ? "2px solid #ef4444"
      : (darkMode 
        ? "1px solid rgba(255, 255, 255, 0.1)" 
        : "1px solid rgba(102, 126, 234, 0.1)"),
    background: darkMode
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(255, 255, 255, 0.9)",
    color: darkMode ? "#e2e8f0" : "#1e293b",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  };

  const sendButtonStyle = {
    marginLeft: "12px",
    padding: "12px 20px",
    borderRadius: "12px",
    border: "none",
    background: (isToxic || !message.trim())
      ? (darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(102, 126, 234, 0.1)")
      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: (isToxic || !message.trim())
      ? (darkMode ? "#64748b" : "#94a3b8")
      : "white",
    cursor: (isToxic || !message.trim()) ? "not-allowed" : "pointer",
    fontWeight: 600,
    fontSize: "1rem",
    transition: "all 0.3s ease",
    boxShadow: (isToxic || !message.trim())
      ? "none"
      : "0 6px 20px rgba(102, 126, 234, 0.3)",
  };

  const toxicWarningStyle = {
    color: "#ef4444",
    fontSize: "0.85rem",
    margin: "0 20px 12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: darkMode
      ? "rgba(239, 68, 68, 0.1)"
      : "rgba(239, 68, 68, 0.05)",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid rgba(239, 68, 68, 0.2)",
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <img
          src={
            chatWithUserPic?.startsWith("http")
              ? chatWithUserPic
              : `${BACKEND_URL}/${chatWithUserPic}`
          }
          alt="Profile"
          style={profileImageStyle}
          onClick={() => navigate(`/profile/${chatWithUserId}`)}
          onError={(e) => (e.target.src = "https://ui-avatars.com/api/?name=User")}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.border = "2px solid #667eea";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.border = darkMode 
              ? "2px solid rgba(102, 126, 234, 0.4)" 
              : "2px solid rgba(102, 126, 234, 0.3)";
          }}
        />
        <div style={{ marginLeft: "16px" }}>
          <div style={userNameStyle}>
            {chatWithUserName}
          </div>
          <div style={statusStyle}>
            {isOnline
              ? "🟢 Online"
              : lastSeen
              ? `Last seen at ${lastSeen.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "⚫ Offline"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={messagesContainerStyle}
      >
        {loadingMore && (
          <div style={{
            textAlign: "center",
            padding: "16px",
            color: darkMode ? "#94a3b8" : "#64748b",
            background: darkMode
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(102, 126, 234, 0.05)",
            borderRadius: "12px",
            margin: "0 0 16px 0",
          }}>
            Loading older messages...
          </div>
        )}
        {messages.map((msg, idx) => {
          const sent = msg.senderId === currentUserId;
          return (
            <div key={idx} style={getMessageStyle(sent)}>
              <div style={getMessageBubbleStyle(sent)}>
                <div style={senderNameStyle}>
                  {msg.senderName}
                </div>
                <div style={messageTextStyle}>{msg.message}</div>
                <div style={timestampStyle}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {sent && (
                    <span style={{ 
                      color: msg.seen ? "#10b981" : "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.9rem"
                    }}>
                      ✓
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {typingUser && (
          <div style={{
            fontStyle: "italic",
            color: darkMode ? "#94a3b8" : "#64748b",
            padding: "8px 16px",
            background: darkMode
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(102, 126, 234, 0.05)",
            borderRadius: "12px",
            marginBottom: "16px",
            border: darkMode 
              ? "1px solid rgba(255, 255, 255, 0.1)" 
              : "1px solid rgba(102, 126, 234, 0.1)",
          }}>
            {typingUser} is typing...
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={inputContainerStyle}>
        <button
          style={emojiButtonStyle}
          onClick={() => setShowEmojiPicker((v) => !v)}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.background = darkMode
              ? "rgba(255, 255, 255, 0.15)"
              : "rgba(102, 126, 234, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.background = darkMode
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(102, 126, 234, 0.1)";
          }}
        >
          <FaSmile size={20} />
        </button>
        <input
          ref={inputRef}
          value={message}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          style={inputStyle}
          onFocus={(e) => {
            if (!isToxic) {
              e.target.style.border = darkMode 
                ? "1px solid rgba(102, 126, 234, 0.4)" 
                : "1px solid rgba(102, 126, 234, 0.3)";
              e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
            }
          }}
          onBlur={(e) => {
            e.target.style.border = isToxic 
              ? "2px solid #ef4444"
              : (darkMode 
                ? "1px solid rgba(255, 255, 255, 0.1)" 
                : "1px solid rgba(102, 126, 234, 0.1)");
            e.target.style.boxShadow = "none";
          }}
        />
        <button
          onClick={handleSend}
          style={sendButtonStyle}
          disabled={isToxic || !message.trim()}
          onMouseEnter={(e) => {
            if (!isToxic && message.trim()) {
              e.target.style.transform = "translateY(-2px) scale(1.05)";
              e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0) scale(1)";
            e.target.style.boxShadow = (isToxic || !message.trim())
              ? "none"
              : "0 6px 20px rgba(102, 126, 234, 0.3)";
          }}
        >
          Send
        </button>
        {showEmojiPicker && (
          <div
            style={{ 
              position: "absolute", 
              bottom: "70px", 
              left: "20px", 
              zIndex: 10,
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: darkMode
                ? "0 20px 50px rgba(0, 0, 0, 0.3)"
                : "0 20px 50px rgba(102, 126, 234, 0.2)",
            }}
          >
            <EmojiPicker 
              onEmojiClick={handleEmojiClick}
              theme={darkMode ? "dark" : "light"}
            />
          </div>
        )}
      </div>

      {isToxic && (
        <div style={toxicWarningStyle}>
          ⚠️ This message is offensive. You cannot send it.
        </div>
      )}
    </div>
  );
};

Chat.propTypes = {
  currentUserId: PropTypes.string.isRequired,
  currentUserName: PropTypes.string.isRequired,
  chatWithUserId: PropTypes.string.isRequired,
  chatWithUserName: PropTypes.string.isRequired,
  chatWithUserPic: PropTypes.string,
};

export default Chat;
import { useEffect, useState, useRef } from "react";
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

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: 12,
          borderBottom: "1px solid #ccc",
        }}
      >
        <img
          src={
            chatWithUserPic?.startsWith("http")
              ? chatWithUserPic
              : `${BACKEND_URL}/${chatWithUserPic}`
          }
          alt="Profile"
          style={{
            width: 45,
            height: 45,
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/profile/${chatWithUserId}`)}
          onError={(e) => (e.target.src = "https://ui-avatars.com/api/?name=User")}
        />
        <div style={{ marginLeft: 12 }}>
          <div style={{ fontSize: 18, fontWeight: "bold" }}>
            {chatWithUserName}
          </div>
          <div style={{ fontSize: 12, color: isOnline ? "green" : "#555" }}>
            {isOnline
              ? "Online"
              : lastSeen
              ? `Last seen at ${lastSeen.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Offline"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ flex: 1, overflowY: "auto", padding: 12, background: "#f9f9f9" }}
      >
        {loadingMore && <div>Loading older messages...</div>}
        {messages.map((msg, idx) => {
          const sent = msg.senderId === currentUserId;
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: sent ? "flex-end" : "flex-start",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  background: sent ? "#dcf8c6" : "#fff",
                  padding: 8,
                  borderRadius: 12,
                  maxWidth: "70%",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                  {msg.senderName}
                </div>
                <div>{msg.message}</div>
                <div
                  style={{ fontSize: 10, color: "#888", textAlign: "right" }}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {sent && (
                    <span style={{ marginLeft: 4, color: msg.seen ? "blue" : "gray" }}>
                      ✓
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {typingUser && (
          <div style={{ fontStyle: "italic", color: "#888" }}>
            {typingUser} is typing...
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: 12,
          borderTop: "1px solid #ccc",
          position: "relative",
        }}
      >
        <button onClick={() => setShowEmojiPicker((v) => !v)}>
          <FaSmile size={24} />
        </button>
        <input
          ref={inputRef}
          value={message}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            marginLeft: 8,
            padding: 8,
            borderColor: isToxic ? "red" : undefined,
          }}
        />
        <button
          onClick={handleSend}
          style={{ marginLeft: 8 }}
          disabled={isToxic || !message.trim()}
        >
          Send
        </button>
        {showEmojiPicker && (
          <div
            style={{ position: "absolute", bottom: "60px", left: "12px", zIndex: 10 }}
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      {isToxic && (
        <div style={{ color: "red", fontSize: 12, margin: "0 12px 8px" }}>
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

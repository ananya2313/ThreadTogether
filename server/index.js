
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();
connectDB();

// CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

// Default route
app.get("/", (req, res) => {
  res.send("✅ Backend is live and working!");
});

// HTTP + Socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("user_connected", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("user_connected_broadcast", userId);
  });

  socket.on("join_room", (room) => {
    socket.join(room);
  });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("typing", ({ room, senderName }) => {
    socket.to(room).emit("user_typing", senderName);
  });

  socket.on("stop_typing", ({ room }) => {
    socket.to(room).emit("user_stopped_typing");
  });

  socket.on("check_online", (userId) => {
    const isOnline = onlineUsers.has(userId);
    socket.emit("user_online_status", { userId, online: isOnline });
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        socket.broadcast.emit("user_disconnected_broadcast", userId);
        break;
      }
    }
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`✅ App is listening on PORT: ${port}`);
  console.log("✅ Allowed CORS Origins:", allowedOrigins);
});

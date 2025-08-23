
const Message = require("../models/Message");
const User = require("../models/user-model");
const { checkToxicity } = require("./moderation-controller"); // 👈 import

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is empty" });

    const toxic = await checkToxicity(message);
    if (toxic) {
      return res
        .status(400)
        .json({ error: "Message contains offensive language!" });
    }

    // const newMessage = new Message({
    //   senderId,
    //   receiverId,
    //   message,
    //   timestamp: new Date(),
    //   room: `${senderId}_${receiverId}`,
    // });

    const [id1, id2] = [senderId, receiverId].sort();
const newMessage = new Message({
  senderId,
  receiverId,
  message,
  timestamp: new Date(),
  room: `${id1}_${id2}`,
});


    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("❌ Error in sendMessage:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// ✅ Get messages between users
const getMessages = async (req, res) => {
  try {
    const { room } = req.params;
    const [user1, user2] = room.split("_");

    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Error in getMessages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// ✅ Mark messages as seen
const markMessagesAsSeen = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    await Message.updateMany(
      { senderId, receiverId, seen: false },
      { $set: { seen: true } }
    );

    res.status(200).json({ message: "Messages marked as seen" });
  } catch (error) {
    console.error("❌ Error in markMessagesAsSeen:", error);
    res.status(500).json({ error: "Failed to mark messages as seen" });
  }
};

// ✅ Optimized: Get chat users with last message
const getUserChats = async (req, res) => {
  try {
    const currentUserId = req.params.id;

    const messages = await Message.find({
      $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
    })
      .sort({ timestamp: -1 })
      .lean();

    const userMap = new Map();

    for (let msg of messages) {
      const otherUserId =
        msg.senderId.toString() === currentUserId
          ? msg.receiverId.toString()
          : msg.senderId.toString();

      if (!userMap.has(otherUserId)) {
        userMap.set(otherUserId, msg);
      }
    }

    const otherUserIds = Array.from(userMap.keys());

    const users = await User.find({ _id: { $in: otherUserIds } }).select(
      "_id userName profilePic"
    );

    const finalUsers = users.map((user) => ({
      _id: user._id,
      userName: user.userName,
      profilePic: user.profilePic,
      lastMessage: userMap.get(user._id.toString()).message,
    }));

    res.status(200).json({ users: finalUsers });
  } catch (error) {
    console.error("❌ Error in getUserChats:", error);
    res.status(500).json({ error: "Failed to get chat users" });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markMessagesAsSeen,
  getUserChats,
};

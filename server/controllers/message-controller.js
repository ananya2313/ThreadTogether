const mongoose = require("mongoose");
const Message = require("../models/Message");
const User = require("../models/user-model");
const { checkToxicity } = require("./moderation-controller");

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Message is empty" });
    }

    let isToxic = false;

    // Attempt to run the toxicity check safely
    try {
      const response = await checkToxicity({ body: { text } });
      // checkToxicity should now return { isToxic: boolean } when called programmatically
      isToxic = response.isToxic;

      if (isToxic) {
        return res
          .status(400)
          .json({ error: "Message contains offensive language!" });
      }
    } catch (error) {
      console.warn("❌ Moderation failed. Skipping check:", error.message);
      // Proceed without blocking message
    }

    // Save the message
    const senderObjId = new mongoose.Types.ObjectId(senderId);
    const receiverObjId = new mongoose.Types.ObjectId(receiverId);

    const [id1, id2] = [senderObjId.toString(), receiverObjId.toString()].sort();

    const newMessage = new Message({
      senderId: senderObjId,
      receiverId: receiverObjId,
      message: text,
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




// Get messages for a room (with pagination)
const getMessages = async (req, res) => {
  try {
    const { room } = req.params;
    const { before, limit } = req.query;

     const [user1, user2] = room.split("_").map(id => new mongoose.Types.ObjectId(id));

    const query = {
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    };

    if (before) {
      query.timestamp = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit) || 20)
      .lean();

    res.status(200).json(messages.reverse());
  } catch (error) {
    console.error("❌ Error in getMessages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Mark messages as seen
const markMessagesAsSeen = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    await Message.updateMany(
      {
        senderId: mongoose.Types.ObjectId(senderId),
        receiverId: mongoose.Types.ObjectId(receiverId),
        seen: false,
      },
      { $set: { seen: true } }
    );

    res.status(200).json({ message: "Messages marked as seen" });
  } catch (error) {
    console.error("❌ Error in markMessagesAsSeen:", error);
    res.status(500).json({ error: "Failed to mark messages as seen" });
  }
};

// Get chat users for current user
const getUserChats = async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.params.id);
    const messages = await Message.find({
      $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
    })
      .sort({ timestamp: -1 })
      .lean();

    const userMap = new Map();

    for (let msg of messages) {
      const otherUserId =
        msg.senderId.toString() === currentUserId.toString()
          ? msg.receiverId.toString()
          : msg.senderId.toString();

      if (!userMap.has(otherUserId)) {
        userMap.set(otherUserId, msg);
      }
    }

    const otherUserIds = Array.from(userMap.keys()).map((id) =>
      new mongoose.Types.ObjectId(id)
    );

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
const express = require("express");
const router = express.Router();
const auth = require("./middleware/auth");

// Controllers
const {
  signin,
  login,
  userDetails,
  followUser,
  updateProfile,
  searchUser,
  logout,
  myInfo,
  getAllUsers,
} = require("./controllers/user-controller");

const {
  addPost,
  allPost,
  deletePost,
  likePost,
  repost,
  singlePost,
} = require("./controllers/post-controller");

const {
  addComment,
  deleteComment,
} = require("./controllers/comment-controller");

const {
  sendMessage,
  getMessages,
  markMessagesAsSeen,
  getUserChats,
} = require("./controllers/message-controller");

const { generateCaption } = require("./controllers/ai-controller");
const analyzeSentiment = require("./utils/sentimentAnalyzer");
const { detectFakeNews } = require("./controllers/fakeNews-controller");
const { checkToxicity } = require("./controllers/moderation-controller");


// Auth routes
router.post("/signin", signin);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/me", auth, myInfo);

// User routes
router.get("/user/:id", auth, userDetails);
router.put("/user/follow/:id", auth, followUser);
router.put("/update", auth, updateProfile);
router.get("/users/search/:query", auth, searchUser);
router.get("/users", auth, getAllUsers);

// Post routes
router.post("/post", auth, addPost);
router.get("/post", auth, allPost);
router.delete("/post/:id", auth, deletePost);
router.put("/post/like/:id", auth, likePost);
router.put("/repost/:id", auth, repost);
router.get("/post/:id", auth, singlePost);

// Comment routes
router.post("/comment/:id", auth, addComment);
router.delete("/comment/:postId/:id", auth, deleteComment);

// Message routes
router.post("/message", auth, sendMessage);
router.get("/message/:room", auth, getMessages);
router.put("/message/seen", auth, markMessagesAsSeen);
router.get("/message/user-chats/:id", auth, getUserChats);

// AI Caption
router.post("/ai-caption", generateCaption);


// Sentiment Analysis
router.post("/analyze", auth, (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });
  const result = analyzeSentiment(text);
  res.status(200).json({ sentiment: result });
});

// Fake News
router.post("/detect-fake-news", auth, detectFakeNews);


router.post("/moderation",  checkToxicity);


module.exports = router;

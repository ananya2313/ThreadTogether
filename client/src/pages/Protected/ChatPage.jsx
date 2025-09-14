


import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Chat from "../../components/Chat";
import { useUserDetailsQuery } from "../../redux/service";
import { Box, Typography } from "@mui/material";

const ChatPage = () => {
  const { userId } = useParams(); // Chat receiver
  const { myInfo } = useSelector((state) => state.service);

  const { data: userDetails, isLoading } = useUserDetailsQuery(userId, {
    skip: !userId,
  });

  console.log("🧾 userId from URL:", userId);
  console.log("🧍 myInfo._id:", myInfo?._id);
  console.log("👤 userDetails:", userDetails);

  if (!myInfo?._id || !userId || isLoading || !userDetails) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9f9ff", // match theme
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading chat...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f9f9ff", // match theme
        px: 2,
        py: 2,
        width: "100%", // use full width
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Chat
          currentUserId={myInfo._id}
          currentUserName={myInfo.userName}
          chatWithUserId={userId}
          chatWithUserName={userDetails?.user?.userName}
          chatWithUserPic={userDetails?.user?.profilePic}
        />
      </Box>
    </Box>
  );
};

export default ChatPage;  
import {
  Avatar,
  Button,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addPostModal } from "../../redux/slice";

const Input = () => {
  const { myInfo, darkMode } = useSelector((state) => state.service);
  const _700 = useMediaQuery("(min-width:700px)");

  const dispatch = useDispatch();

  const handleAddPost = () => {
    dispatch(addPostModal(true));
  };

  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      width={_700 ? "70%" : "90%"}
      maxWidth="700px"
      px={_700 ? 3 : 2}
      py={_700 ? 3 : 2}
      mx="auto"
      my={4}
      borderRadius="15px"
      onClick={handleAddPost}
      sx={{
        background: darkMode
          ? "linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(20,20,20,0.98) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)",
        border: darkMode
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid rgba(102,126,234,0.1)",
        boxShadow: darkMode
          ? "0 10px 30px rgba(0,0,0,0.6)"
          : "0 10px 30px rgba(102,126,234,0.2)",
        cursor: "pointer",
      }}
    >
      {/* Left side - Avatar + placeholder */}
      <Stack flexDirection="row" alignItems="center" gap={2}>
        <Avatar
          src={myInfo?.profilePic || ""}
          alt={myInfo?.userName || ""}
        />
        <Typography
          color={darkMode ? "#a0aec0" : "GrayText"}
          fontSize={_700 ? "1rem" : "0.9rem"}
        >
          Start a thread...
        </Typography>
      </Stack>

      {/* Right side - Post button */}
      <Button
        size={_700 ? "medium" : "small"}
        sx={{
          px: _700 ? 3 : 2,
          py: _700 ? 1 : 0.7,
          fontSize: _700 ? "1rem" : "0.8rem",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          boxShadow: "0 6px 20px rgba(102,126,234,0.3)",
          "&:hover": {
            transform: "translateY(-1px) scale(1.02)",
            background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
            boxShadow: "0 8px 25px rgba(102,126,234,0.4)",
          },
        }}
      >
        POST
      </Button>
    </Stack>
  );
};

export default Input;

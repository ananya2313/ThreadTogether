import {
  Avatar,
  Button,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProfileBar = ({ e }) => {
  const { darkMode } = useSelector((state) => state.service);
  const _700 = useMediaQuery("(min-width:700px)");
  const _500 = useMediaQuery("(min-width:500px)");

  return (
    <Stack
      flexDirection={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      px={_700 ? 3 : 2}
      py={_700 ? 2 : 1.5}
      mx={"auto"}
      width={_700 ? "80%" : "90%"}
      maxWidth={"700px"}
      borderRadius={"15px"}
      sx={{
        background: darkMode
          ? "linear-gradient(135deg, rgba(30,30,30,0.9) 0%, rgba(20,20,20,0.95) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)",
        border: darkMode
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid rgba(102,126,234,0.1)",
        boxShadow: darkMode
          ? "0 8px 20px rgba(0,0,0,0.7)"
          : "0 8px 20px rgba(102,126,234,0.2)",
        transition: "all 0.3s ease",
        ":hover": {
          transform: "translateY(-2px) scale(1.01)",
          boxShadow: darkMode
            ? "0 10px 25px rgba(0,0,0,0.8)"
            : "0 10px 25px rgba(102,126,234,0.3)",
          cursor: "pointer",
        },
      }}
    >
      <Stack flexDirection={"row"} gap={2} alignItems={"center"}>
        <Avatar
          src={e ? e.profilePic : ""}
          alt={e ? e.userName : ""}
          sx={{
            width: _700 ? 56 : 48,
            height: _700 ? 56 : 48,
            border: darkMode
              ? "2px solid rgba(255,255,255,0.1)"
              : "2px solid rgba(102,126,234,0.2)",
            boxShadow: "0 4px 15px rgba(102,126,234,0.2)",
          }}
        />
        <Stack flexDirection={"column"}>
          <Link to={`/profile/threads/${e._id}`} className="link">
            <Typography
              variant="h6"
              fontWeight={"bold"}
              fontSize={_700 ? "1rem" : "0.9rem"}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {e ? e.userName : ""}
            </Typography>
          </Link>
          <Typography
            variant="caption"
            fontSize={_700 ? "0.9rem" : "0.75rem"}
            color={darkMode ? "rgba(226,232,240,0.7)" : "gray"}
          >
            {e ? e.bio : ""}
          </Typography>
          <Typography
            variant="caption"
            fontSize={_700 ? "0.85rem" : "0.75rem"}
            color={darkMode ? "rgba(226,232,240,0.7)" : "gray"}
          >
            {e ? e.followers.length : 0} followers
          </Typography>
        </Stack>
      </Stack>

      <Link to={`/profile/threads/${e._id}`} className="link">
        <Button
          size="medium"
          sx={{
            border: "1px solid",
            borderColor: darkMode ? "rgba(255,255,255,0.2)" : "rgba(102,126,234,0.2)",
            color: darkMode ? "whitesmoke" : "black",
            borderRadius: "12px",
            px: _700 ? 3 : 2,
            py: 1,
            fontSize: _700 ? "0.95rem" : "0.85rem",
            background: darkMode
              ? "rgba(255,255,255,0.05)"
              : "rgba(102,126,234,0.05)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: darkMode
                ? "rgba(102,126,234,0.1)"
                : "rgba(102,126,234,0.15)",
              boxShadow: "0 6px 15px rgba(102,126,234,0.2)",
            },
          }}
        >
          Follow
        </Button>
      </Link>
    </Stack>
  );
};

export default ProfileBar;

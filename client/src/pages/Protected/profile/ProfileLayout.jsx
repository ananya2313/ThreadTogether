
import {
  Avatar,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
// import { FaInstagram } from "react-icons/fa";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editProfileModal } from "../../../redux/slice";
import {
  useFollowUserMutation,
  useUserDetailsQuery,
} from "../../../redux/service";
import { useEffect, useState } from "react";
import EditProfile from "../../../components/modals/EditProfile";
import { Bounce, toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { MdChat } from "react-icons/md";
import ThreadTogetherLogo from "../../ThreadTogetherLogo";
const ProfileLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
 const { id: userId } = useParams();
console.log("Profile ID from URL:", userId); // ✅ Now correct

  

  const { data } = useUserDetailsQuery(userId, {
    skip: !userId,
  });

  
  const [followUser, followUserData] = useFollowUserMutation();
  const { darkMode, myInfo } = useSelector((state) => state.service);

  const [myAccount, setMyAccount] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const _300 = useMediaQuery("(min-width:300px)");
  const _500 = useMediaQuery("(min-width:500px)");
  const _700 = useMediaQuery("(min-width:700px)");

  const user = data?.user;

  useEffect(() => {
    if (user && myInfo) {
      setMyAccount(user._id === myInfo._id);
      setIsFollowing(user.followers?.some((f) => f._id === myInfo._id));
    }
  }, [user, myInfo]);

  const handleFollow = async () => {
    if (user) await followUser(user._id);
  };

  const handleOpenEditModal = () => {
    dispatch(editProfileModal(true));
  };

  useEffect(() => {
    if (followUserData.isSuccess) {
      toast.success(followUserData.data.msg, {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
        transition: Bounce,
      });
    } else if (followUserData.isError) {
      toast.error(followUserData.error?.data?.msg || "Follow failed", {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
        transition: Bounce,
      });
    }
  }, [followUserData]);



return (
  <>
    <Helmet>
      <title>{user ? `${user.userName} | Threads Clone` : "Threads Clone"}</title>
    </Helmet>

    {/* Profile Section */}
    <Stack
      flexDirection="column"
      gap={2}
      p={3}
      m={2}
      width={_700 ? "800px" : "90%"}
      mx="auto"
      bgcolor={darkMode ? "#1c1c2b" : "#ffffff"} // ⬅ Base kept neutral
      borderRadius={4}
      boxShadow={"0px 4px 12px rgba(0, 0, 0, 0.1)"}
    >
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
        <Stack gap={1}>
          <Typography
            fontWeight="bold"
            fontSize={_300 ? "2rem" : "1.3rem"}
            color={darkMode ? "#E6E6FA" : "#2E2E2E"}
          >
            {user?.userName || "User"}
          </Typography>
          <Stack flexDirection="row" alignItems="center" gap={1}>
            <Typography fontSize={_300 ? "1rem" : "0.8rem"} color={darkMode ? "#ccc" : "#555"}>
              {user?.email || ""}
            </Typography>
            <Chip
              label="ThreadTogether.net"
              size="small"
              sx={{
                fontSize: _300 ? "0.8rem" : "0.6rem",
                bgcolor: darkMode ? "#C8A2C8" : "#E6E6FA",
                color: "#2E2E2E",
              }}
            />
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" gap={1}>
          {myAccount && (
            <IconButton
              onClick={() => navigate("/messages")}
              sx={{
                border: "1px solid #aaa",
                borderRadius: "10px",
                backgroundColor: darkMode ? "#2a2a3d" : "#f5f5f5",
              }}
            >
              <MdChat size={_300 ? 28 : 20} color={darkMode ? "#E6E6FA" : "#333"} />
            </IconButton>
          )}
          <Avatar
            src={user?.profilePic}
            alt={user?.userName}
            sx={{ width: _300 ? 60 : 40, height: _300 ? 60 : 40 }}
          />
        </Stack>
      </Stack>

      <Typography variant="subtitle2" color={darkMode ? "#aaa" : "#444"}>
        {user?.bio || ""}
      </Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography color={darkMode ? "#bbb" : "#777"} variant="subtitle2">
          {user?.followers?.length
            ? `${user.followers.length} followers`
            : "No Followers"}
        </Typography>
    
        <ThreadTogetherLogo
  size={_300 ? 36 : 22}
  color={darkMode ? "#C8A2C8" : "#C8A2C8"}
/>

      </Stack>
    </Stack>

<Stack direction="row" gap={1} justifyContent="center" mt={2}>
  <Button
    size="large"
    sx={{
      color: darkMode ? "#fff" : "#2E2E2E",
      bgcolor: darkMode ? "#C8A2C8" : "#E6EFA",
      border: "1px solid #ccc",
      borderRadius: "10px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      fontWeight: "bold",
      ":hover": {
        backgroundColor: darkMode ? "#b57fb5" : "#f0e8f8",
      },
    }}
    onClick={myAccount ? handleOpenEditModal : handleFollow}
  >
    {myAccount ? "Edit Profile" : isFollowing ? "Unfollow" : "Follow User"}
  </Button>

  {!myAccount && user?._id && (
    <Link to={`/chat/${user._id}`} style={{ textDecoration: "none" }}>
      <Button
        size="large"
        sx={{
          color: darkMode ? "#fff" : "#2E2E2E",
          bgcolor: darkMode ? "#C8A2C8" : "#E6EFA",
          border: "1px solid #ccc",
          borderRadius: "10px",
          fontWeight: "bold",
          ":hover": {
            backgroundColor: darkMode ? "#b57fb5" : "#f0e8f8",
          },
        }}
      >
        💬 Message
      </Button>
    </Link>
  )}
</Stack>




    {/* Navigation Tabs */}
    <Stack
      flexDirection="row"
      justifyContent="space-evenly"
      my={5}
      pb={2}
      borderBottom={`2px solid ${darkMode ? "#444" : "#bbb"}`}
      fontSize={_500 ? "1.2rem" : _300 ? "1.1rem" : "0.9rem"}
      width={_700 ? "800px" : "90%"}
      mx="auto"
    >
      {["threads", "replies", "reposts"].map((tab) => (
        <Link
          key={tab}
          to={`/profile/${tab}/${user?._id}`}
          className={`link ${darkMode ? "mode" : ""}`}
          style={{
            color: darkMode ? "#E6E6FA" : "#333",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </Link>
      ))}
    </Stack>

    <Outlet />
    <EditProfile />
  </>
);

};

export default ProfileLayout;

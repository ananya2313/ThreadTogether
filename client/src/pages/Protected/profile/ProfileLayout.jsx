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
        <title>{user ? `${user.userName} | ThreadTogether` : "ThreadTogether"}</title>
      </Helmet>

      {/* Profile Section */}
      <Stack
        flexDirection="column"
        gap={3}
        p={_700 ? 4 : 3}
        m={2}
        width={_700 ? "800px" : "95%"}
        mx="auto"
        sx={{
          background: darkMode 
            ? 'linear-gradient(135deg, rgba(45, 55, 72, 0.95) 0%, rgba(74, 85, 104, 0.9) 100%)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: darkMode 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' 
            : '0 25px 50px -12px rgba(102, 126, 234, 0.15)',
          border: darkMode 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(102, 126, 234, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: darkMode 
              ? '0 30px 60px -12px rgba(0, 0, 0, 0.5)' 
              : '0 30px 60px -12px rgba(102, 126, 234, 0.2)',
          }
        }}
      >
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Stack gap={1}>
            <Typography
              fontWeight={700}
              fontSize={_300 ? "2.2rem" : "1.5rem"}
              sx={{
                background: darkMode
                  ? 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}
            >
              {user?.userName || "User"}
            </Typography>
            <Stack flexDirection="row" alignItems="center" gap={1} flexWrap="wrap">
              <Typography 
                fontSize={_300 ? "1rem" : "0.9rem"} 
                sx={{ 
                  color: darkMode ? "#a0aec0" : "#718096",
                  fontWeight: 500
                }}
              >
                {user?.email || ""}
              </Typography>
              <Chip
                label="ThreadTogether"
                size="small"
                sx={{
                  fontSize: _300 ? "0.8rem" : "0.7rem",
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: '12px',
                  height: '24px',
                  '& .MuiChip-label': {
                    px: 1.5
                  }
                }}
              />
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" gap={2}>
            {myAccount && (
              <IconButton
                onClick={() => navigate("/messages")}
                sx={{
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(102, 126, 234, 0.2)'}`,
                  borderRadius: "16px",
                  width: _300 ? 48 : 40,
                  height: _300 ? 48 : 40,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 25px -12px rgba(102, 126, 234, 0.3)',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)',
                  }
                }}
              >
                <MdChat size={_300 ? 24 : 18} color={darkMode ? "#e2e8f0" : "#667eea"} />
              </IconButton>
            )}
            <Avatar
              src={user?.profilePic}
              alt={user?.userName}
              sx={{ 
                width: _300 ? 72 : 56, 
                height: _300 ? 72 : 56,
                border: `3px solid ${darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(102, 126, 234, 0.2)'}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 10px 25px -12px rgba(102, 126, 234, 0.4)',
                }
              }}
            />
          </Stack>
        </Stack>

        <Typography 
          variant="body1" 
          sx={{
            color: darkMode ? "#a0aec0" : "#4a5568",
            fontSize: _300 ? "1.1rem" : "1rem",
            lineHeight: 1.6,
            fontWeight: 400
          }}
        >
          {user?.bio || "Welcome to my peaceful corner of ThreadTogether 🌸"}
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography 
            sx={{
              color: darkMode ? "#cbd5e0" : "#667eea",
              fontSize: _300 ? "1rem" : "0.9rem",
              fontWeight: 600
            }}
          >
            {user?.followers?.length
              ? `${user.followers.length} followers`
              : "No Followers"}
          </Typography>
      
          <ThreadTogetherLogo
            size={_300 ? 36 : 28}
            color={darkMode ? "#a0aec0" : "#667eea"}
          />
        </Stack>
      </Stack>

      <Stack 
        direction={_500 ? "row" : "column"} 
        gap={2} 
        justifyContent="center" 
        mt={3}
        px={2}
      >
        <Button
          size="large"
          sx={{
            minWidth: _500 ? '140px' : '100%',
            height: 48,
            background: myAccount
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : isFollowing
              ? 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)'
              : 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
            color: "white",
            borderRadius: "16px",
            fontWeight: 600,
            fontSize: "1rem",
            textTransform: 'none',
            boxShadow: '0 10px 25px -12px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease',
            ":hover": {
              transform: 'translateY(-2px)',
              boxShadow: '0 15px 35px -12px rgba(102, 126, 234, 0.5)',
              background: myAccount
                ? 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                : isFollowing
                ? 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)'
                : 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
            },
          }}
          onClick={myAccount ? handleOpenEditModal : handleFollow}
        >
          {myAccount ? "✏️ Edit Profile" : isFollowing ? "👋 Unfollow" : "🤝 Follow"}
        </Button>

        {!myAccount && user?._id && (
          <Link to={`/chat/${user._id}`} style={{ textDecoration: "none" }}>
            <Button
              size="large"
              sx={{
                minWidth: _500 ? '140px' : '100%',
                width: _500 ? 'auto' : '100%',
                height: 48,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
                color: darkMode ? "#e2e8f0" : "#667eea",
                border: `2px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(102, 126, 234, 0.2)'}`,
                borderRadius: "16px",
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: 'none',
                transition: 'all 0.3s ease',
                ":hover": {
                  transform: 'translateY(-2px)',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                  boxShadow: '0 10px 25px -12px rgba(102, 126, 234, 0.3)',
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
        my={4}
        pb={3}
        sx={{
          borderBottom: `3px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(102, 126, 234, 0.2)'}`,
          fontSize: _500 ? "1.2rem" : _300 ? "1.1rem" : "1rem",
          width: _700 ? "800px" : "95%",
          mx: "auto",
          background: darkMode 
            ? 'rgba(45, 55, 72, 0.3)'
            : 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px 20px 0 0',
          padding: '1rem 0',
          gap: 1
        }}
      >
        {["threads", "replies", "reposts"].map((tab) => (
          <Link
            key={tab}
            to={`/profile/${tab}/${user?._id}`}
            style={{
              textDecoration: "none",
              flex: 1,
              textAlign: 'center'
            }}
          >
            <Typography
              sx={{
                color: darkMode ? "#e2e8f0" : "#667eea",
                fontWeight: 700,
                fontSize: _500 ? "1.1rem" : "1rem",
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                textTransform: 'capitalize',
                '&:hover': {
                  background: darkMode
                    ? 'rgba(102, 126, 234, 0.2)'
                    : 'rgba(102, 126, 234, 0.1)',
                  transform: 'translateY(-1px)',
                  color: darkMode ? "#f7fafc" : "#5a67d8",
                }
              }}
            >
              {tab}
            </Typography>
          </Link>
        ))}
      </Stack>

      <Outlet />
      <EditProfile />
    </>
  );
};

export default ProfileLayout;
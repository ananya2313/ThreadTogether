import {
  Avatar,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { IoIosMore } from "react-icons/io";
import { useSelector } from "react-redux";
import {
  useDeleteCommentMutation,
  useSinglePostQuery,
} from "../../../redux/service";
import { Bounce, toast } from "react-toastify";
import { isToxicMessage } from "../../../utils/isToxicMessage";
import PropTypes from "prop-types";

const Comments = ({ e, postId }) => {
  const { darkMode, myInfo } = useSelector((state) => state.service);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isToxic, setIsToxic] = useState(false); // ✅ store async toxic check
  const _700 = useMediaQuery("(min-width:700px)");
  const _300 = useMediaQuery("(min-width:300px)");

  const [deleteComment, deleteCommentData] = useDeleteCommentMutation();
  const { refetch } = useSinglePostQuery(postId);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteComment = async () => {
    const info = {
      postId,
      id: e?._id,
    };
    await deleteComment(info);
    handleClose();
    refetch();
  };

  // Check if the comment is from admin
  useEffect(() => {
    if (e && myInfo && e?.admin?._id === myInfo?._id) {
      setIsAdmin(true);
    }
  }, [e, myInfo]);

  // ✅ Async toxic check
  useEffect(() => {
    const checkToxic = async () => {
      if (e?.text) {
        const result = await isToxicMessage(e.text);
        setIsToxic(result);
      }
    };
    checkToxic();
  }, [e?.text]);

  // Toast messages for delete
  useEffect(() => {
    if (deleteCommentData.isSuccess) {
      toast.success(deleteCommentData.data?.msg, {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
        transition: Bounce,
      });
    }
    if (deleteCommentData.isError) {
      toast.error(deleteCommentData.error?.data?.msg, {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
        transition: Bounce,
      });
    }
  }, [
    deleteCommentData.isSuccess,
    deleteCommentData.isError,
    deleteCommentData.data?.msg,
    deleteCommentData.error?.data?.msg,
  ]);

  return (
    <>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        p={_700 ? 3 : 2}
        mb={2}
        width="95%"
        mx="auto"
        sx={{
          background: darkMode 
            ? 'linear-gradient(135deg, rgba(45, 55, 72, 0.7) 0%, rgba(74, 85, 104, 0.6) 100%)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(15px)',
          borderRadius: '20px',
          border: darkMode 
            ? '1px solid rgba(255, 255, 255, 0.08)' 
            : '1px solid rgba(102, 126, 234, 0.08)',
          boxShadow: darkMode 
            ? '0 8px 32px -8px rgba(0, 0, 0, 0.3)' 
            : '0 8px 32px -8px rgba(102, 126, 234, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: darkMode 
              ? '0 12px 40px -8px rgba(0, 0, 0, 0.4)' 
              : '0 12px 40px -8px rgba(102, 126, 234, 0.15)',
            background: darkMode 
              ? 'linear-gradient(135deg, rgba(45, 55, 72, 0.8) 0%, rgba(74, 85, 104, 0.7) 100%)'
              : 'rgba(255, 255, 255, 0.9)',
          }
        }}
      >
        <Stack flexDirection="row" gap={_700 ? 2 : 1.5} alignItems="flex-start">
          <Avatar 
            src={e?.admin?.profilePic} 
            alt={e?.admin?.userName}
            sx={{ 
              width: _300 ? 48 : 40, 
              height: _300 ? 48 : 40,
              border: `2px solid ${darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(102, 126, 234, 0.15)'}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 20px -8px rgba(102, 126, 234, 0.3)',
              }
            }}
          />
          <Stack flexDirection="column" gap={0.5} flex={1}>
            <Typography 
              fontWeight={700} 
              fontSize={_300 ? "1rem" : "0.9rem"}
              sx={{
                color: darkMode ? "#e2e8f0" : "#2d3748",
                letterSpacing: '-0.01em'
              }}
            >
              {e?.admin?.userName}
            </Typography>

            {/* Show comment only if not toxic */}
            {e?.text && !isToxic && (
              <Typography 
                variant="body2" 
                fontSize={_300 ? "0.95rem" : "0.85rem"}
                sx={{
                  color: darkMode ? "#a0aec0" : "#4a5568",
                  lineHeight: 1.5,
                  wordBreak: 'break-word'
                }}
              >
                {e.text}
              </Typography>
            )}

            {/* Show warning if toxic */}
            {e?.text && isToxic && (
              <Stack
                direction="row"
                alignItems="center"
                gap={1}
                p={2}
                sx={{
                  background: 'linear-gradient(135deg, rgba(245, 101, 101, 0.1) 0%, rgba(229, 62, 62, 0.1) 100%)',
                  border: '1px solid rgba(245, 101, 101, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Typography 
                  variant="body2" 
                  fontSize={_300 ? "0.9rem" : "0.8rem"}
                  sx={{
                    color: "#f56565",
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  ⚠️ Comment hidden due to offensive content
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>

        <Stack
          flexDirection="row"
          gap={1.5}
          alignItems="center"
          sx={{
            color: darkMode ? "#a0aec0" : "#718096",
            fontSize: _300 ? "0.9rem" : "0.8rem"
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              color: darkMode ? "#cbd5e0" : "#667eea",
              fontSize: _300 ? "0.85rem" : "0.75rem"
            }}
          >
            24min
          </Typography>
          <Stack
            sx={{
              p: 1,
              borderRadius: '12px',
              cursor: isAdmin ? 'pointer' : 'default',
              transition: 'all 0.3s ease',
              '&:hover': isAdmin ? {
                background: darkMode 
                  ? 'rgba(102, 126, 234, 0.2)' 
                  : 'rgba(102, 126, 234, 0.1)',
                transform: 'scale(1.1)'
              } : {}
            }}
            onClick={(event) => isAdmin && setAnchorEl(event.currentTarget)}
          >
            <IoIosMore
              size={_700 ? 24 : 18}
              color={darkMode ? "#e2e8f0" : "#667eea"}
            />
          </Stack>
        </Stack>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            background: darkMode 
              ? 'linear-gradient(135deg, rgba(45, 55, 72, 0.95) 0%, rgba(74, 85, 104, 0.9) 100%)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(102, 126, 234, 0.1)',
            boxShadow: darkMode 
              ? '0 20px 40px -12px rgba(0, 0, 0, 0.4)' 
              : '0 20px 40px -12px rgba(102, 126, 234, 0.2)',
            minWidth: '120px',
            mt: 0.5
          }
        }}
      >
        <MenuItem 
          onClick={handleDeleteComment}
          sx={{
            color: "#f56565",
            fontWeight: 600,
            fontSize: "0.9rem",
            py: 1.5,
            px: 2,
            borderRadius: '12px',
            mx: 1,
            mb: 0.5,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(245, 101, 101, 0.1) 0%, rgba(229, 62, 62, 0.1) 100%)',
              transform: 'translateX(4px)',
            }
          }}
        >
          🗑️ Delete
        </MenuItem>
      </Menu>
    </>
  );
};

Comments.propTypes = {
  e: PropTypes.shape({
    _id: PropTypes.string,
    text: PropTypes.string,
    admin: PropTypes.shape({
      _id: PropTypes.string,
      profilePic: PropTypes.string,
      userName: PropTypes.string,
    }),
  }).isRequired,
  postId: PropTypes.string.isRequired,
};

export default Comments;
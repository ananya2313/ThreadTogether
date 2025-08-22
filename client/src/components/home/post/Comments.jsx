
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
        flexDirection={"row"}
        justifyContent={"space-between"}
        px={2}
        pb={4}
        borderBottom={"1px solid gray"}
        mx={"auto"}
        width={"90%"}
      >
        <Stack flexDirection={"row"} gap={_700 ? 2 : 1}>
          <Avatar src={e?.admin?.profilePic} alt={e?.admin?.userName} />
          <Stack flexDirection={"column"}>
            <Typography variant="h6" fontWeight={"bold"} fontSize={"0.9rem"}>
              {e?.admin?.userName}
            </Typography>

            {/* Show comment only if not toxic */}
            {e?.text && !isToxic && (
              <Typography variant="subtitle2" fontSize={"0.9rem"}>
                {e.text}
              </Typography>
            )}

            {/* Show warning if toxic */}
            {e?.text && isToxic && (
              <Typography variant="subtitle2" fontSize={"0.9rem"} color="error">
                ⚠️ Comment hidden due to offensive content
              </Typography>
            )}
          </Stack>
        </Stack>

        <Stack
          flexDirection={"row"}
          gap={1}
          alignItems={"center"}
          color={darkMode ? "white" : "GrayText"}
          fontSize={"0.9rem"}
        >
          <p>24min</p>
          <IoIosMore
            size={_700 ? 28 : 20}
            className="image-icon"
            onClick={(event) => isAdmin && setAnchorEl(event.currentTarget)}
          />
        </Stack>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleDeleteComment}>Delete</MenuItem>
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


import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { FaImages } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPostModal } from "../../redux/slice";
import { useAddPostMutation } from "../../redux/service";
import Loading from "../common/Loading";
import { Bounce, toast } from "react-toastify";
import { isToxicMessage } from "../../utils/isToxicMessage"; // 👈 Add this

const AddPost = () => {
  const { openAddPostModal, myInfo } = useSelector((state) => state.service);

  const [addNewPost, addNewPostData] = useAddPostMutation();

  const _700 = useMediaQuery("(min-width:700px)");
  const _500 = useMediaQuery("(min-width:500px)");
  const _300 = useMediaQuery("(min-width:300px)");

  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [loadingCaption, setLoadingCaption] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [isToxic, setIsToxic] = useState(false); // 👈

  const mediaRef = useRef();
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(addPostModal(false));
  };

  const handleMediaRef = () => {
    mediaRef.current.click();
  };

  const handleTextChange = async (e) => {
    const val = e.target.value;
    setText(val);

    try {
      if (val.trim() === "") {
        setIsToxic(false);
        return;
      }

      const result = await isToxicMessage(val); // ✅ await required
      setIsToxic(result);
    } catch (err) {
      console.error("Toxicity check failed", err);
      setIsToxic(false); // fallback
    }
  };

  const handlePost = async () => {
    if (isToxic) {
      toast.error("🚫 Toxic content detected! Post blocked.");
      return;
    }

    const data = new FormData();
    if (text) data.append("text", text);
    if (media) data.append("media", media);

    await addNewPost(data);
  };

  const generateAICaption = async () => {
    if (!text.trim()) {
      return toast.info("Please write something first.");
    }

    const SERVER_URL = process.env.VITE_BACKEND_URL;

    try {
      setLoadingCaption(true);

      const res = await fetch(`${SERVER_URL}/api/moderation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (res.ok) {
        setGeneratedCaption(data.caption);
      } else {
        toast.error(data.error || "Failed to generate caption.");
      }
    } catch (err) {
      console.error("Caption error:", err);
      toast.error("Error generating caption.");
    } finally {
      setLoadingCaption(false);
    }
  };

  useEffect(() => {
    if (addNewPostData.isSuccess) {
      setText("");
      setMedia(null);
      setGeneratedCaption("");
      dispatch(addPostModal(false));
      toast.success(addNewPostData.data.msg, {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    }
    if (addNewPostData.isError) {
      toast.error(addNewPostData.error.data.msg, {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    }
  }, [
    addNewPostData.isSuccess,
    addNewPostData.isError,
    addNewPostData.data?.msg,
    addNewPostData.error?.data?.msg,
    dispatch,
  ]);

  return (
    <Dialog
      open={openAddPostModal}
      onClose={handleClose}
      fullWidth
      fullScreen={!_700}
    >
      {addNewPostData?.isLoading ? (
        <Stack height={"60vh"}>
          <Loading />
        </Stack>
      ) : (
        <>
          <Box position={"absolute"} top={20} right={20} onClick={handleClose}>
            <RxCross2 size={28} className="image-icon" />
          </Box>
          <DialogTitle textAlign={"center"} mb={5}>
            New Thread...
          </DialogTitle>
          <DialogContent>
            <Stack flexDirection={"row"} gap={2} mb={5}>
              <Avatar
                src={myInfo?.profilePic || ""}
                alt={myInfo?.userName || ""}
              />
              <Stack>
                <Typography variant="h6" fontWeight={"bold"} fontSize={"1rem"}>
                  {myInfo?.userName || ""}
                </Typography>
                <textarea
                  cols={_500 ? 40 : 25}
                  rows={2}
                  className="text1"
                  placeholder="Start a Thread..."
                  autoFocus
                  value={text}
                  onChange={handleTextChange} // 👈
                />
                {isToxic && (
                  <Typography color="red" fontSize={"0.85rem"}>
                    🚫 Inappropriate content detected!
                  </Typography>
                )}
                {generatedCaption && (
                  <Typography mt={1} color="gray" fontStyle="italic">
                    💡 <strong>Suggested Caption:</strong> {generatedCaption}
                  </Typography>
                )}
                {media && (
                  <img
                    src={URL.createObjectURL(media)}
                    alt=""
                    id="url-img"
                    width={_500 ? 300 : _300 ? 200 : 100}
                    height={_500 ? 300 : _300 ? 200 : 100}
                  />
                )}
                <FaImages
                  size={28}
                  className="image-icon"
                  onClick={handleMediaRef}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="file-input"
                  ref={mediaRef}
                  onChange={(e) => setMedia(e.target.files[0])}
                />
                <Button
                  variant="outlined"
                  onClick={generateAICaption}
                  sx={{
                    mt: 2,
                    width: "fit-content",
                    textTransform: "none",
                    fontSize: "0.85rem",
                  }}
                  disabled={loadingCaption}
                >
                  {loadingCaption ? "Generating..." : "✨ Generate Caption"}
                </Button>
              </Stack>
            </Stack>
            <Stack
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="h6" fontSize={"1rem"} color={"gray"}>
                Anyone can reply
              </Typography>
              <Button
                size="large"
                sx={{
                  bgcolor:
                    isToxic || text.trim() === "" ? "lightgray" : "GrayText",
                  color: "white",
                  borderRadius: "10px",
                  ":hover": {
                    bgcolor:
                      isToxic || text.trim() === "" ? "lightgray" : "gray",
                  },
                  cursor:
                    isToxic || text.trim() === "" ? "not-allowed" : "pointer",
                }}
                onClick={handlePost}
                //   disabled={isToxic || text.trim() === ""} // ✅ works fine now

                // >
                disabled={isToxic}
              >
                {isToxic ? "🚫 Inappropriate content!" : "Post"}
              </Button>
            </Stack>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default AddPost;

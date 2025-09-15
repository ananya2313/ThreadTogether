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
import { isToxicMessage } from "../../utils/isToxicMessage";

const AddPost = () => {
  const { openAddPostModal, myInfo, darkMode } = useSelector((state) => state.service);

  const [addNewPost, addNewPostData] = useAddPostMutation();

  const _700 = useMediaQuery("(min-width:700px)");
  const _500 = useMediaQuery("(min-width:500px)");
  const _300 = useMediaQuery("(min-width:300px)");

  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [loadingCaption, setLoadingCaption] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [isToxic, setIsToxic] = useState(false);

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

      const result = await isToxicMessage(val);
      setIsToxic(result);
    } catch (err) {
      console.error("Toxicity check failed", err);
      setIsToxic(false);
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

    const SERVER_URL = import.meta.env.VITE_BACKEND_URL;

    try {
      setLoadingCaption(true);

      const res = await fetch(`${SERVER_URL}/api/ai-caption`, {
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
      PaperProps={{
        sx: {
          background: darkMode
            ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: darkMode 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(102, 126, 234, 0.1)',
          borderRadius: _700 ? '24px' : '0px',
          boxShadow: darkMode
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
            : '0 25px 50px -12px rgba(102, 126, 234, 0.3)',
        }
      }}
    >
      {addNewPostData?.isLoading ? (
        <Stack 
          height={"60vh"}
          sx={{
            background: darkMode
              ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.9) 100%)',
          }}
        >
          <Loading />
        </Stack>
      ) : (
        <>
          <Box 
            position={"absolute"} 
            top={_700 ? 20 : 16} 
            right={_700 ? 20 : 16} 
            onClick={handleClose}
            sx={{
              width: _700 ? 44 : 40,
              height: _700 ? 44 : 40,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: darkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(102, 126, 234, 0.1)',
              border: darkMode 
                ? '1px solid rgba(255, 255, 255, 0.2)' 
                : '1px solid rgba(102, 126, 234, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px) scale(1.05)',
                background: darkMode
                  ? 'rgba(255, 255, 255, 0.15)'
                  : 'rgba(102, 126, 234, 0.15)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.2)',
              }
            }}
          >
            <RxCross2 
              size={_700 ? 24 : 20} 
              color={darkMode ? "#e2e8f0" : "#667eea"}
            />
          </Box>

          <DialogTitle 
            textAlign={"center"} 
            mb={_700 ? 4 : 3}
            sx={{
              fontSize: _700 ? '1.5rem' : '1.25rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              pt: _700 ? 3 : 2,
            }}
          >
            New Thread...
          </DialogTitle>

          <DialogContent sx={{ px: _700 ? 3 : 2 }}>
            <Stack flexDirection={"row"} gap={_700 ? 3 : 2} mb={_700 ? 4 : 3}>
              <Avatar
                src={myInfo?.profilePic || ""}
                alt={myInfo?.userName || ""}
                sx={{
                  width: _700 ? 48 : 40,
                  height: _700 ? 48 : 40,
                  border: darkMode 
                    ? '2px solid rgba(255, 255, 255, 0.1)' 
                    : '2px solid rgba(102, 126, 234, 0.1)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                }}
              />
              <Stack flex={1}>
                <Typography 
                  variant="h6" 
                  fontWeight={"bold"} 
                  fontSize={_700 ? "1rem" : "0.9rem"}
                  sx={{
                    color: darkMode ? '#e2e8f0' : '#1a202c',
                    mb: 1,
                  }}
                >
                  {myInfo?.userName || ""}
                </Typography>
                
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '100%',
                    '& textarea': {
                      width: '100%',
                      maxWidth: '100%',
                      minHeight: '100px',
                      padding: '16px',
                      border: darkMode 
                        ? '1px solid rgba(255, 255, 255, 0.1)' 
                        : '1px solid rgba(102, 126, 234, 0.1)',
                      borderRadius: '16px',
                      fontSize: _700 ? '1rem' : '0.9rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: darkMode
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(102, 126, 234, 0.03)',
                      color: darkMode ? '#e2e8f0' : '#1a202c',
                      transition: 'all 0.3s ease',
                      '&::placeholder': {
                        color: darkMode ? 'rgba(226, 232, 240, 0.6)' : 'rgba(26, 32, 44, 0.6)',
                      },
                      '&:focus': {
                        background: darkMode
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(102, 126, 234, 0.05)',
                        borderColor: '#667eea',
                        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
                      }
                    }
                  }}
                >
                  <textarea
                    placeholder="Start a Thread..."
                    autoFocus
                    value={text}
                    onChange={handleTextChange}
                  />
                </Box>

                {isToxic && (
                  <Typography 
                    sx={{
                      mt: 1,
                      px: 2,
                      py: 1,
                      fontSize: "0.85rem",
                      color: '#ef4444',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '12px',
                      fontWeight: 500,
                    }}
                  >
                    🚫 Inappropriate content detected!
                  </Typography>
                )}

                {generatedCaption && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: '16px',
                      background: darkMode
                        ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                      border: darkMode 
                        ? '1px solid rgba(102, 126, 234, 0.2)' 
                        : '1px solid rgba(102, 126, 234, 0.1)',
                    }}
                  >
                    <Typography 
                      sx={{
                        fontSize: "0.9rem",
                        color: darkMode ? 'rgba(226, 232, 240, 0.8)' : 'rgba(26, 32, 44, 0.8)',
                        fontStyle: 'italic',
                      }}
                    >
                      💡 <strong style={{ color: '#667eea' }}>Suggested Caption:</strong> {generatedCaption}
                    </Typography>
                  </Box>
                )}

                {media && (
                  <Box
                    sx={{
                      mt: 2,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: darkMode 
                        ? '1px solid rgba(255, 255, 255, 0.1)' 
                        : '1px solid rgba(102, 126, 234, 0.1)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)',
                    }}
                  >
                    <img
                      src={URL.createObjectURL(media)}
                      alt=""
                      style={{
                        width: _500 ? '300px' : _300 ? '200px' : '150px',
                        height: _500 ? '300px' : _300 ? '200px' : '150px',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </Box>
                )}

                <Stack direction="row" gap={2} mt={2}>
                  <Box
                    onClick={handleMediaRef}
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: darkMode
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(102, 126, 234, 0.05)',
                      border: darkMode 
                        ? '1px solid rgba(255, 255, 255, 0.1)' 
                        : '1px solid rgba(102, 126, 234, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px) scale(1.05)',
                        background: darkMode
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'rgba(102, 126, 234, 0.1)',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.2)',
                      }
                    }}
                  >
                    <FaImages
                      size={20}
                      color={darkMode ? "#e2e8f0" : "#667eea"}
                    />
                  </Box>

                  <Button
                    variant="outlined"
                    onClick={generateAICaption}
                    disabled={loadingCaption}
                    sx={{
                      textTransform: "none",
                      fontSize: _700 ? "0.9rem" : "0.85rem",
                      fontWeight: 600,
                      borderRadius: '16px',
                      px: 3,
                      py: 1.5,
                      background: darkMode
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(102, 126, 234, 0.05)',
                      border: darkMode 
                        ? '1px solid rgba(255, 255, 255, 0.1)' 
                        : '1px solid rgba(102, 126, 234, 0.3)',
                      color: darkMode ? '#e2e8f0' : '#667eea',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        background: darkMode
                          ? 'rgba(102, 126, 234, 0.1)'
                          : 'rgba(102, 126, 234, 0.1)',
                        border: '1px solid #667eea',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.2)',
                      },
                      '&:disabled': {
                        opacity: 0.6,
                        transform: 'none',
                      }
                    }}
                  >
                    {loadingCaption ? "Generating..." : "✨ Generate Caption"}
                  </Button>
                </Stack>

                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={mediaRef}
                  onChange={(e) => setMedia(e.target.files[0])}
                />
              </Stack>
            </Stack>

            <Stack
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              sx={{
                pt: 2,
                borderTop: darkMode 
                  ? '1px solid rgba(255, 255, 255, 0.1)' 
                  : '1px solid rgba(102, 126, 234, 0.1)',
              }}
            >
              <Typography 
                variant="h6" 
                fontSize={_700 ? "1rem" : "0.9rem"} 
                sx={{
                  color: darkMode ? 'rgba(226, 232, 240, 0.6)' : 'rgba(26, 32, 44, 0.6)',
                  fontWeight: 500,
                }}
              >
                Anyone can reply
              </Typography>

              <Button
                size="large"
                onClick={handlePost}
                disabled={isToxic}
                sx={{
                  px: _700 ? 4 : 3,
                  py: 1.5,
                  borderRadius: "16px",
                  fontSize: _700 ? "1rem" : "0.9rem",
                  fontWeight: 600,
                  textTransform: "none",
                  minWidth: _700 ? '120px' : '100px',
                  transition: 'all 0.3s ease',
                  ...(isToxic || text.trim() === ""
                    ? {
                        background: darkMode
                          ? 'rgba(156, 163, 175, 0.3)'
                          : 'rgba(156, 163, 175, 0.5)',
                        color: darkMode ? 'rgba(226, 232, 240, 0.4)' : 'rgba(255, 255, 255, 0.7)',
                        cursor: 'not-allowed',
                        border: darkMode 
                          ? '1px solid rgba(156, 163, 175, 0.2)' 
                          : '1px solid rgba(156, 163, 175, 0.3)',
                      }
                    : {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
                        '&:hover': {
                          transform: 'translateY(-2px) scale(1.02)',
                          background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                        },
                        '&:active': {
                          transform: 'translateY(-1px) scale(1.01)',
                        }
                      })
                }}
              >
                {isToxic ? "🚫 Inappropriate!" : "Post"}
              </Button>
            </Stack>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default AddPost;
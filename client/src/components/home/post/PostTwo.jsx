
import { Stack, Typography, useMediaQuery } from "@mui/material";
import { FaRegHeart, FaRegComment, FaRetweet, FaHeart } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useLikePostMutation, useRepostMutation } from "../../../redux/service";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";

const PostTwo = ({ e }) => {
  const { darkMode, myInfo } = useSelector((state) => state.service);

  const [likePost] = useLikePostMutation();
  const [repost, repostData] = useRepostMutation();

  const [isLiked, setIsLiked] = useState();

  const _300 = useMediaQuery("(min-width:300px)");
  const _400 = useMediaQuery("(min-width:400px)");
  const _500 = useMediaQuery("(min-width:500px)");
  const _700 = useMediaQuery("(min-width:700px)");
  const _900 = useMediaQuery("(min-width:900px)");

  const handleLike = async () => {
    await likePost(e?._id);
  };

  const checkIsLiked = () => {
    if (e?.likes.length > 0) {
      const variable = e.likes.filter((ele) => ele._id === myInfo._id);
      if (variable.length > 0) {
        setIsLiked(true);
        return;
      }
    }
    setIsLiked(false);
  };

  const handleRepost = async () => {
    await repost(e?._id);
  };

  useEffect(() => {
    checkIsLiked();
  }, [e]);

  useEffect(() => {
    if (repostData.isSuccess) {
      toast.success(repostData.data.msg, {
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
    if (repostData.isError) {
      toast.success(repostData.error.data.msg, {
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
  }, [repostData.isSuccess, repostData.isError]);

  return (
    <>
      <Stack 
        flexDirection="column" 
        justifyContent="space-between"
        sx={{
          background: darkMode 
            ? 'linear-gradient(135deg, rgba(45, 55, 72, 0.7) 0%, rgba(74, 85, 104, 0.6) 100%)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(15px)',
          borderRadius: { xs: '16px', sm: '20px', md: '24px' },
          p: { 
            xs: 1.5, 
            sm: 2, 
            md: 2.5, 
            lg: 3 
          },
          m: { xs: 1, sm: 1.5, md: 2 },
          width: { 
            xs: 'calc(100% - 16px)', 
            sm: 'calc(100% - 24px)', 
            md: 'auto' 
          },
          maxWidth: { xs: '100%', sm: '100%', md: '600px', lg: '800px' },
          mx: 'auto',
          border: darkMode 
            ? '1px solid rgba(255, 255, 255, 0.08)' 
            : '1px solid rgba(102, 126, 234, 0.08)',
          boxShadow: darkMode 
            ? '0 8px 32px -8px rgba(0, 0, 0, 0.3)' 
            : '0 8px 32px -8px rgba(102, 126, 234, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: darkMode 
              ? '0 12px 40px -8px rgba(0, 0, 0, 0.4)' 
              : '0 12px 40px -8px rgba(102, 126, 234, 0.15)',
            background: darkMode 
              ? 'linear-gradient(135deg, rgba(45, 55, 72, 0.8) 0%, rgba(74, 85, 104, 0.7) 100%)'
              : 'rgba(255, 255, 255, 0.9)',
          }
        }}
      >
        <Stack 
          flexDirection="column" 
          gap={{ xs: 1.5, sm: 2, md: 2.5 }}
        >
          <Stack flexDirection="column" gap={{ xs: 0.5, sm: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: { 
                  xs: '0.9rem', 
                  sm: '1rem', 
                  md: '1.1rem',
                  lg: '1.2rem' 
                },
                fontWeight: 700,
                background: darkMode
                  ? 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.01em',
                mb: 0.5
              }}
            >
              {e ? e.admin.userName : ""}
            </Typography>
            <Link 
              to={`/post/${e?._id}`} 
              style={{ 
                textDecoration: "none",
                color: 'inherit'
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: { 
                    xs: '0.85rem', 
                    sm: '0.95rem', 
                    md: '1.1rem',
                    lg: '1.25rem',
                    xl: '1.3rem'
                  },
                  color: darkMode ? "#e2e8f0" : "#2d3748",
                  lineHeight: { xs: 1.4, sm: 1.5, md: 1.6 },
                  fontWeight: 400,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  wordBreak: 'break-word',
                  '&:hover': {
                    color: darkMode ? "#f7fafc" : "#667eea",
                    transform: 'translateX(2px)'
                  }
                }}
              >
                {e ? e.text : ""}
              </Typography>
            </Link>
          </Stack>
          
          {e && e.media && (
            <Stack
              sx={{
                borderRadius: { xs: '12px', sm: '16px', md: '20px' },
                overflow: 'hidden',
                boxShadow: darkMode 
                  ? '0 8px 25px -8px rgba(0, 0, 0, 0.3)' 
                  : '0 8px 25px -8px rgba(102, 126, 234, 0.15)',
                border: darkMode 
                  ? '1px solid rgba(255, 255, 255, 0.1)' 
                  : '1px solid rgba(102, 126, 234, 0.1)',
                transition: 'all 0.3s ease',
                width: '100%',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: darkMode 
                    ? '0 12px 35px -8px rgba(0, 0, 0, 0.4)' 
                    : '0 12px 35px -8px rgba(102, 126, 234, 0.2)',
                }
              }}
            >
              <img
                src={e?.media}
                alt={e?.media}
                loading="lazy"
                style={{
                  width: '100%',
                  maxWidth: _900
                    ? "500px"
                    : _700
                    ? "400px"
                    : _500
                    ? "350px"
                    : _400
                    ? "280px"
                    : _300
                    ? "220px"
                    : "180px",
                  height: "auto",
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            </Stack>
          )}
        </Stack>
        
        <Stack 
          flexDirection="column" 
          gap={{ xs: 1.5, sm: 2 }} 
          mt={{ xs: 2, sm: 2.5, md: 3 }}
        >
          <Stack 
            flexDirection="row" 
            gap={{ xs: 1.5, sm: 2, md: 2.5 }} 
            alignItems="center"
            justifyContent={{ xs: 'space-around', sm: 'flex-start' }}
            sx={{
              px: { xs: 0.5, sm: 1 },
              py: 0.5,
              flexWrap: { xs: 'nowrap', sm: 'nowrap' }
            }}
          >
            <Stack
              sx={{
                cursor: 'pointer',
                p: { xs: 1, sm: 1.2, md: 1.5 },
                borderRadius: { xs: '12px', sm: '14px', md: '16px' },
                transition: 'all 0.3s ease',
                background: isLiked 
                  ? 'linear-gradient(135deg, rgba(245, 101, 101, 0.2) 0%, rgba(229, 62, 62, 0.1) 100%)'
                  : 'transparent',
                '&:hover': {
                  background: isLiked
                    ? 'linear-gradient(135deg, rgba(245, 101, 101, 0.3) 0%, rgba(229, 62, 62, 0.2) 100%)'
                    : darkMode 
                    ? 'rgba(102, 126, 234, 0.15)'
                    : 'rgba(102, 126, 234, 0.1)',
                  transform: 'scale(1.1)',
                  boxShadow: '0 4px 12px -4px rgba(102, 126, 234, 0.3)'
                }
              }}
              onClick={handleLike}
            >
              {isLiked ? (
                <FaHeart 
                  size={
                    _700 ? 28 : 
                    _500 ? 24 : 
                    _300 ? 22 : 18
                  } 
                  color="#f56565"
                />
              ) : (
                <FaRegHeart
                  size={
                    _700 ? 28 : 
                    _500 ? 24 : 
                    _300 ? 22 : 18
                  }
                  color={darkMode ? "#e2e8f0" : "#667eea"}
                />
              )}
            </Stack>

            <Link 
              to={`/post/${e?._id}#comment`} 
              style={{ textDecoration: "none" }}
            >
              <Stack
                sx={{
                  cursor: 'pointer',
                  p: { xs: 1, sm: 1.2, md: 1.5 },
                  borderRadius: { xs: '12px', sm: '14px', md: '16px' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: darkMode 
                      ? 'rgba(102, 126, 234, 0.15)'
                      : 'rgba(102, 126, 234, 0.1)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 12px -4px rgba(102, 126, 234, 0.3)'
                  }
                }}
              >
                <FaRegComment 
                  size={
                    _700 ? 28 : 
                    _500 ? 24 : 
                    _300 ? 22 : 18
                  } 
                  color={darkMode ? "#e2e8f0" : "#667eea"}
                />
              </Stack>
            </Link>
            
            <Stack
              sx={{
                cursor: 'pointer',
                p: { xs: 1, sm: 1.2, md: 1.5 },
                borderRadius: { xs: '12px', sm: '14px', md: '16px' },
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(72, 187, 120, 0.2) 0%, rgba(56, 161, 105, 0.1) 100%)',
                  transform: 'scale(1.1)',
                  boxShadow: '0 4px 12px -4px rgba(72, 187, 120, 0.3)'
                }
              }}
              onClick={handleRepost}
            >
              <FaRetweet 
                size={
                  _700 ? 28 : 
                  _500 ? 24 : 
                  _300 ? 22 : 18
                }
                color={darkMode ? "#e2e8f0" : "#667eea"}
              />
            </Stack>
            
            <Stack
              sx={{
                cursor: 'pointer',
                p: { xs: 1, sm: 1.2, md: 1.5 },
                borderRadius: { xs: '12px', sm: '14px', md: '16px' },
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: darkMode 
                    ? 'rgba(102, 126, 234, 0.15)'
                    : 'rgba(102, 126, 234, 0.1)',
                  transform: 'scale(1.1)',
                  boxShadow: '0 4px 12px -4px rgba(102, 126, 234, 0.3)'
                }
              }}
            >
              <IoMdSend 
                size={
                  _700 ? 28 : 
                  _500 ? 24 : 
                  _300 ? 22 : 18
                }
                color={darkMode ? "#e2e8f0" : "#667eea"}
              />
            </Stack>
          </Stack>
          
          <Stack
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={{ xs: 1, sm: 2 }}
            sx={{
              px: { xs: 1, sm: 1.5, md: 2 },
              py: { xs: 1, sm: 1.2, md: 1.5 },
              background: darkMode 
                ? 'rgba(102, 126, 234, 0.1)' 
                : 'rgba(102, 126, 234, 0.05)',
              borderRadius: { xs: '12px', sm: '14px', md: '16px' },
              backdropFilter: 'blur(10px)',
              border: darkMode 
                ? '1px solid rgba(255, 255, 255, 0.05)' 
                : '1px solid rgba(102, 126, 234, 0.05)',
            }}
          >
            {e && e.likes.length > 0 && (
              <Typography
                variant="caption"
                sx={{
                  color: darkMode ? "#cbd5e0" : "#667eea",
                  fontSize: { 
                    xs: '0.8rem', 
                    sm: '0.85rem', 
                    md: '0.9rem',
                    lg: '1rem' 
                  },
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  gap: 0.5
                }}
              >
                ❤️ {e.likes.length} likes
              </Typography>
            )}
            {e && e.comments.length > 0 && (
              <Typography
                variant="caption"
                sx={{
                  color: darkMode ? "#cbd5e0" : "#667eea",
                  fontSize: { 
                    xs: '0.8rem', 
                    sm: '0.85rem', 
                    md: '0.9rem',
                    lg: '1rem' 
                  },
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  gap: 0.5
                }}
              >
                💬 {e.comments.length} comment{e.comments.length > 1 ? 's' : ''}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
export default PostTwo;
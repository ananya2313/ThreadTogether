
import { Stack, Typography, useMediaQuery } from "@mui/material";
import { IoIosMore } from "react-icons/io";
import PostOne from "./post/PostOne";
import PostTwo from "./post/PostTwo";
import { useDispatch, useSelector } from "react-redux";
import { addPostId, toggleMyMenu } from "../../redux/slice";
import { useEffect, useState } from "react";

const Post = ({ e }) => {
  const { darkMode, myInfo } = useSelector((state) => state.service);

  const [isAdmin, setIsAdmin] = useState();

  const _300 = useMediaQuery("(min-width:300px)");
  const _400 = useMediaQuery("(min-width:400px)");
  const _500 = useMediaQuery("(min-width:500px)");
  const _700 = useMediaQuery("(min-width:700px)");
  const _900 = useMediaQuery("(min-width:900px)");

  const dispatch = useDispatch();

  const handleOpenMenu = (event) => {
    dispatch(addPostId(e._id));
    dispatch(toggleMyMenu(event.currentTarget));
  };

  const checkIsAdmin = () => {
    if (e?.admin._id === myInfo._id) {
      setIsAdmin(true);
      return;
    }
    setIsAdmin(false);
  };

  useEffect(() => {
    if (e && myInfo) {
      checkIsAdmin();
    }
  }, [e, myInfo]);

  return (
    <>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{
          p: { 
            xs: 1.5, 
            sm: 2, 
            md: 2.5, 
            lg: 3 
          },
          mx: "auto",
          width: '100%',
          maxWidth: { xs: '100%', sm: '100%', md: '900px', lg: '1200px' },
          background: 'transparent',
          borderRadius: { xs: '12px', sm: '14px', md: '16px' },
          border: 'none',
          borderBottom: darkMode 
            ? '2px solid rgba(255, 255, 255, 0.1)' 
            : '2px solid rgba(102, 126, 234, 0.1)',
          transition: 'all 0.3s ease',
          position: 'relative',
          minHeight: { xs: '100px', sm: '120px', md: '140px' },
          '&:hover': {
            cursor: "pointer",
            background: darkMode
              ? 'rgba(255, 255, 255, 0.02)'
              : 'rgba(102, 126, 234, 0.03)',
            transform: 'translateY(-1px)',
            borderBottomColor: darkMode 
              ? 'rgba(255, 255, 255, 0.2)' 
              : 'rgba(102, 126, 234, 0.2)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: darkMode
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
              borderRadius: { xs: '12px', sm: '14px', md: '16px' },
              zIndex: -1,
            }
          },
          '&:last-child': {
            borderBottom: 'none',
            mb: { xs: 1, sm: 1.5, md: 2 }
          }
        }}
      >
        <Stack 
          flexDirection="row" 
          gap={{ 
            xs: 1, 
            sm: 1.5, 
            md: 2, 
            lg: 2.5 
          }}
          flex={1}
          sx={{
            minWidth: 0, // Allows flex items to shrink
            overflow: 'hidden'
          }}
        >
          <Stack
            sx={{
              minWidth: { xs: '60px', sm: '80px', md: '100px', lg: '120px' },
              maxWidth: { xs: '80px', sm: '100px', md: '120px', lg: '140px' }
            }}
          >
            <PostOne e={e} />
          </Stack>
          <Stack
            flex={1}
            sx={{
              minWidth: 0, // Prevents overflow
              width: '100%'
            }}
          >
            <PostTwo e={e} />
          </Stack>
        </Stack>
        
        <Stack
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
          gap={{ xs: 1, sm: 1.2, md: 1.5 }}
          sx={{
            minWidth: { xs: '50px', sm: '60px', md: '70px', lg: '80px' },
            ml: { xs: 1, sm: 1.5, md: 2 }
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: darkMode ? "#a0aec0" : "#718096",
              fontSize: { 
                xs: "0.75rem", 
                sm: "0.8rem", 
                md: "0.85rem",
                lg: "0.9rem",
                xl: "1rem" 
              },
              fontWeight: 500,
              background: darkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(102, 126, 234, 0.08)',
              px: { xs: 1, sm: 1.2, md: 1.5 },
              py: { xs: 0.3, sm: 0.4, md: 0.5 },
              borderRadius: { xs: '8px', sm: '10px', md: '12px' },
              border: darkMode 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(102, 126, 234, 0.1)',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              minWidth: { xs: '35px', sm: '40px', md: '45px' }
            }}
          >
            24h
          </Typography>
          
          <Stack
            sx={{
              width: { 
                xs: 28, 
                sm: 30, 
                md: 32, 
                lg: 34, 
                xl: 36 
              },
              height: { 
                xs: 28, 
                sm: 30, 
                md: 32, 
                lg: 34, 
                xl: 36 
              },
              borderRadius: { xs: '8px', sm: '10px', md: '12px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isAdmin 
                ? (darkMode
                  ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)')
                : 'transparent',
              border: darkMode 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(102, 126, 234, 0.1)',
              cursor: isAdmin ? 'pointer' : 'default',
              transition: 'all 0.3s ease',
              '&:hover': isAdmin ? {
                transform: 'scale(1.1)',
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)'
                  : 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                boxShadow: '0 5px 15px -5px rgba(102, 126, 234, 0.3)',
              } : {}
            }}
            onClick={isAdmin ? handleOpenMenu : undefined}
          >
            <IoIosMore 
              size={
                _900 ? 18 :
                _700 ? 16 :
                _500 ? 15 :
                _400 ? 14 : 13
              } 
              color={isAdmin 
                ? (darkMode ? "#e2e8f0" : "#667eea")
                : (darkMode ? "#a0aec0" : "#cbd5e0")
              }
            />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default Post;
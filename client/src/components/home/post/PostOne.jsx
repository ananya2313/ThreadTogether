

import {
  Avatar,
  AvatarGroup,
  Badge,
  Stack,
  Stepper,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const PostOne = ({ e }) => {
  const { darkMode } = useSelector((state) => state.service);
  const _700 = useMediaQuery("(min-width:700px)");
  const _300 = useMediaQuery("(min-width:300px)");
  const _500 = useMediaQuery("(min-width:500px)");
  const _900 = useMediaQuery("(min-width:900px)");

  return (
    <>
      <Stack
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          position: 'relative',
          minHeight: { xs: '120px', sm: '140px', md: '160px', lg: '180px' },
          px: { xs: 0.5, sm: 1, md: 1.5 },
          py: { xs: 1, sm: 1.5, md: 2 },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: '1.5px', sm: '2px', md: '2.5px' },
            height: '100%',
            background: darkMode 
              ? 'linear-gradient(180deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.1) 100%)'
              : 'linear-gradient(180deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.05) 100%)',
            borderRadius: { xs: '1px', sm: '2px' },
            zIndex: 0
          }
        }}
      >
        <Link 
          to={`/profile/threads/${e?.admin._id}`}
          style={{ 
            textDecoration: "none",
            position: 'relative',
            zIndex: 2
          }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Avatar
                alt="+"
                src=""
                sx={{
                  width: { 
                    xs: 16, 
                    sm: 18, 
                    md: 20, 
                    lg: 22, 
                    xl: 24 
                  },
                  height: { 
                    xs: 16, 
                    sm: 18, 
                    md: 20, 
                    lg: 22, 
                    xl: 24 
                  },
                  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                  color: 'white',
                  fontSize: { 
                    xs: '0.5rem', 
                    sm: '0.55rem', 
                    md: '0.65rem', 
                    lg: '0.7rem', 
                    xl: '0.75rem' 
                  },
                  fontWeight: 700,
                  position: { xs: "initial", sm: "initial", md: "relative" },
                  right: { xs: 0, sm: 0, md: 2, lg: 3, xl: 4 },
                  bottom: { xs: 0, sm: 0, md: 2, lg: 3, xl: 4 },
                  border: `2px solid ${darkMode ? '#2d3748' : '#ffffff'}`,
                  boxShadow: darkMode 
                    ? '0 4px 12px -4px rgba(72, 187, 120, 0.4)' 
                    : '0 4px 12px -4px rgba(72, 187, 120, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
                  }
                }}
              >
                +
              </Avatar>
            }
          >
            <Avatar
              alt={e ? e.admin.userName : ""}
              src={e ? e.admin.profilePic : ""}
              sx={{ 
                width: { 
                  xs: 32, 
                  sm: 36, 
                  md: 40, 
                  lg: 44, 
                  xl: 48 
                }, 
                height: { 
                  xs: 32, 
                  sm: 36, 
                  md: 40, 
                  lg: 44, 
                  xl: 48 
                },
                border: darkMode 
                  ? '3px solid rgba(255, 255, 255, 0.15)' 
                  : '3px solid rgba(102, 126, 234, 0.15)',
                boxShadow: darkMode 
                  ? '0 8px 25px -8px rgba(0, 0, 0, 0.3)' 
                  : '0 8px 25px -8px rgba(102, 126, 234, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: darkMode 
                    ? '0 12px 30px -8px rgba(0, 0, 0, 0.4)' 
                    : '0 12px 30px -8px rgba(102, 126, 234, 0.3)',
                  border: darkMode 
                    ? '3px solid rgba(255, 255, 255, 0.25)' 
                    : '3px solid rgba(102, 126, 234, 0.25)',
                }
              }}
            />
          </Badge>
        </Link>
        
        <Stack
          flexDirection="column"
          alignItems="center"
          gap={{ xs: 1.5, sm: 2 }}
          height="100%"
          sx={{ 
            position: 'relative',
            zIndex: 1,
            mt: { xs: 1.5, sm: 2 },
            width: '100%',
            maxWidth: { xs: '100px', sm: '120px', md: '140px' }
          }}
        >
          {e && e.comments.length > 0 && (
            <Stack
              alignItems="center"
              sx={{
                background: darkMode 
                  ? 'linear-gradient(135deg, rgba(45, 55, 72, 0.8) 0%, rgba(74, 85, 104, 0.6) 100%)'
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(15px)',
                borderRadius: { xs: '16px', sm: '18px', md: '20px' },
                p: { xs: 1, sm: 1.2, md: 1.5 },
                border: darkMode 
                  ? '1px solid rgba(255, 255, 255, 0.1)' 
                  : '1px solid rgba(102, 126, 234, 0.1)',
                boxShadow: darkMode 
                  ? '0 8px 32px -8px rgba(0, 0, 0, 0.3)' 
                  : '0 8px 32px -8px rgba(102, 126, 234, 0.15)',
                transition: 'all 0.3s ease',
                minWidth: { xs: '60px', sm: '70px', md: '80px' },
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: darkMode 
                    ? '0 12px 40px -8px rgba(0, 0, 0, 0.4)' 
                    : '0 12px 40px -8px rgba(102, 126, 234, 0.2)',
                }
              }}
            >
              <AvatarGroup
                total={e?.comments.length}
                sx={{
                  "& .MuiAvatar-root": {
                    width: { 
                      xs: 18, 
                      sm: 20, 
                      md: 24, 
                      lg: 26, 
                      xl: 28 
                    },
                    height: { 
                      xs: 18, 
                      sm: 20, 
                      md: 24, 
                      lg: 26, 
                      xl: 28 
                    },
                    fontSize: { 
                      xs: '0.5rem', 
                      sm: '0.55rem', 
                      md: '0.65rem', 
                      lg: '0.7rem', 
                      xl: '0.75rem' 
                    },
                    fontWeight: 600,
                    border: darkMode 
                      ? '2px solid rgba(255, 255, 255, 0.2)' 
                      : '2px solid rgba(102, 126, 234, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      zIndex: 10,
                    }
                  },
                  "& .MuiAvatar-colorDefault": {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 700,
                  },
                  '& .MuiAvatarGroup-avatar': {
                    marginLeft: { xs: '-6px', sm: '-8px', md: '-8px' }
                  }
                }}
              >
                <Avatar
                  src={e?.comments[0].admin.profilePic}
                  alt={e?.comments[0].admin.userName}
                  sx={{
                    boxShadow: darkMode 
                      ? '0 4px 12px -4px rgba(0, 0, 0, 0.3)' 
                      : '0 4px 12px -4px rgba(102, 126, 234, 0.2)',
                  }}
                />
                {e.comments.length > 1 && (
                  <Avatar
                    src={e?.comments[1].admin.profilePic}
                    alt={e?.comments[1].admin.userName}
                    sx={{
                      boxShadow: darkMode 
                        ? '0 4px 12px -4px rgba(0, 0, 0, 0.3)' 
                        : '0 4px 12px -4px rgba(102, 126, 234, 0.2)',
                    }}
                  />
                )}
              </AvatarGroup>
            </Stack>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default PostOne;

import { Grid, Stack, useMediaQuery } from "@mui/material";
import Navbar from "./Navbar";
import { IoMenu } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toggleMainMenu } from "../../redux/slice";

const Header = () => {
  const { darkMode } = useSelector((state) => state.service);
  const _700 = useMediaQuery("(min-width:700px)");

  const dispatch = useDispatch();

  const handleOpenMenu = (e) => {
    dispatch(toggleMainMenu(e.currentTarget));
  };

  return (
    <>
      {_700 ? (
        <Stack
          direction="row"
          height={70}
          justifyContent="space-around"
          alignItems="center"
          position="sticky"
          top={0}
          sx={{
            background: darkMode 
              ? 'linear-gradient(135deg, rgba(45, 55, 72, 0.95) 0%, rgba(74, 85, 104, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            borderBottom: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(102, 126, 234, 0.1)',
            boxShadow: darkMode 
              ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
              : '0 8px 32px rgba(102, 126, 234, 0.15)',
            zIndex: 1000,
            transition: 'all 0.3s ease'
          }}
        >
          {/* Logo Section */}
          <Stack
            sx={{
              p: 1,
              borderRadius: '16px',
              background: darkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(102, 126, 234, 0.05)',
              border: darkMode 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(102, 126, 234, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                background: darkMode
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(102, 126, 234, 0.08)',
              }
            }}
          >
            <img
              src={
                darkMode
                  ? "/Threads-logo-black-bg.webp"
                  : "/Threads-logo-white-bg.png"
              }
              alt="ThreadTogether Logo"
              width={60}
              height={35}
              style={{
                borderRadius: '8px'
              }}
            />
          </Stack>

          {/* Navigation Section */}
          <Stack
            width={600}
            justifyContent="center"
            height={56}
            sx={{
              background: darkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: darkMode 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(102, 126, 234, 0.1)',
              boxShadow: darkMode
                ? '0 8px 25px rgba(0, 0, 0, 0.2)'
                : '0 8px 25px rgba(102, 126, 234, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: darkMode
                  ? '0 12px 35px rgba(0, 0, 0, 0.3)'
                  : '0 12px 35px rgba(102, 126, 234, 0.15)',
              }
            }}
          >
            <Navbar />
          </Stack>

          {/* Menu Button */}
          <Stack
            sx={{
              width: 48,
              height: 48,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: darkMode
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              border: darkMode 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(102, 126, 234, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1) translateY(-2px)',
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)'
                  : 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
              },
              '&:active': {
                transform: 'scale(1.05)',
              }
            }}
            onClick={handleOpenMenu}
          >
            <IoMenu
              size={24}
              color={darkMode ? "#e2e8f0" : "#667eea"}
            />
          </Stack>
        </Stack>
      ) : (
        <>
          {/* Mobile Bottom Navigation */}
          <Stack
            position="fixed"
            bottom={0}
            width="100%"
            height={60}
            justifyContent="center"
            p={1}
            sx={{
              background: darkMode 
                ? 'linear-gradient(135deg, rgba(45, 55, 72, 0.95) 0%, rgba(74, 85, 104, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
              backdropFilter: 'blur(20px)',
              borderTop: darkMode 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(102, 126, 234, 0.1)',
              boxShadow: darkMode 
                ? '0 -8px 32px rgba(0, 0, 0, 0.3)' 
                : '0 -8px 32px rgba(102, 126, 234, 0.15)',
              zIndex: 1000,
            }}
          >
            <Navbar />
          </Stack>

          {/* Mobile Top Header */}
          <Grid
            container
            height={70}
            justifyContent="space-between"
            alignItems="center"
            px={2}
            py={1}
            sx={{
              background: darkMode 
                ? 'linear-gradient(135deg, rgba(45, 55, 72, 0.95) 0%, rgba(74, 85, 104, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
              backdropFilter: 'blur(20px)',
              borderBottom: darkMode 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(102, 126, 234, 0.1)',
              boxShadow: darkMode 
                ? '0 4px 20px rgba(0, 0, 0, 0.2)' 
                : '0 4px 20px rgba(102, 126, 234, 0.1)',
            }}
          >
            <Grid item xs={8}>
              <Stack
                sx={{
                  p: 1,
                  borderRadius: '16px',
                  background: darkMode
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(102, 126, 234, 0.05)',
                  border: darkMode 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(102, 126, 234, 0.1)',
                  display: 'inline-flex',
                  width: 'fit-content'
                }}
              >
                <img
                  src={
                    darkMode
                      ? "/Threads-logo-black-bg.webp"
                      : "/Threads-logo-white-bg.png"
                  }
                  alt="ThreadTogether Logo"
                  width={60}
                  height={35}
                  style={{
                    borderRadius: '8px'
                  }}
                />
              </Stack>
            </Grid>
            
            <Grid item xs={4} display="flex" justifyContent="flex-end">
              <Stack
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  border: darkMode 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(102, 126, 234, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    background: darkMode
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)'
                      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                  }
                }}
                onClick={handleOpenMenu}
              >
                <IoMenu
                  size={22}
                  color={darkMode ? "#e2e8f0" : "#667eea"}
                />
              </Stack>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default Header;



import { Box, Stack, Typography } from "@mui/material";
import Post from "../../../components/home/Post";
import { useSelector } from "react-redux";

const Repost = () => {
  const { user, darkMode } = useSelector((state) => state.service);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "800px",
        mx: "auto",
        mt: 3,
        mb: 4,
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4 },
        background: darkMode 
          ? 'linear-gradient(135deg, rgba(45, 55, 72, 0.95) 0%, rgba(74, 85, 104, 0.9) 100%)'
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: "24px",
        boxShadow: darkMode 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' 
          : '0 25px 50px -12px rgba(102, 126, 234, 0.15)',
        border: darkMode 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : '1px solid rgba(102, 126, 234, 0.1)',
        minHeight: "60vh",
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: darkMode 
            ? '0 30px 60px -12px rgba(0, 0, 0, 0.5)' 
            : '0 30px 60px -12px rgba(102, 126, 234, 0.2)',
        }
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            background: darkMode
              ? 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            textAlign: 'center',
            mb: 1,
            letterSpacing: '-0.02em'
          }}
        >
          🔄 Your Reposts
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: darkMode ? "#a0aec0" : "#718096",
            textAlign: 'center',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            fontWeight: 500
          }}
        >
          Posts you have shared with the community
        </Typography>
      </Box>

      <Stack spacing={3}>
        {user?.user?.reposts?.length > 0 ? (
          user.user.reposts.map((e) => (
            <Box
              key={e._id}
              sx={{
                background: darkMode
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: darkMode 
                  ? '1px solid rgba(255, 255, 255, 0.1)' 
                  : '1px solid rgba(102, 126, 234, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: darkMode
                    ? '0 15px 35px -12px rgba(0, 0, 0, 0.3)'
                    : '0 15px 35px -12px rgba(102, 126, 234, 0.2)',
                  background: darkMode
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              <Post e={e} />
            </Box>
          ))
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              px: 4
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '3rem', sm: '4rem' },
                mb: 3,
                opacity: 0.6
              }}
            >
              🌿
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: darkMode ? "#cbd5e0" : "#4a5568",
                fontWeight: 600,
                fontSize: { xs: '1.2rem', sm: '1.4rem' },
                textAlign: 'center',
                mb: 2
              }}
            >
              No reposts yet
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: darkMode ? "#a0aec0" : "#718096",
                textAlign: 'center',
                fontSize: { xs: '0.95rem', sm: '1rem' },
                maxWidth: '400px',
                lineHeight: 1.6
              }}
            >
              Share inspiring posts from the community! Your reposts help spread positivity and meaningful content.
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default Repost;


import { Button, Stack, Typography, Box } from "@mui/material";
import Input from "../../components/home/Input";
import Post from "../../components/home/Post";
import Loading from "../../components/common/Loading";
import { useAllPostQuery } from "../../redux/service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const [page, setPage] = useState(1);
  const [showMore, setShowMore] = useState(true);
  const { data, isLoading } = useAllPostQuery(page);
  const { allPosts, darkMode } = useSelector((state) => state.service);

  const handleClick = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (data && data.posts.length < 3) {
      setShowMore(false);
    }
  }, [data]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mt: 3,
        mb: 4,
        px: 2
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
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
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3, sm: 4 },
          minHeight: "80vh",
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
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              background: darkMode
                ? 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              mb: 1,
              letterSpacing: '-0.02em'
            }}
          >
            🌸 ThreadTogether
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: darkMode ? "#a0aec0" : "#718096",
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 500
            }}
          >
            Share your thoughts in our peaceful community
          </Typography>
        </Box>

        {/* Input Section */}
        <Box
          sx={{
            mb: 4,
            background: darkMode
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(102, 126, 234, 0.1)',
            p: { xs: 2, sm: 3 },
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
          <Input />
        </Box>

        {/* Posts Section */}
        <Stack spacing={3} mb={5}>
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                py: 8
              }}
            >
              <Loading />
            </Box>
          ) : allPosts?.length > 0 ? (
            allPosts.map((e) => (
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
                🌱
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
                No posts yet
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
                Be the first to share something beautiful! Start a conversation and help grow our peaceful community.
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Load More Section */}
        {showMore ? (
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              onClick={handleClick}
              sx={{
                minWidth: '160px',
                height: 48,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                },
              }}
            >
              🔮 Load More
            </Button>
          </Box>
        ) : (
          allPosts?.length > 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                px: 4
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                  mb: 2,
                  opacity: 0.6
                }}
              >
                🎉
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: darkMode ? "#cbd5e0" : "#4a5568",
                  fontWeight: 600,
                  fontSize: { xs: '1.1rem', sm: '1.3rem' },
                  textAlign: 'center',
                  mb: 1
                }}
              >
                You have reached the end!
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: darkMode ? "#a0aec0" : "#718096",
                  textAlign: 'center',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                }}
              >
                Thanks for exploring our peaceful community 💫
              </Typography>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

export default Home;
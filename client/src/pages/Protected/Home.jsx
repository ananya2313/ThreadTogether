
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
  const { allPosts } = useSelector((state) => state.service);

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
        mt: 5,
      }}
    >
      <Box
        sx={{
          width: "600px", // SAME as Repost/Replies
          backgroundColor: "#f5f7ff", // SAME as Repost/Replies
          px: 2,
          py: 3,
          borderRadius: "16px",
          minHeight: "100vh",
          boxShadow: "0 4px 20px rgba(180, 170, 255, 0.15)",
        }}
      >
        <Box
          sx={{
            mb: 4,
            p: 2,
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(180, 170, 255, 0.1)",
          }}
        >
          <Input />
        </Box>

        <Stack spacing={3} mb={5}>
          {isLoading ? (
            <Loading />
          ) : allPosts?.length > 0 ? (
            allPosts.map((e) => <Post key={e._id} e={e} />)
          ) : (
            <Typography variant="body1" textAlign="center" color="text.secondary">
              No posts yet!
            </Typography>
          )}
        </Stack>

        {showMore ? (
          <Box textAlign="center" mt={3}>
            <Button
              variant="outlined"
              onClick={handleClick}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 500,
                borderRadius: "10px",
                borderColor: "#c9b6ff",
                color: "#7b42f6",
                "&:hover": {
                  backgroundColor: "#f2e9ff",
                  borderColor: "#a689ff",
                },
              }}
            >
              Load More
            </Button>
          </Box>
        ) : (
          allPosts?.length > 0 && (
            <Typography
              variant="subtitle1"
              textAlign="center"
              color="text.secondary"
              mt={3}
            >
              You have reached the end!
            </Typography>
          )
        )}
      </Box>
    </Box>
  );
};

export default Home;

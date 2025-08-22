

import { Box, Stack, Typography } from "@mui/material";
import Post from "../../../components/home/Post";
import { useSelector } from "react-redux";

const Threads = () => {
  const { user } = useSelector((state) => state.service);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "750px",
        mx: "auto",
        mt: 5,
        px: { xs: 2, sm: 3 },
        py: 1,
        backgroundColor: "#fdf6ff",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(180, 170, 255, 0.2)",
        minHeight: "100vh",
      }}
    >
      <Stack spacing={3} mb={5}>
        {user?.user?.threads?.length > 0 ? (
          user.user.threads.map((e) => <Post key={e._id} e={e} />)
        ) : (
          <Typography variant="body1" textAlign="center" color="text.secondary">
            No Threads yet!
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default Threads;

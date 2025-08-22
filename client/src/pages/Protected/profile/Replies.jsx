

import { Box, Stack, Typography } from "@mui/material";
import Comments from "../../../components/home/post/Comments";
import { useSelector } from "react-redux";

const Replies = () => {
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
        {user?.user?.replies?.length > 0 ? (
          user.user.replies.map((e) => (
            <Comments key={e._id} e={e} postId={e.post} />
          ))
        ) : (
          <Typography variant="body1" textAlign="center" color="text.secondary">
            No Replies yet!
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default Replies;

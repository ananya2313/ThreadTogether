


import { Stack, CircularProgress, Typography, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";

const Loading = () => {
  const { darkMode } = useSelector((state) => state.service);
  const _700 = useMediaQuery("(min-width:700px)");

  return (
    <Stack
      flexDirection="column"
      minHeight="100vh"
      width="100%"
      justifyContent="center"
      alignItems="center"
      gap={3}
      bgcolor={darkMode ? "#1a202c" : "#E6E6FA"} // Dark vs Lavender
    >
      <CircularProgress
        thickness={5}
        size={_700 ? 70 : 50}
        sx={{
          color: darkMode ? "#90cdf4" : "#C8A2C8", // Blue in dark, lilac in light
        }}
      />
      <Typography
        variant={_700 ? "h6" : "body1"}
        sx={{ color: darkMode ? "#e2e8f0" : "#4a5568" }}
      >
        Loading, please wait...
      </Typography>
    </Stack>
  );
};

export default Loading;

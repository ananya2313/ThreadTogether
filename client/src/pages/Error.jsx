import { Button, Stack, Typography, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  const { darkMode } = useSelector((state) => state.service);
  const _700 = useMediaQuery("(min-width:700px)");

  return (
    <Stack
      width="100%"
      height="100vh"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: 'url("/error-bg.png")',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Stack
        p={_700 ? 5 : 3}
        border={darkMode ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.2)"}
        bgcolor={
          darkMode
            ? "rgba(30,30,30,0.9)"
            : "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)"
        }
        borderRadius="20px"
        flexDirection="column"
        alignItems="center"
        gap={2}
        boxShadow={
          darkMode
            ? "0 10px 30px rgba(0,0,0,0.7)"
            : "0 10px 30px rgba(102,126,234,0.3)"
        }
      >
        <Typography
          variant={_700 ? "h2" : "h4"}
          fontWeight="bold"
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Oops!
        </Typography>

        <Typography
          variant={_700 ? "h6" : "body1"}
          textAlign="center"
          sx={{ color: darkMode ? "#e2e8f0" : "#1a202c" }}
        >
          You entered the wrong location!
        </Typography>

        <Button
          size={_700 ? "large" : "medium"}
          onClick={() => navigate(-1)}
          sx={{
            mt: 2,
            px: _700 ? 4 : 3,
            py: _700 ? 1.5 : 1,
            borderRadius: "12px",
            fontSize: _700 ? "1rem" : "0.9rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            boxShadow: "0 6px 20px rgba(102,126,234,0.3)",
            "&:hover": {
              transform: "translateY(-1px) scale(1.02)",
              background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
              boxShadow: "0 8px 25px rgba(102,126,234,0.4)",
            },
          }}
        >
          Go Back
        </Button>
      </Stack>
    </Stack>
  );
};

export default Error;

import { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";

const FakeNews = () => {
  const [news, setNews] = useState("");
  const [result, setResult] = useState(null);
  const { darkMode } = useSelector((state) => state.service);
  const _700 = useMediaQuery("(min-width:700px)");
  const handleCheck = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setResult("⚠️ You must be logged in.");
        return;
      }
      const SERVER_URL = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.post(
        `${SERVER_URL}/api/detect-fake-news`,
        { news },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setResult(res.data.result || "✅ Server responded, but no result returned.");
    } catch (err) {
      console.error("Fake news detection error:", err?.response || err);
      if (err.response?.status === 401) {
        setResult("⛔ Unauthorized. Please log in again.");
      } else {
        setResult("🚨 Error checking news.");
      }
    }
  };

  return (
    <Box
      p={_700 ? 4 : 2}
      mx="auto"
      maxWidth={_700 ? "700px" : "95%"}
      sx={{
        background: darkMode
          ? "linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(20,20,20,0.98) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)",
        border: darkMode
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid rgba(102,126,234,0.1)",
        borderRadius: "20px",
        boxShadow: darkMode
          ? "0 25px 50px -12px rgba(0,0,0,0.8)"
          : "0 25px 50px -12px rgba(102,126,234,0.3)",
      }}
    >
      <Typography
        variant={_700 ? "h5" : "h6"}
        mb={_700 ? 3 : 2}
        sx={{
          fontWeight: "bold",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        🕵️‍♀️ Fake News Detection
      </Typography>

      <TextField
        label="Enter News Content"
        multiline
        fullWidth
        rows={_700 ? 6 : 4}
        value={news}
        onChange={(e) => setNews(e.target.value)}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(102,126,234,0.03)",
            color: darkMode ? "#e2e8f0" : "#1a202c",
            borderRadius: "16px",
            "& fieldset": {
              border: darkMode
                ? "1px solid rgba(255,255,255,0.2)"
                : "1px solid rgba(102,126,234,0.2)",
            },
            "&:hover fieldset": {
              borderColor: "#667eea",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#667eea",
              boxShadow: "0 0 0 3px rgba(102,126,234,0.1)",
            },
          },
          "& label": {
            color: darkMode ? "#e2e8f0" : "#1a202c",
          },
        }}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleCheck}
        sx={{
          py: 1.8,
          borderRadius: "16px",
          fontSize: _700 ? "1rem" : "0.9rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          boxShadow: "0 6px 20px rgba(102,126,234,0.3)",
          "&:hover": {
            transform: "translateY(-1px) scale(1.01)",
            background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
            boxShadow: "0 8px 25px rgba(102,126,234,0.4)",
          },
        }}
      >
        Check Authenticity
      </Button>

      {result && (
        <Typography
          mt={3}
          fontWeight="bold"
          sx={{ color: darkMode ? "#e2e8f0" : "#1a202c" }}
        >
          Result: {result}
        </Typography>
      )}
    </Box>
  );
};

export default FakeNews;

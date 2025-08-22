import { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";

const FakeNews = () => {
  const [news, setNews] = useState("");
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setResult("⚠️ You must be logged in.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/detect-fake-news",
        { news },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // ✅ Add this if using cookies also
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
    <Box p={4}>
      <Typography variant="h5" mb={2}>
        🕵️‍♀️ Fake News Detection
      </Typography>
      <TextField
        label="Enter News Content"
        multiline
        fullWidth
        rows={6}
        value={news}
        onChange={(e) => setNews(e.target.value)}
      />
      <Button variant="contained" onClick={handleCheck} sx={{ mt: 2 }}>
        Check Authenticity
      </Button>

      {result && (
        <Typography mt={3} fontWeight="bold">
          Result: {result}
        </Typography>
      )}
    </Box>
  );
};

export default FakeNews;

const axios = require("axios");
require("dotenv").config();

const detectFakeNews = async (req, res) => {
  const { news } = req.body;

  if (!news) {
    return res.status(400).json({ error: "News content is required." });
  }
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,

      {
        contents: [
          {
            parts: [
              {
                text: `Is the following news fake or real? Explain.\n\n${news}`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.candidates[0].content.parts[0].text;
    res.json({ result: reply });
  } catch (error) {
    console.error(
      "Error using Gemini:",
      error?.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to detect fake news." });
  }
};

module.exports = { detectFakeNews };






const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Reusable function for internal use
async function isToxic(text) {
  if (!text) throw new Error("Text is required");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      `Is the following message inappropriate or offensive? Just say "yes" or "no": "${text}"`
    );

    const output = await result.response.text();
    return output.toLowerCase().includes("yes");
  } catch (err) {
    // 👇 Instead of throwing, log and allow safe fallback
    console.warn("⚠️ Moderation skipped due to Gemini error:", err.message);
    return false; // assume safe if moderation unavailable
  }
}

// Express route for API
async function checkToxicityRoute(req, res) {
  try {
    const { text } = req.body;
    const toxic = await isToxic(text);
    res.status(200).json({ isToxic: toxic });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ msg: "Gemini API failed", error: error.message });
  }
}

module.exports = { isToxic, checkToxicityRoute };

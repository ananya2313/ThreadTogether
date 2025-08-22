const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.checkToxicity = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ msg: "Text is required" });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


    const result = await model.generateContent(
      `Is the following message inappropriate or offensive? Just say "yes" or "no": "${text}"`
    );

    const output = await result.response.text();
    const isToxic = output.toLowerCase().includes("yes");

    res.status(200).json({ isToxic });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ msg: "Gemini API failed", error: error.message });
  }
};



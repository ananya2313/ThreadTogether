

// require("dotenv").config();
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// exports.generateCaption = async (req, res) => {
//   try {
//     const { text } = req.body;

//     if (!text || text.trim() === "") {
//       return res.status(400).json({ error: "Text is required." });
//     }

  
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


    

//     const result = await model.generateContent(text);
//     const response = await result.response;
//     const caption = response.text();

//     res.status(200).json({ caption });
//   } catch (error) {
//     console.error("Error generating caption:", error.message);
//     res
//       .status(500)
//       .json({ error: "Something went wrong while generating the caption." });
//   }
// };



require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateCaption = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Text is required." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(text);
    const caption = result.response.text();

    res.status(200).json({ caption });
  } catch (error) {
    console.error("Error generating caption:", error.message);
    res
      .status(500)
      .json({ error: "Something went wrong while generating the caption." });
  }
};

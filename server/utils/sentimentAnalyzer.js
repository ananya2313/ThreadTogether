const Sentiment = require("sentiment");
const sentiment = new Sentiment();

const analyzeSentiment = (text) => {
  const result = sentiment.analyze(text);

  let sentimentType = "neutral";
  if (result.score > 0) sentimentType = "positive";
  else if (result.score < 0) sentimentType = "negative";

  return {
    score: result.score,
    comparative: result.comparative,
    type: sentimentType,
    words: result.words,
  };
};

module.exports = analyzeSentiment;

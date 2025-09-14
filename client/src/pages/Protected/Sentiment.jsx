import { useState } from "react";
import axios from "axios";

const Sentiment = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setError("");
    setResult(null);
    if (!text.trim()) {
      setError("Please enter some text.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/analyze",
        { text },
        { withCredentials: true }
      );
      setResult(res.data.sentiment);
    } catch (err) {
      setError(
        err?.response?.data?.error || "Something went wrong. Try again."
      );
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "2rem" }}>
      <h2>🧠 Sentiment Analysis</h2>
      <textarea
        rows={4}
        style={{ width: "100%", padding: "1rem" }}
        placeholder="Enter your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>

      <button
        onClick={handleAnalyze}
        style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}
      >
        Analyze Sentiment
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "1rem" }}>
          <h4>Result:</h4>
          <p>
            <strong>Sentiment:</strong> {result.type}
          </p>
          <p>
            <strong>Score:</strong> {result.score}
          </p>
          <p>
            <strong>Comparative:</strong> {result.comparative}
          </p>
          <p>
            <strong>Keywords:</strong> {result.words.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default Sentiment;

const SERVER_URL = process.env.VITE_BACKEND_URL;
require('dotenv').config();
export const isToxicMessage = async (text) => {
  try {
    const res = await fetch(`${SERVER_URL}/api/moderation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }), // ✅ correct key
    });

    const data = await res.json();
    return data.isToxic;
  } catch (error) {
    console.error("Toxic check failed", error);
    return false;
  }
};

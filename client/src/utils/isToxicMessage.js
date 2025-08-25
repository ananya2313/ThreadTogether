const SERVER_URL = import.meta.env.VITE_BACKEND_URL;

export const isToxicMessage = async (text) => {
  try {
    const res = await fetch(`${SERVER_URL}/api/moderation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    return data.isToxic;
  } catch (error) {
    console.error("Toxic check failed", error);
    return false;
  }
};

// const SERVER_URL = import.meta.env.VITE_BACKEND_URL;

// export const isToxicMessage = async (text) => {
//   try {
//     const res = await fetch(`${SERVER_URL}/api/moderation`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ text }),
//     });

//     const data = await res.json();
//     return data.isToxic;
//   } catch (error) {
//     console.error("Toxic check failed", error);
//     return false;
//   }
// };

const SERVER_URL = import.meta.env.VITE_BACKEND_URL;

export const isToxicMessage = async (text) => {
  try {
    const res = await fetch(`${SERVER_URL}/api/moderation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const textData = await res.text(); // raw response
    if (!textData) return false; // empty response fallback

    const data = JSON.parse(textData); // safe parse
    return data.isToxic;
  } catch (error) {
    console.error("Toxic check failed", error);
    return false;
  }
};

const isLocalHost =
   typeof window !== "undefined" &&
   ["localhost", "127.0.0.1"].includes(window.location.hostname);

const fallbackApiUrl = isLocalHost
   ? "http://localhost:5000/api"
   : "https://hospitalm-9kap.onrender.com/api";

export const API_URL = (import.meta.env.VITE_API_URL || fallbackApiUrl).trim();


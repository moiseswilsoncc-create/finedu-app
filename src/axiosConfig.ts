import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL; // ✅ en vez de process.env

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

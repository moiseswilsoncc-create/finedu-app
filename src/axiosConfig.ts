// src/axiosConfig.ts
import axios from "axios";

// ✅ Usamos import.meta.env en lugar de process.env
const apiUrl = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

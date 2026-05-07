import axios from "axios";

export const API_BASE = "https://medic-ai-chat-bot-backend-3.onrender.com";

export const api = axios.create({ baseURL: API_BASE });

//token validation

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("med_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

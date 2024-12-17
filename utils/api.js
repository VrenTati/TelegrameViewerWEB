import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // Замініть на вашу адресу сервера
});

export default api;

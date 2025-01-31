import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // Your server URL
});

// Add an interceptor for adding token to the request if you are using JWT
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

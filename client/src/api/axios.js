import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api", // ✅ Fixed
  withCredentials: true
});

export default API;
import axios from "axios";

const API = axios.create({
  baseURL: "https://beauty-product.onrender.com/api",
  withCredentials: true
});

export default API;
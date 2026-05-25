import axios from "axios";

const api = axios.create({
  baseURL: "http://10.68.76.165:8083/api",
  timeout: 10000,
});

export default api;

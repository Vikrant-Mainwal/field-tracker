import axios from "axios";

const API = axios.create({
  baseURL: "url/api",
});

export default API;

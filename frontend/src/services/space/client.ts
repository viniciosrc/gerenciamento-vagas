import axios from "axios";

const spaceApi = axios.create({
  baseURL: "http://localhost:3000/api/spaces",
});

export default spaceApi;

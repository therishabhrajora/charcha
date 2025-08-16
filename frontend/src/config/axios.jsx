import axios from "axios";
// export const baseURl = "http://localhost:8080";
export const baseURl = "https://charcha-68tw.onrender.com";

export const httpClient = axios.create({
  baseURL: baseURl,
});

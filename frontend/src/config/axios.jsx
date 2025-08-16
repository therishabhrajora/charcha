import axios from "axios";
export const baseURl = "http://localhost:8080";

export const httpClient = axios.create({
  baseURL: baseURl,
});

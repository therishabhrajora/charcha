import { httpClient } from "../config/axios";

export const createRoomApi = async (roomDetails) => {
  const res = await httpClient.post(`/api/v1/rooms`, roomDetails);
  return res.data;
};

export const joinRoomApi = async (roomId) => {
  const res = await httpClient.get(`/api/v1/rooms/${roomId}`);
  return res.data;
};

export const getRoomMessages = async (roomId) => {
  const res = await httpClient.get(`/api/v1/rooms/${roomId}/messages`);
  return res.data;
};

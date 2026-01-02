import axios from "axios";

const API_URL = "http://localhost:4000/api";

export async function fetchBuses(params = {}) {
  const response = await axios.get(`${API_URL}/buses`, {
    params
  });
  return response.data;
}

export async function fetchBusById(id) {
  const response = await axios.get(`${API_URL}/buses/${id}`);
  return response.data;
}

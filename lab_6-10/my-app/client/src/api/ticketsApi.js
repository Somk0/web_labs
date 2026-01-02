import axiosClient from "./axiosClient";

export async function fetchTickets(params = {}) {
  const res = await axiosClient.get("/tickets", { params });
  return res.data.data;        
}

export async function fetchTicketById(id) {
  try {
    const res = await axiosClient.get(`/tickets/${id}`);
    return res.data.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return null;
    }
    throw err;
  }
}

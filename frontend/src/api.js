import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const savePrediction = async (payload, getIdToken) => {
  const token = await getIdToken();
  return axios.post(`${BASE_URL}/api/stocks/save`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchHistory = async (getIdToken) => {
  const token = await getIdToken();
  return axios.get(`${BASE_URL}/api/stocks/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Public lookup — no auth header needed for this one per the current backend.
export const predictTicker = async (ticker) => {
  return axios.get(`${BASE_URL}/predict/${ticker}`);
};

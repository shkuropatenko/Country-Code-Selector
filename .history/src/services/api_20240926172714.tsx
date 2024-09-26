import axios from "axios";

const API_BASE_URL = "https://sandbox-api.softpoint.io/interface/v1";
const API_KEY = "PO8Rlv4TiYdnZ6NF4uYN/98k6zIGBEkbBG7hBXi9QcI=";

export const generateAccessToken = async (): Promise<string> => {
  const response = await axios.post(`${API_BASE_URL}/access_token`, null, {
    headers: {
      "Api-Key": API_KEY,
    },
    params: {
      corporate_id: 10,
    },
  });
  return response.data.access_token;
};

export const getCountries = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/challenges/countries`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

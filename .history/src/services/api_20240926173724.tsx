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
console.log(1);
export const getCountries = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/challenges/countries`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const sendTwoFactorAuth = async (
  token: string,
  phoneNumber: number,
  countryId: number
) => {
  const response = await axios.post(
    `${API_BASE_URL}/challenges/two_factor_auth`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        phone_number: phoneNumber,
        country_id: countryId,
      },
    }
  );
  return response.data;
};

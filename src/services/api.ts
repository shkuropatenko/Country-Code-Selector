import axios from "axios";

interface Country {
  id: string;
  name: string;
  calling_code: string;
  phone_length: string;
}

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

  if (response.status !== 200) {
    throw new Error("Failed to fetch access token");
  }

  return response.data.access_token;
};

export const getCountries = async (token: string): Promise<Country[]> => {
  const response = await fetch(`${API_BASE_URL}/challenges/countries`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch countries");
  }

  const data = await response.json();

  return data;
};

export const sendTwoFactorAuth = async (
  token: string,
  phoneNumber: string,
  countryId: string
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

  if (response.status !== 200) {
    throw new Error("Failed to send Two Factor Auth");
  }

  return response.data;
};

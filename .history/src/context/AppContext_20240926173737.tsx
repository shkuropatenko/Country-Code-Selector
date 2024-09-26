import React, { createContext, useState, useEffect } from "react";
import { generateAccessToken, getCountries } from "../services/api";

interface Country {
  id: string;
  name: string;
  calling_code: string;
  phone_length: string;
}

interface AppContextProps {
  token: string;
  countries: Country[];
  loading: boolean;
  error: string | null;
}

export const AppContext = createContext<AppContextProps>({
  token: "",
  countries: [],
  loading: false,
  error: null,
});
console.log(1);
// export const AppProvider: React.FC = ({ children }) => {
//   const [token, setToken] = useState<string>("");
//   const [countries, setCountries] = useState<Country[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         const fetchedToken = await generateAccessToken()
//       }
//     }
//   }, [])
// }

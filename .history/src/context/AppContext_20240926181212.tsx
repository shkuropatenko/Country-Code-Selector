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

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppContext = createContext<AppContextProps>({
  token: "",
  countries: [],
  loading: false,
  error: null,
});

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string>("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const fetchedToken = await generateAccessToken();
        setToken(fetchedToken);

        const fetchedCountries: Country[] = await getCountries(fetchedToken);
        setCountries(fetchedCountries);

        console.log(fetchedCountries, "!!!fetchedCountries!!!");
        setLoading(false);
      } catch (err) {
        setError("Failed to initialize application.");
        setLoading(false);
      }
    };
    initialize();
  }, []);

  return (
    <AppContext.Provider value={{ token, countries, loading, error }}>
      {children}
    </AppContext.Provider>
  );
};

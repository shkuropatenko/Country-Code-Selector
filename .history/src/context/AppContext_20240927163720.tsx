// src/context/AppContext.tsx
import React, { createContext, useState, useEffect } from "react";
import { generateAccessToken, getCountries } from "../services/api";

interface Country {
  id: string;
  name: string;
  calling_code: string;
  phone_length: string;
  phone_number_format?: string;
}

interface AppContextProps {
  countries: Country[] | Record<string, Country>;
  loading: boolean;
  error: string | null;
}

export const AppContext = createContext<AppContextProps>({
  countries: [],
  loading: false,
  error: null,
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [countries, setCountries] = useState<
    Country[] | Record<string, Country>
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const token = await generateAccessToken();
        const fetchedCountries = await getCountries(token);
        setCountries(fetchedCountries);
      } catch (err) {
        setError("Failed to fetch countries");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <AppContext.Provider value={{ countries, loading, error }}>
      {children}
    </AppContext.Provider>
  );
};

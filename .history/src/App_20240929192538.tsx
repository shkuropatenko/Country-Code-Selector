// src/App.tsx
import React from "react";
import { AppProvider } from "./context/AppContext";
import CountrySelector from "./components/CountrySelector/CountrySelector";
import { useForm, FormProvider } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import "./App.scss";

const App: React.FC = () => {
  const methods = useForm();

  return (
    <AppProvider>
      <FormProvider {...methods}>
        <Box
          sx={{
            maxWidth: "360px",
            margin: "0 auto",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "20px",
            width: "100%",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
            Two Factor Authentication
          </Typography>
          <CountrySelector />
        </Box>
      </FormProvider>
    </AppProvider>
  );
};

export default App;

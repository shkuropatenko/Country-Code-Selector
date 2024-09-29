import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import PhoneNumberInput from "../PhoneNumberInput/PhoneNumberInput";
import { generateAccessToken, sendTwoFactorAuth } from "../../services/api";
import { useForm, FormProvider, Controller } from "react-hook-form";
import {
  Autocomplete,
  TextField,
  Avatar,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

const CountrySelector: React.FC = () => {
  const { countries, loading, error } = useContext(AppContext);
  const methods = useForm();
  const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
  const [isoCode, setIsoCode] = useState<string | null>(null); // Новое состояние для isoCode
  const [mask, setMask] = useState<string>("(000) 000-0000");
  const [placeholder, setPlaceholder] = useState<string>("(000) 000-0000");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const countryCodes = [
    { callingCode: "1", isoCode: "us" }, // United States
    { callingCode: "44", isoCode: "gb" }, // United Kingdom
    { callingCode: "91", isoCode: "in" }, // India
    { callingCode: "49", isoCode: "de" }, // Germany
    { callingCode: "33", isoCode: "fr" }, // France
    { callingCode: "81", isoCode: "jp" }, // Japan
    { callingCode: "61", isoCode: "au" }, // Australia
    { callingCode: "7", isoCode: "ru" }, // Russia
    { callingCode: "86", isoCode: "cn" }, // China
    { callingCode: "39", isoCode: "it" }, // Italy
    { callingCode: "55", isoCode: "br" }, // Brazil
    { callingCode: "34", isoCode: "es" }, // Spain
    { callingCode: "27", isoCode: "za" }, // South Africa
    { callingCode: "46", isoCode: "se" }, // Sweden
    { callingCode: "31", isoCode: "nl" }, // Netherlands
    { callingCode: "41", isoCode: "ch" }, // Switzerland
    { callingCode: "61", isoCode: "au" }, // Australia
    { callingCode: "65", isoCode: "sg" }, // Singapore
    { callingCode: "90", isoCode: "tr" }, // Turkey
    { callingCode: "351", isoCode: "pt" }, // Portugal
    { callingCode: "43", isoCode: "at" }, // Austria
    { callingCode: "45", isoCode: "dk" }, // Denmark
    { callingCode: "353", isoCode: "ie" }, // Ireland
    { callingCode: "972", isoCode: "il" }, // Israel
    { callingCode: "62", isoCode: "id" }, // Indonesia
    { callingCode: "63", isoCode: "ph" }, // Philippines
    { callingCode: "48", isoCode: "pl" }, // Poland
    { callingCode: "420", isoCode: "cz" }, // Czech Republic
    { callingCode: "421", isoCode: "sk" }, // Slovakia
    { callingCode: "359", isoCode: "bg" }, // Bulgaria
    { callingCode: "371", isoCode: "lv" }, // Latvia
    { callingCode: "370", isoCode: "lt" }, // Lithuania
    { callingCode: "36", isoCode: "hu" }, // Hungary
    { callingCode: "45", isoCode: "dk" }, // Denmark
    { callingCode: "972", isoCode: "il" }, // Israel
    { callingCode: "64", isoCode: "nz" }, // New Zealand
    { callingCode: "673", isoCode: "bn" }, // Brunei
    { callingCode: "1", isoCode: "ca" }, // Canada
    { callingCode: "1", isoCode: "jm" }, // Jamaica
    { callingCode: "1", isoCode: "tt" }, // Trinidad and Tobago
    { callingCode: "1", isoCode: "bs" }, // Bahamas
    { callingCode: "1", isoCode: "ky" }, // Cayman Islands
    { callingCode: "1", isoCode: "ag" }, // Antigua and Barbuda
    { callingCode: "1", isoCode: "bb" }, // Barbados
    { callingCode: "1", isoCode: "dm" }, // Dominica
    { callingCode: "1", isoCode: "gd" }, // Grenada
    { callingCode: "1", isoCode: "ht" }, // Haiti
    { callingCode: "1", isoCode: "lc" }, // Saint Lucia
    { callingCode: "1", isoCode: "ms" }, // Montserrat
    { callingCode: "1", isoCode: "kn" }, // Saint Kitts and Nevis
    { callingCode: "1", isoCode: "vc" }, // Saint Vincent and the Grenadines
    { callingCode: "1264", isoCode: "ai" }, // Anguilla
    { callingCode: "1268", isoCode: "ag" }, // Antigua and Barbuda
    { callingCode: "1284", isoCode: "vg" }, // British Virgin Islands
    { callingCode: "1340", isoCode: "vi" }, // US Virgin Islands
    { callingCode: "1473", isoCode: "gd" }, // Grenada
    { callingCode: "1787", isoCode: "pr" }, // Puerto Rico
    { callingCode: "1758", isoCode: "lc" }, // Saint Lucia
    { callingCode: "1868", isoCode: "tt" }, // Trinidad and Tobago
    { callingCode: "1869", isoCode: "kn" }, // Saint Kitts and Nevis
    { callingCode: "1876", isoCode: "jm" }, // Jamaica
    // Add more countries as needed
  ];

  const updatePhoneField = (country: any | null) => {
    if (country) {
      const phoneLength = parseInt(country.phone_length, 10);
      let newMask = "";

      if (phoneLength === 13) {
        newMask = "(000) 0000-0000";
      } else if (phoneLength === 10) {
        newMask = "(000) 000-0000";
      } else {
        newMask = "(000) 000-0000";
      }

      setMask(newMask);
      setPlaceholder(newMask);
    } else {
      setMask("(000) 000-0000");
      setPlaceholder("(000) 000-0000");
    }
  };

  const handleCountrySelect = (event: any, country: any | null) => {
    setSelectedCountry(country);
    methods.setValue("country", country ? country.id : "");
    methods.setValue("phoneNumber", "");
    updatePhoneField(country);

    // Получите ISO-код страны и обновите состояние
    const code = country ? countryCodes[country.id]?.isoCode || null : null; // Get the ISO code string
    setIsoCode(code); // Сохраняем isoCode в состоянии
  };

  const onSubmit = async (data: any) => {
    const { phoneNumber, country } = data;

    try {
      const token = await generateAccessToken();
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");
      const response = await sendTwoFactorAuth(
        token,
        cleanPhoneNumber,
        country
      );

      console.log("API Response: ", response);
      setSnackbar({
        open: true,
        message: "Two Factor Auth sent successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error during API call: ", error);
      setSnackbar({
        open: true,
        message: "Failed to send Two Factor Auth.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Преобразуем объект стран в массив
  const countryArray = Object.values(countries);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
          {/* Селектор страны с флагами */}
          <Controller
            name="country"
            control={methods.control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={countryArray}
                getOptionLabel={(option) => option.name}
                onChange={handleCountrySelect}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Avatar
                      src={`https://flagcdn.com/w20/${isoCode}.png`} // Используем isoCode для загрузки флага
                      alt={option.name}
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body1">
                      {option.name} ({option.calling_code})
                    </Typography>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Country"
                    variant="outlined"
                    placeholder="Search Country"
                    sx={{ minWidth: 200 }}
                  />
                )}
              />
            )}
          />

          {/* Поле ввода номера телефона */}
          <Box sx={{ ml: 2, flexGrow: 1 }}>
            <Controller
              name="phoneNumber"
              control={methods.control}
              rules={{
                required: "Phone number is required",
                minLength: {
                  value: mask.replace(/\D/g, "").length,
                  message: "Invalid phone number length",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <PhoneNumberInput
                  value={field.value}
                  onChange={field.onChange}
                  mask={mask}
                  placeholder={placeholder}
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Box>
        </Box>

        <button type="submit">Submit</button>
      </form>

      {/* Уведомления Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </FormProvider>
  );
};

export default CountrySelector;

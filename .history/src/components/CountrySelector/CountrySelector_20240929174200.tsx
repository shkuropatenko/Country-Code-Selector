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
import { countryCodes } from "./countryCodes";

const CountrySelector: React.FC = () => {
  const { countries, loading, error } = useContext(AppContext);
  const methods = useForm();
  const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
  const [isoCode, setIsoCode] = useState<string | null>(null);
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
  const [autocompleteOpen, setAutocompleteOpen] = useState(false); // State for controlling the autocomplete open

  const countryArray = Object.values(countries);

  const updatePhoneField = (country: any | null) => {
    if (country) {
      const phoneLength = parseInt(country.phone_length, 10);
      let newMask = "(000) 000-0000"; // Default mask

      if (phoneLength === 13) {
        newMask = "(000) 0000-0000";
      } else if (phoneLength === 10) {
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
    if (!country) {
      setIsoCode(null);
      setAutocompleteOpen(false); // Close autocomplete if no country selected
      return;
    }

    setSelectedCountry(country);
    methods.setValue("country", country.id || "");
    methods.setValue("phoneNumber", "");
    updatePhoneField(country);

    const cleanCallingCode = country.calling_code.replace("+", "");
    const code = countryCodes.find((c) => c.callingCode === cleanCallingCode);

    setIsoCode(code ? code.isoCode : null);
    setAutocompleteOpen(false); // Close autocomplete after country selection
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
          <Box
            onClick={() => setAutocompleteOpen(true)} // Open autocomplete on click
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "4px",
              minWidth: "200px",
            }}
          >
            {selectedCountry && (
              <>
                <Avatar
                  src={`https://flagcdn.com/w20/${isoCode}.png`}
                  alt={selectedCountry.name}
                  sx={{ mr: 1, width: 20, height: 11 }}
                />
                <Typography variant="body1">
                  {selectedCountry.calling_code}
                </Typography>
              </>
            )}
          </Box>

          {autocompleteOpen && (
            <Controller
              name="country"
              control={methods.control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={countryArray}
                  getOptionLabel={(option) => option.name || ""}
                  onChange={handleCountrySelect}
                  renderOption={(props, option) => {
                    const code = countryCodes.find(
                      (c) =>
                        c.callingCode === option.calling_code.replace("+", "")
                    );
                    return (
                      <Box
                        component="li"
                        {...props}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Avatar
                          src={
                            code
                              ? `https://flagcdn.com/w20/${code.isoCode}.png`
                              : ""
                          }
                          alt={option.name}
                          sx={{ mr: 1, width: 20, height: 11 }}
                        />
                        <Typography variant="body1">
                          {option.name} ({option.calling_code})
                        </Typography>
                      </Box>
                    );
                  }}
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
          )}

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

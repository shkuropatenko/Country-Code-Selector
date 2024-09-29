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
                value={selectedCountry} // Передаем значение из состояния
                options={countryArray}
                getOptionLabel={(option) => option.name}
                onChange={handleCountrySelect}
                renderOption={(props, option) => {
                  const { key, ...restProps } = props;
                  console.log(option.id.toLowerCase());
                  return (
                    <Box
                      component="li"
                      key={key}
                      {...restProps}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Avatar
                        src={`https://flagcdn.com/w20/${option.id.toLowerCase()}.png`}
                        alt={option.name}
                        sx={{ mr: 1 }}
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

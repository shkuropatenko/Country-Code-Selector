// src/components/CountrySelector/CountrySelector.tsx
import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import PhoneNumberInput from "../PhoneNumberInput/PhoneNumberInput"; // Ваш кастомный компонент
import { useForm, FormProvider, Controller } from "react-hook-form";
import {
  Autocomplete,
  TextField,
  Avatar,
  Box,
  Typography,
} from "@mui/material";

interface Country {
  id: string;
  name: string;
  calling_code: string;
  phone_length: string;
  phone_number_format?: string;
}

const CountrySelector: React.FC = () => {
  const { countries, loading, error } = useContext(AppContext);
  const methods = useForm();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [mask, setMask] = useState<string>("(000) 000-0000");
  const [placeholder, setPlaceholder] = useState<string>("(000) 000-0000");

  // Обновление маски и плейсхолдера на основе выбранной страны
  const updatePhoneField = (country: Country | null) => {
    if (country) {
      // Пример логики для обновления маски и плейсхолдера на основе формата страны
      const newMask = country.phone_number_format || "(000) 000-0000";
      setMask(newMask);
      setPlaceholder(newMask);
    } else {
      setMask("(000) 000-0000");
      setPlaceholder("(000) 000-0000");
    }
  };

  // Обработчик выбора страны
  const handleCountrySelect = (event: any, country: Country | null) => {
    setSelectedCountry(country);
    methods.setValue("country", country ? country.id : "");
    methods.setValue("phoneNumber", ""); // Очистка поля телефона при смене страны
    updatePhoneField(country);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const countryArray: Country[] = Array.isArray(countries)
    ? countries
    : Object.values(countries || {});

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((data) => console.log(data))}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Селект для выбора страны с флагами */}
          <Controller
            name="country"
            control={methods.control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={countryArray}
                getOptionLabel={(option) =>
                  `${option.name} (${option.calling_code})`
                }
                onChange={handleCountrySelect}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Avatar
                      src={`https://flagcdn.com/w20/${option.id.toLowerCase()}.png`} // Ссылка на флаг
                      alt={option.name}
                      sx={{ mr: 1 }}
                    />
                    <Typography>
                      {option.name} ({option.calling_code})
                    </Typography>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Country"
                    placeholder="Search Country"
                    variant="outlined"
                    sx={{ minWidth: 200 }}
                  />
                )}
              />
            )}
          />

          {/* Поле ввода номера телефона */}
          <Box sx={{ ml: 2 }}>
            <PhoneNumberInput mask={mask} placeholder={placeholder} />
          </Box>
        </Box>

        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

export default CountrySelector;

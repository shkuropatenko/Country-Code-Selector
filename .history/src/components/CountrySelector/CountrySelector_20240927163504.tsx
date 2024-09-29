// src/components/CountrySelector/CountrySelector.tsx
import React, { useContext, useState, useEffect } from "react";
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
} from "@mui/material";

// Интерфейс для страны
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
      const phoneLength = parseInt(country.phone_length, 10);
      let newMask = "";

      // Пример логики для разных длин номеров
      if (phoneLength === 13) {
        newMask = "(000) 0000-0000"; // Пример для 13 цифр
      } else if (phoneLength === 10) {
        newMask = "(000) 000-0000"; // Пример для 10 цифр
      } else {
        newMask = "(000) 000-0000"; // Маска по умолчанию
      }

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
    methods.setValue("phoneNumber", ""); // Очистка поля телефона
    updatePhoneField(country);
  };

  // Обработчик отправки формы
  const onSubmit = async (data: any) => {
    const { phoneNumber, country } = data;

    try {
      const token = await generateAccessToken(); // Получение токена доступа
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, ""); // Очистка номера телефона от нечисловых символов
      const response = await sendTwoFactorAuth(
        token,
        cleanPhoneNumber,
        Number(country)
      ); // Отправка данных на API

      console.log("API Response: ", response);
      // Обработка успешного ответа (например, показать сообщение)
    } catch (error) {
      console.error("Error during API call: ", error);
      // Обработка ошибки (например, показать сообщение об ошибке)
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Преобразование countries в массив, если это объект
  const countryArray: Country[] = Array.isArray(countries)
    ? countries
    : Object.values(countries || {});

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Box sx={{ mb: 2 }}>
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
                      src={`https://flagcdn.com/w20/${option.id.toLowerCase()}.png`} // Используйте правильный URL для флагов
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
                  />
                )}
              />
            )}
          />
        </Box>

        {/* Поле ввода номера телефона */}
        <PhoneNumberInput mask={mask} placeholder={placeholder} />

        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

export default CountrySelector;

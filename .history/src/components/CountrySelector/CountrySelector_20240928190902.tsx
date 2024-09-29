import React, { useState } from "react";
import {
  TextField,
  Autocomplete,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import countries from "react-phone-input-2/lang/en.json";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  phoneInput: {
    "& input": {
      paddingLeft: "60px", // Пространство для флага и кода
    },
  },
});

interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

const CountrySelector: React.FC = () => {
  const classes = useStyles();
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    name: "United States",
    code: "US",
    dialCode: "+1",
    flag: "🇺🇸",
  });
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleCountryChange = (event: any, newValue: Country | null) => {
    if (newValue) {
      setSelectedCountry(newValue);
    }
  };

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
  };

  const countryOptions: Country[] = Object.entries(countries).map(
    ([code, countryData]: any) => ({
      name: countryData.name,
      code,
      dialCode: countryData.dialCode,
      flag: countryData.flag,
    })
  );

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* Селектор страны */}
      <Autocomplete
        value={selectedCountry}
        onChange={handleCountryChange}
        options={countryOptions}
        getOptionLabel={(option) =>
          `${option.flag} ${option.name} (${option.dialCode})`
        }
        style={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Select country" variant="outlined" />
        )}
        renderOption={(props, option) => (
          <MenuItem {...props} value={option}>
            {`${option.flag} ${option.name} (${option.dialCode})`}
          </MenuItem>
        )}
      />
      {/* Инпут для телефона с маской */}
      <PhoneInput
        country={selectedCountry.code.toLowerCase()}
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        inputProps={{
          name: "phone",
          required: true,
          autoFocus: true,
        }}
        masks={{ us: "(...) ...-...." }}
        inputStyle={{
          width: "200px",
          marginLeft: "10px",
        }}
        buttonStyle={{
          backgroundColor: "transparent",
        }}
        className={classes.phoneInput}
      />
    </div>
  );
};

export default CountrySelector;

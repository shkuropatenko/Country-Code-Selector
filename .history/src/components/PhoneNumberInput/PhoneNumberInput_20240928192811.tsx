// src/components/PhoneNumberInput/PhoneNumberInput.tsx
import React from "react";
import MaskedInput from "react-text-mask";
import { useFormContext, Controller } from "react-hook-form";
import { Typography, Box } from "@mui/material";

interface PhoneNumberInputProps {
  mask: string;
  placeholder: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  mask,
  placeholder,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name="phoneNumber"
      control={control}
      render={({ field }) => (
        <InputMask
          mask="+1 (999) 999-9999"
          value={field.value}
          onChange={field.onChange}
        >
          {(inputProps) => (
            <TextField
              {...inputProps}
              label="Phone Number"
              variant="outlined"
              fullWidth
            />
          )}
        </InputMask>
      )}
    />
  );
};

export default PhoneNumberInput;

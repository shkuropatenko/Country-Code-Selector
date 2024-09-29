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
      rules={{
        required: "Phone number is required",
        minLength: {
          value: mask.replace(/\D/g, "").length,
          message: "Invalid phone number length",
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <Box sx={{ mb: 2 }}>
          <MaskedInput
            {...field}
            mask={mask.split("").map((char) => (char === "0" ? /\d/ : char))}
            placeholder={placeholder}
            type="tel"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "4px",
              border: error ? "1px solid red" : "1px solid #ccc",
            }}
          />
          {error && (
            <Typography variant="body2" color="error">
              {error.message}
            </Typography>
          )}
        </Box>
      )}
    />
  );
};

export default PhoneNumberInput;

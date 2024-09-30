import React from "react";
import MaskedInput from "react-text-mask";
import { Typography, Box } from "@mui/material";

interface PhoneNumberInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  mask: string;
  error?: boolean;
  helperText?: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  placeholder,
  mask,
  error,
  helperText,
}) => {
  return (
    <Box>
      <MaskedInput
        mask={mask.split("").map((char) => (char === "0" ? /\d/ : char))}
        placeholder={placeholder}
        type="tel"
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "4px",
          border: error ? "1px solid red" : "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />
      {error && (
        <Typography variant="body2" color="error">
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default PhoneNumberInput;

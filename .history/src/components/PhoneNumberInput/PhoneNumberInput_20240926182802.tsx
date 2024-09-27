// src/components/PhoneNumberInput.tsx
import React from "react";
import InputMask from "react-input-mask";
import { useFormContext, Controller } from "react-hook-form";

// Define a type for the phone number input props
interface PhoneNumberInputProps {
  mask: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ mask }) => {
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
        <div>
          <InputMask
            {...field} // Spread field properties
            mask={mask}
            placeholder={mask}
            onBlur={() => {
              field.onBlur(); // Trigger onBlur from react-hook-form
            }}
          >
            {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
              <input {...inputProps} type="tel" />
            )}
          </InputMask>
          {error && <span>{error.message}</span>}
        </div>
      )}
    />
  );
};

export default PhoneNumberInput;

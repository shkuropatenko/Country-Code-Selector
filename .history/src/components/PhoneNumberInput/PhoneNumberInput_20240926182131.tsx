// src/components/PhoneNumberInput.tsx
import React from "react";
import InputMask from "react-input-mask";
import { useFormContext, Controller } from "react-hook-form";

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
          <InputMask {...field} mask={mask} placeholder={mask}>
            {(inputProps: any) => <input {...inputProps} type="tel" />}
          </InputMask>
          {error && <span>{error.message}</span>}
        </div>
      )}
    />
  );
};

export default PhoneNumberInput;

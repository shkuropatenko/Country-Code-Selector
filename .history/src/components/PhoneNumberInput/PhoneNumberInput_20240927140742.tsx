import React from "react";
import MaskedInput from "react-text-mask";
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
          <MaskedInput
            {...field} // Передаем свойства от react-hook-form
            mask={mask.split("").map((char) => (char === "9" ? /\d/ : char))}
            placeholder={mask} // Плейсхолдер для маски
            type="tel" // Устанавливаем тип input
          />
          {error && <span>{error.message}</span>}
        </div>
      )}
    />
  );
};

export default PhoneNumberInput;

import React from "react";
import MaskedInput from "react-text-mask";
import { useFormContext, Controller } from "react-hook-form";

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
        <div>
          <MaskedInput
            {...field}
            mask={mask.split("").map((char) => (char === "0" ? /\d/ : char))}
            placeholder={placeholder} // Use placeholder prop here
            type="tel"
          />
          {error && <span>{error.message}</span>}
        </div>
      )}
    />
  );
};

export default PhoneNumberInput;

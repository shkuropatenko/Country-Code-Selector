import React from "react";
import MaskedInput from "react-text-mask";
import { useFormContext, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
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
            {...field}
            mask={mask}
            placeholder={mask}
            onBlur={field.onBlur}
          >
            <input type="tel" />
          </InputMask>
          {error && <span>{error.message}</span>}
        </div>
      )}
    />
  );
};

export default PhoneNumberInput;

import React from "react";
import InputMask from "react-input-mask";
import { useFormContext, Controller } from "react-hook-form";

interface PhoneNumberInputProps {
  mask: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ mask }) => {
  const { control } = useFormContext();
  const [tel, setTel] = React.useState("");
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
            value={tel}
            name="maskedInputTel"
            mask="+22"
            alwaysShowMask
            onChange={(e) => setTel(e.target.value)}
          >
            <input type="tel" placeholder={mask} />
          </InputMask>
          {error && <span>{error.message}</span>}
        </div>
      )}
    />
  );
};

export default PhoneNumberInput;

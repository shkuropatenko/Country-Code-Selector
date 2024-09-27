import React from "react";
import InputMask from "react-input-mask";
import { useFormContext, Controller } from "react-hook-form";

interface PhoneNumberInputProps {
  mask: string;
}
const isNotFilledTel = (v) =>
  v && v.indexOf("_") === -1 ? undefined : "Phone number is required.";
const Input = React.memo((props) => {
  const { name, inputRef, value, maskChar, ...inputProps } = props;
  return <input value={value} name={name} ref={inputRef} {...inputProps} />;
});
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
            inputRef={register({
              validate: {
                inputTelRequired: isNotFilledTel,
              },
            })}
            mask="+7 (999) 999-99-99"
            alwaysShowMask
            onChange={(e) => setTel(e.target.value)}
          >
            <Input type="tel" autoComplete="tel-national" />
          </InputMask>
          {error && <span>{error.message}</span>}
        </div>
      )}
    />
  );
};

export default PhoneNumberInput;

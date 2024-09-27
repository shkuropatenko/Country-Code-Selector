// src/components/CountrySelector.tsx
import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import PhoneNumberInput from "../PhoneNumberInput/PhoneNumberInput";
import { useForm, FormProvider } from "react-hook-form";

const CountrySelector: React.FC = () => {
  const { countries, loading, error } = useContext(AppContext);
  const methods = useForm();
  const { handleSubmit, watch, setValue } = methods;

  // Watch selected country
  const selectedCountry = watch("country");

  const onSubmit = async (data: any) => {
    const phoneNumber = data.phoneNumber;
    const countryId = data.country;
    // Call your sendTwoFactorAuth function here
    console.log(`Sending phoneNumber: ${phoneNumber}, countryId: ${countryId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="country">Select Country:</label>
        <select id="country" {...methods.register("country")}>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name} (+{country.calling_code})
            </option>
          ))}
        </select>
        <PhoneNumberInput mask={"(000) 000-0000"} />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

export default CountrySelector;

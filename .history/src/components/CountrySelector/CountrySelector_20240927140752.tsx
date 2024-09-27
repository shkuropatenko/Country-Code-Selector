// src/components/CountrySelector.tsx
import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import PhoneNumberInput from "../PhoneNumberInput/PhoneNumberInput";
import { useForm, FormProvider } from "react-hook-form";

const CountrySelector: React.FC = () => {
  const { countries, loading, error } = useContext(AppContext);
  const methods = useForm();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const countryArray = Object.values(countries);
  const onSubmit = (data: any) => {
    console.log("Form Data: ", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="country">Select Country:</label>
          <select id="country" {...methods.register("country")}>
            {countryArray.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name} {country.calling_code}
              </option>
            ))}
          </select>
        </div>
        <PhoneNumberInput mask="(999) 999-9999" />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

export default CountrySelector;

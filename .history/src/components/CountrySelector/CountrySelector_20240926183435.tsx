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

  return (
    <FormProvider {...methods}>
      <form>
        <div>
          <label htmlFor="country">Select Country:</label>
          <select id="country" {...methods.register("country")}>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name} (+{country.calling_code})
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

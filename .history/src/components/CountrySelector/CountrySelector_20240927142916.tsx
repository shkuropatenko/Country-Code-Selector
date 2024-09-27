import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import PhoneNumberInput from "../PhoneNumberInput/PhoneNumberInput";
import { useForm, FormProvider } from "react-hook-form";

interface Country {
  id: string;
  name: string;
  calling_code: string;
  phone_number_format?: string; // Make this optional if not all countries have it
}

interface ExtendedCountry extends Country {
  phone_number_format: string; // Include this property
}

const CountrySelector: React.FC = () => {
  const { countries, loading, error } = useContext(AppContext);
  const methods = useForm();
  const [mask, setMask] = useState<string>("(000) 000-0000");
  const [placeholder, setPlaceholder] = useState<string>("(000) 000-0000"); // New state for placeholder

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Explicitly typing countryArray
  const countryArray: Country[] = Array.isArray(countries)
    ? countries
    : Object.values(countries || {});

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = countryArray.find(
      (country) => country.id === event.target.value
    );

    // Type guard to check if selectedCountry is not undefined and has phone_number_format
    if (selectedCountry && "phone_number_format" in selectedCountry) {
      const extendedCountry = selectedCountry as ExtendedCountry; // Now we can safely assert
      setMask(extendedCountry.phone_number_format || "(000) 000-0000"); // Set mask
      setPlaceholder(extendedCountry.phone_number_format || "(000) 000-0000"); // Set placeholder based on selected country
    } else {
      setMask("(000) 000-0000"); // Default mask
      setPlaceholder("(000) 000-0000"); // Default placeholder
    }
  };

  const onSubmit = async (data: any) => {
    const { phoneNumber, country } = data;

    // Make the API call to SoftPoint here
    const response = await fetch("API_URL_HERE", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, country }),
    });

    const result = await response.json();
    console.log("API Response: ", result);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="country">Select Country:</label>
          <select
            id="country"
            {...methods.register("country")}
            onChange={handleCountryChange}
          >
            {countryArray.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name} {country.calling_code}
              </option>
            ))}
          </select>
        </div>
        {/* Pass mask and placeholder to PhoneNumberInput */}
        <PhoneNumberInput mask={mask} placeholder={placeholder} />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

export default CountrySelector;

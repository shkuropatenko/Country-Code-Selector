import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import PhoneNumberInput from "../PhoneNumberInput/PhoneNumberInput";
import { generateAccessToken, sendTwoFactorAuth } from "../../api";
import { useForm, FormProvider } from "react-hook-form";

interface Country {
  id: string;
  name: string;
  calling_code: string;
  phone_length?: string; // Include phone_length
  phone_number_format?: string; // Make this optional if not all countries have it
}

const CountrySelector: React.FC = () => {
  const { countries, loading, error } = useContext(AppContext);
  const methods = useForm();
  const [mask, setMask] = useState<string>("(000) 000-0000");
  const [placeholder, setPlaceholder] = useState<string>("(000) 000-0000");

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const countryArray: Country[] = Array.isArray(countries)
    ? countries
    : Object.values(countries || {});

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = countryArray.find(
      (country) => country.id === event.target.value
    );

    if (selectedCountry) {
      const phoneLength = Number(selectedCountry.phone_length); // Convert to a number
      let newMask = "";

      // Define how you want the mask to look based on phone length
      if (phoneLength === 13) {
        newMask = "(000) 0000-0000"; // Example format for 13 digits
      } else if (phoneLength === 10) {
        newMask = "(000) 000-0000"; // Example format for 10 digits
      } else {
        newMask = "(000) 000-0000"; // Default mask
      }

      setMask(newMask); // Update mask
      setPlaceholder(newMask); // Update placeholder
    } else {
      setMask("(000) 000-0000"); // Default mask
      setPlaceholder("(000) 000-0000"); // Default placeholder
    }
  };

  const onSubmit = async (data: any) => {
    const { phoneNumber, country } = data;

    try {
      const token = await generateAccessToken(); // Get the access token
      const response = await sendTwoFactorAuth(token, phoneNumber, country);

      console.log("API Response: ", response);
      // Handle successful response (e.g., show a success message)
    } catch (error) {
      console.error("Error during API call: ", error);
      // Handle error (e.g., show an error message)
    }
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
        <PhoneNumberInput mask={mask} placeholder={placeholder} />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

export default CountrySelector;

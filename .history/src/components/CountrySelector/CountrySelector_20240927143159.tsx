import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import PhoneNumberInput from "../PhoneNumberInput/PhoneNumberInput";
import { useForm, FormProvider } from "react-hook-form";

interface Country {
  id: string;
  name: string;
  calling_code: string;
  phone_length?: string; // Include phone_length
  phone_number_format?: string; // Make this optional if not all countries have it
}

interface ExtendedCountry extends Country {
  phone_number_format: string; // Include this property
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

  // Check if selectedCountry is defined
  if (selectedCountry) {
    const phoneLength = Number(selectedCountry.phone_length); // Convert to a number
    if (phoneLength) {
      // Define how you want the mask to look. For example, if phoneLength is 13, you might have:
      // Let's assume the format should be (000) 0000-0000 for a total of 13 digits
      let newMask = "";

      if (phoneLength === 13) {
        newMask = "(000) 0000-0000"; // Customize as needed
      } else if (phoneLength === 10) {
        newMask = "(000) 000-0000"; // Example for US numbers
      } else {
        newMask = "(000) 000-0000"; // Fallback to a default mask
      }

      setMask(newMask); // Update mask
      setPlaceholder(newMask); // Update placeholder
    }
  } else {
    setMask("(000) 000-0000"); // Default mask
    setPlaceholder("(000) 000-0000"); // Default placeholder
  }
};
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
        <PhoneNumberInput mask={mask} placeholder={placeholder} />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

export default CountrySelector;

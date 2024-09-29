const CountrySelector: React.FC = () => {
  const { countries, loading, error } = useContext(AppContext);
  const methods = useForm();
  const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
  const [isoCode, setIsoCode] = useState<string | null>(null);
  const [mask, setMask] = useState<string>("(000) 000-0000");
  const [placeholder, setPlaceholder] = useState<string>("(000) 000-0000");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const countryCodes = [
    // Ensure all necessary mappings are here...
    { callingCode: "86", isoCode: "cn" }, // China
    // Other countries...
  ];

  const updatePhoneField = (country: any | null) => {
    // Existing logic...
  };

  const handleCountrySelect = (event: any, country: any | null) => {
    console.log("Selected Country Object:", country);

    if (!country) {
      setIsoCode(null);
      console.log("No country selected");
      return;
    }

    setSelectedCountry(country);
    methods.setValue("country", country.id || "");
    methods.setValue("phoneNumber", "");
    updatePhoneField(country);

    const cleanCallingCode = country.calling_code.replace("+", ""); // Remove '+' for comparison

    const code = countryCodes.find((c) => c.callingCode === cleanCallingCode);

    if (code) {
      setIsoCode(code.isoCode);
      console.log("Selected ISO Code:", code.isoCode);
    } else {
      console.log(
        "No matching ISO code found for calling code:",
        country.calling_code
      );
      setIsoCode(null);
    }
  };

  const onSubmit = async (data: any) => {
    // Existing logic...
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const countryArray = Object.values(countries);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
          <Controller
            name="country"
            control={methods.control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={countryArray}
                getOptionLabel={(option) => option.name}
                value={selectedCountry}
                onChange={handleCountrySelect}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Avatar
                      src={
                        isoCode
                          ? `https://flagcdn.com/w20/${isoCode.toLowerCase()}.png`
                          : ""
                      }
                      alt={option.name}
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body1">
                      {option.name} ({option.calling_code})
                    </Typography>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Country"
                    variant="outlined"
                    placeholder="Search Country"
                    sx={{ minWidth: 200 }}
                  />
                )}
              />
            )}
          />
          <Box sx={{ ml: 2, flexGrow: 1 }}>
            <Controller
              name="phoneNumber"
              control={methods.control}
              rules={{
                required: "Phone number is required",
                minLength: {
                  value: mask.replace(/\D/g, "").length,
                  message: "Invalid phone number length",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <PhoneNumberInput
                  value={field.value}
                  onChange={field.onChange}
                  mask={mask}
                  placeholder={placeholder}
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Box>
        </Box>
        <button type="submit">Submit</button>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </FormProvider>
  );
};

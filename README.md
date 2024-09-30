# Country Code Selector

## Description
The Country Code Selector is a mobile-first UI component built with TypeScript and React.js. It allows users to select a country from a dropdown list and automatically formats their phone number according to the selected country's dialing code and number length.

## Features
- Mobile-first design
- Country flag and calling code selector
- Phone number input field with dynamic placeholder
- Input validation based on selected country
- Search functionality within the country list
- Phone number formatting using a mask

## Requirements
- React.js
- TypeScript
- A phone number input field formatted as (000) 000-0000
- API integration for country data and two-factor authentication

## API Endpoints
1. **GET Countries**: Retrieve a list of countries with their flags and calling codes.
2. **POST Two Factor Auth**: Send the phone number and selected country ID for two-factor authentication.

## Installation
To set up the project on your local machine, follow these steps:

1. **Clone the repository**: First, you need to get the project files on your local machine by cloning the repository.
   ```bash
   git clone https://github.com/shkuropatenko/Country-Code-Selector.git

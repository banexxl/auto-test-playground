# Maxbet Playground for Testing

This project is a Next.js playground designed for rapid prototyping, feature testing, and UI/UX experimentation. It includes:

## Features

- **Weather Forecast Page**
  - Search for cities using AI-powered autocomplete (API Layer)
  - Fetch and display weather forecasts with rich UI (icons, temperature, humidity, wind)
  - Multiple UI gadgets for automated testing (inputs, selects, switches)

- **Orders API & Store**
  - Create and fetch orders using a PostgreSQL database (AWS RDS)
  - Store and display order details, items, and customer info
  - Modern store UI with cart, checkout, and confirmation pages

- **Form Validation Playground**
  - Test and demo form validation using Formik and Yup

- **Reusable Components**
  - Built with MUI (Material UI) for fast, beautiful interfaces
  - Includes navigation, data tables, interactive controls, and more

## Tech Stack

- Next.js 15
- React 18
- TypeScript
- MUI (Material UI)
- Redux Toolkit
- PostgreSQL (pg)
- Formik & Yup

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables in `.env` for database and API keys (see code for details)
3. Run the development server:
   ```bash
   npm run dev
   ```

## Automated Testing

The UI is designed for easy automated testing, with test IDs and interactive controls throughout the app.

---

For more details, see the source code and explore the `/app` folder for feature demos.
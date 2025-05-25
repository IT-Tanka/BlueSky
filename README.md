

### **"BlueSky"** is a web application for tracking weather

This application is utilizing the OpenWeatherMap API. The application allows users to monitor current weather in various cities, view temperature charts by hours and days, and manage favorite cities. It does not use CSS frameworks or UI libraries and supports multilingual functionality (English and Ukrainian).

### Key Features

1. **Dynamic City Weather on Home Page**
   - By default, the application detects the user's city based on their IP address and shows detailed weather information.
   - If the user previously searched for a city, the last selected city will be shown instead.
   - Users can also search for any city using the autocomplete input and view its current weather.

2. **Favorites System**
   - Any city displayed on the home page can be added to the **Favorites** with a single click.
   - The **Favorites** tab displays weather cards for all saved cities.
   - Each favorite includes an interactive temperature chart with toggle options and detailed weather info.
   - Favorites are stored in `localStorage` with a limit of 5 cities. If the user tries to add more, a warning is shown.

3. **Interactive Temperature Charts**
   - Each favorite city card features a temperature chart.
   - Users can toggle between **hourly** (for the current day) and **daily** (5-day forecast) views.

4. **City Autocomplete Input**
   - Smart autocomplete helps users quickly find city names using the OpenWeatherMap API.

5. **Preloaders for Smooth UX**
   - Loading indicators are shown during API requests to provide clear feedback to users.

6. **Multilingual Support**
   - The app supports switching between **English** and **Ukrainian**, including interface text and weather descriptions.


### Responsiveness:

The application is responsive and supports a minimum container width of 360px and a maximum width of 1200px, ensuring usability across various devices.

Overall, **"BlueSky"** provides a comprehensive weather tracking solution with numerous features and a user-friendly interface, adapted for different devices and supporting multilingual functionality.






This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

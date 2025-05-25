

### **"BlueSky"** is a web application for tracking weather

This application is utilizing the OpenWeatherMap API. The application allows users to monitor current weather in various cities, view temperature charts by hours and days, and manage favorite cities. It does not use CSS frameworks or UI libraries and supports multilingual functionality (English and Ukrainian).

### Key Features:

1. **City Autocomplete Input:**
   - Users can enter city names in a dedicated field, and the application will automatically show a list of matching cities using the OpenWeatherMap API.

2. **Weather Information Display:**
   - For each selected city, the application displays current weather information in a card format.

3. **Temperature Chart:**
   - The application generates a temperature chart by hours for the current day using a JavaScript library, such as Chart.js.

4. **Weather Blocks Management:**
   - Users can create up to five weather blocks, each displaying information for a specific city. By default, there is always one block, and users can add new blocks using a "+" button.
   - There is an option to delete weather blocks with confirmation through a modal window.

5. **Favorites Tab:**
   - Users can add and remove cities from favorites. This tab displays only the favorite cities as weather blocks, without the option to select a new city.
   - Favorite cities are stored in localStorage, with a maximum limit of five. If users try to add more cities, a warning message is displayed.

6. **Toggle Between "Day" and "5 Days":**
   - Users can toggle between viewing the current day's weather and a five-day forecast. The five-day forecast is shown as average temperatures by day.

7. **Location Detection by IP:**
   - The application determines the user's city based on their IP address and displays the weather for this city by default.

8. **Preloaders:**
   - The application uses preloaders to indicate loading states, such as when making API requests.

9. **Multilingual Support:**
   - The application interface supports switching between English and Ukrainian languages.

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

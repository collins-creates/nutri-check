# NutriCheck

A modern web application for searching and comparing nutritional values of foods using the USDA Food Data Central API.

## Features

- **Food Search**: Search for any food item and get detailed nutritional information
- **Nutrition Breakdown**: View macronutrients, vitamins, minerals, and other nutritional components
- **Food Comparison**: Compare up to 3 foods side-by-side to make informed dietary choices
- **Modern UI**: Clean, responsive design with smooth animations and gradients
- **Real-time Data**: Powered by the official USDA Food Data Central API

## Demo

Visit the live demo: [https://yourusername.github.io/nutricheck/](https://yourusername.github.io/nutricheck/)

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)**: Vanilla JavaScript with async/await for API calls
- **USDA Food Data Central API**: Official nutrition database

## Getting Started

### Prerequisites

- A web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API calls

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nutricheck.git
cd nutricheck
```

2. Open `index.html` in your web browser or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve .

# Or simply open index.html directly
```

### Usage

1. **Search for Food**: Enter a food name (e.g., "apple", "chicken", "rice") in the search box and click "Search"
2. **View Results**: Browse through the search results and click on any food item to see detailed nutrition information
3. **Compare Foods**: Click "Add to Comparison" to add foods to the comparison list (up to 3 foods)
4. **Clear Comparison**: Click "Clear Comparison" to reset the comparison list

## API Configuration

The application uses the USDA Food Data Central API with the provided API key. The API key is included in the JavaScript file for demonstration purposes. For production use, consider:

- Moving the API key to environment variables
- Implementing rate limiting
- Adding error handling for API quota limits

## Project Structure

```
nutricheck/
|-- index.html          # Main HTML file
|-- styles.css          # CSS styling
|-- script.js           # JavaScript functionality
|-- README.md           # Project documentation
```

## Key Features Explained

### Food Search
- Real-time search using USDA's comprehensive food database
- Support for brand names, generic foods, and common food items
- Displays food category and brand information when available

### Nutrition Display
- Organized into categories: Macronutrients, Vitamins, Minerals, and Other
- Shows values with appropriate units (g, mg, mcg, IU, etc.)
- Clean, card-based layout for easy reading

### Comparison Feature
- Side-by-side comparison of key nutrients
- Focus on most important nutritional information
- Easy to add/remove foods from comparison

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- USDA Food Data Central for providing the nutrition database
- Google Fonts for the Inter font family
- The open-source community for inspiration and tools

## Future Enhancements

- [ ] User accounts to save favorite foods
- [ ] Meal planning features
- [ ] Dietary goal tracking
- [ ] Barcode scanning for packaged foods
- [ ] Recipe nutrition calculator
- [ ] Export nutrition data to PDF/CSV

## Contact

Created with passion for health and nutrition. If you have any questions or suggestions, feel free to open an issue or reach out!

---

**Disclaimer**: Nutritional information is provided by the USDA Food Data Central API. Always consult with a healthcare professional for personalized dietary advice.

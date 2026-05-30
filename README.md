# Nra Assist Chrome Auto Filler

A Chrome extension that automatically fills Bulgarian National Revenue Agency tax declaration for stock share
operations (ГДД към НАП). This extension simplifies the process of submitting annual tax declarations by automating data
entry from JSON files.

The extension is published on the Chrome Web Store:
https://chromewebstore.google.com/detail/nra-assist/ecbcncgfeednmlpbjkicphillddbijic

## Features

- **Automated Form Filling**: Automatically populates НАП tax declaration forms with your stock data
- **JSON Data Import**: Support for importing stock data from JSON files
- **Multiple Declaration Parts**: Fill specific parts (Част 3, Приложение 5, 6, 8, 13) or the entire declaration at once
- **Secure & Local**: All data processing happens locally in your browser
- **Dark Mode Support**: Built-in dark mode for comfortable use

## Installation

### From Chrome Web Store

The easiest way to install the extension is from the Chrome Web Store:
https://chromewebstore.google.com/detail/nra-assist/ecbcncgfeednmlpbjkicphillddbijic

### From Source

To build and install the extension from source:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chrome-auto-filler.git
   cd chrome-auto-filler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
    - Open Chrome and navigate to `chrome://extensions/`
    - Enable "Developer mode" in the top right corner
    - Click "Load unpacked" and select the `dist` directory
    - The extension should now appear in your extensions list

## JSON Data Format

The extension expects JSON files with the following structure:

```json
{
  "holdings": [
    {
      "country": "US",
      "count": "100",
      "acquireDate": "2023-01-15",
      "priceInCurrency": "150.00",
      "price": "138.00"
    }
  ],
  "dividends": [
    {
      "name": "Apple Inc.",
      "country": "US",
      "sum": "50.00",
      "paidTax": "7.50"
    }
  ],
  "mergers": [
    {
      "date": "2023-06-01",
      "targetCompanyName": "Acquired Corp",
      "targetCountry": "US",
      "sourceCostPriceInEur": "1000.00",
      "targetPriceInEur": "1200.00"
    }
  ],
  "unregulatedSellsSum": {
    "sellValue": "5000.00",
    "buyValue": "3000.00",
    "profit": "2000.00"
  },
  "regulatedSellsSum": {
    "sellValue": "10000.00",
    "buyValue": "8000.00"
  },
  "interestsSum": "100.00",
  "cashbacksSum": "50.00"
}
```

### Field Descriptions

- **holdings**: Array of stock holdings
    - `country`: Country code (e.g., "US", "BG")
    - `count`: Number of shares held
    - `acquireDate`: Date when shares were acquired (YYYY-MM-DD format)
    - `priceInCurrency`: Purchase price in original currency
    - `price`: Purchase price converted to EUR

- **dividends**: Array of dividend payments
    - `name`: Company name
    - `country`: Country where dividend was paid
    - `sum`: Total dividend amount
    - `paidTax`: Tax already paid on dividends

- **mergers**: Array of corporate merger/acquisition events
    - `date`: Date of merger (YYYY-MM-DD format)
    - `targetCompanyName`: Name of acquired company
    - `targetCountry`: Country of target company
    - `sourceCostPriceInEur`: Cost basis in EUR
    - `targetPriceInEur`: Acquisition price in EUR

- **unregulatedSellsSum**: Summary of unregulated market sales
    - `sellValue`: Total sell value
    - `buyValue`: Total buy value
    - `profit`: Calculated profit

- **regulatedSellsSum**: Summary of regulated market sales
    - `sellValue`: Total sell value
    - `buyValue`: Total buy value

- **interestsSum**: Total interest income
- **cashbacksSum**: Total cashback amounts

All fields are optional - include only the sections relevant to your tax situation.

## Usage

1. **Navigate to the НАП portal** (https://portal.nra.bg)
2. **Prepare your JSON file** with your stock data following the format above
3. **Open the extension** by clicking its icon in Chrome
4. **Drag and drop** your JSON file into the extension
5. **Select which part** of the declaration to fill:
    - "Част 3" - Part 3 of the declaration
    - "Приложение 5" - Appendix 5
    - "Приложение 6" - Appendix 6
    - "Приложение 8" - Appendix 8
    - "Приложение 13" - Appendix 13
    - "Попълни всички" - Fill all parts

## Development

### Prerequisites

- Node.js (v22 or higher)
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

### Project Structure

```
chrome-auto-filler/
├── public/              # Static assets and manifest
├── src/
│   ├── components/      # React components
│   │   ├── declaration/ # Declaration filling logic
│   │   ├── file-drop/   # File upload component
│   │   ├── navbar/      # Navigation bar
│   │   └── theme/       # Theme components
│   ├── pages/           # Page components
│   ├── services/        # Chrome API services
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── package.json
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite build configuration
└── README.md
```

### Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **React Icons** - Icon library
- **React Toastify** - Notifications

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following the existing code style
4. **Run tests and linters** (`npm run lint`)
5. **Commit your changes** with clear messages
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Code Style

- Use Prettier for code formatting (configured in `.prettierrc`)
- Follow ESLint rules (configured in `eslint.config.js`)
- Write TypeScript for type safety
- Keep components small and focused

## Privacy & Security

- **Local Processing**: All data processing happens locally in your browser
- **No Data Collection**: The extension does not collect or transmit any personal data
- **Minimal Permissions**: Only requests necessary permissions for the НАП portal
- **Open Source**: Full code transparency for security auditing

## Browser Compatibility

- Chrome/Chromium-based browsers (Edge, Brave, Opera, etc.)
- Requires Chrome Manifest V3 support

## License

The source code is licensed under the Apache 2.0 License.

The project logo, name, and branding assets are not covered by the Apache 2.0 License and remain the property of the
copyright holder. All rights reserved.

# Alicante Schools Map

An interactive map displaying schools in Alicante, Spain. This application allows users to view school locations, track visit status, quota availability, and add comments for each school.

## Features

- 🗺️ Interactive map with 117+ schools in Alicante
- 🎯 Color-coded markers:
  - **Black**: Unvisited schools
  - **Red**: Visited schools without quota
  - **Green**: Visited schools with quota
- 🖱️ Click markers to view school information
- 📍 School details include name, address, phone, email, and comments
- 📱 Responsive design for mobile and desktop

## Live Demo

Visit the live application: [https://rzlams.github.io/alicante_schools_map/](https://rzlams.github.io/alicante_schools_map/)

## Technology Stack

- **Frontend**: React with TypeScript
- **Map**: Leaflet with OpenStreetMap tiles
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

## Development

### Prerequisites

- Node.js 18 or higher
- npm

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/alicante_schools_map.git
   cd alicante_schools_map
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Data

The school data includes geocoded coordinates for accurate positioning on the map. Each school entry contains:

- Name and address
- Contact information (phone and email)
- Visit status and quota availability
- Space for comments

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

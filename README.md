# Alicante Schools and Rental Properties Map

An interactive map displaying schools and rental houses in Alicante, Spain. This application allows users to view both educational institutions and rental properties, track visit status, manage quota/availability information, and add comments for each location.

## Deployment

✅ Correct base path: /alicante-schools-map in vite.config.ts
✅ Homepage field: Properly set in package.json
✅ Build assets: Now have correct paths (/alicante-schools-map/assets/)
✅ Deployment: Successfully pushed to gh-pages branch

1. Go to Repository Settings
   Open your repository: https://github.com/rzlams/alicante-schools-map
   Click the "Settings" tab
   Scroll down to "Pages" in the left sidebar
2. Change the Source Branch
   Under "Source", you'll see "Deploy from a branch"
   Change the branch from "main" to "gh-pages"
   Keep the folder as "/ (root)"
   Click "Save"
3. Push all the changes to the github repository
4. Execute the command `npm run deploy`
5. Wait for Deployment
   GitHub will show: "Your site is being built from the gh-pages branch"
   Wait 1-2 minutes for the deployment to complete
   You'll see a green checkmark when it's ready
6. Access Your Site
   Your Alicante Schools and Houses Map will be available at:
   https://rzlams.github.io/alicante-schools-map/

## Features

### Schools Management

- 🗺️ Interactive map with 117+ schools in Alicante
- 🎯 Color-coded circular markers:
  - **Black**: Unvisited schools
  - **Red**: Visited schools without quota
  - **Green**: Visited schools with quota
- 🖱️ Click markers to view school information
- 📍 School details include name, address, phone, email, and comments
- 📊 Statistics panel with filters: Total, Visitados, Sin cupo

### Rental Houses Management

- 🏠 Interactive display of rental properties
- 🔺 Triangular markers for houses:
  - **Black**: Default state
  - **Green**: Visited houses
  - **Red**: Not available houses
  - **Orange border**: High priority properties
- 💰 Property details include address, price, warranty months, insurance requirements
- 👥 Agent information in collapsible sections (name, agency, address, phone, email, web)
- 📊 Independent statistics panel with filters: Total, Visitados, No disponible

### General Features

- 📱 Responsive design for mobile and desktop
- 🎛️ Independent filtering for schools and houses
- 🗂️ Layered display (houses appear above schools)
- 🖱️ Toggle popup functionality for all markers

## Live Demo

Visit the live application: [https://rzlams.github.io/alicante_schools_map/](https://rzlams.github.io/alicante_schools_map/)

## Technology Stack

- **Frontend**: React with TypeScript
- **Map**: Leaflet with OpenStreetMap tiles
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives with custom shadcn/ui components
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

## Data Structure

### Schools Data (`client/src/data/schools.json`)

The school data includes geocoded coordinates for accurate positioning. Each school entry contains:

- Basic information: name, address, contact details (phone, email)
- Status tracking: visit status (`isVisited`), quota availability (`hasQuota`)
- Additional notes: comments field for observations

### Houses Data (`client/src/data/houses.json`)

The rental properties data structure includes:

**Houses Array:**

- Basic info: id, address, coordinates (lat/lng)
- Rental details: price, warranty months, insurance requirements
- Status tracking: visit status (`isVisited`), availability (`isNotAvailable`)
- Priority levels: HIGH (orange border) or LOW
- Agent assignment: `agentId` for contact information
- Comments: additional notes

**Agents Array:**

- Contact information: name, agency, address, phone, email, web
- Linked to houses via `agentId` reference

## File Structure

```
client/src/
├── components/
│   ├── map.tsx                    # Main map component (handles both schools and houses)
│   ├── stats-panel.tsx            # Schools statistics and filters
│   ├── house-stats-panel.tsx      # Houses statistics and filters
│   └── ui/                        # Reusable UI components
├── data/
│   ├── schools.json               # Schools dataset
│   └── houses.json                # Houses and agents dataset
├── types/
│   ├── school.ts                  # School TypeScript types
│   └── house.ts                   # House and Agent TypeScript types
└── pages/
    └── home.tsx                   # Main page component
```

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

# Project Name

## Overview

This project is a frontend application built using Vite and Babylon.js. The application includes:

- **Signup Page**: When the user loads the app, they are prompted to sign up. Upon successful authentication, the user is redirected to the map container.
- **Map Container**: Displays a 3D cuboid of a map image based on the user's location. Users can drag the map to explore different parts.
- **Profile Page**: Shows the user's saved maps and highlights the top frequent regions.

## Setup and Installation

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later) or Yarn

### Getting Started

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**

   If you're using npm:

   ```bash
   npm install
   ```

   Or if you're using Yarn:

   ```bash
   yarn install
   ```

3. **Environment Variables:**

   Create a `.env` file in the root of the project and add the following environment variable:

   ```plaintext
   VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
   ```

   Replace `your_mapbox_access_token_here` with your actual Mapbox access token.

4. **Running the Application:**

   To start the development server, run:

   ```bash
   npm run dev
   ```

   Or if you're using Yarn:

   ```bash
   yarn dev
   ```

   The application should now be running on `http://localhost:3000`.

5. **Building for Production:**

   To build the application for production, run:

   ```bash
   npm run build
   ```

   Or if you're using Yarn:

   ```bash
   yarn build
   ```

   The production-ready files will be output to the `dist` directory.

## Features

- **3D Map Display**: Utilizes Babylon.js to render a 3D cuboid of a map image, which can be manipulated and dragged to explore different regions.
- **Authentication**: Users must sign up and log in to access the map and profile features.
- **Profile Page**: Users can view and manage their saved maps and see the top regions they frequently visit.

## Dependencies

- **Vite**: Fast and modern frontend build tool.
- **Babylon.js**: 3D engine for rendering the map.
- **Mapbox**: Used for map data and rendering.



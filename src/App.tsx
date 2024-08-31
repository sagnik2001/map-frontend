import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MapContainer from './Components/MapContainer';
import RedirectToMapOrHome from './Components/RedirectComponent';
import ProfilePage from './Pages/Profile';
import Layout from './Pages/Landing/landing';
import { AuthProvider } from './Context/AuthContextProvider';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/mapContainer" element={<RedirectToMapOrHome><MapContainer /></RedirectToMapOrHome>} />
          <Route path="/profile" element={<RedirectToMapOrHome><ProfilePage /></RedirectToMapOrHome>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

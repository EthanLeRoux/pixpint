import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import ArtistsPage from './pages/ArtistsPage';
import AddArtistPage from './pages/AddArtistPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <NavBar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/add-artist" element={<AddArtistPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

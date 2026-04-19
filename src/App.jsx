import React from 'react';
import { useArtists } from './hooks/useArtists';
import ArtistGrid from './components/ArtistGrid';
import AddArtistForm from './components/AddArtistForm';


function App() {
  const { artists, loading, error } = useArtists();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pixiv Artists Manager</h1>
      </header>

      <main className="app-main">
        <AddArtistForm />

        <div className="artists-section">
          <h2>Artists</h2>

          {loading && <div className="loading">Loading artists...</div>}

          {error && <div className="error">Error: {error}</div>}

          {!loading && !error && artists.length === 0 && (
            <div className="empty-state">No artists added yet. Add your first artist above!</div>
          )}

          {!loading && !error && artists.length > 0 && (
            <ArtistGrid artists={artists} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

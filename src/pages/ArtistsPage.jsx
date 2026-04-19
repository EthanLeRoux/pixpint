import React from 'react';
import { useArtists } from '../hooks/useArtists';
import ArtistGrid from '../components/ArtistGrid';
import './ArtistsPage.css';

const ArtistsPage = () => {
  const { artists, loading, error } = useArtists();

  return (
    <section className="artists-page">
      <div className="page-header">
        <h1>Saved Artists</h1>
        <p>Manage the artists used to power the illustration feed.</p>
      </div>

      {loading && <div className="page-loading">Loading artists...</div>}
      {error && <div className="page-error">{error}</div>}
      {!loading && !error && artists.length === 0 && (
        <div className="empty-state">No artists saved yet. Add an artist from the Add Artist page.</div>
      )}
      {!loading && artists.length > 0 && <ArtistGrid artists={artists} />}
    </section>
  );
};

export default ArtistsPage;

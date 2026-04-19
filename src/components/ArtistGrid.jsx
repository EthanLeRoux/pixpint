import React from 'react';
import ArtistCard from './ArtistCard';
import './ArtistGrid.css';

const ArtistGrid = ({ artists }) => {
  return (
    <div className="artist-grid">
      {artists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </div>
  );
};

export default ArtistGrid;
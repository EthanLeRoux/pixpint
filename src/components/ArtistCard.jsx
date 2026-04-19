import React from 'react';
import './ArtistCard.css';

const ArtistCard = ({ artist }) => {
  return (
    <div className="artist-card">
      <img
        src={artist.profileImage}
        alt={artist.name}
        className="artist-image"
      />
      <div className="artist-info">
        <h3 className="artist-name">{artist.name}</h3>
        <a
          href={artist.pixivUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="artist-link"
        >
          View on Pixiv
        </a>
      </div>
    </div>
  );
};

export default ArtistCard;
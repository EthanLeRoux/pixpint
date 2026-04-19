import React from 'react';
import AddArtistForm from '../components/AddArtistForm';
import './AddArtistPage.css';

const AddArtistPage = () => {
  return (
    <section className="add-artist-page">
      <div className="page-header">
        <h1>Add Artist</h1>
        <p>Fetch Pixiv profile data and save it into your backend-powered artist list.</p>
      </div>
      <AddArtistForm />
    </section>
  );
};

export default AddArtistPage;

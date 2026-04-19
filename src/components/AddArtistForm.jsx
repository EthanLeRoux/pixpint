import React, { useState } from 'react';
import { useArtists } from '../hooks/useArtists';
import { getUserDetails } from '../services/pixivService';
import './AddArtistForm.css';

const AddArtistForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    pixivUserId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addArtist } = useArtists();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Fetch Pixiv profile data
      const pixivData = await getUserDetails(formData.pixivUserId);

      // Combine form data with Pixiv data
      const artistData = {
        name: formData.name,
        pixivUserId: formData.pixivUserId,
        pixivUrl: pixivData.pixivUrl,
        profileImage: pixivData.profileImage
      };

      // Store in Firestore
      await addArtist(artistData);

      // Reset form
      setFormData({ name: '', pixivUserId: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-artist-form">
      <h2>Add New Artist</h2>

      <div className="form-group">
        <label htmlFor="name">Artist Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="pixivUserId">Pixiv User ID</label>
        <input
          type="text"
          id="pixivUserId"
          name="pixivUserId"
          value={formData.pixivUserId}
          onChange={handleChange}
          required
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={loading} className="submit-button">
        {loading ? 'Adding Artist...' : 'Add Artist'}
      </button>
    </form>
  );
};

export default AddArtistForm;
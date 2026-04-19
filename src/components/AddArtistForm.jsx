import React, { useState } from 'react';
import { useArtists } from '../hooks/useArtists';
import { getUserDetails } from '../services/illustrationApi.js';
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userData = await getUserDetails(formData.pixivUserId);
      const artistData = {
        name: formData.name || userData.name,
        pixivUserId: formData.pixivUserId,
        pixivUrl: `https://www.pixiv.net/users/${formData.pixivUserId}`,
        profileImage: userData.avatar,
      };

      await addArtist(artistData);
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
          placeholder="Optional display name"
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
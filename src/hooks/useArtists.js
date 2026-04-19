import { useState, useEffect } from 'react';
import { getArtists, addArtist as addArtistService, updateArtist as updateArtistService, deleteArtist as deleteArtistService } from '../firebase/artistService.js';

export const useArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArtists();
      setArtists(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const addArtist = async (artistData) => {
    try {
      await addArtistService(artistData);
      await fetchArtists(); // Refresh the list
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateArtist = async (id, data) => {
    try {
      await updateArtistService(id, data);
      await fetchArtists(); // Refresh the list
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteArtist = async (id) => {
    try {
      await deleteArtistService(id);
      await fetchArtists(); // Refresh the list
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    artists,
    loading,
    error,
    addArtist,
    updateArtist,
    deleteArtist,
    refetch: fetchArtists
  };
};
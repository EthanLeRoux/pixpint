import { useState, useEffect } from 'react';
import { getArtists, addArtist as addArtistService } from '../services/artistApi.js';

export const useArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getArtists();
      setArtists(response.items || []);
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
      await fetchArtists();
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
    refetch: fetchArtists,
  };
};
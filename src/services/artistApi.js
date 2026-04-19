import { get, post } from './apiClient.js';

export const getArtists = () => get('/api/artists');
export const addArtist = (artistData) => post('/api/artists', artistData);

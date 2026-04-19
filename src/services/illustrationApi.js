import { get } from './apiClient.js';

export const getIllustrations = (page = 1, limit = 20) =>
  get(`/api/illustrations?page=${page}&limit=${limit}`);

export const getUserIllustrations = (userId, page = 1, limit = 20) =>
  get(`/api/illustrations?userId=${encodeURIComponent(userId)}&page=${page}&limit=${limit}`);

export const getIllustration = (illustId) => get(`/api/illustration?illustId=${encodeURIComponent(illustId)}`);

export const getUserDetails = (userId) => get(`/api/user/${encodeURIComponent(userId)}`);

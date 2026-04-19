import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseClient.js';

const withErrorHandling = (res, error) => {
  console.error('/api/artists error:', error);
  const message = error?.message || 'Failed to process artist request';
  return res.status(502).json({ error: message });
};

const serializeArtist = (doc) => ({
  id: doc.id,
  ...doc.data(),
});

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const snapshot = await getDocs(collection(db, 'artists'));
      const artists = snapshot.docs.map(serializeArtist);
      return res.status(200).json({ items: artists });
    }

    if (req.method === 'POST') {
      const { name, pixivUserId, pixivUrl, profileImage } = req.body || {};

      if (!name || !pixivUserId) {
        return res.status(400).json({ error: 'name and pixivUserId are required' });
      }

      const docRef = await addDoc(collection(db, 'artists'), {
        name,
        pixivUserId,
        pixivUrl: pixivUrl || `https://www.pixiv.net/users/${pixivUserId}`,
        profileImage: profileImage || null,
        createdAt: serverTimestamp(),
      });

      return res.status(201).json({ id: docRef.id });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return withErrorHandling(res, error);
  }
}
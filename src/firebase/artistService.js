import { db } from './firebaseConfig.js';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export const addArtist = async (artistData) => {
  try {
    const docRef = await addDoc(collection(db, 'artists'), {
      ...artistData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding artist:', error);
    throw error;
  }
};

export const getArtists = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'artists'));
    const artists = [];
    querySnapshot.forEach((doc) => {
      artists.push({ id: doc.id, ...doc.data() });
    });
    return artists;
  } catch (error) {
    console.error('Error getting artists:', error);
    throw error;
  }
};

export const updateArtist = async (id, data) => {
  try {
    const docRef = doc(db, 'artists', id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating artist:', error);
    throw error;
  }
};

export const deleteArtist = async (id) => {
  try {
    const docRef = doc(db, 'artists', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting artist:', error);
    throw error;
  }
};
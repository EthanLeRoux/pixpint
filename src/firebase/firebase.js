import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, query, where,getDoc, getDocs, updateDoc, deleteDoc, Timestamp, serverTimestamp, orderBy, setDoc,onSnapshot } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateEmail as fbUpdateEmail, updatePassword as fbUpdatePassword ,deleteUser,  EmailAuthProvider, 
  reauthenticateWithCredential, 
  verifyBeforeUpdateEmail  } from "firebase/auth";
import { writeBatch } from "firebase/firestore";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// console.log("Firebase app initialized:", app.name);

export const db = getFirestore(app);
export const auth = getAuth(app); // Export auth so other components can use it

// Enhanced signUpUser with better error handling
export async function signUpUser(email, password,role,firstName,lastName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
            email,
            uid: userCredential.user.uid,
            role,
            firstName,
            lastName,
            locationSet: false,
            pfpSet: false,
            driverProfileSet: false,
        });
        
        return userCredential.user;
    } catch (error) {
        console.error("Sign up failed:", error.message);
        throw error;
    }
}

// Enhanced loginUser function
export async function loginUser(email, password) {
    try {
        // console.log("Attempting to login user:", email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // console.log("User logged in successfully:", userCredential.user.uid);
        return userCredential.user;
    } catch (error) {
        // console.error("Login failed:", error.code, error.message);

        let errorMessage = "Login failed: ";
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage += "No account found with this email.";
                break;
            case 'auth/wrong-password':
                errorMessage += "Incorrect password.";
                break;
            case 'auth/invalid-email':
                errorMessage += "Please enter a valid email address.";
                break;
            case 'auth/network-request-failed':
                errorMessage += "Network error. Please check your connection.";
                break;
            case 'auth/api-key-not-valid':
                errorMessage += "Configuration error. Please contact support.";
                break;
            default:
                errorMessage += error.message;
        }

        alert(errorMessage);
        throw error;
    }
}

// Rest of your functions remain the same...
export const logoutUser = async () => {
    try {
        await signOut(auth);
        // console.log("User signed out successfully.");
    } catch (error) {
        // console.error("Error signing out:", error);
    }
};

export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error("Error sending reset email:", error.message);
        throw error;
    }
}

export async function updateEmail(newEmail) {
    if (!auth.currentUser) throw new Error("No user logged in");
    return await fbUpdateEmail(auth.currentUser, newEmail);
}

export async function updatePassword(newPassword) {
    if (!auth.currentUser) throw new Error("No user logged in");
    return await fbUpdatePassword(auth.currentUser, newPassword);
}

export async function saveDoc(docData, collectionName) {
    try {
       const data = await addDoc(collection(db, collectionName), docData);
       if (data.id) {
          //  console.log(`Document added to ${collectionName} with ID:`, data.id);
           return data.id;
       }
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
}

export async function getDocumentsByField(collectionName, fieldName, value) {
    try {
        const q = query(collection(db, collectionName), where(fieldName, "==", value));
        const querySnapshot = await getDocs(q);
        const results = [];
        querySnapshot.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
        return results;
    } catch (error) {
        console.error("Error getting documents:", error);
        throw error;
    }
}

export async function saveDriver(driverData) {
  try {
    // Get current drivers
    const snapshot = await getDocs(collection(db, "drivers"));
    const driverCount = snapshot.size;

    const driverNumber = driverCount + 1;
    const EARLY_LIMIT = 50;

    // Decide badge
    let badge = null;

    if (driverNumber <= EARLY_LIMIT) {
      badge = {
        type: "EARLY",
        label: "Day One Driver",
        awardedAt: new Date()
      };
    }

    const updatedDriverData = {
      ...driverData,
      driverNumber,
      badge,
      createdAt: new Date()
    };

    await setDoc(doc(db, "drivers", driverData.uid), updatedDriverData);

    return driverData.uid;
  } catch (error) {
    console.error("Error saving driver:", error);
    throw error;
  }
}

export async function getCollection(collectionName) {
    const docs = [];
  const querySnapshot = await getDocs(collection(db, collectionName));
  querySnapshot.forEach((doc) => {
    // doc.data() is the document data
    // doc.id is the document ID
    docs.push({ id: doc.id, ...doc.data() });
  });
  return docs;
}

export async function updateDocument(collectionName, docId, updatedData) {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, updatedData);
    } catch (error) {
        console.error("Error updating document:", error);
        throw error;
    }
}

export async function deleteDocument(collectionName, docId) {
    try {
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
        // console.log("Document deleted successfully.");
    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
}

export async function saveDriverReview(reviewData) {
    try {
        const reviewWithUser = {
            ...reviewData,
            timestamp: serverTimestamp(),
            createdAt: new Date().toISOString() // Client-side fallback
        };

        const docRef = await addDoc(collection(db, "driver-reviews"), reviewWithUser);
        // console.log("Review saved with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error saving driver review:", error);
        throw error;
    }
}

export async function getDriverReviews(driverId) {
    try {
        const q = query(
            collection(db, "driver-reviews"),
            where("driverId", "==", driverId),
            orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const reviews = [];
        querySnapshot.forEach((doc) => reviews.push({ id: doc.id, ...doc.data() }));
        return reviews;
    } catch (error) {
        console.error("Error getting driver reviews:", error);
        throw error;
    }
}

export const getOrCreateConversation = async (uid1, uid2) => {
  const convoId = [uid1, uid2].sort().join("_");
  const convoRef = doc(db, "conversations", convoId);
  const convoSnap = await getDoc(convoRef);

  // console.log('convoSnap exists:', convoSnap.exists());
  // console.log('about to create with:', { uid1, uid2, convoId });

  if (!convoSnap.exists()) {
    await setDoc(convoRef, {
      participants: [uid1, uid2],
      lastMessage: "",
      lastMessageAt: serverTimestamp(),
    });
  }
  return convoId;
};

// Send a message
export const sendMessage = async (convoId, senderId, text, replyTo = null) => {
  const msgRef = collection(db, "conversations", convoId, "messages");
  await addDoc(msgRef, {
    senderId,
    text,
    createdAt: serverTimestamp(),
    readBy: [senderId],
    replyTo: replyTo || null,
  });
  await updateDoc(doc(db, "conversations", convoId), {
    lastMessage: text,
    lastMessageAt: serverTimestamp(),
  });
};

// Listen to messages in real time
export const subscribeToMessages = (convoId, callback) => {
  const q = query(
    collection(db, "conversations", convoId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

// Listen to all conversations for a user
export const subscribeToConversations = (uid, callback) => {
  const q = query(
    collection(db, "conversations"),
    where("participants", "array-contains", uid)  // Firestore filters server-side
  );

  return onSnapshot(q, async (snap) => {
    const convos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const withUnread = await Promise.all(
      convos.map(async (convo) => {
        const msgsSnap = await getDocs(
          collection(db, "conversations", convo.id, "messages")
        );
        const unread = msgsSnap.docs.filter((d) => {
          const data = d.data();
          return data.senderId !== uid && !data.readBy?.includes(uid);
        }).length;
        return { ...convo, unread };
      })
    );

    callback(withUnread);
  });
};

export const markMessagesAsRead = async (convoId, uid) => {
  const q = query(
    collection(db, "conversations", convoId, "messages"),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(q);
  const batch = writeBatch(db);

  snap.docs.forEach((docSnap) => {
    const data = docSnap.data();
    if (!data.readBy?.includes(uid)) {
      batch.update(docSnap.ref, {
        readBy: [...(data.readBy || []), uid],
      });
    }
  });

  await batch.commit();
};

export const deleteAccount = async (uid) => {
  const batch = writeBatch(db);

  // 1. Anonymise the user document — keep it but wipe personal data
  const userRef = doc(db, "users", uid);
  batch.update(userRef, {
    firstName: "Deleted",
    lastName: "Account",
    email: "",
    phone: "",
    image64: "",
    latitude: null,
    longitude: null,
    locationAddress: "",
    locationSet: false,
    pfpSet: false,
    deleted: true,
    deletedAt: new Date().toISOString(),
  });

  // 2. Anonymise the driver document if exists
 const driverRef = doc(db, "drivers", uid);
  const driverSnap = await getDoc(driverRef);

  if (driverSnap.exists()) {
    batch.update(driverRef, {
      deleted: true,
      supportedSchools: [],
      languages: [],
      pricePerMonth: null,
      vehicleType: "",
      vehicleCapacity: null,
      availableSeats: null,
    });
  }

  await batch.commit();

  // 3. Delete Firebase Auth account
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    await deleteUser(user); // deletes auth account
  }
};

export const changeEmail = async (currentPassword, newEmail) => {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await verifyBeforeUpdateEmail(user, newEmail);
};


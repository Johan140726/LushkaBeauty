import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../../environments/firebase-config';

// Las credenciales web de Firebase no son secretos. La autorización depende
// de Firebase Authentication y de las reglas publicadas en Cloud Firestore.
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

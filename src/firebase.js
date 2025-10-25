// Configuration Firebase pour la synchronisation en temps réel
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

// Configuration Firebase (remplacer par vos propres clés)
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Fonction pour sauvegarder les données des écoles
export const saveSchoolsData = async (schoolsData) => {
  try {
    await setDoc(doc(db, 'coordination', 'schools'), {
      schools: schoolsData,
      lastUpdated: new Date().toISOString()
    });
    console.log('Données sauvegardées sur Firebase');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde Firebase:', error);
    throw error;
  }
};

// Fonction pour charger les données des écoles
export const loadSchoolsData = async () => {
  try {
    const docRef = doc(db, 'coordination', 'schools');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().schools;
    } else {
      console.log('Aucune donnée trouvée sur Firebase');
      return null;
    }
  } catch (error) {
    console.error('Erreur lors du chargement Firebase:', error);
    throw error;
  }
};

// Fonction pour écouter les changements en temps réel
export const subscribeToSchoolsData = (callback) => {
  const docRef = doc(db, 'coordination', 'schools');
  
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback(data.schools);
    } else {
      console.log('Aucune donnée trouvée sur Firebase');
      callback(null);
    }
  }, (error) => {
    console.error('Erreur lors de l\'écoute Firebase:', error);
  });
};

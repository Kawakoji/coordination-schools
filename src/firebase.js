// Configuration Firebase pour la synchronisation en temps réel
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

// Configuration Firebase (clés réelles)
const firebaseConfig = {
  apiKey: "AIzaSyCokgD-y_M2rya-woXMhVKwpaRr-mBtyIg",
  authDomain: "coordination-schools.firebaseapp.com",
  projectId: "coordination-schools",
  storageBucket: "coordination-schools.firebasestorage.app",
  messagingSenderId: "745012743753",
  appId: "1:745012743753:web:e982df2e0c17787ae13998",
  measurementId: "G-THZDMYMP5C"
};

// Vérifier si la configuration Firebase est valide
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && 
         firebaseConfig.projectId === "coordination-schools";
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Fonction pour sauvegarder les données des écoles
export const saveSchoolsData = async (schoolsData) => {
  // Vérifier si Firebase est configuré
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase non configuré - Utilisez localStorage');
  }
  
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
  // Vérifier si Firebase est configuré
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase non configuré - Utilisez localStorage');
  }
  
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
  // Vérifier si Firebase est configuré
  if (!isFirebaseConfigured()) {
    console.log('Firebase non configuré - Pas de synchronisation en temps réel');
    return () => {}; // Retourner une fonction vide pour nettoyer
  }
  
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

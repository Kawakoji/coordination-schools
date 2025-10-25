import React, { useState, useEffect } from 'react';
import { saveSchoolsData, loadSchoolsData, subscribeToSchoolsData } from './firebase.js';

/**
 * Application de coordination des animateurs pour 3 écoles
 * 
 * FONCTIONNALITÉS :
 * - Gestion de 3 écoles avec nombre d'animateurs et d'élèves
 * - Calcul automatique du quota (1 animateur pour 8 enfants)
 * - Notifications automatiques entre écoles
 * - Persistance localStorage
 * - Auto-refresh toutes les 10 minutes
 * 
 * TESTS MANUELS :
 * 1. École A: 10 élèves/1 animateur → manque 1 → École B: 6 élèves/2 animateurs → excédent 1 → notification
 * 2. Toutes écoles équilibrées → aucune notification
 * 3. Aucune école avec excédent → alerte "Aucune aide disponible"
 * 4. Bouton Réinitialiser → remet 0/0 et sauvegarde
 * 5. Auto-refresh → vérifier après 10 minutes (ou modifier l'intervalle pour test)
 * 
 * REMPLACEMENT API :
 * Remplacer toutes les occurrences de localStorage par des appels API :
 * - localStorage.getItem() → await fetch('/api/schools').then(r => r.json())
 * - localStorage.setItem() → await fetch('/api/schools', {method: 'POST', body: JSON.stringify(data)})
 */

const CoordinationSchools = () => {
  // État initial des écoles
  const [schools, setSchools] = useState({
    'École A': { animators: 0, students: 0 },
    'École B': { animators: 0, students: 0 },
    'École C': { animators: 0, students: 0 }
  });

  // État pour les notifications
  const [notification, setNotification] = useState(null);

  // Charger les données depuis Firebase au montage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Essayer Firebase d'abord
        const firebaseData = await loadSchoolsData();
        if (firebaseData) {
          setSchools(firebaseData);
          console.log('Données chargées depuis Firebase');
        } else {
          // Fallback vers localStorage si Firebase n'a pas de données
          const savedData = localStorage.getItem('coordination-schools');
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            setSchools(parsedData);
            console.log('Données chargées depuis localStorage (fallback)');
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // Fallback vers localStorage en cas d'erreur Firebase
        try {
          const savedData = localStorage.getItem('coordination-schools');
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            setSchools(parsedData);
          }
        } catch (localError) {
          console.error('Erreur localStorage:', localError);
        }
      }
    };

    loadData();
  }, []);

  // Synchronisation en temps réel avec Firebase
  useEffect(() => {
    const unsubscribe = subscribeToSchoolsData((firebaseData) => {
      if (firebaseData) {
        setSchools(firebaseData);
        console.log('Données synchronisées depuis Firebase en temps réel');
      }
    });

    // Nettoyer l'écoute lors du démontage
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Auto-refresh toutes les 10 minutes (fallback)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Essayer Firebase d'abord
        const firebaseData = await loadSchoolsData();
        if (firebaseData) {
          setSchools(firebaseData);
        } else {
          // Fallback vers localStorage
          const savedData = localStorage.getItem('coordination-schools');
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            setSchools(parsedData);
          }
        }
      } catch (error) {
        console.error('Erreur lors du rafraîchissement:', error);
      }
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  // Calculer le statut d'une école
  const calculateSchoolStatus = (animators, students) => {
    const needed = Math.ceil(students / 8);
    const delta = animators - needed;
    
    if (delta < 0) {
      return { type: 'manque', count: Math.abs(delta) };
    } else if (delta > 0) {
      return { type: 'excedent', count: delta };
    } else {
      return { type: 'ok', count: 0 };
    }
  };

  // Calculer les excédents et manques pour toutes les écoles
  const calculateAllStatuses = () => {
    const statuses = {};
    Object.keys(schools).forEach(schoolName => {
      const { animators, students } = schools[schoolName];
      statuses[schoolName] = calculateSchoolStatus(animators, students);
    });
    return statuses;
  };

  // Trouver l'école avec le plus grand excédent
  const findSchoolWithMaxExcedent = (excludeSchool) => {
    const statuses = calculateAllStatuses();
    let maxExcedentSchool = null;
    let maxExcedent = 0;

    Object.keys(statuses).forEach(schoolName => {
      if (schoolName !== excludeSchool && statuses[schoolName].type === 'excedent') {
        if (statuses[schoolName].count > maxExcedent) {
          maxExcedent = statuses[schoolName].count;
          maxExcedentSchool = schoolName;
        }
      }
    });

    return { school: maxExcedentSchool, excedent: maxExcedent };
  };

  // Gérer les notifications
  useEffect(() => {
    const statuses = calculateAllStatuses();
    const schoolsInNeed = Object.keys(statuses).filter(
      schoolName => statuses[schoolName].type === 'manque'
    );

    if (schoolsInNeed.length === 0) {
      setNotification(null);
      return;
    }

    // Prendre la première école en manque (on pourrait améliorer pour gérer plusieurs)
    const schoolInNeed = schoolsInNeed[0];
    const needCount = statuses[schoolInNeed].count;
    
    const { school: helperSchool, excedent } = findSchoolWithMaxExcedent(schoolInNeed);

    if (helperSchool && excedent > 0) {
      const canHelp = Math.min(excedent, needCount);
      setNotification({
        type: 'help',
        helper: helperSchool,
        helped: schoolInNeed,
        amount: canHelp,
        excedent: excedent
      });
    } else {
      setNotification({
        type: 'no-help',
        helped: schoolInNeed,
        need: needCount
      });
    }
  }, [schools]);

  // Sauvegarder les données
  const saveData = async () => {
    try {
      // Sauvegarder sur Firebase
      await saveSchoolsData(schools);
      
      // Sauvegarder aussi en local comme backup
      localStorage.setItem('coordination-schools', JSON.stringify(schools));
      
      alert('Données sauvegardées avec succès ! (Synchronisées sur tous les appareils)');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde Firebase:', error);
      
      // Fallback vers localStorage
      try {
        localStorage.setItem('coordination-schools', JSON.stringify(schools));
        alert('Données sauvegardées localement (Firebase indisponible)');
      } catch (localError) {
        console.error('Erreur localStorage:', localError);
        alert('Erreur lors de la sauvegarde');
      }
    }
  };

  // Mettre à jour une école
  const updateSchool = (schoolName, field, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setSchools(prev => ({
      ...prev,
      [schoolName]: {
        ...prev[schoolName],
        [field]: numValue
      }
    }));
  };

  // Réinitialiser une école
  const resetSchool = (schoolName) => {
    setSchools(prev => ({
      ...prev,
      [schoolName]: { animators: 0, students: 0 }
    }));
  };

  // Réinitialiser toutes les écoles
  const resetAll = () => {
    const resetSchools = {
      'École A': { animators: 0, students: 0 },
      'École B': { animators: 0, students: 0 },
      'École C': { animators: 0, students: 0 }
    };
    setSchools(resetSchools);
    setNotification(null);
  };

  // Rendu d'une carte d'école
  const renderSchoolCard = (schoolName) => {
    const { animators, students } = schools[schoolName];
    const status = calculateSchoolStatus(animators, students);

    const getStatusMessage = () => {
      switch (status.type) {
        case 'ok':
          return 'Quota respecté — Pas d\'intervention nécessaire';
        case 'manque':
          return `Manque ${status.count} animateur(s) — Demander de l'aide`;
        case 'excedent':
          return `Excédent de ${status.count} animateur(s) — Peut aider`;
        default:
          return '';
      }
    };

    const getStatusColor = () => {
      switch (status.type) {
        case 'ok':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'manque':
          return 'bg-red-100 text-red-800 border-red-200';
        case 'excedent':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{schoolName}</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor={`${schoolName}-animators`} className="block text-sm font-medium text-gray-700 mb-2">
              Nombre d'animateurs
            </label>
            <input
              id={`${schoolName}-animators`}
              type="number"
              min="0"
              value={animators}
              onChange={(e) => updateSchool(schoolName, 'animators', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor={`${schoolName}-students`} className="block text-sm font-medium text-gray-700 mb-2">
              Nombre d'élèves
            </label>
            <input
              id={`${schoolName}-students`}
              type="number"
              min="0"
              value={students}
              onChange={(e) => updateSchool(schoolName, 'students', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div className={`p-3 rounded-md border ${getStatusColor()}`}>
            <p className="text-sm font-medium">{getStatusMessage()}</p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => {
                updateSchool(schoolName, 'animators', animators);
                updateSchool(schoolName, 'students', students);
                saveData();
              }}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Sauvegarder
            </button>
            <button
              onClick={() => {
                resetSchool(schoolName);
                saveData();
              }}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Coordination des Animateurs
          </h1>
          <p className="text-gray-600">
            Gestion du quota 1 animateur pour 8 enfants • Auto-refresh toutes les 10 minutes
          </p>
        </div>

        {/* Notifications */}
        {notification && (
          <div className="mb-6">
            {notification.type === 'help' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      L'<strong>{notification.helper}</strong> peut aider l'<strong>{notification.helped}</strong> 
                      (excédent de {notification.excedent} animateur{notification.excedent > 1 ? 's' : ''}).
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      Aucune école n'a d'animateur disponible pour aider l'<strong>{notification.helped}</strong> 
                      (manque de {notification.need} animateur{notification.need > 1 ? 's' : ''}).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cartes des écoles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.keys(schools).map(schoolName => (
            <div key={schoolName}>
              {renderSchoolCard(schoolName)}
            </div>
          ))}
        </div>

        {/* Actions globales */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={saveData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Sauvegarder toutes les écoles
          </button>
          <button
            onClick={resetAll}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Réinitialiser toutes les écoles
          </button>
        </div>

        {/* Informations de debug (optionnel) */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Informations de synchronisation :</h3>
          <p className="text-xs text-gray-600">
            🔄 Synchronisation en temps réel avec Firebase • 📱 Modifications visibles sur tous les appareils • 💾 Backup localStorage
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoordinationSchools;

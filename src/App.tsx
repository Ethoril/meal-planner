// src/App.tsx

import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './features/auth/AuthProvider';
import { LoginScreen } from './features/auth/LoginScreen';
import { PlanningView } from './features/planning/PlanningView';
import { DishForm } from './features/dishes/DishForm';
import { Modal } from './components/ui/Modal';
import { useStore } from './store/useStore';
import { syncDishes, syncSlots } from './utils/firebase-helpers';
import { saveDish } from './utils/firebase-helpers';
import { Dish } from './types/schema';

function AppContent() {
  const { user, logout, loading } = useAuth();
  const { setDishes, setSlots, addDish, setUserId } = useStore(); // ← Ajout de setUserId
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    setUserId(user.uid); // ← Nouvelle ligne : enregistre le userId dans le store
    const unsubDishes = syncDishes(user.uid, setDishes);
    const unsubSlots = syncSlots(user.uid, setSlots);

    return () => {
      unsubDishes();
      unsubSlots();
    };
  }, [user, setDishes, setSlots, setUserId]); // ← Ajout de setUserId dans les dépendances

  const handleCreateDish = async (dish: Dish) => {
    console.log('handleCreateDish appelé', dish);
    if (!user) return;
    
    addDish(dish);
    await saveDish(user.uid, dish);
    console.log('Plat sauvegardé, fermeture du modal');
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-xl">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-[#E8DCC8]">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="bg-[#E8DCC8] py-4 md:py-6 px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">
                <span className="text-gray-800">Morgane's </span>
                <span className="text-[#CD5C08]">Super Planner</span>
              </h1>
              <p className="text-gray-600 mt-1 text-base md:text-lg">
                C'est l'heure de bien manger ! 🥕
              </p>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#6C4E31] hover:bg-[#8B6F47] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium shadow-md transition-colors flex items-center gap-2 flex-1 md:flex-none justify-center"
              >
                <span className="text-xl">🍳</span>
                <span className="hidden sm:inline">Cuisiner un plat</span>
                <span className="sm:hidden">Cuisiner</span>
              </button>
              
              <button className="text-gray-600 hover:underline text-sm">
                Nettoyer
              </button>
            </div>
          </div>
        </header>

        {/* CONTENU PRINCIPAL */}
        <main>
          <PlanningView />
        </main>
      </div>

      {/* MODALE DE CRÉATION */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cuisiner un plat"
      >
        <DishForm
          onSave={handleCreateDish}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

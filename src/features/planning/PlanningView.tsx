// src/features/planning/PlanningView.tsx

import { useState } from 'react';
import { startOfWeek, addDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FridgePanel } from '../dishes/FridgePanel';
import { WeekGrid } from './WeekGrid';
import { BottomDrawer } from '../../components/ui/BottomDrawer';
import { useStore } from '../../store/useStore';
import { getDishColors } from '../../types/schema';


export function PlanningView() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dishes = useStore((state) => state.dishes);

  const goToPreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const week1Days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  const week2Days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i + 7));

  return (
    <>
      {/* BARRE DE NAVIGATION MOIS */}
      <div className="bg-white mx-4 md:mx-8 mt-4 md:mt-6 mb-4 md:mb-6 px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center">
          <button
            onClick={goToPreviousWeek}
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm md:text-base"
          >
            ← Précédent
          </button>
          
          <div className="text-center">
            <div className="text-lg md:text-2xl font-bold text-gray-800 capitalize">
              {format(currentWeekStart, 'MMMM yyyy', { locale: fr })}
            </div>
            <div className="text-xs md:text-sm text-[#CD5C08] font-bold mt-1">
              AUJOURD'HUI
            </div>
          </div>
          
          <button
            onClick={goToNextWeek}
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm md:text-base"
          >
            Suivant →
          </button>
        </div>
      </div>

      {/* CONTENU */}
      <div className="flex px-4 md:px-8 pb-8 md:pb-8 gap-6">
        {/* Frigo Desktop uniquement */}
        <div className="hidden md:block">
          <FridgePanel />
        </div>
        
        <div className="flex-1 space-y-6 md:space-y-8">
          {/* Semaine 1 */}
          <div>
            <div className="text-left mb-3 md:mb-4 text-base md:text-lg font-semibold text-gray-800">
              Semaine du {format(currentWeekStart, 'd MMMM yyyy', { locale: fr })}
            </div>
            <WeekGrid weekDays={week1Days} />
          </div>

          {/* Espacement */}
          <div className="h-4 md:h-8" />

          {/* Semaine 2 */}
          <div>
            <div className="text-left mb-3 md:mb-4 text-base md:text-lg font-semibold text-gray-800">
              Semaine du {format(addDays(currentWeekStart, 7), 'd MMMM yyyy', { locale: fr })}
            </div>
            <WeekGrid weekDays={week2Days} />
          </div>
          
          {/* Espace pour le drawer mobile */}
          <div className="h-20 md:hidden" />
        </div>
      </div>

{/* Frigo Mobile en tiroir */}
<div className="md:hidden">
  <BottomDrawer isOpen={isDrawerOpen} onToggle={() => setIsDrawerOpen(!isDrawerOpen)}>
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Mes plats</h3>
      {dishes.map((dish) => {
        const colors = getDishColors(dish);
        return (
          <div
            key={dish.id}
            className="p-3 rounded-lg text-white font-semibold"
            style={{ backgroundColor: colors.bg }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="flex-1">{dish.name}</span>
              <span className="text-sm opacity-90">Stock: {dish.quantity}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // TODO: Ouvrir modal d'édition
                  console.log('Éditer', dish);
                }}
                className="flex-1 bg-white/20 hover:bg-white/30 py-2 px-3 rounded text-sm font-medium transition-colors"
              >
                ✏️ Éditer
              </button>
              <button
                onClick={() => {
                  if (confirm(`Supprimer "${dish.name}" ?`)) {
                    useStore.getState().deleteDish(dish.id);
                  }
                }}
                className="flex-1 bg-white/20 hover:bg-white/30 py-2 px-3 rounded text-sm font-medium transition-colors"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </BottomDrawer>
</div>

    </>
  );
}

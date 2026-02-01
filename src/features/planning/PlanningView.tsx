// src/features/planning/PlanningView.tsx

import { useState } from 'react';
import { startOfWeek, addDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FridgePanel } from '../dishes/FridgePanel';
import { WeekGrid } from './WeekGrid';

export function PlanningView() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

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
      <div className="bg-white mx-8 mt-6 mb-6 px-6 py-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center">
          <button
            onClick={goToPreviousWeek}
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            ← Précédent
          </button>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 capitalize">
              {format(currentWeekStart, 'MMMM yyyy', { locale: fr })}
            </div>
            <div className="text-sm text-[#CD5C08] font-bold mt-1">
              AUJOURD'HUI
            </div>
          </div>
          
          <button
            onClick={goToNextWeek}
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Suivant →
          </button>
        </div>
      </div>

      {/* CONTENU */}
      <div className="flex px-8 pb-8 gap-6">
        <FridgePanel />
        
        <div className="flex-1 space-y-8">
          {/* Semaine 1 */}
          <div>
            <div className="text-left mb-4 text-lg font-semibold text-gray-800">
              Semaine du {format(currentWeekStart, 'd MMMM yyyy', { locale: fr })}
            </div>
            <WeekGrid weekDays={week1Days} />
          </div>

          {/* Espacement de 32px */}
          <div style={{ height: '32px' }} />

          {/* Semaine 2 */}
          <div>
            <div className="text-left mb-4 text-lg font-semibold text-gray-800">
              Semaine du {format(addDays(currentWeekStart, 7), 'd MMMM yyyy', { locale: fr })}
            </div>
            <WeekGrid weekDays={week2Days} />
          </div>
        </div>
      </div>
    </>
  );
}

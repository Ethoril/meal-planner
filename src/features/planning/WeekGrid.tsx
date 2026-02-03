// src/features/planning/WeekGrid.tsx

import { useState } from 'react';
import { format, isToday, isBefore, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useStore } from '../../store/useStore';
import { getDishColors, DishColorBase, Dish } from '../../types/schema';
import { DishSelector } from '../../components/ui/DishSelector';

interface WeekGridProps {
  weekDays: Date[];
}

interface SlotSelection {
  date: string;
  meal: 'lunch' | 'dinner';
}

export function WeekGrid({ weekDays }: WeekGridProps) {
  const slots = useStore((state) => state.slots);
  const dishes = useStore((state) => state.dishes);
  const removeSlot = useStore((state) => state.removeSlot);
  const addSlot = useStore((state) => state.addSlot);
  const [selectedSlot, setSelectedSlot] = useState<SlotSelection | null>(null);
  
  const today = startOfDay(new Date());

  const handleSlotClick = (date: string, meal: 'lunch' | 'dinner', isPast: boolean) => {
    if (isPast) return;
    setSelectedSlot({ date, meal });
  };

  const handleDishSelect = (dish: Dish) => {
    if (!selectedSlot) return;
    
    addSlot({
      date: selectedSlot.date,
      meal: selectedSlot.meal,
      dishId: dish.id,
      type: 'meal',
      dishName: dish.name,
      dishColor: dish.color || 'orange'
    });
    
    setSelectedSlot(null);
  };

  return (
    <>
      {/* Vue Desktop (cachée sur mobile) */}
      <div className="hidden md:flex gap-[5px]">
        {weekDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isPast = isBefore(day, today);
          const isCurrentDay = isToday(day);

          const lunchSlot = slots.find(s => s.date === dateStr && s.meal === 'lunch');
          const dinnerSlot = slots.find(s => s.date === dateStr && s.meal === 'dinner');

          const lunchDish = lunchSlot ? dishes.find(d => d.id === lunchSlot.dishId) : null;
          const dinnerDish = dinnerSlot ? dishes.find(d => d.id === dinnerSlot.dishId) : null;

          return (
            <div
              key={dateStr}
              className={`flex flex-col rounded-xl overflow-hidden shadow-sm ${isPast ? 'opacity-50' : ''}`}
              style={{ width: '127px', minHeight: '300px' }}
            >
              {/* HEADER DU JOUR */}
              <div
                className={`text-center py-3 ${
                  isCurrentDay 
                    ? 'bg-[#C1440E] text-white' 
                    : isPast 
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-wide">
                  {format(day, 'EEEE', { locale: fr })}
                </div>
                <div className="text-3xl font-bold mt-1">
                  {format(day, 'd')}
                </div>
              </div>

              {/* CONTENU DU JOUR */}
              <div className={`flex-1 p-2.5 flex flex-col gap-3 ${
                isPast ? 'bg-gray-100' : 'bg-white'
              }`}>
                {/* MIDI */}
                <div className="flex flex-col">
                  <div className="text-[11px] text-gray-500 font-semibold mb-1.5">MIDI</div>
                  <div
                    className="relative rounded-lg overflow-hidden"
                    style={{ width: '112px', height: '70px' }}
                    onDragOver={(e) => !isPast && e.preventDefault()}
                    onDrop={(e) => {
                      if (isPast) return;
                      e.preventDefault();
                      const dishId = e.dataTransfer.getData('dishId');
                      if (dishId) {
                        const dish = dishes.find(d => d.id === dishId);
                        if (dish) {
                          addSlot({
                            date: dateStr,
                            meal: 'lunch',
                            dishId,
                            type: 'meal',
                            dishName: dish.name,
                            dishColor: dish.color || 'orange'
                          });
                        }
                      }
                    }}
                  >
                    {lunchSlot ? (
                      <div
                        className="w-full h-full flex items-center justify-center text-white font-bold text-sm relative group cursor-pointer"
                        style={{ 
                          backgroundColor: lunchDish 
                            ? getDishColors(lunchDish).bg 
                            : getDishColors({ 
                                id: lunchSlot.dishId, 
                                name: lunchSlot.dishName, 
                                color: (lunchSlot.dishColor || 'orange') as DishColorBase,
                                quantity: 0,
                                
                                tags: []
                              }).bg
                        }}
                      >
                        <span className="text-center px-2 leading-tight break-words">
                          {lunchDish?.name || lunchSlot.dishName || 'Plat supprimé'}
                        </span>
                        <button
                          onClick={() => removeSlot(lunchSlot.id)}
                          className="absolute top-1 right-1 text-white/80 hover:text-white text-lg leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className={`w-full h-full border-2 border-dashed rounded-lg ${
                        isPast ? 'border-gray-300 bg-gray-50' : 'border-gray-300'
                      }`} />
                    )}
                  </div>
                </div>

                {/* SOIR */}
                <div className="flex flex-col">
                  <div className="text-[11px] text-gray-500 font-semibold mb-1.5">SOIR</div>
                  <div
                    className="relative rounded-lg overflow-hidden"
                    style={{ width: '112px', height: '70px' }}
                    onDragOver={(e) => !isPast && e.preventDefault()}
                    onDrop={(e) => {
                      if (isPast) return;
                      e.preventDefault();
                      const dishId = e.dataTransfer.getData('dishId');
                      if (dishId) {
                        const dish = dishes.find(d => d.id === dishId);
                        if (dish) {
                          addSlot({
                            date: dateStr,
                            meal: 'dinner',
                            dishId,
                            type: 'meal',
                            dishName: dish.name,
                            dishColor: dish.color || 'orange'
                          });
                        }
                      }
                    }}
                  >
                    {dinnerSlot ? (
                      <div
                        className="w-full h-full flex items-center justify-center text-white font-bold text-sm relative group cursor-pointer"
                        style={{ 
                          backgroundColor: dinnerDish 
                            ? getDishColors(dinnerDish).bg 
                            : getDishColors({ 
                                id: dinnerSlot.dishId, 
                                name: dinnerSlot.dishName, 
                                color: (dinnerSlot.dishColor || 'orange') as DishColorBase,
                                quantity: 0,
                                
                                tags: []
                              }).bg
                        }}
                      >
                        <span className="text-center px-2 leading-tight break-words">
                          {dinnerDish?.name || dinnerSlot.dishName || 'Plat supprimé'}
                        </span>
                        <button
                          onClick={() => removeSlot(dinnerSlot.id)}
                          className="absolute top-1 right-1 text-white/80 hover:text-white text-lg leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className={`w-full h-full border-2 border-dashed rounded-lg ${
                        isPast ? 'border-gray-300 bg-gray-50' : 'border-gray-300'
                      }`} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vue Mobile (affichée uniquement sur mobile) - 2 jours par ligne */}
      <div className="md:hidden grid grid-cols-2 gap-3">
        {weekDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isPast = isBefore(day, today);
          const isCurrentDay = isToday(day);

          const lunchSlot = slots.find(s => s.date === dateStr && s.meal === 'lunch');
          const dinnerSlot = slots.find(s => s.date === dateStr && s.meal === 'dinner');

          const lunchDish = lunchSlot ? dishes.find(d => d.id === lunchSlot.dishId) : null;
          const dinnerDish = dinnerSlot ? dishes.find(d => d.id === dinnerSlot.dishId) : null;

          return (
            <div
              key={dateStr}
              className={`rounded-xl overflow-hidden shadow-md ${isPast ? 'opacity-60' : ''}`}
            >
              {/* HEADER DU JOUR */}
              <div
                className={`py-2 px-3 ${
                  isCurrentDay 
                    ? 'bg-[#C1440E] text-white' 
                    : isPast 
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <div className="text-xs font-semibold uppercase text-center">
                  {format(day, 'EEE', { locale: fr })}
                </div>
                <div className="text-2xl font-bold text-center">
                  {format(day, 'd')}
                </div>
              </div>

              {/* REPAS */}
              <div className={`p-3 space-y-3 ${isPast ? 'bg-gray-100' : 'bg-white'}`}>
                {/* MIDI */}
                <div>
                  <div className="text-xs text-gray-500 font-semibold mb-1.5">🍽️ MIDI</div>
                  <div
                    className="relative rounded-lg overflow-hidden cursor-pointer"
                    style={{ height: '60px' }}
                    onClick={() => !lunchSlot && handleSlotClick(dateStr, 'lunch', isPast)}
                  >
                    {lunchSlot ? (
                      <div
                        className="w-full h-full flex items-center justify-between px-3 text-white font-bold text-sm relative"
                        style={{ 
                          backgroundColor: lunchDish 
                            ? getDishColors(lunchDish).bg 
                            : getDishColors({ 
                                id: lunchSlot.dishId, 
                                name: lunchSlot.dishName, 
                                color: (lunchSlot.dishColor || 'orange') as DishColorBase,
                                quantity: 0,
                                
                                tags: []
                              }).bg
                        }}
                      >
                        <span className="flex-1 truncate">
                          {lunchDish?.name || lunchSlot.dishName || 'Plat supprimé'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSlot(lunchSlot.id);
                          }}
                          className="text-white/90 hover:text-white text-2xl leading-none ml-2"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className={`w-full h-full border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 text-xs ${
                        isPast ? 'border-gray-300 bg-gray-50' : 'border-gray-300 active:bg-gray-50'
                      }`}>
                        {isPast ? 'Vide' : 'Ajouter'}
                      </div>
                    )}
                  </div>
                </div>

                {/* SOIR */}
                <div>
                  <div className="text-xs text-gray-500 font-semibold mb-1.5">🌙 SOIR</div>
                  <div
                    className="relative rounded-lg overflow-hidden cursor-pointer"
                    style={{ height: '60px' }}
                    onClick={() => !dinnerSlot && handleSlotClick(dateStr, 'dinner', isPast)}
                  >
                    {dinnerSlot ? (
                      <div
                        className="w-full h-full flex items-center justify-between px-3 text-white font-bold text-sm relative"
                        style={{ 
                          backgroundColor: dinnerDish 
                            ? getDishColors(dinnerDish).bg 
                            : getDishColors({ 
                                id: dinnerSlot.dishId, 
                                name: dinnerSlot.dishName, 
                                color: (dinnerSlot.dishColor || 'orange') as DishColorBase,
                                quantity: 0,
                                
                                tags: []
                              }).bg
                        }}
                      >
                        <span className="flex-1 truncate">
                          {dinnerDish?.name || dinnerSlot.dishName || 'Plat supprimé'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSlot(dinnerSlot.id);
                          }}
                          className="text-white/90 hover:text-white text-2xl leading-none ml-2"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className={`w-full h-full border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 text-xs ${
                        isPast ? 'border-gray-300 bg-gray-50' : 'border-gray-300 active:bg-gray-50'
                      }`}>
                        {isPast ? 'Vide' : 'Ajouter'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sélecteur de plat pour mobile */}
      {selectedSlot && (
        <DishSelector
          dishes={dishes}
          onSelect={handleDishSelect}
          onCancel={() => setSelectedSlot(null)}
        />
      )}
    </>
  );
}

// src/features/planning/WeekGrid.tsx

import { format, isToday, isBefore, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useStore } from '../../store/useStore';
import { getDishColors, DishColorBase } from '../../types/schema';

interface WeekGridProps {
  weekDays: Date[];
}

export function WeekGrid({ weekDays }: WeekGridProps) {
  const slots = useStore((state) => state.slots);
  const dishes = useStore((state) => state.dishes);
  const removeSlot = useStore((state) => state.removeSlot);
  const addSlot = useStore((state) => state.addSlot);
  
  const today = startOfDay(new Date());

  return (
    <div className="flex gap-[5px]">
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
                              defaultYield: 1,
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
                              defaultYield: 1,
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
  );
}

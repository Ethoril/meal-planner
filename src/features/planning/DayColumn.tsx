// src/features/planning/DayColumn.tsx

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MealType } from '../../types/schema';
import { MealSlotCard } from './MealSlotCard';

interface DayColumnProps {
  date: Date;
}

const MEALS: MealType[] = ['lunch', 'dinner'];

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: '🌅 Petit-déj',
  lunch: '🍽️ Midi',
  dinner: '🌙 Soir',
  snack: '🍪 Snack',
};

export function DayColumn({ date }: DayColumnProps) {
  const dateStr = format(date, 'yyyy-MM-dd');
  const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;

  return (
    <div className={`border rounded-lg overflow-hidden ${isToday ? 'ring-2 ring-blue-500' : 'border-gray-200'}`}>
      <div className={`p-2 text-center font-semibold ${isToday ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-700'}`}>
        <div className="text-xs uppercase">
          {format(date, 'EEE', { locale: fr })}
        </div>
        <div className="text-lg">
          {format(date, 'd')}
        </div>
      </div>
      
      <div className="p-2 space-y-2 bg-gray-50 min-h-[200px]">
        {MEALS.map((meal) => (
          <MealSlotCard
            key={`${dateStr}-${meal}`}
            date={dateStr}
            meal={meal}
            label={MEAL_LABELS[meal]}
          />
        ))}
      </div>
    </div>
  );
}

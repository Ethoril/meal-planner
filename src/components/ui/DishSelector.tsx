// src/components/ui/DishSelector.tsx
import { Dish } from '../../types/schema';
import { getDishColors } from '../../types/schema';

interface DishSelectorProps {
  dishes: Dish[];
  onSelect: (dish: Dish) => void;
  onCancel: () => void;
}

export function DishSelector({ dishes, onSelect, onCancel }: DishSelectorProps) {
  const availableDishes = dishes.filter(d => d.quantity > 0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={onCancel}>
      <div 
        className="bg-white rounded-t-3xl w-full max-h-[70vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b">
          <h3 className="text-lg font-bold text-center">Choisir un plat</h3>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-2" style={{ maxHeight: 'calc(70vh - 60px)' }}>
          {availableDishes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Aucun plat disponible en stock
            </p>
          ) : (
            availableDishes.map((dish) => {
              const colors = getDishColors(dish);
              return (
                <button
                  key={dish.id}
                  onClick={() => onSelect(dish)}
                  className="w-full p-4 rounded-lg text-white font-semibold text-left flex items-center justify-between"
                  style={{ backgroundColor: colors.bg }}
                >
                  <span>{dish.name}</span>
                  <span className="text-sm opacity-90">Stock: {dish.quantity}</span>
                </button>
              );
            })
          )}
        </div>
        
        <div className="p-4 border-t">
          <button
            onClick={onCancel}
            className="w-full py-3 bg-gray-200 rounded-lg font-semibold"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

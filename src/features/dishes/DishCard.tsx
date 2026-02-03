// src/features/dishes/DishCard.tsx

import React from 'react';
import { Dish, getDishColors } from '../../types/schema';

interface DishCardProps {
  dish: Dish;
  onEdit: () => void;
  onDelete: () => void;
  onConsume: () => void;
  onRestock: () => void;
}

export function DishCard({ dish, onEdit, onDelete, onConsume, onRestock }: DishCardProps) {
  const colors = getDishColors(dish);
  const isOutOfStock = dish.quantity === 0;

  return (
    <div 
      className="rounded-xl p-4 shadow-md border border-gray-200"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-white font-semibold text-lg flex-1">{dish.name}</h3>
        <button
          onClick={onDelete}
          className="text-white/80 hover:text-white text-xl leading-none ml-2"
        >
          ×
        </button>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <div 
          className="px-3 py-1 rounded-full text-white font-medium text-sm"
          style={{ backgroundColor: colors.stock }}
        >
          Stock: {dish.quantity}
        </div>

      </div>
      
      {dish.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {dish.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-medium transition-colors"
        >
          ✏️ Modifier
        </button>
        
        {!isOutOfStock ? (
          <button
            onClick={onConsume}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            ➖ Consommer
          </button>
        ) : (
          <button
            onClick={onRestock}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            ♻️ Refaire
          </button>
        )}
      </div>
    </div>
  );
}

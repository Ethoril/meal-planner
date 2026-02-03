// src/features/dishes/DishForm.tsx

import { useState } from 'react';
import { Dish, DishColorBase, DISH_COLORS } from '../../types/schema';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface DishFormProps {
  dish?: Dish;
  onSave: (dish: Dish) => void;
  onCancel: () => void;
}

export function DishForm({ dish, onSave, onCancel }: DishFormProps) {
  const [name, setName] = useState(dish?.name || '');
  const [quantity, setQuantity] = useState(dish?.quantity || 1);
  const [color, setColor] = useState<DishColorBase>(dish?.color || 'orange');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDish: Dish = {
      id: dish?.id || crypto.randomUUID(),
      name: name.trim(),
      quantity,
      tags: [],
      color,
    };
    
    onSave(newDish);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nom du plat"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ex: Lasagnes"
        required
      />
      
      <Input
        label="Nombre de parts"
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        required
      />
      
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Couleur
        </label>
        <div className="grid grid-cols-6 gap-2">
          {(Object.keys(DISH_COLORS) as DishColorBase[]).map((colorKey) => (
            <button
              key={colorKey}
              type="button"
              onClick={() => setColor(colorKey)}
              className={`h-10 rounded-lg transition-all ${
                color === colorKey ? 'ring-4 ring-blue-500 scale-110' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: DISH_COLORS[colorKey].normal.bg }}
            />
          ))}
        </div>
      </div>
      
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
        <Button type="submit" className="flex-1">
          {dish ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}

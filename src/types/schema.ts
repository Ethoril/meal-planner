// src/types/schema.ts

export type DishId = string;
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Dish {
  id: DishId;
  name: string;
  quantity: number;
  tags: string[];
  color?: DishColorBase;
}

export type SlotType = 'meal';

export interface MealSlot {
  id: string;
  date: string; // Format: 'YYYY-MM-DD'
  meal: MealType;
  dishId: string;
  type: 'meal' | 'leftover';
  dishName: string;  // ← Enlever le "?"
  dishColor: DishColorBase;  // ← Enlever le "?"
}



export type DishColorBase = 'orange' | 'green' | 'yellow' | 'teal' | 'blue' | 'purple';

export const DISH_COLORS: Record<DishColorBase, { 
  normal: { bg: string; stock: string }; 
  grayed: { bg: string; stock: string }; 
}> = {
  orange: {
    normal: { bg: '#CD410C', stock: '#611F11' },
    grayed: { bg: '#CC8164', stock: '#5F423C' }
  },
  green: {
    normal: { bg: '#289C6D', stock: '#13593D' },
    grayed: { bg: '#71BF9F', stock: '#446156' }
  },
  yellow: {
    normal: { bg: '#DC9C06', stock: '#634A10' },
    grayed: { bg: '#B69A59', stock: '#5C523A' }
  },
  teal: {
    normal: { bg: '#17BA9D', stock: '#0B6958' },
    grayed: { bg: '#60B5A6', stock: '#3A5E57' }
  },
  blue: {
    normal: { bg: '#2175D3', stock: '#13365D' },
    grayed: { bg: '#5A7FA9', stock: '#3A4A5B' }
  },
  purple: {
    normal: { bg: '#9B289C', stock: '#631464' },
    grayed: { bg: '#AB5EAC', stock: '#5D3D5D' }
  },
};

export function getDishColors(dish: Dish) {
  let colorBase: DishColorBase = dish.color as DishColorBase || 'orange';
  
  if (!DISH_COLORS[colorBase]) {
    const oldColorMapping: Record<string, DishColorBase> = {
      '#fbbf24': 'yellow',
      '#34d399': 'green',
      '#60a5fa': 'blue',
      '#f472b6': 'purple',
      '#fb923c': 'orange',
      '#10b981': 'teal',
    };
    
    colorBase = oldColorMapping[dish.color as string] || 'orange';
    console.warn(`Migration couleur pour "${dish.name}": ${dish.color} → ${colorBase}`);
  }
  
  const palette = DISH_COLORS[colorBase];
  
  return dish.quantity === 0 ? palette.grayed : palette.normal;
}

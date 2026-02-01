// src/store/useStore.ts

import { create } from 'zustand';
import { Dish, MealSlot } from '../types/schema';

interface StoreState {
  dishes: Dish[];
  slots: MealSlot[];
  setDishes: (dishes: Dish[]) => void;
  setSlots: (slots: MealSlot[]) => void;
  addDish: (dish: Dish) => void;
  updateDish: (id: string, updates: Partial<Dish>) => void;
  deleteDish: (id: string) => void;
  restockDish: (id: string) => void;
  addSlot: (slot: Omit<MealSlot, 'id'>) => void;
  removeSlot: (id: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  dishes: [],
  slots: [],
  
  setDishes: (dishes) => set({ dishes }),
  setSlots: (slots) => set({ slots }),
  
  addDish: (dish) => set((state) => ({ 
    dishes: [...state.dishes, dish] 
  })),
  
  updateDish: (id, updates) => set((state) => ({
    dishes: state.dishes.map(d => d.id === id ? { ...d, ...updates } : d)
  })),
  
deleteDish: (id) => set((state) => ({
  dishes: state.dishes.filter(d => d.id !== id)
  // On ne touche PAS aux slots !
})),

  
  restockDish: (id) => set((state) => ({
    dishes: state.dishes.map(d => 
      d.id === id ? { ...d, quantity: d.defaultYield } : d
    )
  })),
  
  addSlot: (newSlot) => set((state) => {
    const dish = state.dishes.find(d => d.id === newSlot.dishId);
    if (!dish || dish.quantity <= 0) return state;

    // Vérifier s'il y a déjà un plat à ce créneau
    const existingSlot = state.slots.find(
      s => s.date === newSlot.date && s.meal === newSlot.meal
    );

    let nextDishes = [...state.dishes];
    let nextSlots = [...state.slots];

    // Si un plat existe déjà, le remettre en stock
    if (existingSlot) {
      nextDishes = nextDishes.map(d =>
        d.id === existingSlot.dishId ? { ...d, quantity: d.quantity + 1 } : d
      );
      nextSlots = nextSlots.filter(s => s.id !== existingSlot.id);
    }

    // Retirer 1 du stock du nouveau plat
    nextDishes = nextDishes.map(d =>
      d.id === newSlot.dishId ? { ...d, quantity: d.quantity - 1 } : d
    );

    // Ajouter le nouveau slot
    nextSlots = [...nextSlots, { ...newSlot, id: crypto.randomUUID() }];

    return { dishes: nextDishes, slots: nextSlots };
  }),
  
removeSlot: (id) => set((state) => {
  const slotToRemove = state.slots.find(s => s.id === id);
  if (!slotToRemove) return state;

  const existingDish = state.dishes.find(d => d.id === slotToRemove.dishId);

  if (existingDish) {
    // Le plat existe encore, on remet juste la part en stock
    return {
      slots: state.slots.filter(s => s.id !== id),
      dishes: state.dishes.map(d =>
        d.id === slotToRemove.dishId ? { ...d, quantity: d.quantity + 1 } : d
      )
    };
  } else {
    // Le plat n'existe plus, on le recrée avec 1 part
    const recreatedDish = {
      id: slotToRemove.dishId,
      name: slotToRemove.dishName,
      color: slotToRemove.dishColor,
      quantity: 1,
      defaultYield: 1,
      tags: []
    };
    
    return {
      slots: state.slots.filter(s => s.id !== id),
      dishes: [...state.dishes, recreatedDish]
    };
  }
}),

}));

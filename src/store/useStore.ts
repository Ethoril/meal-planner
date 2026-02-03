// src/store/useStore.ts

import { create } from 'zustand';
import { Dish, MealSlot } from '../types/schema';
import { saveDish, removeDish as firebaseRemoveDish, saveSlot, removeSlot as firebaseRemoveSlot } from '../utils/firebase-helpers';

interface StoreState {
  dishes: Dish[];
  slots: MealSlot[];
  userId: string | null;
  setUserId: (userId: string | null) => void;
  setDishes: (dishes: Dish[]) => void;
  setSlots: (slots: MealSlot[]) => void;
  addDish: (dish: Dish) => void;
  updateDish: (id: string, updates: Partial<Dish>) => void;
  deleteDish: (id: string) => void;
  addSlot: (slot: Omit<MealSlot, 'id'>) => void;
  removeSlot: (id: string) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  dishes: [],
  slots: [],
  userId: null,
  
  setUserId: (userId) => set({ userId }),
  setDishes: (dishes) => set({ dishes }),
  setSlots: (slots) => set({ slots }),
  
  addDish: (dish) => {
    set((state) => ({ dishes: [...state.dishes, dish] }));
    const { userId } = get();
    if (userId) saveDish(userId, dish);
  },
  
updateDish: (id, updates) => {
  const { userId, dishes } = get();
  const currentDish = dishes.find(d => d.id === id);
  
  if (!currentDish) return;
  
  // Construire le plat mis à jour AVANT de faire le set
  const updatedDish = { ...currentDish, ...updates };
  
  // Mettre à jour le state
  set((state) => ({
    dishes: state.dishes.map(d => d.id === id ? updatedDish : d)
  }));
  
  // Sauvegarder dans Firebase avec le plat complet
  if (userId) saveDish(userId, updatedDish);
},

  
  deleteDish: (id) => {
    set((state) => ({
      dishes: state.dishes.filter(d => d.id !== id)
    }));
    const { userId } = get();
    if (userId) firebaseRemoveDish(userId, id);
  },
  
  
  addSlot: (newSlot) => {
    const state = get();
    const dish = state.dishes.find(d => d.id === newSlot.dishId);
    if (!dish || dish.quantity <= 0) return;

    const existingSlot = state.slots.find(
      s => s.date === newSlot.date && s.meal === newSlot.meal
    );

    let nextDishes = [...state.dishes];
    let nextSlots = [...state.slots];

    if (existingSlot) {
      nextDishes = nextDishes.map(d =>
        d.id === existingSlot.dishId ? { ...d, quantity: d.quantity + 1 } : d
      );
      nextSlots = nextSlots.filter(s => s.id !== existingSlot.id);
      
      // Sync Firebase
      if (state.userId) {
        const restoredDish = nextDishes.find(d => d.id === existingSlot.dishId);
        if (restoredDish) saveDish(state.userId, restoredDish);
        firebaseRemoveSlot(state.userId, existingSlot.id);
      }
    }

    nextDishes = nextDishes.map(d =>
      d.id === newSlot.dishId ? { ...d, quantity: d.quantity - 1 } : d
    );

    const slotWithId = { ...newSlot, id: crypto.randomUUID() };
    nextSlots = [...nextSlots, slotWithId];

    set({ dishes: nextDishes, slots: nextSlots });
    
    // Sync Firebase
    if (state.userId) {
      const updatedDish = nextDishes.find(d => d.id === newSlot.dishId);
      if (updatedDish) saveDish(state.userId, updatedDish);
      saveSlot(state.userId, slotWithId);
    }
  },
  
  removeSlot: (id) => {
    const state = get();
    const slotToRemove = state.slots.find(s => s.id === id);
    if (!slotToRemove) return;

    const existingDish = state.dishes.find(d => d.id === slotToRemove.dishId);

    if (existingDish) {
      const updatedDish = { ...existingDish, quantity: existingDish.quantity + 1 };
      set({
        slots: state.slots.filter(s => s.id !== id),
        dishes: state.dishes.map(d =>
          d.id === slotToRemove.dishId ? updatedDish : d
        )
      });
      
      // Sync Firebase
      if (state.userId) {
        saveDish(state.userId, updatedDish);
        firebaseRemoveSlot(state.userId, id);
      }
    } else {
      const recreatedDish = {
        id: slotToRemove.dishId,
        name: slotToRemove.dishName,
        color: slotToRemove.dishColor,
        quantity: 1,
        defaultYield: 1,
        tags: []
      };
      
      set({
        slots: state.slots.filter(s => s.id !== id),
        dishes: [...state.dishes, recreatedDish]
      });
      
      // Sync Firebase
      if (state.userId) {
        saveDish(state.userId, recreatedDish);
        firebaseRemoveSlot(state.userId, id);
      }
    }
  },
}));

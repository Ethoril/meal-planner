// src/utils/firebase-helpers.ts

import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Dish, MealSlot } from '../types/schema';

export function syncDishes(userId: string, callback: (dishes: Dish[]) => void) {
  const dishesRef = collection(db, 'users', userId, 'dishes');
  
  return onSnapshot(dishesRef, (snapshot) => {
    const dishes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Dish[];
    callback(dishes);
  });
}

export function syncSlots(userId: string, callback: (slots: MealSlot[]) => void) {
  const slotsRef = collection(db, 'users', userId, 'slots');
  
  return onSnapshot(slotsRef, (snapshot) => {
    const slots = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MealSlot[];
    callback(slots);
  });
}

export async function saveDish(userId: string, dish: Dish) {
  const dishRef = doc(db, 'users', userId, 'dishes', dish.id);
  await setDoc(dishRef, dish);
}

export async function removeDish(userId: string, dishId: string) {
  const dishRef = doc(db, 'users', userId, 'dishes', dishId);
  await deleteDoc(dishRef);
}

export async function saveSlot(userId: string, slot: MealSlot) {
  const slotRef = doc(db, 'users', userId, 'slots', slot.id);
  await setDoc(slotRef, slot);
}

export async function removeSlot(userId: string, slotId: string) {
  const slotRef = doc(db, 'users', userId, 'slots', slotId);
  await deleteDoc(slotRef);
}

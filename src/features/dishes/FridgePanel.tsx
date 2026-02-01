// src/features/dishes/FridgePanel.tsx

import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../auth/AuthProvider';
import { Dish, getDishColors } from '../../types/schema';
import { saveDish, removeDish } from '../../utils/firebase-helpers';
import { DishForm } from './DishForm';
import { Modal } from '../../components/ui/Modal';

export function FridgePanel() {
  const { user } = useAuth();
  const { dishes, deleteDish, restockDish, updateDish } = useStore();
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const handleDelete = async (dishId: string) => {
    if (!user || !confirm('Supprimer ce plat ?')) return;
    deleteDish(dishId);
    await removeDish(user.uid, dishId);
  };

  const handleRestock = async (dishId: string) => {
    if (!user) return;
    restockDish(dishId);
    const dish = dishes.find(d => d.id === dishId);
    if (dish) {
      await saveDish(user.uid, { ...dish, quantity: dish.defaultYield });
    }
  };

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish);
  };

  const handleSaveEdit = async (updatedDish: Dish) => {
    if (!user) return;
    
    updateDish(updatedDish.id, updatedDish);
    await saveDish(user.uid, updatedDish);
    setEditingDish(null);
  };

  return (
    <>
      <div className="w-96 bg-[#E8DCC8] p-0 overflow-y-auto h-screen sticky top-0">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Mon Frigo</h2>
            <div className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              {dishes.length}
            </div>
          </div>
          
          <div className="space-y-3">
            {dishes.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                <p className="text-xl font-bold text-gray-800 mb-2">
                  OH MON DIEU tu n'as rien à manger 😱
                </p>
                <p className="text-[#CD5C08] font-bold text-lg">
                  Viiiiiiiite !
                </p>
              </div>
            ) : (
              dishes.map((dish) => {
                const colors = getDishColors(dish);

                return (
                  <div
                    key={dish.id}
                    className="rounded-xl overflow-hidden shadow-lg cursor-move hover:shadow-xl transition-shadow h-32 flex flex-col"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('dishId', dish.id);
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                  >
                    {/* Partie haute - Nom du plat (50%) */}
                    <div 
                      className="flex-1 px-4 flex items-center justify-center"
                      style={{ backgroundColor: colors.bg }}
                    >
                      <h3 className="text-white font-bold text-center text-lg">
                        {dish.name}
                      </h3>
                    </div>

                    {/* Partie basse - Stock et icônes (50%) */}
                    <div 
                      className="flex-1 px-4 flex items-center justify-between"
                      style={{ backgroundColor: colors.stock }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-white/80 text-sm">Stock :</span>
                        <div className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                          {dish.quantity}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(dish)}
                          className="text-white/80 hover:text-white transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleDelete(dish.id)}
                          className="text-white/80 hover:text-white transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={editingDish !== null}
        onClose={() => setEditingDish(null)}
        title="Modifier le plat"
      >
        {editingDish && (
          <DishForm
            dish={editingDish}
            onSave={handleSaveEdit}
            onCancel={() => setEditingDish(null)}
          />
        )}
      </Modal>
    </>
  );
}

// src/components/ui/BottomDrawer.tsx
import { ReactNode } from 'react';

interface BottomDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function BottomDrawer({ isOpen, onToggle, children }: BottomDrawerProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
        />
      )}
      
      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'
        }`}
        style={{ maxHeight: '80vh' }}
      >
        {/* Handle */}
        <button
          onClick={onToggle}
          className="w-full py-4 flex flex-col items-center gap-2"
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          <div className="text-sm font-semibold text-gray-700">
            {isOpen ? 'Fermer le frigo' : 'Ouvrir le frigo'} 🧊
          </div>
        </button>
        
        {/* Content */}
        <div className="overflow-y-auto px-4 pb-4" style={{ maxHeight: 'calc(80vh - 60px)' }}>
          {children}
        </div>
      </div>
    </>
  );
}

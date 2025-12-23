import React from 'react';

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161616] rounded p-6 max-w-sm w-full border border-[#333]">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-[#bbbbbb] mb-6">{message}</p>
        <div className="space-y-2">
          <button onClick={onConfirm} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold">Delete</button>
          <button onClick={onCancel} className="w-full bg-[#1a1a1a] hover:bg-[#252525] text-[#aaa] py-3 rounded font-medium">Cancel</button>
        </div>
      </div>
    </div>
  );
}

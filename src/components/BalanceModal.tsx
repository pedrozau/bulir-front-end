// src/components/BalanceModal.tsx
import React, { useState } from 'react';
import api from '../api';

interface BalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (balance: number) => void;
}

const BalanceModal: React.FC<BalanceModalProps> = ({ isOpen, onClose, onSave }) => {
  const [balance, setBalance] = useState<number>(0);
  const [userId, setUserId] = useState('');

  React.useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) {
      setUserId(id);
    }
  }, []);

  const handleSave = async () => {
    const response = await api.post('api/user/updateBalance',{
          balance, userId
    });

    console.log(response.data)

    onSave(balance);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Update Balance</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="balance">New Balance</label>
          <input
            type="number"
            id="balance"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            className="w-full border-gray-300 border rounded-lg p-2"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalanceModal;

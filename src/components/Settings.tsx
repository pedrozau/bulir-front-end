// src/pages/SettingsPage.tsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import BalanceModal from '../components/BalanceModal';
import { Alert } from '../components/Alert';

const Settings: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>({ fullname: '', email: '' });
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success'); // Tipo do alerta

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get(`api/user/getById/${userId}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        setAlertMessage('Failed to fetch user info.');
        setAlertType('error');
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      setAlertMessage('Passwords do not match.');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    try {
      const updatedData = { ...userInfo };
      if (password) updatedData.password = password;

      await api.put(`api/user/update/${userId}`, updatedData);
      setAlertMessage('Information updated successfully.');
      setAlertType('success');
      setShowAlert(true);
    } catch (error) {
      console.error('Failed to update user info:', error);
      setAlertMessage('Failed to update user info.');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveBalance = async (balance: number) => {
    try {
      // Implement the logic to update the balance
      console.log('Balance to be updated:', balance);
      // Call the API to update balance here
      // Simulate successful balance update
      setAlertMessage('Balance updated successfully.');
      setAlertType('success');
      setShowAlert(true);
    } catch (error) {
      console.error('Failed to update balance:', error);
      setAlertMessage('Failed to update balance.');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Alerta */}
      {showAlert && alertMessage && (
        <Alert 
          message={alertMessage} 
          type={alertType}
          onClose={() => setShowAlert(false)} 
        />
      )}

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              value={userInfo.fullname}
              onChange={(e) => setUserInfo({ ...userInfo, fullname: e.target.value })}
              className="w-full border-gray-300 border rounded-lg p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              className="w-full border-gray-300 border rounded-lg p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-gray-300 border rounded-lg p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-gray-300 border rounded-lg p-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Information
          </button>
        </form>
        <button
          onClick={handleOpenModal}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Update Balance
        </button>
      </div>
      <BalanceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveBalance}
      />
    </div>
  );
};

export default Settings;

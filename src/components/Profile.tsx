// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Alert } from '../components/Alert';

const Profile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [providerId, setProviderId] = useState('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success'); // Tipo do alerta
  const { userRole } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserData = async () => {
      const getBalance = localStorage.getItem('balance');
      if (getBalance) {
        setBalance(parseFloat(getBalance));
      }
      try {
        const userId = localStorage.getItem('userId');
        const userResponse = await api.get(`api/user/getById/${userId}`);
        setUserInfo(userResponse.data);

        const transactionsResponse = await api.get(`api/transaction/history/${userId}`);
        setTransactions(transactionsResponse.data);
      } catch (error) {
        console.error('Failed to fetch user data or transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userId) {
        setProviderId(userId);

        await api.post('api/service/create', { title, description, price, providerId });
        setAlertMessage('Service created successfully!');
        setAlertType('success');
        setShowAlert(true);
        // Reset form and hide modal after submission
        setIsModalOpen(false);
        // Optionally, refetch services or show a success message
      } else {
        console.error('User ID not found');
        setAlertMessage('User ID not found.');
        setAlertType('error');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Failed to create service:', error);
      setAlertMessage('Failed to create service.');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

      {/* Informações do Usuário */}
      {userInfo && (
        <div className="mb-8 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
          <p><strong>Name:</strong> {userInfo.fullname}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>NIF:</strong> {userInfo.nif}</p>
          <p><strong>Balance:</strong>${balance}</p>
          {userRole === 'prestador' && (
            <>
              <p><strong>Provider ID:</strong> {userInfo.id}</p>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Create New Service
              </button>
            </>
          )}
        </div>
      )}

      {/* Modal para Criar Novo Serviço */}
      {isModalOpen && userRole === 'prestador' && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Create New Service</h2>
            <form onSubmit={handleCreateService}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border-gray-300 border rounded-lg p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border-gray-300 border rounded-lg p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full border-gray-300 border rounded-lg p-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Create Service
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Histórico de Transações */}
      {transactions.length > 0 ? (
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
          <div className="max-h-[calc(100vh-15rem)] overflow-y-auto">
            <ul>
              {transactions.map((transaction) => (
                <li key={transaction.id} className="mb-4 p-4 border rounded-lg shadow-sm">
                  <p><strong>Service:</strong> {transaction.service.title}</p>
                  {/* <p><strong>Provider:</strong> {transaction.providerName}</p> */}
                  <p><strong>Amount:</strong> ${transaction.amount}</p>
                  <p><strong>Date:</strong> {new Date(transaction.data).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">No transactions found.</p>
      )}
    </div>
  );
};

export default Profile;

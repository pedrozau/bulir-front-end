// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Profile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { userRole } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        
        const userId = localStorage.getItem('userId')

        const userResponse = await api.get(`api/user/getById/${userId}`);
        setUserInfo(userResponse.data);

        const transactionsResponse = await api.get(`api/transaction/history/${userId}`);
        setTransactions(transactionsResponse.data);
      } catch (error) {
        console.error('Failed to fetch user data or transactions:', error);
      } finally {
          
        setLoading(false)

      }
    };

    fetchUserData();
  }, []);

   
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    );
  }



  return (
    <div className="p-4">
      {/* Informações do Usuário */}
      {userInfo && (
        <div className="mb-8 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
          <p><strong>Name:</strong> {userInfo.fullname}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>NIF:</strong> {userInfo.nif}</p>
          {userRole === 'provider' && (
            <p><strong>Provider ID:</strong> {userInfo.providerId}</p>
          )}
        </div>
      )}

      {/* Histórico de Transações */}
      {transactions.length > 0 ? (
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction.id} className="mb-4 p-4 border rounded-lg shadow-sm">
                <p><strong>Service:</strong> {transaction.serviceTitle}</p>
                <p><strong>Provider:</strong> {transaction.providerName}</p>
                <p><strong>Amount:</strong> ${transaction.amount}</p>
                <p><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center text-gray-600">No transactions found.</p>
      )}
    </div>
  );
};

export default Profile;

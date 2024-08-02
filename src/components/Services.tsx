// src/pages/ServicesPage.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Alert } from '../components/Alert';
import { useSearch } from '../context/SearchContext';

interface Service {
    id: string;
    createAt: string;
    title: string;
    description: string;
    price: number;
    providerId: string;
}

const Services: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const { userRole } = useAuth();
    const { searchTerm } = useSearch();
    const userId = localStorage.getItem('userId');


    const handleShowAlert = (message: string, type: 'success' | 'error') => {
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    useEffect(() => {
        const fetchServices = async () => {
          try {
            const response = await api.get(`api/service/search/${searchTerm}`);
            console.log(response.data)
            setServices(response.data);
          } catch (error) {
            console.error('Failed to fetch services:', error);
          }
        };
    
        fetchServices();
      }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('api/service/getAll');
                setServices(response.data);
            } catch (error) {
                console.error('Failed to fetch services:', error);
                setError('Failed to fetch services.');
                handleShowAlert('Failed to fetch services.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const checkUserBalance = async (servicePrice: number) => {
        try {
            const response = await api.get('api/service/checkBalance', {
                params: { userId }
            });
            

            console.log(response.data.balance <= servicePrice)
            console.log(response.data)
            return response.data.balance >= servicePrice; 

        } catch (error) {
            console.error('Failed to check balance:', error);
            handleShowAlert('Failed to check balance.', 'error');
            return false;
        }
    };

    const handleHireService = async (serviceId: string, servicePrice: number) => {
        
        console.log(serviceId)
        console.log(servicePrice)

        const hasSufficientBalance = await checkUserBalance(servicePrice);

        if (!hasSufficientBalance) {
            handleShowAlert('Insufficient balance', 'error');
            return;
        }

        try {
            await api.post('api/service/hire', {
                userId,
                serviceId,
            });
            setSuccessMessage('Service hired successfully!');
            handleShowAlert('Service hired successfully!', 'success');
        } catch (error) {
            console.error('Failed to hire service:', error);
            handleShowAlert('Failed to hire service.', 'error');
        }
    };

    const handleEditService = (service: Service) => {
        setServiceToEdit(service);
        setEditModalOpen(true);
    };

    const handleDeleteService = async (serviceId: string) => {
        try {
            await api.delete(`api/service/delete/${serviceId}`);
            setServices(services.filter(service => service.id !== serviceId));
            setSuccessMessage('Service deleted successfully!');
            handleShowAlert('Service deleted successfully!', 'success');
        } catch (error) {
            console.error('Failed to delete service:', error);
            handleShowAlert('Failed to delete service.', 'error');
        }
    };

    const handleUpdateService = async () => {
        if (!serviceToEdit) return;

        try {
            await api.put(`api/service/update/${serviceToEdit.id}`, serviceToEdit);
            setServices(services.map(service => service.id === serviceToEdit.id ? serviceToEdit : service));
            setSuccessMessage('Service updated successfully!');
            handleShowAlert('Service updated successfully!', 'success');
        } catch (error) {
            console.error('Failed to update service:', error);
            handleShowAlert('Failed to update service.', 'error');
        } finally {
            setEditModalOpen(false);
            setServiceToEdit(null);
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
            {error && <p className="text-red-600">{error}</p>}
            {successMessage && <p className="text-green-600">{successMessage}</p>}

            {showAlert && alertMessage && (
                <Alert 
                    message={alertMessage} 
                    type={alertType}
                    onClose={() => setShowAlert(false)} 
                />
            )}

            {userRole === 'cliente' ? (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Available Services</h2>
                    <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
                        <ul>
                            {services.map((service) => (
                                <li key={service.id} className="mb-4 p-4 border rounded-lg shadow-sm">
                                    <h3 className="text-xl font-semibold">{service.title}</h3>
                                    <p>{service.description}</p>
                                    <p className="text-gray-600">Price: ${service.price}</p>
                                    <button
                                        onClick={() => handleHireService(service.id, service.price)}
                                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                        Hire Service
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : userRole === 'prestador' ? (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Your Services</h2>
                    <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
                        <ul>
                            {services.filter(service => service.providerId === userId).map((service) => (
                                <li key={service.id} className="mb-4 p-4 border rounded-lg shadow-sm">
                                    <h3 className="text-xl font-semibold">{service.title}</h3>
                                    <p>{service.description}</p>
                                    <p className="text-gray-600">Price: ${service.price}</p>
                                    <button
                                        onClick={() => handleEditService(service)}
                                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                        Edit Service
                                    </button>
                                    <button
                                        onClick={() => handleDeleteService(service.id)}
                                        className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                        Delete Service
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-600">You are not authorized to view this content.</p>
            )}

            {/* Edit Service Modal */}
            {editModalOpen && serviceToEdit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-2xl font-bold mb-4">Edit Service</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdateService(); }}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-gray-700">Title:</label>
                                <input
                                    id="title"
                                    type="text"
                                    value={serviceToEdit.title}
                                    onChange={(e) => setServiceToEdit({ ...serviceToEdit, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    placeholder="Enter service title"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-gray-700">Description:</label>
                                <textarea
                                    id="description"
                                    value={serviceToEdit.description}
                                    onChange={(e) => setServiceToEdit({ ...serviceToEdit, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    placeholder="Enter service description"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-gray-700">Price:</label>
                                <input
                                    id="price"
                                    type="number"
                                    value={serviceToEdit.price}
                                    onChange={(e) => setServiceToEdit({ ...serviceToEdit, price: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    placeholder="Enter service price"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;

// src/pages/ServicesPage.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

interface Service {
    id: string;
    createAt:string;
    title: string;
    description: string;
    price: number;
    providerId:string
  }
  

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<Boolean>(true)
  const { userRole } = useAuth();


  const providerId = localStorage.getItem('providerId')
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('api/service/getAll');
        
        const service_data: Service[] = response.data 
        setServices(service_data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {

         setLoading(false)
      }
    };

    fetchServices();
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
      {userRole === 'cliente' ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Services</h2>
          <ul>
            {services.map((service) => (

              <li key={service.id} className="mb-4 p-4 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p>{service.description}</p>
                <p className="text-gray-600">Price: ${service.price}</p>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Hire Service
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : userRole === 'prestador' ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Services</h2>
          <ul>
            {services.filter(service => service.providerId === userId).map((service) => (
              <li key={service.id} className="mb-4 p-4 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p>{service.description}</p>
                <p className="text-gray-600">Price: ${service.price}</p>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Edit Service
                </button>
                <button className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Delete Service
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center text-gray-600">You are not authorized to view this content.</p>
      )}
    </div>
  );
};

export default Services;

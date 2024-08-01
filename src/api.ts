import axios from 'axios';
// import { useAuth } from './context/AuthContext';

// Crie uma instância do axios
const api = axios.create({
  baseURL: 'https://bulir-api.onrender.com/', // Substitua pela URL da sua API
});

// Adicione um interceptor para incluir o token em cada solicitação
api.interceptors.request.use(
  (config) => {
    // Acessar o token do localStorage
    const token = localStorage.getItem('token');
    
    // Se o token estiver presente, adicione-o ao cabeçalho da solicitação
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Exporta a instância do axios configurada
export default api;

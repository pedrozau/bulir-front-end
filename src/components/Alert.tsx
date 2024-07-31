// components/Alert.tsx
import { useEffect, useState } from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'error'; // Adicionando tipo para determinar o estilo do alerta
  onClose: () => void;
}

export function Alert({ message, type, onClose }: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Chama onClose após a animação de desaparecimento
      setTimeout(() => onClose(), 500);
    }, 3000); // Tempo para exibir o alerta

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  // Define as classes baseadas no tipo do alerta
  const alertClasses = type === 'success' 
    ? 'bg-green-500 text-white'
    : 'bg-red-500 text-white';

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg w-80 ${alertClasses} fade-in`} role="alert">
      <div className="flex items-center">
        <svg 
          className={`w-6 h-6 mr-2 ${type === 'success' ? 'text-green-200' : 'text-red-200'}`} 
          fill="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d={type === 'success' 
              ? "M12 2a10 10 0 11-10 10A10 10 0 0112 2zm-1 14h2v-2h-2v2zm0-4h2V7h-2v5z"
              : "M12 2a10 10 0 11-10 10A10 10 0 0112 2zm-1 14h2v-2h-2v2zm0-4h2V7h-2v5z" // Adicione o path do ícone de erro aqui
            }
          />
        </svg>
        <span className="text-lg">{message}</span>
      </div>
    </div>
  );
}

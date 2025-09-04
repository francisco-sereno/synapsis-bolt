import React from 'react';
import { Bot } from 'lucide-react';

interface FloatingAIButtonProps {
  onClick: () => void;
}

const FloatingAIButton: React.FC<FloatingAIButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center z-40 hover:scale-105"
      title="Abrir Asistente IA"
    >
      <Bot className="w-6 h-6" />
    </button>
  );
};

export default FloatingAIButton;
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

const AIAssistant = () => {
  const { t } = useTranslation();
  
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: t('welcome'), 
      sender: "ai" 
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

    // Ajouter le message de l'utilisateur
    const userMessage = { 
      id: messages.length +.1, 
      text: inputText, 
      sender: "user" 
    };
    
    setMessages([...messages, userMessage]);
    setInputText('');

    // Simuler une réponse de l'IA après un court délai
    setTimeout(() => {
      const aiResponse = { 
        id: messages.length + 2, 
        text: t('processing'), 
        sender: "ai" 
      };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    }, 1000);
  };

  return (
    <div>
      <PageHeader 
        title={t('aiAssistant.title')} 
        subtitle={t('aiAssistant.subtitle')}
        icon={Bot}
      />
      
      <div className="bg-white shadow rounded-lg p-6 flex flex-col h-[calc(100vh-12rem)]">
        <div className="flex-grow overflow-y-auto mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`mb-4 ${
                message.sender === 'user' 
                  ? 'text-right' 
                  : 'text-left'
              }`}
            >
              <div 
                className={`inline-block p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('inputPlaceholder')}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {t('sendButton')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant; 
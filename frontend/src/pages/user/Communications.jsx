import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

const Communications = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('messages');

  // Messages simulées
  const messages = [
    { id: 1, sender: 'Jean Dupont', date: '15/06/2023', content: 'Bonjour, je souhaiterais obtenir plus d\'informations sur le logement.', read: true },
    { id: 2, sender: 'Marie Leroy', date: '14/06/2023', content: 'Pouvez-vous me confirmer la date de disponibilité du logement?', read: false },
    { id: 3, sender: 'Thomas Martin', date: '13/06/2023', content: 'Merci pour votre retour rapide concernant ma demande.', read: true },
  ];

  // Notifications simulées
  const notifications = [
    { id: 1, title: 'Nouveau paiement reçu', date: '15/06/2023', content: 'Un paiement de loyer a été reçu pour la propriété Appartement Paris.', type: 'info' },
    { id: 2, title: 'Retard de paiement', date: '14/06/2023', content: 'Le paiement pour la propriété Villa Cannes est en retard.', type: 'warning' },
    { id: 3, title: 'Demande approuvée', date: '12/06/2023', content: 'La demande de réparation pour la propriété Studio Lyon a été approuvée.', type: 'success' },
  ];

  return (
    <div>
      <PageHeader 
        title={t('communications.title')} 
        subtitle={t('communications.subtitle')}
        icon={MessageSquare}
      />
      
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('messages')}
              className={`${
                activeTab === 'messages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              {t('messages')} ({messages.length})
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              {t('notifications')} ({notifications.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'messages' ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-4 border rounded-lg ${!message.read ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-200'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{message.sender}</h3>
                    <span className="text-sm text-gray-500">{message.date}</span>
                  </div>
                  <p className="text-gray-700">{message.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border rounded-lg ${
                    notification.type === 'warning' 
                      ? 'bg-yellow-50 border-yellow-100' 
                      : notification.type === 'success'
                        ? 'bg-green-50 border-green-100'
                        : 'bg-blue-50 border-blue-100'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{notification.title}</h3>
                    <span className="text-sm text-gray-500">{notification.date}</span>
                  </div>
                  <p className="text-gray-700">{notification.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Communications; 
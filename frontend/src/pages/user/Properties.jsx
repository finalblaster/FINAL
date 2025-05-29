import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building, Plus, MessageSquare, ThumbsUp, Clock, Users } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatisticsGrid from '../../components/shared/StatisticsGrid';
import PropertyFilter from '../../components/shared/PropertyFilter';

const Properties = () => {
  const { t } = useTranslation();
  
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [timeFilter, setTimeFilter] = useState('7j');
  const timeFilters = ['24h', '7j', '30j', '90j', '1an', 'Tout'];
  
  const stats = [
    {
      title: 'Questions traitées',
      value: '1 248',
      description: '+12% ce mois',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      title: 'Temps de réponse moyen',
      value: '1.2s',
      description: '-0.3s vs dernier mois',
      icon: Clock,
      color: 'indigo'
    },
    {
      title: 'Taux de satisfaction',
      value: '98%',
      description: '+2% ce mois',
      icon: ThumbsUp,
      color: 'emerald'
    },
    {
      title: 'Utilisateurs actifs',
      value: '156',
      description: '+8 cette semaine',
      icon: Users,
      color: 'purple'
    }
  ];

  const [properties] = useState([
    { id: 1, name: 'Villa Moderne', address: '123 Avenue des Roses', price: '550 000 €', status: t('status.forSale') },
    { id: 2, name: 'Appartement Centre-Ville', address: '45 Rue du Commerce', price: '320 000 €', status: t('status.forSale') },
    { id: 3, name: 'Maison Familiale', address: '8 Allée des Chênes', price: '1 200 €/mois', status: t('status.forRent') },
  ]);

  return (
    <div>
      <PageHeader 
        title="properties.title"
        subtitle="properties.subtitle"
        icon={Building}
        action={
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-5 w-5 mr-2" />
            {t('properties.addProperty')}
          </button>
        }
      />
      
      <PropertyFilter
        properties={properties}
        selectedProperty={selectedProperty}
        onPropertyChange={setSelectedProperty}
        timeFilters={timeFilters}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
      />
      
      <StatisticsGrid stats={stats} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="h-40 bg-gray-200 rounded-t-lg flex items-center justify-center">
              <Building className="h-16 w-16 text-gray-400" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{property.address}</p>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <span className="text-sm text-gray-500">{property.price}</span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  property.status === t('status.forSale') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {property.status}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  {t('properties.viewDetails')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Properties; 
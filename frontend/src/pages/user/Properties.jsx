import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building, Plus, MessageSquare, ThumbsUp, Clock, Users } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import PropertyFilter from '../../components/shared/PropertyFilter';
import StatisticsGrid from '../../components/shared/StatisticsGrid';
import PropertyCard from '../../components/properties/PropertyCard';

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

  // Données de test pour les propriétés
  const [properties] = useState([
    {
      id: 1,
      name: 'Villa Moderne',
      type: 'Villa',
      address: '123 Avenue des Roses, 75001 Paris',
      surface_m2: 180,
      floor: 0,
      has_garden: true,
      has_balcony: true,
      is_accessible: true,
      description: 'Magnifique villa moderne avec jardin paysager et piscine. Idéale pour les familles, cette propriété offre un espace de vie généreux et lumineux.',
      wifi_name: 'Villa-Moderne',
      access_code: '1234',
      infoEntries: [
        {
          id: 1,
          category: 'Arrivée',
          content: 'Les clés sont disponibles dans la boîte aux lettres. Code d\'accès au portail : 1234',
          is_active: true,
          visible_to_guest: true
        },
        {
          id: 2,
          category: 'Jardin',
          content: 'Le jardin est accessible 24h/24. L\'arrosage automatique fonctionne tous les matins de 6h à 7h.',
          is_active: true,
          visible_to_guest: true
        }
      ]
    },
    {
      id: 2,
      name: 'Appartement Centre-Ville',
      type: 'T3',
      address: '45 Rue du Commerce, 75015 Paris',
      surface_m2: 75,
      floor: 3,
      has_balcony: true,
      description: 'Bel appartement rénové au cœur du centre-ville. Proche de tous les commerces et transports.',
      wifi_name: 'Appart-Centre',
      access_code: '5678',
      infoEntries: [
        {
          id: 3,
          category: 'Transport',
          content: 'Station de métro à 2 minutes à pied. Ligne 8, station Commerce.',
          is_active: true,
          visible_to_guest: true
        },
        {
          id: 4,
          category: 'Ascenseur',
          content: 'L\'ascenseur est en maintenance jusqu\'au 15/06. Merci de votre compréhension.',
          is_active: true,
          visible_to_guest: true
        }
      ]
    },
    {
      id: 3,
      name: 'Studio Design',
      type: 'Studio',
      address: '8 Rue de la Paix, 75002 Paris',
      surface_m2: 35,
      floor: 5,
      has_balcony: true,
      description: 'Studio moderne et fonctionnel, parfaitement aménagé pour optimiser l\'espace.',
      wifi_name: 'Studio-Design',
      access_code: '9012',
      infoEntries: [
        {
          id: 5,
          category: 'Équipements',
          content: 'Machine à laver dans la salle de bain. Lave-vaisselle intégré dans la cuisine.',
          is_active: true,
          visible_to_guest: true
        },
        {
          id: 6,
          category: 'Chauffage',
          content: 'Chauffage individuel. Thermostat dans le couloir. Température recommandée : 19°C',
          is_active: true,
          visible_to_guest: true
        }
      ]
    }
  ]);

  return (
    <div className="w-full">
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
      
      <div className="w-full">
        <PropertyFilter
          properties={properties}
          selectedProperty={selectedProperty}
          onPropertyChange={setSelectedProperty}
          timeFilters={timeFilters}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
        />
        
        <StatisticsGrid stats={stats} />
        
        <div className="w-full mt-6 space-y-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              infoEntries={property.infoEntries}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Properties; 
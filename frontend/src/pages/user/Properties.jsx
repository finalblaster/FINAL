import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

const Properties = () => {
  const { t } = useTranslation();
  
  const properties = [
    { id: 1, name: 'Villa Moderne', address: '123 Avenue des Roses', price: '550 000 €', status: t('status.forSale') },
    { id: 2, name: 'Appartement Centre-Ville', address: '45 Rue du Commerce', price: '320 000 €', status: t('status.forSale') },
    { id: 3, name: 'Maison Familiale', address: '8 Allée des Chênes', price: '1 200 €/mois', status: t('status.forRent') },
  ];

  return (
    <div>
      <PageHeader 
        title={t('properties.title')} 
        subtitle={t('properties.subtitle')}
        icon={Building}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  {t('viewDetails')}
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
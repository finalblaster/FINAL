import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader 
        title="dashboard.title"
        subtitle="dashboard.subtitle"
        icon={LayoutGrid}
      />
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-medium text-blue-800">{t('statistics')}</h2>
            <p className="text-blue-600 text-xl font-bold">24</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="font-medium text-green-800">{t('activities')}</h2>
            <p className="text-green-600 text-xl font-bold">12</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h2 className="font-medium text-purple-800">{t('messages')}</h2>
            <p className="text-purple-600 text-xl font-bold">6</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
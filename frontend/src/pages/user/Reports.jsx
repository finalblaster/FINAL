import React from 'react';
import { BarChart2, TrendingUp, TrendingDown, Activity, DollarSign, Users } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from 'react-i18next';

const Reports = () => {
  const { t } = useTranslation();
  
  const statistics = [
    { 
      id: 1, 
      title: t('revenue'), 
      value: '€24,500', 
      change: '+15%', 
      trend: 'up',
      icon: DollarSign,
      color: 'blue' 
    },
    { 
      id: 2, 
      title: t('visits'), 
      value: '78', 
      change: '+24%', 
      trend: 'up',
      icon: Users,
      color: 'green' 
    },
    { 
      id: 3, 
      title: t('contracts'), 
      value: '12', 
      change: '+8%', 
      trend: 'up',
      icon: Activity,
      color: 'purple' 
    },
    { 
      id: 4, 
      title: t('expenses'), 
      value: '€8,700', 
      change: '-5%', 
      trend: 'down',
      icon: TrendingDown,
      color: 'red' 
    },
  ];

  return (
    <div>
      <PageHeader 
        title="reports.title" 
        subtitle="reports.subtitle"
        icon={BarChart2}
      />
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-end items-center mb-6">
          <div className="flex space-x-2">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>{t('period.lastWeek')}</option>
              <option>{t('period.lastMonth')}</option>
              <option>{t('period.lastQuarter')}</option>
              <option>{t('period.thisYear')}</option>
            </select>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
              <BarChart2 size={16} />
              {t('export')}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statistics.map((stat) => (
            <div key={stat.id} className="bg-white p-4 border rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`text-${stat.color}-600`} size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.trend === 'up' ? (
                  <TrendingUp className="text-green-500 mr-1" size={16} />
                ) : (
                  <TrendingDown className="text-red-500 mr-1" size={16} />
                )}
                <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} {t('since')}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4">{t('monthlyRevenue')}</h2>
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
              <p className="text-gray-500">{t('monthlyRevenue')}</p>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4">{t('activitiesByType')}</h2>
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
              <p className="text-gray-500">{t('activitiesByType')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 
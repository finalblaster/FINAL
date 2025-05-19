import React from 'react';
import { FileText, Download, Trash2, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../components/PageHeader';

const Documents = () => {
  const { t } = useTranslation();

  const documents = [
    { 
      id: 1, 
      name: 'Contrat de vente.pdf', 
      type: 'PDF', 
      size: '2.4 MB', 
      lastModified: '15/05/2023',
      category: 'contrat' 
    },
    { 
      id: 2, 
      name: 'Diagnostic immobilier.pdf', 
      type: 'PDF', 
      size: '5.1 MB', 
      lastModified: '12/05/2023',
      category: 'diagnostic' 
    },
    { 
      id: 3, 
      name: 'Photos propriété.zip', 
      type: 'ZIP', 
      size: '15.8 MB', 
      lastModified: '10/05/2023',
      category: 'photos' 
    },
    { 
      id: 4, 
      name: 'Plan étage.dwg', 
      type: 'DWG', 
      size: '3.2 MB', 
      lastModified: '08/05/2023',
      category: 'plan' 
    },
    { 
      id: 5, 
      name: 'Factures travaux.xlsx', 
      type: 'XLSX', 
      size: '1.7 MB', 
      lastModified: '05/05/2023',
      category: 'facture' 
    },
  ];

  return (
    <div>
      <PageHeader 
        title={t('documents.title')} 
        subtitle={t('documents.subtitle')}
        icon={FileText}
      />
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <select className="border border-gray-300 rounded-md p-2 text-gray-700">
              <option value="all">{t('allCategories')}</option>
              <option value="contrat">{t('categories.contract')}</option>
              <option value="facture">{t('categories.invoice')}</option>
              <option value="inventaire">{t('categories.inventory')}</option>
              <option value="diagnostic">{t('categories.diagnostic')}</option>
              <option value="photos">{t('categories.photos')}</option>
            </select>
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              className="border border-gray-300 rounded-md p-2 text-gray-700"
            />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            {t('uploadDocument')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h3>
                  <p className="text-xs text-gray-500">{doc.size} • {doc.lastModified}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                      {doc.category}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end mt-4 space-x-2">
                <button className="p-1 text-gray-500 hover:text-blue-600" title={t('actions.view')}>
                  <Eye size={16} />
                </button>
                <button className="p-1 text-gray-500 hover:text-green-600" title={t('actions.download')}>
                  <Download size={16} />
                </button>
                <button className="p-1 text-gray-500 hover:text-red-600" title={t('actions.delete')}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Documents; 
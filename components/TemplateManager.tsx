import React, { useState } from 'react';
import { CustomTemplate, STANDARD_TEMPLATES, BrandSettings, PropertyDetails } from '../types';
import TemplateRenderer from './TemplateRenderer';
import TemplateEditor from './TemplateEditor';
import { Plus, Trash2, Layout } from 'lucide-react';

interface Props {
  customTemplates: CustomTemplate[];
  brandSettings: BrandSettings;
  onCreate: (template: CustomTemplate) => void;
  onDelete: (id: string) => void;
}

const TemplateManager: React.FC<Props> = ({ customTemplates, brandSettings, onCreate, onDelete }) => {
  const [isCreating, setIsCreating] = useState(false);

  // Dummy data for thumbnails
  const dummyData: PropertyDetails = {
    address: '123 Main St',
    price: '$950k',
    beds: 3,
    baths: 2,
    sqft: 2000,
    description: '',
    features: [],
    imageUrl: 'https://picsum.photos/400/500?blur=2'
  };

  if (isCreating) {
      return (
          <TemplateEditor 
            brandSettings={brandSettings}
            onSave={(t) => {
                onCreate(t);
                setIsCreating(false);
            }}
            onCancel={() => setIsCreating(false)}
          />
      );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Templates</h1>
          <p className="text-gray-500 mt-1">Manage standard and custom listing layouts.</p>
        </div>
        <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-brand-600 text-white px-5 py-3 rounded-lg font-semibold shadow-lg hover:bg-brand-700 transition-all hover:-translate-y-0.5"
        >
            <Plus className="w-5 h-5" /> Create Template
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
          {/* Custom Templates Section */}
          <div className="mb-10">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-purple-600" /> Your Custom Templates
              </h2>
              {customTemplates.length === 0 ? (
                  <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
                      <p>No custom templates yet. Create one to standout!</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {customTemplates.map(t => (
                          <div key={t.id} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                              <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden flex items-center justify-center">
                                  <div className="scale-[0.4] origin-center">
                                      <TemplateRenderer 
                                        type={t.baseTemplateId} 
                                        data={dummyData} 
                                        brandSettings={brandSettings} 
                                        customConfig={t.config} 
                                      />
                                  </div>
                              </div>
                              <div className="p-3 bg-white border-t border-gray-100 flex justify-between items-center">
                                  <span className="font-medium text-sm text-gray-700 truncate">{t.name}</span>
                                  <button 
                                    onClick={() => onDelete(t.id)}
                                    className="text-gray-400 hover:text-red-500 p-1"
                                    title="Delete Template"
                                  >
                                      <Trash2 className="w-4 h-4" />
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>

          {/* Standard Templates Section */}
          <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-gray-500" /> Standard Library
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {STANDARD_TEMPLATES.map(t => (
                      <div key={t.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                           <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden flex items-center justify-center">
                                  <div className="scale-[0.4] origin-center">
                                      <TemplateRenderer 
                                        type={t.id} 
                                        data={dummyData} 
                                        brandSettings={brandSettings} 
                                      />
                                  </div>
                              </div>
                              <div className="p-3 bg-white border-t border-gray-100">
                                  <span className="font-medium text-sm text-gray-700">{t.label}</span>
                              </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};

export default TemplateManager;
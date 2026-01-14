import React, { useState } from 'react';
import { BrandSettings, PropertyDetails } from '../types';
import TemplateRenderer from './TemplateRenderer';
import { Palette, Type, Upload, User, Globe, Building2, Save, Phone, Mail } from 'lucide-react';

interface Props {
  brandSettings: BrandSettings;
  onSave: (settings: BrandSettings) => void;
}

const BrandKitEditor: React.FC<Props> = ({ brandSettings, onSave }) => {
  const [settings, setSettings] = useState<BrandSettings>(brandSettings);

  // Dummy data for preview
  const previewData: PropertyDetails = {
    address: '123 Luxury Lane, Beverly Hills',
    price: '$3,850,000',
    beds: 5,
    baths: 4.5,
    sqft: 4200,
    description: '',
    features: [],
    imageUrl: 'https://picsum.photos/800/1000?grayscale'
  };

  const fonts = ['Inter', 'Playfair Display', 'Montserrat', 'Lato'];

  const handleImageUpload = (field: 'logoUrl' | 'agentPhotoUrl', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSettings(prev => ({ ...prev, [field]: url }));
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-8">
      {/* Editor Column */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Brand Kit</h2>
                <p className="text-sm text-gray-500">Customize your visual identity</p>
            </div>
            <button 
                onClick={() => onSave(settings)}
                className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm"
            >
                <Save className="w-4 h-4" /> Save Changes
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Colors */}
            <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Brand Colors
                </h3>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="color" 
                                value={settings.primaryColor}
                                onChange={e => setSettings({...settings, primaryColor: e.target.value})}
                                className="h-10 w-20 rounded cursor-pointer border border-gray-300 p-1"
                            />
                            <span className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">{settings.primaryColor}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Used for buttons, badges, and highlights.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="color" 
                                value={settings.secondaryColor}
                                onChange={e => setSettings({...settings, secondaryColor: e.target.value})}
                                className="h-10 w-20 rounded cursor-pointer border border-gray-300 p-1"
                            />
                            <span className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">{settings.secondaryColor}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Used for backgrounds and text accents.</p>
                    </div>
                </div>
            </section>

            <hr className="border-gray-100" />

            {/* Typography */}
            <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Type className="w-4 h-4" /> Typography
                </h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Font</label>
                    <div className="grid grid-cols-2 gap-3">
                        {fonts.map(font => (
                            <button
                                key={font}
                                onClick={() => setSettings({...settings, fontFamily: font as any})}
                                className={`p-3 border rounded-lg text-left transition-all ${
                                    settings.fontFamily === font 
                                    ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <span className="text-lg block" style={{ fontFamily: font }}>Aa</span>
                                <span className="text-xs text-gray-500">{font}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <hr className="border-gray-100" />

            {/* Assets */}
            <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Brand Assets
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                         <div className="mt-1 flex items-center gap-4">
                            <div className="h-16 w-16 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden relative">
                                {settings.logoUrl ? (
                                    <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                                ) : (
                                    <Building2 className="w-6 h-6 text-gray-400" />
                                )}
                            </div>
                            <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                                Change
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('logoUrl', e)} />
                            </label>
                         </div>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Agent Photo</label>
                         <div className="mt-1 flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden relative">
                                {settings.agentPhotoUrl ? (
                                    <img src={settings.agentPhotoUrl} alt="Agent" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-6 h-6 text-gray-400" />
                                )}
                            </div>
                            <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                                Change
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload('agentPhotoUrl', e)} />
                            </label>
                         </div>
                    </div>
                </div>
            </section>

             <hr className="border-gray-100" />

             {/* Agent Details */}
             <section>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> Agent Details
                </h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                value={settings.agentName}
                                onChange={e => setSettings({...settings, agentName: e.target.value})}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Agency Name</label>
                            <input 
                                type="text" 
                                value={settings.agencyName}
                                onChange={e => setSettings({...settings, agencyName: e.target.value})}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                    <Phone className="w-4 h-4" />
                                </span>
                                <input 
                                    type="text" 
                                    value={settings.phone}
                                    onChange={e => setSettings({...settings, phone: e.target.value})}
                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-brand-500 focus:border-brand-500 sm:text-sm border-gray-300 border"
                                    placeholder="(555) 123-4567"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                    <Mail className="w-4 h-4" />
                                </span>
                                <input 
                                    type="text" 
                                    value={settings.email}
                                    onChange={e => setSettings({...settings, email: e.target.value})}
                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-brand-500 focus:border-brand-500 sm:text-sm border-gray-300 border"
                                    placeholder="agent@company.com"
                                />
                            </div>
                        </div>
                    </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                <Globe className="w-4 h-4" />
                            </span>
                            <input 
                                type="text" 
                                value={settings.website}
                                onChange={e => setSettings({...settings, website: e.target.value})}
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-brand-500 focus:border-brand-500 sm:text-sm border-gray-300 border"
                                placeholder="www.realty.com"
                            />
                        </div>
                    </div>
                </div>
             </section>
        </div>
      </div>

      {/* Preview Column */}
      <div className="w-full md:w-[450px] bg-gray-100 rounded-xl p-8 flex flex-col items-center justify-center gap-6 border border-gray-200">
         <h3 className="text-gray-500 font-medium uppercase tracking-widest text-xs">Live Preview</h3>
         <div className="scale-75 md:scale-90 origin-center bg-white shadow-2xl">
             <TemplateRenderer type="just-listed" data={previewData} brandSettings={settings} />
         </div>
         <div className="scale-75 md:scale-90 origin-center bg-white shadow-2xl">
             <TemplateRenderer type="open-house" data={previewData} brandSettings={settings} />
         </div>
      </div>
    </div>
  );
};

export default BrandKitEditor;
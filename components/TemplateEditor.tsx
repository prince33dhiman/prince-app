import React, { useState } from 'react';
import { CustomTemplate, TemplateType, BrandSettings, STANDARD_TEMPLATES, PropertyDetails, ImageStyles, LayoutConfig } from '../types';
import TemplateRenderer from './TemplateRenderer';
import { ArrowLeft, Save, Layout, Palette, RotateCcw, Image as ImageIcon, Sun, Contrast, Droplets, RotateCw, ZoomIn, Eye, AlignLeft, AlignCenter, AlignRight, AlignStartVertical, AlignCenterVertical, AlignEndVertical, PanelTop, PanelBottom, SplitSquareVertical } from 'lucide-react';

interface Props {
  onSave: (template: CustomTemplate) => void;
  onCancel: () => void;
  brandSettings: BrandSettings;
}

const TemplateEditor: React.FC<Props> = ({ onSave, onCancel, brandSettings }) => {
  const [activeTab, setActiveTab] = useState<'layout' | 'style' | 'image'>('layout');
  const [name, setName] = useState('My Custom Template');
  const [baseTemplateId, setBaseTemplateId] = useState<TemplateType>('custom-builder');
  
  // Layout Config
  const defaultLayoutConfig: LayoutConfig = {
      showLogo: true,
      showAgentInfo: true,
      showBadge: true,
      textAlignment: 'left',
      contentPosition: 'bottom',
      headerStyle: 'transparent',
      footerStyle: 'transparent'
  };
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(defaultLayoutConfig);

  // Style Config
  const [badgeText, setBadgeText] = useState('');
  const [primaryColor, setPrimaryColor] = useState(brandSettings.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(brandSettings.secondaryColor);
  const [overlayOpacity, setOverlayOpacity] = useState(0.9);

  // Image Config
  const defaultImageStyles: ImageStyles = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      sepia: 0,
      blur: 0,
      zoom: 1,
      rotation: 0
  };
  const [imageStyles, setImageStyles] = useState<ImageStyles>(defaultImageStyles);

  // Dummy data for preview
  const previewData: PropertyDetails = {
    address: '123 Luxury Lane, Beverly Hills',
    price: '$3,850,000',
    beds: 5,
    baths: 4.5,
    sqft: 4200,
    description: '',
    features: [],
    imageUrl: 'https://picsum.photos/800/1000'
  };

  const handleSave = () => {
    if (!name) return alert('Please enter a template name');
    
    const newTemplate: CustomTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      baseTemplateId,
      config: {
        badgeText: badgeText || undefined,
        primaryColor: primaryColor !== brandSettings.primaryColor ? primaryColor : undefined,
        secondaryColor: secondaryColor !== brandSettings.secondaryColor ? secondaryColor : undefined,
        overlayOpacity,
        imageStyles,
        layout: layoutConfig
      },
      createdAt: new Date()
    };
    onSave(newTemplate);
  };

  const handleReset = () => {
      setPrimaryColor(brandSettings.primaryColor);
      setSecondaryColor(brandSettings.secondaryColor);
      setOverlayOpacity(0.9);
      setBadgeText('');
      setImageStyles(defaultImageStyles);
      setLayoutConfig(defaultLayoutConfig);
  };

  const handleResetImage = () => {
      setImageStyles(defaultImageStyles);
  };

  const handleResetLayout = () => {
      setLayoutConfig(defaultLayoutConfig);
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Editor Panel */}
      <div className="w-full md:w-96 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
           <button onClick={onCancel} className="text-gray-500 hover:text-gray-800">
               <ArrowLeft className="w-5 h-5" />
           </button>
           <h2 className="font-bold text-gray-800">New Template</h2>
           <button onClick={handleReset} className="text-gray-400 hover:text-gray-600" title="Reset All">
               <RotateCcw className="w-4 h-4" />
           </button>
        </div>
        
        {/* Template Name Input */}
        <div className="p-4 border-b border-gray-100">
             <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Template Name"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm p-2 border font-medium"
            />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
            <button 
                onClick={() => setActiveTab('layout')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'layout' ? 'border-brand-600 text-brand-600 bg-brand-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <Layout className="w-4 h-4" /> Layout
            </button>
            <button 
                onClick={() => setActiveTab('style')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'style' ? 'border-brand-600 text-brand-600 bg-brand-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <Palette className="w-4 h-4" /> Style
            </button>
            <button 
                onClick={() => setActiveTab('image')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'image' ? 'border-brand-600 text-brand-600 bg-brand-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <ImageIcon className="w-4 h-4" /> Image
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {activeTab === 'layout' && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Base Layout</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {STANDARD_TEMPLATES.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setBaseTemplateId(t.id)}
                                    className={`p-2 text-xs border rounded-lg text-left transition-all ${
                                        baseTemplateId === t.id 
                                        ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' 
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-100" />
                    
                    {/* Sections Controls - Visible mostly for custom-builder but available for all to tweak config */}
                    <div>
                         <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sections</h3>
                         
                         {/* Header Style */}
                         <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><PanelTop className="w-4 h-4"/> Header Style</label>
                            <select 
                                value={layoutConfig.headerStyle || 'transparent'} 
                                onChange={(e) => setLayoutConfig({...layoutConfig, headerStyle: e.target.value as any})}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                            >
                                <option value="transparent">Transparent Overlay</option>
                                <option value="solid-white">Solid White</option>
                                <option value="solid-primary">Solid Primary Color</option>
                                <option value="solid-secondary">Solid Secondary Color</option>
                            </select>
                         </div>

                         {/* Footer Style */}
                         <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><PanelBottom className="w-4 h-4"/> Footer Style</label>
                            <select 
                                value={layoutConfig.footerStyle || 'transparent'} 
                                onChange={(e) => setLayoutConfig({...layoutConfig, footerStyle: e.target.value as any})}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                            >
                                <option value="transparent">Transparent Overlay</option>
                                <option value="minimal">Minimal (Floating)</option>
                                <option value="solid-white">Solid White</option>
                                <option value="solid-primary">Solid Primary Color</option>
                                <option value="solid-secondary">Solid Secondary Color</option>
                            </select>
                         </div>
                    </div>
                    
                    <hr className="border-gray-100" />

                    {/* Visibility Controls */}
                     <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Elements</h3>
                            <button onClick={handleResetLayout} className="text-xs text-brand-600 hover:text-brand-800 flex items-center gap-1">
                                <RotateCcw className="w-3 h-3" /> Reset
                            </button>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer">
                                <span className="text-sm font-medium text-gray-700">Show Logo</span>
                                <div 
                                    className={`w-10 h-6 rounded-full p-1 transition-colors ${layoutConfig.showLogo ? 'bg-brand-600' : 'bg-gray-300'}`}
                                    onClick={(e) => { e.preventDefault(); setLayoutConfig({...layoutConfig, showLogo: !layoutConfig.showLogo})}}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${layoutConfig.showLogo ? 'translate-x-4' : ''}`}></div>
                                </div>
                            </label>
                            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer">
                                <span className="text-sm font-medium text-gray-700">Show Agent Info</span>
                                <div 
                                    className={`w-10 h-6 rounded-full p-1 transition-colors ${layoutConfig.showAgentInfo ? 'bg-brand-600' : 'bg-gray-300'}`}
                                    onClick={(e) => { e.preventDefault(); setLayoutConfig({...layoutConfig, showAgentInfo: !layoutConfig.showAgentInfo})}}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${layoutConfig.showAgentInfo ? 'translate-x-4' : ''}`}></div>
                                </div>
                            </label>
                            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer">
                                <span className="text-sm font-medium text-gray-700">Show Badge</span>
                                <div 
                                    className={`w-10 h-6 rounded-full p-1 transition-colors ${layoutConfig.showBadge ? 'bg-brand-600' : 'bg-gray-300'}`}
                                    onClick={(e) => { e.preventDefault(); setLayoutConfig({...layoutConfig, showBadge: !layoutConfig.showBadge})}}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${layoutConfig.showBadge ? 'translate-x-4' : ''}`}></div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <hr className="border-gray-100" />
                    
                    {/* Alignment Controls */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Alignment & Layout</h3>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Text Alignment</label>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button 
                                    onClick={() => setLayoutConfig({...layoutConfig, textAlignment: 'left'})}
                                    className={`flex-1 p-2 rounded-md flex justify-center transition-all ${layoutConfig.textAlignment === 'left' ? 'bg-white shadow text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <AlignLeft className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => setLayoutConfig({...layoutConfig, textAlignment: 'center'})}
                                    className={`flex-1 p-2 rounded-md flex justify-center transition-all ${layoutConfig.textAlignment === 'center' ? 'bg-white shadow text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <AlignCenter className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => setLayoutConfig({...layoutConfig, textAlignment: 'right'})}
                                    className={`flex-1 p-2 rounded-md flex justify-center transition-all ${layoutConfig.textAlignment === 'right' ? 'bg-white shadow text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <AlignRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                         <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Layout Composition</label>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button 
                                    onClick={() => setLayoutConfig({...layoutConfig, contentPosition: 'top'})}
                                    className={`flex-1 p-2 rounded-md flex justify-center transition-all ${layoutConfig.contentPosition === 'top' ? 'bg-white shadow text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    title="Overlay Top"
                                >
                                    <AlignStartVertical className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => setLayoutConfig({...layoutConfig, contentPosition: 'center'})}
                                    className={`flex-1 p-2 rounded-md flex justify-center transition-all ${layoutConfig.contentPosition === 'center' ? 'bg-white shadow text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    title="Overlay Center"
                                >
                                    <AlignCenterVertical className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => setLayoutConfig({...layoutConfig, contentPosition: 'bottom'})}
                                    className={`flex-1 p-2 rounded-md flex justify-center transition-all ${layoutConfig.contentPosition === 'bottom' ? 'bg-white shadow text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    title="Overlay Bottom"
                                >
                                    <AlignEndVertical className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => setLayoutConfig({...layoutConfig, contentPosition: 'below-image'})}
                                    className={`flex-1 p-2 rounded-md flex justify-center transition-all ${layoutConfig.contentPosition === 'below-image' ? 'bg-white shadow text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    title="Split View (Image Top)"
                                >
                                    <SplitSquareVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'style' && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Colors & Text</h3>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
                            <input 
                                type="text" 
                                value={badgeText}
                                onChange={e => setBadgeText(e.target.value)}
                                placeholder="e.g. JUST LISTED"
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="color" 
                                value={primaryColor}
                                onChange={e => setPrimaryColor(e.target.value)}
                                className="h-8 w-16 rounded cursor-pointer border border-gray-300 p-1"
                            />
                            <span className="text-xs text-gray-500">Overrides brand color</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="color" 
                                value={secondaryColor}
                                onChange={e => setSecondaryColor(e.target.value)}
                                className="h-8 w-16 rounded cursor-pointer border border-gray-300 p-1"
                            />
                            <span className="text-xs text-gray-500">Overrides brand color</span>
                        </div>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Overlay Opacity: {Math.round(overlayOpacity * 100)}%</label>
                         <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.1" 
                            value={overlayOpacity}
                            onChange={e => setOverlayOpacity(parseFloat(e.target.value))}
                            className="w-full accent-brand-600"
                         />
                         <p className="text-xs text-gray-500 mt-1">Controls darkness of image overlay.</p>
                    </div>
                </div>
            )}

            {activeTab === 'image' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Image Effects</h3>
                        <button onClick={handleResetImage} className="text-xs text-brand-600 hover:text-brand-800 flex items-center gap-1">
                            <RotateCcw className="w-3 h-3" /> Reset Image
                        </button>
                    </div>

                    {/* Brightness */}
                    <div>
                         <div className="flex justify-between mb-1">
                             <label className="text-xs font-medium text-gray-700 flex items-center gap-1"><Sun className="w-3 h-3" /> Brightness</label>
                             <span className="text-xs text-gray-500">{imageStyles.brightness}%</span>
                         </div>
                         <input 
                            type="range" min="0" max="200" 
                            value={imageStyles.brightness}
                            onChange={e => setImageStyles({...imageStyles, brightness: parseInt(e.target.value)})}
                            className="w-full accent-brand-600"
                         />
                    </div>

                    {/* Contrast */}
                    <div>
                         <div className="flex justify-between mb-1">
                             <label className="text-xs font-medium text-gray-700 flex items-center gap-1"><Contrast className="w-3 h-3" /> Contrast</label>
                             <span className="text-xs text-gray-500">{imageStyles.contrast}%</span>
                         </div>
                         <input 
                            type="range" min="0" max="200" 
                            value={imageStyles.contrast}
                            onChange={e => setImageStyles({...imageStyles, contrast: parseInt(e.target.value)})}
                            className="w-full accent-brand-600"
                         />
                    </div>

                    {/* Saturation */}
                    <div>
                         <div className="flex justify-between mb-1">
                             <label className="text-xs font-medium text-gray-700 flex items-center gap-1"><Droplets className="w-3 h-3" /> Saturation</label>
                             <span className="text-xs text-gray-500">{imageStyles.saturation}%</span>
                         </div>
                         <input 
                            type="range" min="0" max="200" 
                            value={imageStyles.saturation}
                            onChange={e => setImageStyles({...imageStyles, saturation: parseInt(e.target.value)})}
                            className="w-full accent-brand-600"
                         />
                    </div>

                     {/* Sepia & Blur */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Sepia ({imageStyles.sepia}%)</label>
                            <input 
                                type="range" min="0" max="100" 
                                value={imageStyles.sepia}
                                onChange={e => setImageStyles({...imageStyles, sepia: parseInt(e.target.value)})}
                                className="w-full accent-brand-600"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1"><Eye className="w-3 h-3"/> Blur ({imageStyles.blur}px)</label>
                            <input 
                                type="range" min="0" max="10" 
                                value={imageStyles.blur}
                                onChange={e => setImageStyles({...imageStyles, blur: parseInt(e.target.value)})}
                                className="w-full accent-brand-600"
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Transforms */}
                     <div>
                         <div className="flex justify-between mb-1">
                             <label className="text-xs font-medium text-gray-700 flex items-center gap-1"><ZoomIn className="w-3 h-3" /> Zoom Scale</label>
                             <span className="text-xs text-gray-500">{imageStyles.zoom.toFixed(1)}x</span>
                         </div>
                         <input 
                            type="range" min="1" max="2" step="0.1"
                            value={imageStyles.zoom}
                            onChange={e => setImageStyles({...imageStyles, zoom: parseFloat(e.target.value)})}
                            className="w-full accent-brand-600"
                         />
                    </div>

                    <div>
                         <div className="flex justify-between mb-1">
                             <label className="text-xs font-medium text-gray-700 flex items-center gap-1"><RotateCw className="w-3 h-3" /> Rotation</label>
                             <span className="text-xs text-gray-500">{imageStyles.rotation}°</span>
                         </div>
                         <input 
                            type="range" min="0" max="360" step="5"
                            value={imageStyles.rotation}
                            onChange={e => setImageStyles({...imageStyles, rotation: parseInt(e.target.value)})}
                            className="w-full accent-brand-600"
                         />
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button 
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-sm"
            >
                <Save className="w-4 h-4" /> Save Template
            </button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
          <div className="relative z-10 shadow-2xl transition-all duration-300">
              <TemplateRenderer 
                 type={baseTemplateId} 
                 data={previewData} 
                 brandSettings={brandSettings} 
                 customConfig={{
                     badgeText: badgeText || undefined,
                     primaryColor,
                     secondaryColor,
                     overlayOpacity,
                     imageStyles,
                     layout: layoutConfig
                 }}
              />
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center text-gray-400 text-sm">
              Live Preview - {activeTab === 'image' ? 'Image Effects' : (activeTab === 'style' ? 'Colors & Style' : 'Layout')}
          </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
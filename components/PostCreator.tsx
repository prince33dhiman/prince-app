import React, { useState, useEffect } from 'react';
import { PropertyDetails, TemplateType, GeneratedCaptionResponse, SocialPost, BrandSettings, CustomTemplate, STANDARD_TEMPLATES } from '../types';
import TemplateRenderer from './TemplateRenderer';
import { generatePostCaption, optimizePropertyDescription } from '../services/gemini';
import { 
  Wand2, Calendar as CalendarIcon, Upload, Layout, Type, 
  CheckCircle2, Share2, Instagram, Facebook, Linkedin, Loader2, ArrowRight, ArrowLeft 
} from 'lucide-react';

interface Props {
  onPostCreated: (post: SocialPost) => void;
  onCancel: () => void;
  brandSettings: BrandSettings;
  initialData?: PropertyDetails | null;
  initialPost?: SocialPost | null;
  customTemplates?: CustomTemplate[];
}

const PostCreator: React.FC<Props> = ({ onPostCreated, onCancel, brandSettings, initialData, initialPost, customTemplates = [] }) => {
  // If editing a post, we start at step 3 (Caption/Preview) for convenience, but can go back.
  const [step, setStep] = useState<1 | 2 | 3 | 4>(initialPost ? 3 : 1);
  const [loading, setLoading] = useState(false);
  
  // We need to store both the selected ID and whether it's a custom template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialPost?.templateId || 'just-listed'
  );

  const selectedCustomTemplate = customTemplates.find(t => t.id === selectedTemplateId);
  const baseTemplateType = selectedCustomTemplate ? selectedCustomTemplate.baseTemplateId : (selectedTemplateId as TemplateType);
  const templateConfig = selectedCustomTemplate ? selectedCustomTemplate.config : undefined;
  
  const isListingMode = !!initialData || !!initialPost;
  // If in listing mode or edit mode, we skip step 2 (Customize Details)
  const visibleSteps = isListingMode ? [1, 3, 4] : [1, 2, 3, 4];
  
  const defaultPropertyData: PropertyDetails = {
    address: '123 Maple Avenue, Beverly Hills',
    price: '$2,450,000',
    beds: 4,
    baths: 3.5,
    sqft: 3200,
    description: 'Stunning modern farmhouse with pool and guest house.',
    features: ['Pool', 'Smart Home', 'Wine Cellar'],
    imageUrl: 'https://picsum.photos/800/1000'
  };

  const [propertyData, setPropertyData] = useState<PropertyDetails>(
    initialPost?.propertyDetails || initialData || defaultPropertyData
  );

  const [selectedPlatforms, setSelectedPlatforms] = useState<('instagram' | 'facebook' | 'linkedin')[]>(
    initialPost?.platforms || ['instagram']
  );

  // If initialData/initialPost changes (e.g. parent updates), sync it.
  useEffect(() => {
      if (initialPost) {
          setPropertyData(initialPost.propertyDetails);
          setSelectedTemplateId(initialPost.templateId);
          setGeneratedContent({
              caption: initialPost.content,
              hashtags: initialPost.hashtags
          });
          setSelectedPlatforms(initialPost.platforms);
          if (initialPost.scheduledDate) {
              // Convert to local datetime string for input
              const date = new Date(initialPost.scheduledDate);
              const offset = date.getTimezoneOffset() * 60000;
              const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
              setScheduledDate(localISOTime);
          }
      } else if (initialData) {
          setPropertyData(initialData);
      }
  }, [initialData, initialPost]);

  const [generatedContent, setGeneratedContent] = useState<GeneratedCaptionResponse>({
    caption: initialPost?.content || '',
    hashtags: initialPost?.hashtags || []
  });

  const togglePlatform = (p: 'instagram' | 'facebook' | 'linkedin') => {
      setSelectedPlatforms(prev => {
          if (prev.includes(p)) {
              return prev.filter(item => item !== p);
          } else {
              return [...prev, p];
          }
      });
  };
  
  // Date formatting for edit mode initial state
  const getInitialDate = () => {
      if (initialPost?.scheduledDate) {
        const date = new Date(initialPost.scheduledDate);
        const offset = date.getTimezoneOffset() * 60000;
        return (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
      }
      return '';
  };

  const [scheduledDate, setScheduledDate] = useState<string>(getInitialDate());

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPropertyData(prev => ({ ...prev, imageUrl: url }));
    }
  };

  const handleGenerateCaption = async () => {
    if (!process.env.API_KEY) {
      alert("Please configure your API_KEY in the environment.");
      return;
    }
    if (selectedPlatforms.length === 0) {
        alert("Please select at least one platform.");
        return;
    }
    setLoading(true);
    try {
      const result = await generatePostCaption(propertyData, selectedPlatforms, 'professional');
      setGeneratedContent(result);
    } catch (e) {
      console.error(e);
      alert("Failed to generate caption. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeDescription = async () => {
    setLoading(true);
    try {
      const optimized = await optimizePropertyDescription(propertyData.description);
      setPropertyData(prev => ({ ...prev, description: optimized }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    if (selectedPlatforms.length === 0) {
        alert("Please select at least one platform.");
        return;
    }
    const newPost: SocialPost = {
      id: initialPost?.id || Math.random().toString(36).substr(2, 9),
      platforms: selectedPlatforms,
      content: generatedContent.caption,
      hashtags: generatedContent.hashtags,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      status: scheduledDate ? 'scheduled' : 'published',
      templateId: selectedTemplateId,
      propertyDetails: propertyData
    };
    onPostCreated(newPost);
  };

  const handleNext = () => {
      if (step === 1 && isListingMode) {
          setStep(3);
      } else {
          setStep(prev => Math.min(4, prev + 1) as any);
      }
  };

  const handleBack = () => {
      if (step === 3 && isListingMode) {
          setStep(1);
      } else {
          setStep(prev => Math.max(1, prev - 1) as any);
      }
  };

  // Step 1: Template Selection
  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <Layout className="w-5 h-5" /> Select a Template
      </h3>
      
      {/* Custom Templates Section */}
      {customTemplates.length > 0 && (
          <div className="mb-8">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Your Custom Templates</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {customTemplates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTemplateId(t.id)}
                        className={`relative group rounded-xl border-2 overflow-hidden transition-all ${
                          selectedTemplateId === t.id ? 'border-brand-500 ring-2 ring-brand-200' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="bg-gray-100 aspect-[4/5] flex items-center justify-center text-gray-400 text-xs p-2">
                            <div className="scale-50 origin-center">
                                <TemplateRenderer type={t.baseTemplateId} data={propertyData} brandSettings={brandSettings} customConfig={t.config} />
                            </div>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur p-2 text-center text-sm font-medium">
                          {t.name}
                        </div>
                        {selectedTemplateId === t.id && (
                          <div className="absolute top-2 right-2 text-brand-500 bg-white rounded-full p-1 shadow-sm">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                  ))}
              </div>
          </div>
      )}

      {/* Standard Templates Section */}
      <div>
        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Standard Library</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STANDARD_TEMPLATES.map(t => (
            <button
                key={t.id}
                onClick={() => setSelectedTemplateId(t.id)}
                className={`relative group rounded-xl border-2 overflow-hidden transition-all ${
                selectedTemplateId === t.id ? 'border-brand-500 ring-2 ring-brand-200' : 'border-gray-200 hover:border-gray-300'
                }`}
            >
                <div className="bg-gray-100 aspect-[4/5] flex items-center justify-center text-gray-400 text-xs p-2">
                    <div className="scale-50 origin-center">
                        <TemplateRenderer type={t.id} data={propertyData} brandSettings={brandSettings} />
                    </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur p-2 text-center text-sm font-medium">
                {t.label}
                </div>
                {selectedTemplateId === t.id && (
                <div className="absolute top-2 right-2 text-brand-500 bg-white rounded-full p-1 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                </div>
                )}
            </button>
            ))}
        </div>
      </div>
    </div>
  );

  // Step 2: Details & Image
  const renderStep2 = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
      <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
         <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Layout className="w-5 h-5" /> Customize Details
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Listing Photo</label>
              <div className="flex items-center gap-4">
                 <img src={propertyData.imageUrl} alt="Preview" className="w-16 h-16 rounded object-cover border" />
                 <label className="cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload New
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                 </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input 
                        type="text" 
                        value={propertyData.price} 
                        onChange={e => setPropertyData({...propertyData, price: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input 
                        type="text" 
                        value={propertyData.address} 
                        onChange={e => setPropertyData({...propertyData, address: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beds</label>
                    <input 
                        type="number" 
                        value={propertyData.beds} 
                        onChange={e => setPropertyData({...propertyData, beds: parseInt(e.target.value)})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Baths</label>
                    <input 
                        type="number" 
                        value={propertyData.baths} 
                        onChange={e => setPropertyData({...propertyData, baths: parseFloat(e.target.value)})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sqft</label>
                    <input 
                        type="number" 
                        value={propertyData.sqft} 
                        onChange={e => setPropertyData({...propertyData, sqft: parseInt(e.target.value)})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                    />
                </div>
            </div>

            <div>
                 <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Description Notes</label>
                    <button 
                        onClick={handleOptimizeDescription}
                        disabled={loading}
                        className="text-xs text-brand-600 flex items-center gap-1 hover:text-brand-800 disabled:opacity-50"
                    >
                        <Wand2 className="w-3 h-3" /> Enhance with AI
                    </button>
                 </div>
                 <textarea 
                    rows={4}
                    value={propertyData.description}
                    onChange={e => setPropertyData({...propertyData, description: e.target.value})}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                 />
            </div>
          </div>
      </div>
      
      {/* Live Preview */}
      <div className="bg-gray-100 rounded-xl p-8 flex items-center justify-center border border-gray-200 shadow-inner">
         <div className="scale-75 md:scale-90 origin-center transition-all duration-500">
            <TemplateRenderer type={baseTemplateType} data={propertyData} brandSettings={brandSettings} customConfig={templateConfig} />
         </div>
      </div>
    </div>
  );

  // Step 3: AI Captioning
  const renderStep3 = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-600" /> AI Caption Generator
        </h3>
        
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
            <div className="flex gap-4 mb-4">
                <button 
                    onClick={() => togglePlatform('instagram')}
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${selectedPlatforms.includes('instagram') ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                >
                    <Instagram className="w-4 h-4" /> Instagram
                </button>
                <button 
                    onClick={() => togglePlatform('facebook')}
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${selectedPlatforms.includes('facebook') ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                >
                    <Facebook className="w-4 h-4" /> Facebook
                </button>
                <button 
                    onClick={() => togglePlatform('linkedin')}
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${selectedPlatforms.includes('linkedin') ? 'bg-blue-800 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                >
                    <Linkedin className="w-4 h-4" /> LinkedIn
                </button>
            </div>

            <div className="mb-4">
                <button 
                    onClick={handleGenerateCaption} 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                    {loading ? 'Generating Magic...' : 'Generate Caption'}
                </button>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm min-h-[150px]">
                {generatedContent.caption ? (
                    <>
                        <textarea 
                            className="w-full h-32 border-none resize-none focus:ring-0 text-gray-700 leading-relaxed"
                            value={generatedContent.caption}
                            onChange={(e) => setGeneratedContent({...generatedContent, caption: e.target.value})}
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                            {generatedContent.hashtags.map(tag => (
                                <span key={tag} className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                        Select platforms and click 'Generate Caption'.
                    </div>
                )}
            </div>
        </div>
      </div>

       {/* Live Preview for Listing Mode - Since step 2 is skipped, we show it here */}
       <div className="bg-gray-100 rounded-xl p-8 flex items-center justify-center border border-gray-200 shadow-inner">
           <div className="scale-75 md:scale-90 origin-center transition-all duration-500">
              <TemplateRenderer type={baseTemplateType} data={propertyData} brandSettings={brandSettings} customConfig={templateConfig} />
           </div>
       </div>
    </div>
  );

  // Step 4: Schedule
  const renderStep4 = () => (
    <div className="space-y-8 max-w-xl mx-auto">
        <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">
                {initialPost ? 'Save Changes' : 'Ready to Publish?'}
            </h3>
            <p className="text-gray-500">Review your post details and choose a publication time.</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Date & Time</label>
                <input 
                    type="datetime-local" 
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-3 border"
                />
                <p className="text-xs text-gray-500 mt-2">Leave blank to publish immediately.</p>
            </div>
            
            <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Publishing to:</h4>
                <div className="flex flex-wrap gap-2">
                    {selectedPlatforms.map(platform => (
                        <div key={platform} className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            {platform === 'instagram' && <Instagram className="w-5 h-5 text-purple-600" />}
                            {platform === 'facebook' && <Facebook className="w-5 h-5 text-blue-600" />}
                            {platform === 'linkedin' && <Linkedin className="w-5 h-5 text-blue-800" />}
                            <span className="capitalize">{platform}</span>
                        </div>
                    ))}
                    {selectedPlatforms.length === 0 && <span className="text-red-500 text-sm">No platforms selected</span>}
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col h-full max-h-[85vh]">
      {/* Header */}
      <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
        <div>
            <h2 className="text-xl font-bold text-gray-800">
                {initialPost ? 'Edit Post' : 'Create New Post'}
            </h2>
            <div className="flex gap-2 mt-1">
                {visibleSteps.map(i => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-brand-500' : 'w-4 bg-gray-300'}`} style={{ backgroundColor: i <= step ? brandSettings.primaryColor : undefined }} />
                ))}
            </div>
        </div>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-800 text-sm font-medium">Cancel</button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>

      {/* Footer Navigation */}
      <div className="px-8 py-5 border-t border-gray-100 flex justify-between bg-white rounded-b-2xl">
        <button 
            onClick={handleBack}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors ${step === 1 ? 'invisible' : ''}`}
        >
            <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {step < 4 ? (
            <button 
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white shadow-md transition-all hover:shadow-lg"
                style={{ backgroundColor: brandSettings.primaryColor }}
            >
                Next Step <ArrowRight className="w-4 h-4" />
            </button>
        ) : (
            <button 
                onClick={handleFinish}
                className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 shadow-md transition-all hover:shadow-lg"
            >
                <Share2 className="w-4 h-4" /> 
                {initialPost ? 'Update Post' : (scheduledDate ? 'Schedule Post' : 'Publish Now')}
            </button>
        )}
      </div>
    </div>
  );
};

export default PostCreator;
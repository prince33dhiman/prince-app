import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import PostCreator from './components/PostCreator';
import BrandKitEditor from './components/BrandKitEditor';
import ListingsManager from './components/ListingsManager';
import TemplateManager from './components/TemplateManager';
import { SocialPost, BrandSettings, Listing, PropertyDetails, CustomTemplate } from './types';
import { LayoutDashboard, PlusSquare, Calendar, Settings, LogOut, Home, Palette, Building2, Layout } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'create' | 'calendar' | 'brand-kit' | 'listings' | 'templates'>('dashboard');
  
  // Default Brand Settings
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({
    primaryColor: '#0ea5e9',
    secondaryColor: '#0c4a6e',
    fontFamily: 'Inter',
    logoUrl: null,
    agentName: 'John Doe',
    agentPhotoUrl: null,
    agencyName: 'Realty One Group',
    website: 'www.johndoerealty.com',
    phone: '(555) 123-4567',
    email: 'john@realty.com'
  });

  const [posts, setPosts] = useState<SocialPost[]>([
    {
        id: '1',
        platforms: ['instagram', 'facebook'],
        content: 'Check out this amazing new listing in downtown! #JustListed',
        hashtags: ['#realestate', '#cityliving'],
        scheduledDate: new Date(Date.now() + 86400000), // Tomorrow
        status: 'scheduled',
        templateId: 'just-listed',
        propertyDetails: {
            address: '8800 Sunset Blvd, LA',
            price: '$1,200,000',
            beds: 2,
            baths: 2,
            sqft: 1400,
            description: 'Amazing views.',
            features: ['View', 'Gym'],
            imageUrl: 'https://picsum.photos/seed/1/400/500'
        }
    }
  ]);

  const [listings, setListings] = useState<Listing[]>([
    {
      id: 'l1',
      address: '123 Maple Avenue, Beverly Hills',
      price: '$2,450,000',
      beds: 4,
      baths: 3.5,
      sqft: 3200,
      description: 'Stunning modern farmhouse with pool and guest house.',
      features: ['Pool', 'Smart Home', 'Wine Cellar'],
      imageUrl: 'https://picsum.photos/800/1000',
      status: 'active',
      dateAdded: new Date()
    },
    {
      id: 'l2',
      address: '500 Ocean Dr, Miami',
      price: '$1,100,000',
      beds: 2,
      baths: 2,
      sqft: 1500,
      description: 'Beachfront condo with amazing sunrise views.',
      features: ['Beach Access', 'Balcony'],
      imageUrl: 'https://picsum.photos/800/600',
      status: 'pending',
      dateAdded: new Date()
    }
  ]);

  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);

  // If selecting a listing to create a post from
  const [selectedListingForPost, setSelectedListingForPost] = useState<PropertyDetails | null>(null);
  const [selectedPostForEdit, setSelectedPostForEdit] = useState<SocialPost | null>(null);

  const handlePostCreated = (post: SocialPost) => {
    const existingIndex = posts.findIndex(p => p.id === post.id);
    if (existingIndex >= 0) {
        const updatedPosts = [...posts];
        updatedPosts[existingIndex] = post;
        setPosts(updatedPosts);
    } else {
        setPosts([post, ...posts]);
    }
    
    // Reset selection states
    setSelectedListingForPost(null);
    setSelectedPostForEdit(null);
    setView('dashboard');
  };

  const handleSaveBrand = (newSettings: BrandSettings) => {
      setBrandSettings(newSettings);
      alert('Brand Kit updated successfully!');
  };

  // Listing CRUD
  const handleAddListing = (listing: Listing) => {
    setListings([...listings, listing]);
  };

  const handleUpdateListing = (updatedListing: Listing) => {
    setListings(listings.map(l => l.id === updatedListing.id ? updatedListing : l));
  };

  const handleDeleteListing = (id: string) => {
    setListings(listings.filter(l => l.id !== id));
  };

  const handleCreatePostFromListing = (listing: Listing) => {
    setSelectedListingForPost(listing);
    setSelectedPostForEdit(null);
    setView('create');
  };

  const handleEditPost = (post: SocialPost) => {
    setSelectedPostForEdit(post);
    setSelectedListingForPost(null);
    setView('create');
  };

  const handleOpenCreator = () => {
    setSelectedListingForPost(null);
    setSelectedPostForEdit(null);
    setView('create');
  };

  // Template CRUD
  const handleCreateTemplate = (template: CustomTemplate) => {
      setCustomTemplates([...customTemplates, template]);
  };

  const handleDeleteTemplate = (id: string) => {
      setCustomTemplates(customTemplates.filter(t => t.id !== id));
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans" style={{ fontFamily: brandSettings.fontFamily }}>
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2" style={{ color: brandSettings.primaryColor }}>
            <Home className="w-6 h-6 fill-current" />
            <span className="text-lg font-bold tracking-tight text-gray-900">RealtySocial AI</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              view === 'dashboard' 
                ? 'bg-gray-100' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            style={view === 'dashboard' ? { color: brandSettings.primaryColor, backgroundColor: `${brandSettings.primaryColor}10` } : {}}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button 
             onClick={handleOpenCreator}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              view === 'create' 
                ? 'bg-gray-100' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            style={view === 'create' ? { color: brandSettings.primaryColor, backgroundColor: `${brandSettings.primaryColor}10` } : {}}
          >
            <PlusSquare className="w-5 h-5" /> Create Post
          </button>
          <button 
             onClick={() => setView('listings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              view === 'listings' 
                ? 'bg-gray-100' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            style={view === 'listings' ? { color: brandSettings.primaryColor, backgroundColor: `${brandSettings.primaryColor}10` } : {}}
          >
            <Building2 className="w-5 h-5" /> Listings
          </button>
          <button 
             onClick={() => setView('templates')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              view === 'templates' 
                ? 'bg-gray-100' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            style={view === 'templates' ? { color: brandSettings.primaryColor, backgroundColor: `${brandSettings.primaryColor}10` } : {}}
          >
            <Layout className="w-5 h-5" /> Templates
          </button>
          <button 
             onClick={() => setView('brand-kit')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              view === 'brand-kit' 
                ? 'bg-gray-100' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            style={view === 'brand-kit' ? { color: brandSettings.primaryColor, backgroundColor: `${brandSettings.primaryColor}10` } : {}}
          >
            <Palette className="w-5 h-5" /> Brand Kit
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Calendar className="w-5 h-5" /> Calendar
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900">
                <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: brandSettings.primaryColor }}
                >
                    {brandSettings.agentPhotoUrl ? (
                        <img src={brandSettings.agentPhotoUrl} alt="User" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        "JD"
                    )}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-gray-900 truncate">{brandSettings.agentName}</p>
                    <p className="text-xs text-gray-500 truncate">{brandSettings.agencyName}</p>
                </div>
                <LogOut className="w-4 h-4" />
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 md:p-12 h-full">
            {view === 'dashboard' && (
                <Dashboard 
                    posts={posts} 
                    onCreateNew={handleOpenCreator} 
                    onEdit={handleEditPost}
                />
            )}
            
            {view === 'create' && (
                <PostCreator 
                    onPostCreated={handlePostCreated} 
                    onCancel={() => setView('dashboard')} 
                    brandSettings={brandSettings}
                    initialData={selectedListingForPost}
                    initialPost={selectedPostForEdit}
                    customTemplates={customTemplates}
                />
            )}

            {view === 'listings' && (
                <ListingsManager 
                    listings={listings}
                    onAdd={handleAddListing}
                    onUpdate={handleUpdateListing}
                    onDelete={handleDeleteListing}
                    onCreatePost={handleCreatePostFromListing}
                    primaryColor={brandSettings.primaryColor}
                />
            )}

            {view === 'templates' && (
                <TemplateManager 
                    customTemplates={customTemplates}
                    brandSettings={brandSettings}
                    onCreate={handleCreateTemplate}
                    onDelete={handleDeleteTemplate}
                />
            )}

            {view === 'brand-kit' && (
                <BrandKitEditor 
                    brandSettings={brandSettings}
                    onSave={handleSaveBrand}
                />
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
import React, { useState } from 'react';
import { Listing, PropertyDetails } from '../types';
import { optimizePropertyDescription } from '../services/gemini';
import { 
  Plus, Search, MoreVertical, Edit2, Trash2, Home, 
  MapPin, Bed, Bath, Square, Upload, Wand2, ArrowRight, X, Save
} from 'lucide-react';

interface Props {
  listings: Listing[];
  onAdd: (listing: Listing) => void;
  onUpdate: (listing: Listing) => void;
  onDelete: (id: string) => void;
  onCreatePost: (listing: Listing) => void;
  primaryColor: string;
}

const ListingsManager: React.FC<Props> = ({ listings, onAdd, onUpdate, onDelete, onCreatePost, primaryColor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const emptyListing: Listing = {
    id: '',
    address: '',
    price: '',
    beds: 0,
    baths: 0,
    sqft: 0,
    description: '',
    features: [],
    imageUrl: '',
    status: 'active',
    dateAdded: new Date()
  };

  const [currentListing, setCurrentListing] = useState<Listing>(emptyListing);

  const handleEdit = (listing: Listing) => {
    setCurrentListing(listing);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentListing({ ...emptyListing, id: Math.random().toString(36).substr(2, 9) });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Simple validation
    if (!currentListing.address || !currentListing.price) {
      alert("Address and Price are required.");
      return;
    }

    const existing = listings.find(l => l.id === currentListing.id);
    if (existing) {
      onUpdate(currentListing);
    } else {
      onAdd(currentListing);
    }
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCurrentListing(prev => ({ ...prev, imageUrl: url }));
    }
  };

  const handleOptimizeDescription = async () => {
    if (!currentListing.description) return;
    setLoadingAi(true);
    try {
      const optimized = await optimizePropertyDescription(currentListing.description);
      setCurrentListing(prev => ({ ...prev, description: optimized }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  const filteredListings = listings.filter(l => 
    l.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- FORM VIEW ---
  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {listings.find(l => l.id === currentListing.id) ? 'Edit Listing' : 'Add New Listing'}
          </h2>
          <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Image & Basic Info */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Image</label>
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center group">
                  {currentListing.imageUrl ? (
                    <img src={currentListing.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <Home className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <span className="text-sm">No image uploaded</span>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <div className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                      <Upload className="w-4 h-4" /> {currentListing.imageUrl ? 'Change Photo' : 'Upload Photo'}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                   <select 
                      value={currentListing.status}
                      onChange={e => setCurrentListing({...currentListing, status: e.target.value as any})}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                   >
                     <option value="active">Active</option>
                     <option value="pending">Pending</option>
                     <option value="sold">Sold</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                   <input 
                      type="text" 
                      value={currentListing.price}
                      onChange={e => setCurrentListing({...currentListing, price: e.target.value})}
                      placeholder="$0"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                   />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input 
                  type="text" 
                  value={currentListing.address}
                  onChange={e => setCurrentListing({...currentListing, address: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                />
              </div>
            </div>

            {/* Right Column: Specs & Description */}
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Beds</label>
                    <input 
                        type="number" 
                        value={currentListing.beds} 
                        onChange={e => setCurrentListing({...currentListing, beds: parseInt(e.target.value) || 0})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Baths</label>
                    <input 
                        type="number" 
                        value={currentListing.baths} 
                        onChange={e => setCurrentListing({...currentListing, baths: parseFloat(e.target.value) || 0})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sqft</label>
                    <input 
                        type="number" 
                        value={currentListing.sqft} 
                        onChange={e => setCurrentListing({...currentListing, sqft: parseInt(e.target.value) || 0})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                    />
                </div>
              </div>

              <div>
                 <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <button 
                        onClick={handleOptimizeDescription}
                        disabled={loadingAi}
                        className="text-xs text-brand-600 flex items-center gap-1 hover:text-brand-800 disabled:opacity-50"
                    >
                        <Wand2 className="w-3 h-3" /> {loadingAi ? 'Optimizing...' : 'Enhance with AI'}
                    </button>
                 </div>
                 <textarea 
                    rows={6}
                    value={currentListing.description}
                    onChange={e => setCurrentListing({...currentListing, description: e.target.value})}
                    placeholder="Enter property details..."
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border resize-none"
                 />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Features (comma separated)</label>
                <input 
                  type="text" 
                  value={currentListing.features.join(', ')}
                  onChange={e => setCurrentListing({...currentListing, features: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                  placeholder="Pool, View, Garage..."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 flex items-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            <Save className="w-4 h-4" /> Save Listing
          </button>
        </div>
      </div>
    );
  }

  // --- GRID VIEW ---
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Listings</h1>
          <p className="text-gray-500 mt-1">Manage your property portfolio.</p>
        </div>
        <button 
            onClick={handleCreate}
            className="flex items-center gap-2 bg-brand-600 text-white px-5 py-3 rounded-lg font-semibold shadow-lg hover:bg-brand-700 transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: primaryColor }}
        >
            <Plus className="w-5 h-5" /> Add Property
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by address or status..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
          />
        </div>
        {/* Can add filters here later */}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-4">
        {filteredListings.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            <Home className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No listings found. Add your first property!</p>
          </div>
        ) : (
          filteredListings.map(listing => (
            <div key={listing.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col group">
              <div className="h-48 relative">
                <img src={listing.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} alt="Property" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    listing.status === 'active' ? 'bg-green-100 text-green-700' :
                    listing.status === 'sold' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {listing.status}
                  </span>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                   <button 
                    onClick={() => handleEdit(listing)}
                    className="bg-white p-2 rounded-full shadow-lg text-gray-700 hover:text-brand-600"
                   >
                     <Edit2 className="w-4 h-4" />
                   </button>
                   <button 
                    onClick={() => {
                        if (confirm('Are you sure you want to delete this listing?')) {
                            onDelete(listing.id);
                        }
                    }}
                    className="bg-white p-2 rounded-full shadow-lg text-gray-700 hover:text-red-600"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{listing.price}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin className="w-3 h-3 mr-1" /> {listing.address}
                </div>
                
                <div className="flex gap-4 border-t border-gray-100 pt-4 mb-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600"><Bed className="w-4 h-4 text-gray-400" /> {listing.beds}</div>
                    <div className="flex items-center gap-1 text-sm text-gray-600"><Bath className="w-4 h-4 text-gray-400" /> {listing.baths}</div>
                    <div className="flex items-center gap-1 text-sm text-gray-600"><Square className="w-4 h-4 text-gray-400" /> {listing.sqft}</div>
                </div>

                <div className="mt-auto">
                    <button 
                        onClick={() => onCreatePost(listing)}
                        className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2 border border-gray-200"
                    >
                        <Wand2 className="w-4 h-4" /> Generate Social Post
                    </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListingsManager;
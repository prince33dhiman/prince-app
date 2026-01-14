import React from 'react';
import { SocialPost } from '../types';
import { 
  BarChart3, Calendar, CheckCircle2, Edit2, 
  Instagram, Facebook, Linkedin, Plus, Clock 
} from 'lucide-react';

interface Props {
  posts: SocialPost[];
  onCreateNew: () => void;
  onEdit: (post: SocialPost) => void;
}

const Dashboard: React.FC<Props> = ({ posts, onCreateNew, onEdit }) => {
  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
  const publishedCount = posts.filter(p => p.status === 'published').length;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Agent Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back. You have {scheduledCount} posts scheduled this week.</p>
        </div>
        <button 
            onClick={onCreateNew}
            className="flex items-center gap-2 bg-brand-600 text-white px-5 py-3 rounded-lg font-semibold shadow-lg hover:bg-brand-700 transition-all hover:-translate-y-0.5"
        >
            <Plus className="w-5 h-5" /> Create Post
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">Total Posts</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{posts.length}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                <BarChart3 className="w-6 h-6" />
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">Scheduled</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{scheduledCount}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-full text-purple-600">
                <Calendar className="w-6 h-6" />
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">Published</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{publishedCount}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-full text-green-600">
                <CheckCircle2 className="w-6 h-6" />
            </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-semibold text-gray-800">Recent & Scheduled Posts</h3>
            <button className="text-sm text-brand-600 hover:text-brand-800 font-medium">View Calendar</button>
        </div>
        
        {posts.length === 0 ? (
            <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Calendar className="w-8 h-8 text-gray-300" />
                </div>
                <p>No posts yet. Create your first listing post!</p>
            </div>
        ) : (
            <div className="divide-y divide-gray-100">
                {posts.map(post => (
                    <div key={post.id} className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors group">
                        <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-200">
                             <img src={post.propertyDetails.imageUrl} alt="Property" className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                {post.platforms.includes('instagram') && <Instagram className="w-4 h-4 text-purple-600" />}
                                {post.platforms.includes('facebook') && <Facebook className="w-4 h-4 text-blue-600" />}
                                {post.platforms.includes('linkedin') && <Linkedin className="w-4 h-4 text-blue-800" />}
                                <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
                                    {post.status}
                                </span>
                            </div>
                            <h4 className="font-medium text-gray-900 truncate">{post.propertyDetails.address}</h4>
                            <p className="text-sm text-gray-500 truncate">{post.content}</p>
                        </div>

                        <div className="flex flex-col items-end gap-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {post.scheduledDate ? new Date(post.scheduledDate).toLocaleDateString() : 'Published'}
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => onEdit(post)}
                            className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors"
                            title="Edit Post"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
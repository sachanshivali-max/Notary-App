import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Upload, CheckCircle } from 'lucide-react';

const Settings = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await api.put('/user/settings/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      updateUser(res.data); // Update context with new logoUrl
      setMessage('Logo updated successfully!');
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading logo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <span className="block text-sm font-medium text-gray-500">Name</span>
            <span className="block text-base text-gray-900">{user?.name}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Email</span>
            <span className="block text-base text-gray-900">{user?.email}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">Account Type</span>
            <span className="inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full bg-blue-50 text-blue-700">
              {user?.role === 'premium' ? 'Premium (Pro)' : 'Free (Standard)'}
            </span>
          </div>
        </div>
      </div>

      {user?.role === 'premium' ? (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl shadow-sm border border-amber-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-semibold text-amber-900">Custom Branding</h2>
              <p className="text-sm text-amber-700 mt-1">Upload your company logo to display on invoices.</p>
            </div>
            {user?.logoUrl && (
              <img 
                src={user.logoUrl.startsWith('data:') ? user.logoUrl : (user.logoUrl.startsWith('/') ? `http://localhost:5000${user.logoUrl}` : user.logoUrl)}
                alt="Current Logo" 
                className="h-12 object-contain bg-white p-1 rounded border border-amber-200"
                crossOrigin="anonymous"
              />
            )}
          </div>

          <form onSubmit={handleUpload}>
            {message && (
              <div className="mb-4 flex items-center text-green-700 bg-green-50 p-3 rounded-lg text-sm border border-green-200">
                <CheckCircle className="w-4 h-4 mr-2" />
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 text-red-700 bg-red-50 p-3 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              <label className="flex-1 flex flex-col items-center px-4 py-6 bg-white text-amber-600 rounded-xl tracking-wide border-2 border-amber-200 border-dashed cursor-pointer hover:bg-amber-50 hover:border-amber-400 transition-colors">
                <Upload className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">
                  {file ? file.name : 'Select a file'}
                </span>
                <input type='file' className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
              <button 
                type="submit"
                disabled={!file || loading}
                className="px-6 py-3 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50 shadow-sm"
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Custom Branding</h2>
          <p className="text-gray-500 mb-4 max-w-sm mx-auto">
            Upgrade to a premium account to upload your company logo and customize your invoices.
          </p>
        </div>
      )}
    </div>
  );
};

export default Settings;

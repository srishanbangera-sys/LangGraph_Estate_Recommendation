import React, { useState } from 'react';
import { Home, Plus, Edit3, Trash2, Eye, MessageSquare, CheckCircle, Clock, AlertCircle, ArrowLeft, Building, Tag, DollarSign, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SellerCMS({ properties = [], onAddProperty, onUpdatePropertyStatus, onBackToSearch }) {
  const { currentUser } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Listing Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Apartment');
  const [newBHK, setNewBHK] = useState(3);
  const [newPrice, setNewPrice] = useState(13500000);
  const [newArea, setNewArea] = useState('Kadri, Mangalore');
  const [newSqft, setNewSqft] = useState(1650);
  const [newAmenities, setNewAmenities] = useState('Power Backup, Swimming Pool, Security, Gym');

  // Scoped list: only properties owned/managed by this seller
  const [sellerListings, setSellerListings] = useState([
    {
      id: 'seller-prop-101',
      title: 'Ocean Crest Luxury 3 BHK',
      location: 'Kadri Hills, Mangalore',
      type: 'Apartment',
      bhk: 3,
      price: 14500000,
      priceFormatted: '₹1.45 Cr',
      sqft: '1,820 sqft',
      status: 'Available',
      views: 342,
      inquiriesCount: 4,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'seller-prop-102',
      title: 'Palm Grove Independent Villa',
      location: 'Bejai, Mangalore',
      type: 'Villa',
      bhk: 4,
      price: 28000000,
      priceFormatted: '₹2.80 Cr',
      sqft: '3,100 sqft',
      status: 'Under Offer',
      views: 618,
      inquiriesCount: 9,
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'seller-prop-103',
      title: 'Surathkal Seafront Apartment',
      location: 'Surathkal Beach Road, Mangalore',
      type: 'Apartment',
      bhk: 2,
      price: 32000,
      priceFormatted: '₹32,000/mo',
      sqft: '1,150 sqft',
      status: 'Available',
      views: 189,
      inquiriesCount: 3,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
    }
  ]);

  // Inquiries scoped to seller listings
  const [inquiries, setInquiries] = useState([
    {
      id: 'inq-1',
      buyerName: 'Dr. Arvind Rao',
      propertyTitle: 'Ocean Crest Luxury 3 BHK',
      message: 'Interested in site inspection this Saturday. Are price negotiations possible?',
      date: '2 hours ago',
      phone: '+91 98450 12345',
      status: 'New'
    },
    {
      id: 'inq-2',
      buyerName: 'Sneha Kamath',
      propertyTitle: 'Palm Grove Independent Villa',
      message: 'Has the loan pre-approval inspection completed for this villa?',
      date: 'Yesterday',
      phone: '+91 99001 67890',
      status: 'In Progress'
    }
  ]);

  const handleStatusChange = (id, newStatus) => {
    setSellerListings(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const handleCreateListing = (e) => {
    e.preventDefault();
    const created = {
      id: `seller-prop-${Date.now()}`,
      title: newTitle || 'Modern Residence',
      location: newArea,
      type: newType,
      bhk: Number(newBHK),
      price: Number(newPrice),
      priceFormatted: Number(newPrice) > 100000 
        ? `₹${(Number(newPrice) / 10000000).toFixed(2)} Cr` 
        : `₹${Number(newPrice).toLocaleString('en-IN')}/mo`,
      sqft: `${newSqft} sqft`,
      status: 'Available',
      views: 1,
      inquiriesCount: 0,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
    };

    setSellerListings(prev => [created, ...prev]);
    if (onAddProperty) onAddProperty(created);
    setIsAddModalOpen(false);
    setNewTitle('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden select-none">
      {/* Top Header */}
      <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-white/95 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToSearch}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>AI Concierge</span>
          </button>
          <div className="flex items-center space-x-2">
            <Home className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-slate-800">Seller CMS Portal</span>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200">
              Scoped Access
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-200"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Listing</span>
        </button>
      </div>

      {/* Main CMS Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Active Listings</span>
              <Building className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{sellerListings.length}</div>
            <span className="text-[10px] text-emerald-600 font-medium">● All properties verified</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Total Buyer Views</span>
              <Eye className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {sellerListings.reduce((acc, p) => acc + p.views, 0)}
            </div>
            <span className="text-[10px] text-indigo-600 font-medium">↑ +24% vs last week</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Direct Inquiries</span>
              <MessageSquare className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{inquiries.length}</div>
            <span className="text-[10px] text-amber-600 font-medium">2 pending response</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Portfolio Value</span>
              <DollarSign className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">₹4.57 Cr</div>
            <span className="text-[10px] text-slate-400 font-medium">Mangalore Zone</span>
          </div>
        </div>

        {/* Managed Listings Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800">My Uploaded Properties</h3>
            <span className="text-xs text-slate-400">Scoped to: {currentUser.name}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {sellerListings.map((prop) => (
              <div key={prop.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <img src={prop.image} alt={prop.title} className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-2xs" />
                  <div>
                    <div className="font-bold text-sm text-slate-900">{prop.title}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>📍 {prop.location}</span>
                      <span>•</span>
                      <span>{prop.bhk} BHK ({prop.sqft})</span>
                    </div>
                    <div className="text-xs font-extrabold text-emerald-600 mt-1">
                      {prop.priceFormatted}
                    </div>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center space-x-3 shrink-0">
                  <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                    {['Available', 'Under Offer', 'Sold'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(prop.id, st)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                          prop.status === st
                            ? st === 'Available'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : st === 'Under Offer'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium pl-2">
                    <Eye className="w-3.5 h-3.5" /> {prop.views}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inquiries / Leads Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Direct Buyer Inquiries</span>
            </h3>
            <span className="text-xs text-emerald-600 font-semibold">{inquiries.length} Active Leads</span>
          </div>

          <div className="divide-y divide-slate-100">
            {inquiries.map((inq) => (
              <div key={inq.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">{inq.buyerName}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold rounded-full">
                      for {inq.propertyTitle}
                    </span>
                    <span className="text-[10px] text-slate-400">{inq.date}</span>
                  </div>
                  <p className="text-xs text-slate-600">"{inq.message}"</p>
                  <div className="text-[11px] text-slate-400 font-medium">Contact: {inq.phone}</div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all">
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Listing Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">Upload New Property Listing</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Property Title</label>
                <input
                  type="text"
                  placeholder="e.g. Skyline Heights 3 BHK Villa"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Independent House">Independent House</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">BHK</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newBHK}
                    onChange={(e) => setNewBHK(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Area (sqft)</label>
                  <input
                    type="number"
                    value={newSqft}
                    onChange={(e) => setNewSqft(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Locality in Mangalore</label>
                <input
                  type="text"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Kadri, Bejai, Falnir, Urwa"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

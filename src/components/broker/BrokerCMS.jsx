import React, { useState } from 'react';
import { Building, ShieldCheck, CheckCircle2, XCircle, ArrowLeft, TrendingUp, MapPin, Award, AlertTriangle, Filter, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function BrokerCMS({ properties = [], onBackToSearch }) {
  const { currentUser } = useAuth();
  const [selectedSubZone, setSelectedSubZone] = useState('All');

  // Pending verification queue
  const [verificationQueue, setVerificationQueue] = useState([
    {
      id: 'verify-1',
      title: 'Hillside Haven 3 BHK Apartment',
      sellerName: 'Kavita Shenoy',
      location: 'Kadri, Mangalore',
      priceFormatted: '₹1.15 Cr',
      sqft: '1,540 sqft',
      submittedDate: 'Today, 9:30 AM',
      docsUploaded: ['Title Deed', 'Occupancy Certificate', 'Tax Receipts'],
      status: 'Pending'
    },
    {
      id: 'verify-2',
      title: 'Coastal Breeze 4 BHK Villa',
      sellerName: 'Ramesh Prabhu',
      location: 'Surathkal Beach, Mangalore',
      priceFormatted: '₹2.45 Cr',
      sqft: '2,900 sqft',
      submittedDate: 'Yesterday',
      docsUploaded: ['Title Deed', 'RERA Registration'],
      status: 'Pending'
    }
  ]);

  const [verifiedCount, setVerifiedCount] = useState(16);

  const handleApprove = (id) => {
    setVerificationQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'Verified' } : item));
    setVerifiedCount(c => c + 1);
  };

  const handleReject = (id) => {
    setVerificationQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'Needs Revision' } : item));
  };

  const subZones = [
    { name: 'Kadri', count: 6, avgSqft: '₹7,150', trend: '+8.4%' },
    { name: 'Bejai', count: 5, avgSqft: '₹6,800', trend: '+6.9%' },
    { name: 'Urwa', count: 4, avgSqft: '₹6,400', trend: '+5.2%' },
    { name: 'Falnir', count: 3, avgSqft: '₹7,900', trend: '+9.1%' },
    { name: 'Surathkal', count: 4, avgSqft: '₹5,600', trend: '+11.3%' }
  ];

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
            <span>AI Search</span>
          </button>
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-bold text-slate-800">Regional Broker Oversight</span>
            <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 font-bold rounded-full border border-amber-200">
              Zone Authority
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-800">Mangalore Coastal Zone</span>
          </div>
        </div>
      </div>

      {/* Main Broker Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Regional KPI Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Zone Inventory</span>
              <Building className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">22 Properties</div>
            <span className="text-[10px] text-amber-700 font-semibold">Kadri, Bejai, Surathkal, Falnir</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Broker Verified</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{verifiedCount} Verified</div>
            <span className="text-[10px] text-emerald-600 font-medium">89% Compliance Rate</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Verification Queue</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {verificationQueue.filter(q => q.status === 'Pending').length} Pending
            </div>
            <span className="text-[10px] text-rose-600 font-medium">Requires Broker Review</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Avg Rate / sqft</span>
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">₹6,850</div>
            <span className="text-[10px] text-indigo-600 font-medium">↑ +7.4% annual appreciation</span>
          </div>
        </div>

        {/* Verification Queue Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Seller Listing Verification Queue</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review legal documentation and grant verified badges for the Mangalore regional catalog.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {verificationQueue.map((item) => (
              <div key={item.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">{item.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      item.status === 'Verified'
                        ? 'bg-emerald-50 text-emerald-700'
                        : item.status === 'Needs Revision'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 flex flex-wrap gap-2">
                    <span>Seller: <strong className="text-slate-700">{item.sellerName}</strong></span>
                    <span>•</span>
                    <span>Locality: <strong>{item.location}</strong></span>
                    <span>•</span>
                    <span>Price: <strong className="text-indigo-600">{item.priceFormatted}</strong></span>
                    <span>•</span>
                    <span>Area: {item.sqft}</span>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-slate-400">Attached Documents:</span>
                    {item.docsUploaded.map((doc, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">
                        ✓ {doc}
                      </span>
                    ))}
                  </div>
                </div>

                {item.status === 'Pending' && (
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
                    >
                      Request Revision
                    </button>
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      <span>Verify & Publish</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mangalore Sub-Zone Pricing Intelligence */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-6">
          <h3 className="font-bold text-sm text-slate-900 mb-1">
            Mangalore Sub-Zone Market Heatmap
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Real-time average square footage rates and annual price growth across your regional oversight zone.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {subZones.map((z) => (
              <div key={z.name} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-800">{z.name}</span>
                  <span className="text-[10px] font-extrabold text-emerald-600">{z.trend}</span>
                </div>
                <div className="text-base font-extrabold text-slate-900">{z.avgSqft}</div>
                <div className="text-[10px] text-slate-400 mt-1">{z.count} active listings</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

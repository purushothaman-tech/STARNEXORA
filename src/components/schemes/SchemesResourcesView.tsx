import React, { useState } from 'react';
import { mockGovernmentSchemes } from '../../data/mockData';
import { GovernmentScheme } from '../../types';
import { BookOpen, DollarSign, Shield, Heart, Scale, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export const SchemesResourcesView: React.FC = () => {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>(mockGovernmentSchemes);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(mockGovernmentSchemes[0]);
  const [formGenerated, setFormGenerated] = useState<string | null>(null);

  const categories = ['all', 'Financial', 'Legal', 'Safety', 'Rehabilitation'];

  const filtered = schemes.filter(
    (s) => selectedCategory === 'all' || s.category === selectedCategory
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">Statutory Welfare Schemes &amp; Compensation</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official central and state statutory relief funds (SC/ST PoA, CVCF, Nirbhaya Fund, NALSA).
          </p>
        </div>

        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
          Statutory Entitlements Guaranteed by Law
        </span>
      </div>

      {/* Category Tabs (Matching Image 2 screen 7) */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl font-bold capitalize transition shrink-0 ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'All Resources & Schemes' : cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Schemes List & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Cards */}
        <div className="lg:col-span-7 space-y-3">
          {filtered.map((s) => {
            const isSelected = selectedScheme?.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedScheme(s)}
                className={`p-5 rounded-2xl border transition cursor-pointer text-xs space-y-2.5 ${
                  isSelected
                    ? 'bg-indigo-50/50 border-indigo-400 shadow-sm'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {s.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    s.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                    s.status === 'Applied' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {s.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{s.title}</h3>
                  <p className="text-slate-500 text-[11px] mt-0.5 font-medium">{s.authority}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-600">
                  <span className="font-extrabold text-indigo-700 text-xs">{s.benefitAmount}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{s.processingTime}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 5 Cols: Detail View & Application Process */}
        <div className="lg:col-span-5">
          {selectedScheme ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs text-xs space-y-4 sticky top-24">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded uppercase">
                  {selectedScheme.category} Scheme
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-2">
                  {selectedScheme.title}
                </h3>
                <p className="text-slate-500 mt-0.5 font-medium">{selectedScheme.authority}</p>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 space-y-1">
                <span className="font-extrabold text-[10px] uppercase tracking-wider text-emerald-700 block">
                  Mandatory Statutory Benefit
                </span>
                <p className="text-sm font-black text-emerald-800">{selectedScheme.benefitAmount}</p>
                <p className="text-[10px] text-emerald-700">{selectedScheme.processingTime}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                  Eligibility Criteria
                </h4>
                <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedScheme.eligibleCriteria}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                  Scheme Description &amp; Legal Provision
                </h4>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {selectedScheme.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    setFormGenerated(selectedScheme.id);
                    setTimeout(() => setFormGenerated(null), 4000);
                  }}
                  className={`w-full py-3 font-bold rounded-xl shadow-sm text-center transition ${
                    formGenerated === selectedScheme.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {formGenerated === selectedScheme.id
                    ? 'Application Pre-filled & Ready for Submission'
                    : 'Generate Direct Application Form'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-xs">
              Select a scheme on the left to review legal entitlement.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

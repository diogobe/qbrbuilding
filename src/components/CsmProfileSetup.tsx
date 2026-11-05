import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Mail, Briefcase, Building2, Palette, ShieldCheck, Check, Globe } from 'lucide-react';

interface CsmProfileSetupProps {
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
  onClose?: () => void;
}

export const CsmProfileSetup: React.FC<CsmProfileSetupProps> = ({ profile, onSave, onClose }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      if (onClose) onClose();
    }, 1500);
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, brandPrimaryColor: color }));
  };

  const colors = [
    { name: 'Indigo', value: '#2563EB' },
    { name: 'Teal', value: '#0D9488' },
    { name: 'Slate', value: '#475569' },
    { name: 'Emerald', value: '#059669' },
    { name: 'Violet', value: '#7C3AED' },
    { name: 'Rose', value: '#E11D48' },
  ];

  return (
    <div id="csm-profile-setup" className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-w-lg w-full mx-auto">
      <div className="bg-slate-900 px-6 py-5 text-white flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold font-display tracking-tight">CSM Professional Identity</h3>
          <p className="text-slate-400 text-xs mt-0.5">Define your personal signature and brand assets</p>
        </div>
        <ShieldCheck className="h-6 w-6 text-blue-500" />
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="h-4 w-4" />
            </span>
            <input
              type="text"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Sarah Chen"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Job Title</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                value={formData.jobTitle}
                onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="e.g. Director of Customer Success"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Corporate Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. sarah.chen@company.com"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Building2 className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Acme Tech Solutions"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">LinkedIn Profile URL</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Globe className="h-4 w-4" />
              </span>
              <input
                type="url"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                value={formData.linkedinUrl || ''}
                onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="e.g. https://linkedin.com/in/username"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Brand Signature Assets</label>
          <div className="space-y-3">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block mb-1.5">Company Logo Image (URL)</span>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition"
                value={formData.companyLogoUrl}
                onChange={e => setFormData({ ...formData, companyLogoUrl: e.target.value })}
                placeholder="URL to your brand logo"
              />
            </div>
            <div className="flex gap-4 items-center">
              <img 
                src={formData.companyLogoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"}
                alt="Brand logo preview" 
                className="h-10 w-10 object-cover rounded-lg border border-slate-200 bg-slate-50"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80";
                }}
              />
              <span className="text-xs text-slate-500 italic">This logo will automatically brand your executive reports.</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Executive Accent Color</label>
          <div className="flex flex-wrap gap-2.5">
            {colors.map(color => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleColorChange(color.value)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition active:scale-95 cursor-pointer"
                style={{
                  borderColor: formData.brandPrimaryColor === color.value ? color.value : '#cbd5e1',
                  backgroundColor: formData.brandPrimaryColor === color.value ? `${color.value}15` : 'transparent',
                  color: formData.brandPrimaryColor === color.value ? color.value : '#475569',
                }}
              >
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: color.value }}></span>
                {color.name}
                {formData.brandPrimaryColor === color.value && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition active:scale-95"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition active:scale-95 flex items-center gap-2 cursor-pointer"
            style={{ backgroundColor: formData.brandPrimaryColor }}
          >
            {isSaved ? 'Saving System Profile...' : 'Save and Persist Identity'}
          </button>
        </div>
      </form>
    </div>
  );
};

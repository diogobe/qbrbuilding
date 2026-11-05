import React, { useState } from 'react';
import { Account, MotionType, AccountTier } from '../types';
import { Plus, Building2, TrendingUp, ShieldAlert, BadgePercent, ShieldCheck, ArrowRight, Trash2, Shield, Calendar, Users, DollarSign, Activity } from 'lucide-react';

interface BookOfBusinessProps {
  accounts: Account[];
  onSelectAccount: (accountId: string) => void;
  onAddAccount: (account: Account) => void;
  onDeleteAccount: (accountId: string) => void;
  activeAccountId: string | null;
}

export const BookOfBusiness: React.FC<BookOfBusinessProps> = ({
  accounts,
  onSelectAccount,
  onAddAccount,
  onDeleteAccount,
  activeAccountId,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newArr, setNewArr] = useState('150000');
  const [newTier, setNewTier] = useState<AccountTier>('Enterprise');
  const [newBusinessUnit, setNewBusinessUnit] = useState('Global Operations');
  const [newRenewalDate, setNewRenewalDate] = useState('2027-06-30');
  const [newHealth, setNewHealth] = useState('80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim()) return;

    const added: Account = {
      id: `acc-${Date.now()}`,
      companyName: newCompany,
      industry: newIndustry || 'Technology Services',
      contractStartDate: new Date().toISOString().split('T')[0],
      contractRenewalDate: newRenewalDate,
      annualRecurringRevenue: parseFloat(newArr) || 100000,
      accountTier: newTier,
      businessUnit: newBusinessUnit,
      healthScore: parseInt(newHealth) || 80
    };

    onAddAccount(added);
    // Reset
    setNewCompany('');
    setNewIndustry('');
    setNewArr('150000');
    setNewTier('Enterprise');
    setNewBusinessUnit('Global Operations');
    setNewRenewalDate('2027-06-30');
    setNewHealth('80');
    setShowAddForm(false);
  };

  // KPI Calculations
  const totalARR = accounts.reduce((acc, curr) => acc + curr.annualRecurringRevenue, 0);
  const averageHealth = accounts.length > 0 
    ? Math.round(accounts.reduce((acc, curr) => acc + curr.healthScore, 0) / accounts.length) 
    : 0;
  
  const strategicCount = accounts.filter(a => a.accountTier === 'Strategic').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Upper Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Book of Business Value</span>
            <h4 className="text-2xl font-bold font-display text-slate-900 mt-1">
              ${totalARR.toLocaleString('en-US')}
            </h4>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              Active Contractual Revenue
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Portfolio Average Health</span>
            <h4 className="text-2xl font-bold font-display text-slate-900 mt-1">
              {averageHealth}%
            </h4>
            <span className={`text-[10px] font-semibold flex items-center gap-1 mt-1 ${averageHealth > 75 ? 'text-emerald-600' : 'text-amber-500'}`}>
              {averageHealth > 75 ? 'Optimal Status' : 'Needs Engagement'}
            </span>
          </div>
          <div className={`p-3 rounded-xl ${averageHealth > 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-500'}`}>
            <Activity className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Strategic Accounts</span>
            <h4 className="text-2xl font-bold font-display text-slate-900 mt-1">
              {strategicCount}
            </h4>
            <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1 mt-1">
              High-Touch Advisory Tier
            </span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Shield className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Active Accounts Count</span>
            <h4 className="text-2xl font-bold font-display text-slate-900 mt-1">
              {accounts.length}
            </h4>
            <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mt-1">
              SaaS Operational Units
            </span>
          </div>
          <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
            <Building2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Account Control Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-950">Customer Accounts</h2>
          <p className="text-slate-500 text-xs">Select or add accounts to define objectives and launch executive reports</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          {showAddForm ? 'Close Intake Form' : 'Register New Account'}
        </button>
      </div>

      {/* Slide down Add Account Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md grid grid-cols-1 md:grid-cols-3 gap-5 animate-slide-down">
          <div className="md:col-span-3 pb-3 border-b border-slate-100 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" /> Account Intake Registry
            </span>
            <span className="text-[10px] text-slate-400">Fills initial state with structural schema</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Company Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition"
              value={newCompany}
              onChange={e => setNewCompany(e.target.value)}
              placeholder="e.g. Apex Security Group"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Industry Sector</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition"
              value={newIndustry}
              onChange={e => setNewIndustry(e.target.value)}
              placeholder="e.g. Logistics & Supply Chain"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Account Tier</label>
            <select
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition"
              value={newTier}
              onChange={e => setNewTier(e.target.value as AccountTier)}
            >
              <option value="Strategic">Strategic (High-Touch)</option>
              <option value="Enterprise">Enterprise (Standard)</option>
              <option value="Mid-Market">Mid-Market (Tech-Touch)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Business Unit / Department Context</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition"
              value={newBusinessUnit}
              onChange={e => setNewBusinessUnit(e.target.value)}
              placeholder="e.g. Cloud Security Team"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Annual Recurring Revenue (ARR)</label>
            <input
              type="number"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition"
              value={newArr}
              onChange={e => setNewArr(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Renewal Target Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition"
              value={newRenewalDate}
              onChange={e => setNewRenewalDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Relationship Health (1-100)</label>
            <div className="flex gap-3 items-center">
              <input
                type="range"
                min="1"
                max="100"
                className="flex-1 accent-blue-600"
                value={newHealth}
                onChange={e => setNewHealth(e.target.value)}
              />
              <span className="text-xs font-bold text-slate-700 w-8 text-right">{newHealth}%</span>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/15 transition cursor-pointer"
            >
              Add Active Account
            </button>
          </div>
        </form>
      )}

      {/* Grid of existing Accounts */}
      {accounts.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center flex flex-col items-center max-w-lg mx-auto">
          <Building2 className="h-12 w-12 text-slate-300 mb-4" />
          <h4 className="text-base font-bold text-slate-800">No active accounts in portfolio</h4>
          <p className="text-slate-500 text-xs mt-1">Add your first client account above using our guided schema generator.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map(acc => {
            const isSelected = activeAccountId === acc.id;
            
            // Health Styling
            let healthColor = 'text-slate-600 bg-slate-100';
            if (acc.healthScore >= 80) healthColor = 'text-emerald-700 bg-emerald-50 border-emerald-100';
            else if (acc.healthScore >= 60) healthColor = 'text-amber-700 bg-amber-50 border-amber-100';
            else healthColor = 'text-rose-700 bg-rose-50 border-rose-100';

            return (
              <div
                key={acc.id}
                className={`bg-white rounded-2xl border transition duration-300 flex flex-col justify-between ${
                  isSelected 
                    ? 'border-blue-600 ring-2 ring-blue-500/10 shadow-lg' 
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="p-6">
                  {/* Card Header */}
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-600 inline-block mb-1">
                        {acc.accountTier}
                      </span>
                      <h4 className="font-bold text-slate-900 font-display text-base leading-snug">{acc.companyName}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{acc.industry}</p>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${healthColor}`}>
                      {acc.healthScore}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 italic mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-600 not-italic block text-[10px] uppercase tracking-wider mb-0.5">Focus Context</span>
                    {acc.businessUnit}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-[11px]">
                    <div>
                      <span className="text-slate-400 font-medium block">Annual Value</span>
                      <span className="font-bold text-slate-800">${acc.annualRecurringRevenue.toLocaleString()} ARR</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Renewal Target</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {new Date(acc.contractRenewalDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 rounded-b-2xl border-t border-slate-100 flex justify-between items-center">
                  <button
                    onClick={() => onDeleteAccount(acc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Account"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onSelectAccount(acc.id)}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 hover:bg-blue-600 hover:border-blue-600 hover:text-white rounded-lg text-xs font-bold text-slate-700 transition active:scale-95 cursor-pointer shadow-xs"
                  >
                    {isSelected ? 'Configure Report' : 'Select Portfolio Unit'}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

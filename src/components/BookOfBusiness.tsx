import React, { useState, useMemo } from 'react';
import { Account, CustomerCompany, AccountTier } from '../types';
import { 
  Plus, 
  Building2, 
  TrendingUp, 
  ShieldAlert, 
  ArrowRight, 
  Trash2, 
  Shield, 
  Calendar, 
  DollarSign, 
  Activity, 
  AlertTriangle, 
  Layers, 
  ChevronRight,
  FolderPlus,
  CheckCircle2
} from 'lucide-react';

interface BookOfBusinessProps {
  companies: CustomerCompany[];
  accounts: Account[];
  onSelectAccount: (accountId: string) => void;
  onAddAccount: (account: Account, newCompany?: CustomerCompany) => void;
  onDeleteAccount: (accountId: string) => void;
  activeAccountId: string | null;
}

export const BookOfBusiness: React.FC<BookOfBusinessProps> = ({
  companies,
  accounts,
  onSelectAccount,
  onAddAccount,
  onDeleteAccount,
  activeAccountId,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [companyMode, setCompanyMode] = useState<'existing' | 'new'>(() => companies.length > 0 ? 'existing' : 'new');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(() => companies[0]?.id || '');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newTier, setNewTier] = useState<AccountTier>('Enterprise');
  const [newBusinessUnit, setNewBusinessUnit] = useState('Global Operations');
  const [newRenewalDate, setNewRenewalDate] = useState('2027-06-30');
  const [hasArr, setHasArr] = useState(true);
  const [newArr, setNewArr] = useState('150000');
  const [hasHealth, setHasHealth] = useState(true);
  const [newHealth, setNewHealth] = useState('80');

  // Explicit duplicate company detection (trimmed, case-insensitive)
  const duplicateMatch = useMemo(() => {
    if (companyMode !== 'new' || !newCompanyName.trim()) return null;
    const clean = newCompanyName.trim().toLowerCase();
    return companies.find(c => c.name.trim().toLowerCase() === clean) || null;
  }, [companyMode, newCompanyName, companies]);

  // Open add project pre-linked to an existing company
  const handleOpenAddForCompany = (companyId: string) => {
    setCompanyMode('existing');
    setSelectedCompanyId(companyId);
    setNewBusinessUnit('New Initiative');
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Block submission if a duplicate company name is entered in 'new' mode
    if (companyMode === 'new' && duplicateMatch) {
      return;
    }

    let targetCompanyId = selectedCompanyId;
    let createdCompany: CustomerCompany | undefined = undefined;

    if (companyMode === 'new') {
      if (!newCompanyName.trim()) return;
      createdCompany = {
        id: `comp-${Date.now()}`,
        name: newCompanyName.trim(),
        industry: newIndustry.trim() || 'Technology Services',
        tier: newTier,
        createdAt: new Date().toISOString()
      };
      targetCompanyId = createdCompany.id;
    } else {
      if (!targetCompanyId && companies.length > 0) {
        targetCompanyId = companies[0].id;
      }
    }

    const matchedCompany = createdCompany || companies.find(c => c.id === targetCompanyId);

    const added: Account = {
      id: `acc-${Date.now()}`,
      companyId: targetCompanyId,
      companyName: matchedCompany?.name || 'Unassigned',
      industry: matchedCompany?.industry || newIndustry || 'Technology Services',
      contractStartDate: new Date().toISOString().split('T')[0],
      contractRenewalDate: newRenewalDate ? newRenewalDate : '',
      annualRecurringRevenue: hasArr && newArr.trim() ? parseFloat(newArr) : undefined,
      accountTier: matchedCompany?.tier || newTier,
      businessUnit: newBusinessUnit.trim() || 'General Operations',
      healthScore: hasHealth && newHealth.trim() ? parseInt(newHealth) : undefined
    };

    onAddAccount(added, createdCompany);

    // Reset Form
    setNewCompanyName('');
    setNewIndustry('');
    setNewArr('150000');
    setHasArr(true);
    setNewHealth('80');
    setHasHealth(true);
    setNewTier('Enterprise');
    setNewBusinessUnit('Global Operations');
    setNewRenewalDate('2027-06-30');
    setShowAddForm(false);
  };

  // KPI Calculations (Safely handling undefined data without substituting 0)
  const totalARR = accounts.reduce((acc, curr) => {
    return acc + (typeof curr.annualRecurringRevenue === 'number' && !isNaN(curr.annualRecurringRevenue) ? curr.annualRecurringRevenue : 0);
  }, 0);

  const accountsWithHealth = accounts.filter(a => typeof a.healthScore === 'number' && !isNaN(a.healthScore));
  const averageHealthDisplay = accountsWithHealth.length > 0
    ? `${Math.round(accountsWithHealth.reduce((sum, a) => sum + (a.healthScore as number), 0) / accountsWithHealth.length)}%`
    : '—';

  const strategicCount = accounts.filter(a => a.accountTier === 'Strategic').length;

  // Strict grouping by companyId (Mandatory adjustment 1)
  const companyGroups = useMemo(() => {
    return companies.map(company => {
      const companyAccounts = accounts.filter(a => a.companyId === company.id);
      const companyArr = companyAccounts.reduce((sum, a) => {
        return sum + (typeof a.annualRecurringRevenue === 'number' && !isNaN(a.annualRecurringRevenue) ? a.annualRecurringRevenue : 0);
      }, 0);
      const hasAnyArr = companyAccounts.some(a => typeof a.annualRecurringRevenue === 'number' && !isNaN(a.annualRecurringRevenue));

      return {
        company,
        accounts: companyAccounts,
        totalArr: companyArr,
        hasAnyArr
      };
    });
  }, [companies, accounts]);

  // Orphaned accounts with invalid or missing companyId (Mandatory adjustment 1)
  const orphanedAccounts = useMemo(() => {
    const validCompanyIds = new Set(companies.map(c => c.id));
    return accounts.filter(a => !a.companyId || !validCompanyIds.has(a.companyId));
  }, [companies, accounts]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Upper Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Portfolio Value</span>
            <h4 className="text-2xl font-bold font-display text-slate-900 mt-1">
              ${totalARR.toLocaleString('en-US')}
            </h4>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              Active Contract ARR
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Portfolio Average Health</span>
            <h4 className="text-2xl font-bold font-display text-slate-900 mt-1">
              {averageHealthDisplay}
            </h4>
            <span className={`text-[10px] font-semibold flex items-center gap-1 mt-1 ${averageHealthDisplay !== '—' && parseInt(averageHealthDisplay) > 75 ? 'text-emerald-600' : 'text-slate-500'}`}>
              {averageHealthDisplay !== '—' && parseInt(averageHealthDisplay) > 75 ? 'Optimal Status' : 'Across Verified Projects'}
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Activity className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Customer Companies</span>
            <h4 className="text-2xl font-bold font-display text-slate-900 mt-1">
              {companies.length}
            </h4>
            <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1 mt-1">
              {strategicCount} Strategic Tier
            </span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Building2 className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Active Accounts / Projects</span>
            <h4 className="text-2xl font-bold font-display text-slate-900 mt-1">
              {accounts.length}
            </h4>
            <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mt-1">
              Business Unit Units
            </span>
          </div>
          <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
            <Layers className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* 2. Controls & Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-950">Enterprise Client Portfolio</h2>
          <p className="text-slate-500 text-xs">Customer companies and their associated business unit accounts and contracts</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (companies.length > 0) setCompanyMode('existing');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition shadow-xs active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          {showAddForm ? 'Close Intake Form' : 'Add Account / Project'}
        </button>
      </div>

      {/* 3. Account Intake Form (with Duplicate Company Prevention) */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md grid grid-cols-1 md:grid-cols-3 gap-5 animate-slide-down">
          <div className="md:col-span-3 pb-3 border-b border-slate-100 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" /> Account & Project Intake
            </span>
            <span className="text-[10px] text-slate-400">Links a project to an existing company or establishes a new client</span>
          </div>

          {/* Company Selection Mode Toggle */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-600 mb-2">Customer Company Selection</label>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={companies.length === 0}
                onClick={() => setCompanyMode('existing')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                  companyMode === 'existing' 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                Existing Company ({companies.length})
              </button>
              <button
                type="button"
                onClick={() => setCompanyMode('new')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                  companyMode === 'new' 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                + Register New Customer Company
              </button>
            </div>
          </div>

          {/* Conditional Company Selector / Creator */}
          {companyMode === 'existing' ? (
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Select Customer Company</label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition"
                value={selectedCompanyId}
                onChange={e => setSelectedCompanyId(e.target.value)}
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.industry} · {c.tier})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">New Company Legal Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  value={newCompanyName}
                  onChange={e => setNewCompanyName(e.target.value)}
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
                  placeholder="e.g. Cloud Infrastructure"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Company Tier</label>
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

              {/* Duplicate Company Detection Warning (Mandatory Adjustment 4) */}
              {duplicateMatch && (
                <div className="md:col-span-3 bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-center justify-between text-xs text-amber-900">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>
                      A company named <strong>&quot;{duplicateMatch.name}&quot;</strong> already exists in your portfolio.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCompanyMode('existing');
                      setSelectedCompanyId(duplicateMatch.id);
                      setNewCompanyName('');
                    }}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] transition shrink-0 cursor-pointer"
                  >
                    Select Existing Company
                  </button>
                </div>
              )}
            </>
          )}

          {/* Project Details */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Project / Business Unit Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition"
              value={newBusinessUnit}
              onChange={e => setNewBusinessUnit(e.target.value)}
              placeholder="e.g. Global Threat Intelligence Ops"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-600">Annual Contract ARR ($)</label>
              <button
                type="button"
                onClick={() => setHasArr(!hasArr)}
                className="text-[10px] text-blue-600 hover:underline cursor-pointer"
              >
                {hasArr ? 'Mark Unknown' : 'Provide Value'}
              </button>
            </div>
            {hasArr ? (
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition"
                value={newArr}
                onChange={e => setNewArr(e.target.value)}
                placeholder="e.g. 150000"
              />
            ) : (
              <div className="w-full px-3 py-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 text-slate-400 text-xs italic">
                Value marked as unknown (will display as &quot;—&quot;)
              </div>
            )}
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
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-600">Health Index (1-100)</label>
              <button
                type="button"
                onClick={() => setHasHealth(!hasHealth)}
                className="text-[10px] text-blue-600 hover:underline cursor-pointer"
              >
                {hasHealth ? 'Mark Unknown' : 'Provide Score'}
              </button>
            </div>
            {hasHealth ? (
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
            ) : (
              <div className="w-full px-3 py-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 text-slate-400 text-xs italic">
                Health unmeasured (will display as &quot;—&quot;)
              </div>
            )}
          </div>

          <div className="md:col-span-3 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={companyMode === 'new' && !!duplicateMatch}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              Add Project to Portfolio
            </button>
          </div>
        </form>
      )}

      {/* 4. Company Grouping View (Grouped strictly by companyId) */}
      {companies.length === 0 && accounts.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center flex flex-col items-center max-w-lg mx-auto">
          <Building2 className="h-12 w-12 text-slate-300 mb-4" />
          <h4 className="text-base font-bold text-slate-800">No active accounts in portfolio</h4>
          <p className="text-slate-500 text-xs mt-1">Register your first customer company above to initialize your account workspace.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {companyGroups.map(({ company, accounts: companyAccounts, totalArr, hasAnyArr }) => {
            return (
              <div 
                key={company.id}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs transition hover:border-slate-300"
              >
                {/* Company Group Header */}
                <div className="p-6 bg-slate-50/70 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-extrabold shadow-2xs shrink-0">
                      <Building2 className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold font-display text-slate-900 text-base">{company.name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 uppercase tracking-wider">
                          {company.tier}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>{company.industry}</span>
                        <span aria-hidden="true">·</span>
                        <span>{companyAccounts.length} {companyAccounts.length === 1 ? 'Project' : 'Projects'}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-slate-700">
                          {hasAnyArr ? `$${totalArr.toLocaleString('en-US')} Total ARR` : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleOpenAddForCompany(company.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition shadow-2xs cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Project
                    </button>
                  </div>
                </div>

                {/* Company Projects Grid */}
                <div className="p-6">
                  {companyAccounts.length === 0 ? (
                    /* Empty State for Company with Zero Accounts (Mandatory Adjustment 2) */
                    <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center">
                      <FolderPlus className="h-8 w-8 text-slate-300 mb-2" />
                      <p className="text-xs font-semibold text-slate-600">No active projects under this company</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Company records are preserved. Register an account project to begin governance.</p>
                      <button
                        onClick={() => handleOpenAddForCompany(company.id)}
                        className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        + Add first project to {company.name}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {companyAccounts.map(acc => {
                        const isSelected = activeAccountId === acc.id;

                        // Health Styling (Standardized missing value display: "—" when undefined)
                        const hasHealthVal = typeof acc.healthScore === 'number' && !isNaN(acc.healthScore);
                        let healthColor = 'text-slate-500 bg-slate-100 border-slate-200';
                        if (hasHealthVal) {
                          if ((acc.healthScore as number) >= 80) healthColor = 'text-emerald-700 bg-emerald-50 border-emerald-100';
                          else if ((acc.healthScore as number) >= 60) healthColor = 'text-amber-700 bg-amber-50 border-amber-100';
                          else healthColor = 'text-rose-700 bg-rose-50 border-rose-100';
                        }

                        // ARR Display (Standardized missing value display: "—" when undefined)
                        const hasArrVal = typeof acc.annualRecurringRevenue === 'number' && !isNaN(acc.annualRecurringRevenue);
                        const arrDisplay = hasArrVal ? `$${(acc.annualRecurringRevenue as number).toLocaleString()} ARR` : '—';

                        // Renewal Date Display
                        const renewalDisplay = acc.contractRenewalDate && !isNaN(new Date(acc.contractRenewalDate).getTime())
                          ? new Date(acc.contractRenewalDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                          : '—';

                        return (
                          <div
                            key={acc.id}
                            className={`bg-white rounded-xl border transition flex flex-col justify-between ${
                              isSelected 
                                ? 'border-blue-600 ring-2 ring-blue-500/10 shadow-md' 
                                : 'border-slate-200/90 hover:border-slate-300 hover:shadow-2xs'
                            }`}
                          >
                            <div className="p-5">
                              {/* Card Header */}
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <div className="min-w-0 flex-1">
                                  <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 inline-block mb-1">
                                    Project Unit
                                  </span>
                                  <h4 className="font-bold text-slate-900 text-sm leading-snug truncate" title={acc.businessUnit}>
                                    {acc.businessUnit}
                                  </h4>
                                </div>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${healthColor}`}>
                                  {hasHealthVal ? `${acc.healthScore}%` : '—'}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-[11px]">
                                <div>
                                  <span className="text-slate-400 font-medium block text-[10px]">Annual Value</span>
                                  <span className="font-bold text-slate-800">{arrDisplay}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 font-medium block text-[10px]">Renewal Target</span>
                                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                                    {renewalDisplay}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="px-5 py-3 bg-slate-50/80 rounded-b-xl border-t border-slate-100 flex justify-between items-center">
                              <button
                                onClick={() => onDeleteAccount(acc.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Delete Project"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>

                              <button
                                onClick={() => onSelectAccount(acc.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:bg-blue-600 hover:border-blue-600 hover:text-white rounded-lg text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs"
                              >
                                {isSelected ? 'Configure Report' : 'Select Project'}
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* 5. Orphaned Accounts Group (Mandatory Adjustment 1) */}
          {orphanedAccounts.length > 0 && (
            <div className="bg-amber-50/40 border border-amber-300 rounded-2xl overflow-hidden shadow-xs">
              <div className="p-5 bg-amber-100/60 border-b border-amber-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0" />
                  <div>
                    <h3 className="font-bold font-display text-amber-950 text-sm">
                      Unlinked accounts — migration review required ({orphanedAccounts.length})
                    </h3>
                    <p className="text-xs text-amber-800 mt-0.5">
                      These accounts do not reference an active CustomerCompany ID. They are isolated here until linked to a valid parent company.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {orphanedAccounts.map(acc => {
                  const isSelected = activeAccountId === acc.id;
                  const hasHealthVal = typeof acc.healthScore === 'number' && !isNaN(acc.healthScore);
                  const hasArrVal = typeof acc.annualRecurringRevenue === 'number' && !isNaN(acc.annualRecurringRevenue);

                  return (
                    <div
                      key={acc.id}
                      className="bg-white rounded-xl border border-amber-200 p-5 shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 inline-block mb-1">
                              Legacy Unlinked
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm">{acc.companyName || 'Untitled'}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{acc.businessUnit}</p>
                          </div>
                          <span className="text-xs font-bold text-slate-500">
                            {hasHealthVal ? `${acc.healthScore}%` : '—'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-[11px]">
                          <div>
                            <span className="text-slate-400 font-medium block text-[10px]">ARR</span>
                            <span className="font-bold text-slate-800">
                              {hasArrVal ? `$${(acc.annualRecurringRevenue as number).toLocaleString()}` : '—'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium block text-[10px]">Renewal</span>
                            <span className="font-semibold text-slate-800">
                              {acc.contractRenewalDate || '—'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                        <button
                          onClick={() => onDeleteAccount(acc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                          title="Delete Account"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectAccount(acc.id)}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition"
                        >
                          {isSelected ? 'Configure Report' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

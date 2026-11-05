import React, { useState, useEffect } from 'react';
import { getInitialState, saveStateToLocalStorage } from './sampleData';
import { UserProfile, Account, PrimaryObjective, Stakeholder, SuccessMilestone, ReportType } from './types';
import { BookOfBusiness } from './components/BookOfBusiness';
import { IntakeFlow } from './components/IntakeFlow';
import { ReportPreview } from './components/ReportPreview';
import { CsmProfileSetup } from './components/CsmProfileSetup';
import { 
  Building2, 
  Settings, 
  HelpCircle, 
  ChevronRight, 
  LayoutDashboard, 
  FileEdit, 
  User, 
  Sparkles, 
  Menu, 
  LogOut, 
  Compass, 
  TrendingUp, 
  Briefcase, 
  ArrowLeft,
  RefreshCw,
  Award
} from 'lucide-react';

export default function App() {
  // Load initial state
  const initialState = getInitialState();

  const [profile, setProfile] = useState<UserProfile>(initialState.profile);
  const [accounts, setAccounts] = useState<Account[]>(initialState.accounts);
  const [objectives, setObjectives] = useState<PrimaryObjective[]>(initialState.objectives);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(initialState.stakeholders);
  const [milestones, setMilestones] = useState<SuccessMilestone[]>(initialState.milestones);

  // App UI State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'builder'>('dashboard');
  const [activeAccountId, setActiveAccountId] = useState<string | null>(() => {
    return localStorage.getItem('impactstream_active_account_id');
  });
  const [reportType, setReportType] = useState<ReportType>(() => {
    const saved = localStorage.getItem('impactstream_report_type');
    return (saved as ReportType) || 'EBR';
  });
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  // Sync state to localstorage when anything changes
  useEffect(() => {
    saveStateToLocalStorage({
      profile,
      accounts,
      objectives,
      stakeholders,
      milestones
    });
  }, [profile, accounts, objectives, stakeholders, milestones]);

  useEffect(() => {
    if (activeAccountId) {
      localStorage.setItem('impactstream_active_account_id', activeAccountId);
    } else {
      localStorage.removeItem('impactstream_active_account_id');
    }
  }, [activeAccountId]);

  useEffect(() => {
    localStorage.setItem('impactstream_report_type', reportType);
  }, [reportType]);

  // Find active context
  const activeAccount = activeAccountId ? accounts.find(a => a.id === activeAccountId) : undefined;
  const activeObjective = (activeAccount ? objectives.find(o => o.accountId === activeAccount.id) : undefined) || {
    id: `obj-${Date.now()}`,
    accountId: activeAccount?.id || '',
    statement: "Define custom primary business outcome aligned with customer's executive board...",
    focusType: "Growth" as const,
    metricName: "Operational Metric",
    baselineValue: "10",
    currentValue: "15",
    targetValue: "30",
    unit: "%",
    estimatedRoiImpact: "$0.00 Saved",
    roiNumericImpact: 0,
    nextSteps: "Schedule preliminary technical design review."
  };

  // State handlers
  const handleSelectAccount = (id: string) => {
    setActiveAccountId(id);
    setActiveTab('builder'); // Transition automatically for clean user flow
  };

  const handleAddAccount = (newAcc: Account) => {
    setAccounts(prev => [...prev, newAcc]);
    
    // Auto-create matching empty objective schema so the live builder has instant backing state
    const defaultObj: PrimaryObjective = {
      id: `obj-${Date.now()}`,
      accountId: newAcc.id,
      statement: `Accelerate adoption of strategic automation platform to reduce processing latency by 30% inside the ${newAcc.businessUnit}.`,
      focusType: "Retention",
      metricName: "Adoption SLA Index",
      baselineValue: "0",
      currentValue: "0",
      targetValue: "100",
      unit: "%",
      estimatedRoiImpact: "$120,000 Annual Team Capacity Value",
      roiNumericImpact: 120000,
      nextSteps: "Register stakeholders and schedule platform audit."
    };
    setObjectives(prev => [...prev, defaultObj]);
    setActiveAccountId(newAcc.id);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    if (activeAccountId === id) {
      setActiveAccountId(null);
    }
  };

  const handleUpdateAccount = (updated: Account) => {
    setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const handleUpdateObjective = (updated: PrimaryObjective) => {
    setObjectives(prev => {
      const exists = prev.some(o => o.accountId === updated.accountId);
      if (exists) {
        return prev.map(o => o.accountId === updated.accountId ? updated : o);
      } else {
        return [...prev, updated];
      }
    });
  };

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Reset layout to defaults to help user test with original mock structures
  const handleExecuteReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      
      {/* 1. Left Global Sidebar Panel */}
      <aside className="w-64 bg-slate-950 text-slate-400 flex flex-col justify-between border-r border-slate-900 select-none shrink-0 z-20">
        
        {/* Top Header Logo */}
        <div>
          <div className="p-6 pb-4 border-b border-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-extrabold shadow-md animate-pulse"
                style={{ backgroundColor: profile.brandPrimaryColor }}
              >
                IS
              </div>
              <div>
                <span className="text-white font-black tracking-tight text-md block font-display">ImpactStream</span>
                <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase block mt-0.5">Enterprise v2.1</span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 mt-4">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setShowProfileSetup(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                activeTab === 'dashboard' && !showProfileSetup
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'hover:bg-slate-900/50 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="h-4.5 w-4.5" />
              Book of Business
            </button>

            <button
              onClick={() => {
                setActiveTab('builder');
                setShowProfileSetup(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                activeTab === 'builder' && !showProfileSetup
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'hover:bg-slate-900/50 hover:text-slate-200'
              }`}
            >
              <FileEdit className="h-4.5 w-4.5" />
              Report Engine Workspace
            </button>

            <button
              onClick={() => setShowProfileSetup(true)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                showProfileSetup
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'hover:bg-slate-900/50 hover:text-slate-200'
              }`}
            >
              <Settings className="h-4.5 w-4.5" />
              CSM System Settings
            </button>
          </nav>
        </div>

        {/* System Reset / Diagnostic Block */}
        <div className="px-4 py-2 border-t border-slate-900/40">
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition text-left cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Initial Defaults
            </button>
          ) : (
            <div className="bg-rose-950/40 border border-rose-900/60 p-2.5 rounded-lg space-y-2">
              <p className="text-[10px] text-rose-300 font-semibold leading-tight">
                Reset all records to sample defaults?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleExecuteReset}
                  className="flex-1 px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-bold transition cursor-pointer text-center"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Persistent CSM profile identity */}
        <div className="p-4 border-t border-slate-900/60 bg-slate-950/50 flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-slate-900 bg-white"
            style={{ borderColor: profile.brandPrimaryColor }}
          >
            {profile.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="min-w-0 flex-1 select-text">
            <p className="text-xs font-bold text-white truncate">{profile.fullName}</p>
            <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wider font-extrabold truncate">{profile.jobTitle}</p>
          </div>
        </div>

      </aside>

      {/* 2. Main Workspace Layout */}
      <main className="flex-1 flex flex-col overflow-hidden h-full">
        
        {/* Top Header Navigation Line */}
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-8 shrink-0 select-none z-10">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <span className="hover:text-slate-800 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              ImpactStream Systems
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-slate-800 capitalize font-bold">
              {showProfileSetup ? 'CSM Profile Profile' : activeTab === 'dashboard' ? 'Book of Business Portfolio' : 'Advisory Builder'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Portfolio Status</span>
              <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Governance Live
              </span>
            </div>
          </div>
        </header>

        {/* Active view component mount */}
        <div className="flex-1 overflow-hidden">
          
          {/* PROFILE SETUP VIEW */}
          {showProfileSetup ? (
            <div className="h-full overflow-y-auto p-12 flex justify-center items-start">
              <CsmProfileSetup 
                profile={profile} 
                onSave={(updated) => {
                  setProfile(updated);
                  setShowProfileSetup(false);
                }} 
                onClose={() => setShowProfileSetup(false)}
              />
            </div>
          ) : activeTab === 'dashboard' ? (
            
            /* BOOK OF BUSINESS DASHBOARD VIEW */
            <div className="h-full overflow-y-auto p-8 max-w-7xl mx-auto w-full">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-extrabold font-display tracking-tight text-slate-900">
                    CSM Portfolio Management
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">Manage accounts, track relationship heatmaps, and compile customer success narratives</p>
                </div>
              </div>

              <BookOfBusiness 
                accounts={accounts}
                onSelectAccount={handleSelectAccount}
                onAddAccount={handleAddAccount}
                onDeleteAccount={handleDeleteAccount}
                activeAccountId={activeAccountId}
              />
            </div>
          ) : (
            
            /* ADVISORY REPORT BUILDER & PREVIEW WORKSPACE */
            <div className="h-full flex overflow-hidden">
              
              {/* Form Input Section */}
              <div className="w-[500px] xl:w-[540px] shrink-0 border-r border-slate-200 h-full flex flex-col bg-white">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center select-none shrink-0 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setActiveTab('dashboard')} 
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                      <h2 className="font-bold font-display text-slate-900 text-sm">
                        {activeAccount?.companyName || "No Selected Customer"}
                      </h2>
                      <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider font-bold">
                        {activeAccount ? `${activeAccount.accountTier} Account Registry` : "Advisory Workspace"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  {activeAccount ? (
                    <IntakeFlow 
                      account={activeAccount}
                      objective={activeObjective}
                      stakeholders={stakeholders}
                      milestones={milestones}
                      onUpdateAccount={handleUpdateAccount}
                      onUpdateObjective={handleUpdateObjective}
                      onUpdateStakeholders={setStakeholders}
                      onUpdateMilestones={setMilestones}
                    />
                  ) : (
                    <div className="p-8 flex flex-col justify-center items-center text-center h-full max-w-md mx-auto select-none">
                      <Building2 className="h-10 w-10 text-slate-400 mb-3 animate-pulse" />
                      <h4 className="text-sm font-bold text-slate-800">No Selected Account</h4>
                      <p className="text-[11px] text-slate-500 mt-1 mb-6">
                        An active client context is required to configure strategic outcomes, align sponsors, and review metrics.
                      </p>
                      
                      <div className="w-full text-left space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Quick Select Portfolio Unit</span>
                        {accounts.map(acc => (
                          <button
                            key={acc.id}
                            onClick={() => setActiveAccountId(acc.id)}
                            className="w-full flex justify-between items-center p-3 border border-slate-100 hover:border-blue-500 hover:bg-blue-50/20 rounded-xl transition text-left cursor-pointer text-xs"
                          >
                            <div>
                              <span className="font-bold text-slate-800 block">{acc.companyName}</span>
                              <span className="text-[10px] text-slate-400 font-medium">{acc.industry} • {acc.accountTier}</span>
                            </div>
                            <span className="text-blue-600 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                              Select <ChevronRight className="h-3 w-3" />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Live Report Preview Section */}
              <div className="flex-1 bg-slate-100 p-8 xl:p-10 overflow-y-auto flex flex-col justify-between items-center h-full">
                {activeAccount ? (
                  <ReportPreview 
                    profile={profile}
                    account={activeAccount}
                    objective={activeObjective}
                    stakeholders={stakeholders}
                    milestones={milestones}
                    reportType={reportType}
                    onChangeReportType={setReportType}
                  />
                ) : (
                  <div className="text-center p-12 border border-dashed border-slate-300 rounded-3xl bg-white max-w-md my-auto shadow-xs select-none">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400 border border-slate-100">
                      <FileEdit className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm font-display">Executive Presentation Closed</h4>
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                      Your executive-ready business review reports (EBR/QBR) will display here in real-time as you refine the account strategy, milestones, and metrics.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </main>

    </div>
  );
}

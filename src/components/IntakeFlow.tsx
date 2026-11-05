import React, { useState } from 'react';
import { Account, PrimaryObjective, Stakeholder, SuccessMilestone, MotionType, AccountTier, StakeholderRole, EngagementLevel, MilestoneStatus, MilestoneImpact } from '../types';
import { Building2, Users, CalendarCheck, HelpCircle, Plus, Trash2, Sliders, CheckCircle, Briefcase, Award, TrendingUp, Sparkles, DollarSign, Target, Activity, Wand2 } from 'lucide-react';
import { NotesSynthesizerModal } from './NotesSynthesizerModal';
import { AiExecutiveSummaryAssistant } from './AiExecutiveSummaryAssistant';

interface IntakeFlowProps {
  account: Account;
  objective: PrimaryObjective;
  stakeholders: Stakeholder[];
  milestones: SuccessMilestone[];
  onUpdateAccount: (updated: Account) => void;
  onUpdateObjective: (updated: PrimaryObjective) => void;
  onUpdateStakeholders: (updated: Stakeholder[]) => void;
  onUpdateMilestones: (updated: SuccessMilestone[]) => void;
}

export const IntakeFlow: React.FC<IntakeFlowProps> = ({
  account,
  objective,
  stakeholders,
  milestones,
  onUpdateAccount,
  onUpdateObjective,
  onUpdateStakeholders,
  onUpdateMilestones,
}) => {
  const [activeTab, setActiveTab] = useState<'context' | 'objective' | 'stakeholders' | 'milestones'>('context');

  // Local helper states for adding new entities
  const [shName, setShName] = useState('');
  const [shTitle, setShTitle] = useState('');
  const [shRole, setShRole] = useState<StakeholderRole>('Champion');
  const [shEngagement, setShEngagement] = useState<EngagementLevel>('High');
  const [shAlignment, setShAlignment] = useState(4);

  const [msTitle, setMsTitle] = useState('');
  const [msStatus, setMsStatus] = useState<MilestoneStatus>('In Progress');
  const [msDue, setMsDue] = useState('2026-08-31');
  const [msOwner, setMsOwner] = useState('Sarah Chen');
  const [msImpact, setMsImpact] = useState<MilestoneImpact>('Operational Efficiency');
  const [msOutcome, setMsOutcome] = useState('');

  // Preset generators to assist CSMs (enterprise-grade help feature)
  const applyObjectivePreset = (presetType: MotionType) => {
    let presetObj: Partial<PrimaryObjective> = {};
    if (presetType === 'Growth') {
      presetObj = {
        focusType: 'Growth',
        statement: `Consolidate legacy licensing and launch regional cloud security infrastructure to reduce platform operational latency by 40% across APAC cores.`,
        metricName: 'Average Core Platform Latency',
        baselineValue: '450',
        currentValue: '310',
        targetValue: '270',
        unit: 'ms',
        estimatedRoiImpact: '$340,000 Annual Server Consolidations Savings',
        nextSteps: 'Enfranchise Singapore local DevOps nodes and finalize telemetry baseline validations.'
      };
    } else if (presetType === 'Retention') {
      presetObj = {
        focusType: 'Retention',
        statement: `Integrate active HR service desks into automated workflow system to increase support agent processing capacity by 1.5x.`,
        metricName: 'Weekly Support Tickets Resolved Per Agent',
        baselineValue: '42',
        currentValue: '58',
        targetValue: '65',
        unit: 'tickets',
        estimatedRoiImpact: '$190,000 Support Capacity Scaling Avoidance',
        nextSteps: 'Activate automatic categorization triggers and prepare user onboarding manuals.'
      };
    } else if (presetType === 'Risk') {
      presetObj = {
        focusType: 'Risk',
        statement: `Establish automated warm failover configurations across dual redundant data centers to mitigate catastrophic business outage liability.`,
        metricName: 'Primary Failover Synchronization Overlap',
        baselineValue: '120',
        currentValue: '28',
        targetValue: '10',
        unit: 'seconds',
        estimatedRoiImpact: '$850,000 High-Availability Financial Risk Mitigation',
        nextSteps: 'Finalize core physical cluster link upgrades and execute scheduled DR dry run.'
      };
    }
    onUpdateObjective({ ...objective, ...presetObj });
    onUpdateAccount({ ...account, businessUnit: presetType === 'Growth' ? 'Global Security & Operations' : presetType === 'Retention' ? 'Finance Shared Services' : 'Infrastructure Redundancy Unit' });
  };

  const handleAddStakeholder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shName.trim()) return;

    const added: Stakeholder = {
      id: `st-${Date.now()}`,
      accountId: account.id,
      name: shName,
      title: shTitle || 'Stakeholder',
      role: shRole,
      engagement: shEngagement,
      alignment: shAlignment,
    };

    onUpdateStakeholders([...stakeholders, added]);
    // reset
    setShName('');
    setShTitle('');
    setShRole('Champion');
    setShEngagement('High');
    setShAlignment(4);
  };

  const handleDeleteStakeholder = (id: string) => {
    onUpdateStakeholders(stakeholders.filter(s => s.id !== id));
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msTitle.trim()) return;

    const added: SuccessMilestone = {
      id: `ms-${Date.now()}`,
      accountId: account.id,
      title: msTitle,
      status: msStatus,
      dueDate: msDue,
      owner: msOwner,
      impactType: msImpact,
      outcomeDetails: msOutcome || 'Pending quantitative valuation.'
    };

    onUpdateMilestones([...milestones, added]);
    // reset
    setMsTitle('');
    setMsStatus('In Progress');
    setMsDue('2026-08-31');
    setMsOwner('Sarah Chen');
    setMsImpact('Operational Efficiency');
    setMsOutcome('');
  };

  const handleDeleteMilestone = (id: string) => {
    onUpdateMilestones(milestones.filter(m => m.id !== id));
  };

  const [showSynthesizer, setShowSynthesizer] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [synthNotice, setSynthNotice] = useState<string | null>(null);

  const handleApplyAiSummary = (narrative: string) => {
    onUpdateObjective({ ...objective, statement: narrative });
    setSynthNotice(`AI Executive Summary pasted into ${account.companyName}'s Mandate!`);
    setTimeout(() => setSynthNotice(null), 4000);
  };

  const handleApplySynthesized = (data: {
    objective?: PrimaryObjective;
    milestones?: SuccessMilestone[];
    stakeholders?: Stakeholder[];
  }) => {
    if (data.objective) {
      onUpdateObjective(data.objective);
    }
    if (data.milestones && data.milestones.length > 0) {
      const otherAccountMilestones = milestones.filter(m => m.accountId !== account.id);
      onUpdateMilestones([...otherAccountMilestones, ...data.milestones]);
    }
    if (data.stakeholders && data.stakeholders.length > 0) {
      const otherAccountStakeholders = stakeholders.filter(s => s.accountId !== account.id);
      onUpdateStakeholders([...otherAccountStakeholders, ...data.stakeholders]);
    }

    setSynthNotice(`Successfully synthesized and applied records to ${account.companyName}`);
    setTimeout(() => setSynthNotice(null), 4000);
  };

  // Filter local account stakeholders and milestones
  const activeStakeholders = stakeholders.filter(s => s.accountId === account.id);
  const activeMilestones = milestones.filter(m => m.accountId === account.id);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full relative">
      {/* Quick-Paste Notes Synthesizer Trigger Bar (QBRBuilder Style) */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-slate-50 border-b border-blue-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-blue-600 text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Quick-Paste Notes Synthesizer
            </span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">
              Parse raw meeting notes &amp; transcripts into QBR records automatically
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowSynthesizer(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Wand2 className="h-3.5 w-3.5" />
          <span>Paste Notes</span>
        </button>
      </div>

      {/* Synthesis Success Toast */}
      {synthNotice && (
        <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{synthNotice}</span>
        </div>
      )}

      {/* Modal Dialog */}
      <NotesSynthesizerModal
        isOpen={showSynthesizer}
        onClose={() => setShowSynthesizer(false)}
        account={account}
        currentObjective={objective}
        onApply={handleApplySynthesized}
      />

      {/* AI Executive Summary Assistant Modal */}
      <AiExecutiveSummaryAssistant
        isOpen={showAiAssistant}
        onClose={() => setShowAiAssistant(false)}
        account={account}
        objective={objective}
        milestones={milestones}
        stakeholders={stakeholders}
        onApplyToMandate={handleApplyAiSummary}
      />

      {/* Configuration Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 p-1">
        <button
          onClick={() => setActiveTab('context')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'context' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          Context
        </button>
        <button
          onClick={() => setActiveTab('objective')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'objective' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Target className="h-3.5 w-3.5" />
          Strategic
        </button>
        <button
          onClick={() => setActiveTab('stakeholders')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'stakeholders' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          Stakeholders ({activeStakeholders.length})
        </button>
        <button
          onClick={() => setActiveTab('milestones')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'milestones' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarCheck className="h-3.5 w-3.5" />
          Success Plan ({activeMilestones.length})
        </button>
      </div>

      {/* Main Forms Scroll Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* TAB 1: Account Context */}
        {activeTab === 'context' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-sm font-bold text-slate-800 font-display tracking-tight flex items-center gap-2">
                <Building2 className="h-4.5 w-4.5 text-blue-600" /> Account Identity
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5">Primary metadata defining the business unit contract boundaries</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Company Name</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 transition"
                  value={account.companyName}
                  onChange={e => onUpdateAccount({ ...account, companyName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Business Unit Context</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 transition"
                    value={account.businessUnit}
                    onChange={e => onUpdateAccount({ ...account, businessUnit: e.target.value })}
                    placeholder="e.g. EMEA Security Division"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Industry Vertical</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 transition"
                    value={account.industry}
                    onChange={e => onUpdateAccount({ ...account, industry: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Contract Target Renewal</label>
                  <input
                    type="date"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 transition"
                    value={account.contractRenewalDate}
                    onChange={e => onUpdateAccount({ ...account, contractRenewalDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Annual Recurring Revenue (ARR)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-semibold">$</span>
                    <input
                      type="number"
                      className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 transition"
                      value={account.annualRecurringRevenue}
                      onChange={e => onUpdateAccount({ ...account, annualRecurringRevenue: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Account Tier</label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 transition"
                    value={account.accountTier}
                    onChange={e => onUpdateAccount({ ...account, accountTier: e.target.value as AccountTier })}
                  >
                    <option value="Strategic">Strategic Engagement</option>
                    <option value="Enterprise">Enterprise Division</option>
                    <option value="Mid-Market">Mid-Market</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Customer Health Score</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      className="flex-1 accent-blue-600"
                      value={account.healthScore}
                      onChange={e => onUpdateAccount({ ...account, healthScore: parseInt(e.target.value) || 50 })}
                    />
                    <span className="text-xs font-bold text-slate-800 w-10 text-right">{account.healthScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Strategic Objective & Metrics */}
        {activeTab === 'objective' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-slate-800 font-display tracking-tight flex items-center gap-2">
                  <Target className="h-4.5 w-4.5 text-blue-600" /> Strategic Objective & Outcomes
                </h3>
                <p className="text-slate-400 text-[11px] mt-0.5">Tying customer's primary objective directly to measurable business outcomes</p>
              </div>
            </div>

            {/* Quick Templates Advisory Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" /> Strategic Advisory Presets
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => applyObjectivePreset('Growth')}
                  className={`px-3 py-2 text-[10px] font-bold rounded-lg border cursor-pointer transition ${
                    objective.focusType === 'Growth' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Growth Presets
                </button>
                <button
                  type="button"
                  onClick={() => applyObjectivePreset('Retention')}
                  className={`px-3 py-2 text-[10px] font-bold rounded-lg border cursor-pointer transition ${
                    objective.focusType === 'Retention' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Retention Presets
                </button>
                <button
                  type="button"
                  onClick={() => applyObjectivePreset('Risk')}
                  className={`px-3 py-2 text-[10px] font-bold rounded-lg border cursor-pointer transition ${
                    objective.focusType === 'Risk' ? 'bg-rose-600 border-rose-600 text-white' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Risk Presets
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Focus Motion</label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 transition"
                    value={objective.focusType}
                    onChange={e => onUpdateObjective({ ...objective, focusType: e.target.value as MotionType })}
                  >
                    <option value="Growth">Growth & Expansion</option>
                    <option value="Retention">Value Realization (Retention)</option>
                    <option value="Risk">Risk & System Recovery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Strategic Metric Target</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 transition"
                    value={objective.metricName}
                    onChange={e => onUpdateObjective({ ...objective, metricName: e.target.value })}
                    placeholder="e.g. Incident Latency SLA"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Executive Statement of Value (Partnership Mandate)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAiAssistant(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-700 border border-indigo-200/80 rounded-lg text-[10px] font-bold transition shadow-2xs cursor-pointer"
                    title="Generate one-paragraph executive summary narrative using Gemini AI"
                  >
                    <Sparkles className="h-3 w-3 text-indigo-600 animate-pulse" />
                    <span>AI Executive Narrative Assistant</span>
                  </button>
                </div>
                <textarea
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs h-24 focus:outline-none focus:border-indigo-500 transition leading-relaxed select-text"
                  value={objective.statement}
                  onChange={e => onUpdateObjective({ ...objective, statement: e.target.value })}
                  placeholder="Define the primary business outcome required by the customer or click 'AI Executive Narrative Assistant'..."
                />
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Baseline</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 text-center"
                    value={objective.baselineValue}
                    onChange={e => onUpdateObjective({ ...objective, baselineValue: e.target.value })}
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Current</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 text-center"
                    value={objective.currentValue}
                    onChange={e => onUpdateObjective({ ...objective, currentValue: e.target.value })}
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Target</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 text-center"
                    value={objective.targetValue}
                    onChange={e => onUpdateObjective({ ...objective, targetValue: e.target.value })}
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Unit</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 text-center"
                    value={objective.unit}
                    onChange={e => onUpdateObjective({ ...objective, unit: e.target.value })}
                    placeholder="e.g. % or hours"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Estimated Annualized ROI Impact</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <DollarSign className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-blue-600 focus:outline-none focus:border-blue-500 transition"
                      value={objective.estimatedRoiImpact}
                      onChange={e => onUpdateObjective({ ...objective, estimatedRoiImpact: e.target.value })}
                      placeholder="e.g. $285,400 Outage Liabilities Mitigated"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">ROI Impact (Numeric Value)</label>
                  <input
                    type="number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 transition"
                    value={objective.roiNumericImpact || ''}
                    onChange={e => onUpdateObjective({ ...objective, roiNumericImpact: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g. 285400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Next Immediate Action Steps</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 transition"
                  value={objective.nextSteps}
                  onChange={e => onUpdateObjective({ ...objective, nextSteps: e.target.value })}
                  placeholder="What is the next immediate task to move this metric?"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Stakeholders */}
        {activeTab === 'stakeholders' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-sm font-bold text-slate-800 font-display tracking-tight flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-blue-600" /> Stakeholder Mapping & Alignment
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5 font-medium">Verify executive support, identify corporate champions, and mitigate engagement gaps</p>
            </div>

            {/* List of active stakeholders */}
            <div className="space-y-3">
              {activeStakeholders.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-slate-200 bg-slate-50/50 rounded-xl">
                  <p className="text-xs text-slate-500">No stakeholders mapped yet. Complete the alignment form below.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {activeStakeholders.map(st => (
                    <div key={st.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-950 truncate">{st.name}</h4>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                            {st.role}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{st.title}</p>
                        {st.notes && <p className="text-[10px] text-slate-400 italic mt-1 leading-snug">{st.notes}</p>}
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block">Alignment</span>
                          <span className="text-xs font-bold text-slate-700">{st.alignment}/5</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteStakeholder(st.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form to add a stakeholder */}
            <form onSubmit={handleAddStakeholder} className="border border-slate-200 rounded-xl p-4 space-y-4 bg-slate-50/30">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Plus className="h-4 w-4 text-blue-600" /> Map Strategic Executive
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-blue-500"
                    value={shName}
                    onChange={e => setShName(e.target.value)}
                    placeholder="e.g. Jane Foster"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Corporate Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-blue-500"
                    value={shTitle}
                    onChange={e => setShTitle(e.target.value)}
                    placeholder="e.g. Director of Networks"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Strategic Role</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-blue-500"
                    value={shRole}
                    onChange={e => setShRole(e.target.value as StakeholderRole)}
                  >
                    <option value="Executive Sponsor">Executive Sponsor</option>
                    <option value="Economic Buyer">Economic Buyer</option>
                    <option value="Champion">Champion / Advocate</option>
                    <option value="Technical Gatekeeper">Technical Gatekeeper</option>
                    <option value="User Advocate">User Advocate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Engagement Level</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-blue-500"
                    value={shEngagement}
                    onChange={e => setShEngagement(e.target.value as EngagementLevel)}
                  >
                    <option value="High">High (Highly Active)</option>
                    <option value="Medium">Medium (Passive Supportive)</option>
                    <option value="Low">Low (At Risk / Inactive)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1 flex justify-between">
                  <span>Partnership Alignment Score</span>
                  <span className="text-blue-600 font-bold">{shAlignment}/5</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  className="w-full accent-blue-600"
                  value={shAlignment}
                  onChange={e => setShAlignment(parseInt(e.target.value) || 4)}
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-semibold mt-1">
                  <span>Antagonistic (1)</span>
                  <span>Fully Champion (5)</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition shadow-sm cursor-pointer"
              >
                Add Stakeholder Profile
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: Milestones / Success Plan */}
        {activeTab === 'milestones' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-sm font-bold text-slate-800 font-display tracking-tight flex items-center gap-2">
                <CalendarCheck className="h-4.5 w-4.5 text-blue-600" /> Success Plan & Value Journey
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5 font-medium">Strategic roadmap defining specific timelines, owners, statuses, and impact categories</p>
            </div>

            {/* List of current milestones */}
            <div className="space-y-3.5">
              {activeMilestones.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-slate-200 bg-slate-50/50 rounded-xl">
                  <p className="text-xs text-slate-500">No success milestones added yet. Launch your strategic roadmap below.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeMilestones.map(ms => {
                    let statusColor = 'text-slate-500 bg-slate-50';
                    if (ms.status === 'Completed') statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-100';
                    else if (ms.status === 'In Progress') statusColor = 'text-blue-700 bg-blue-50 border-blue-100';
                    else if (ms.status === 'At Risk') statusColor = 'text-rose-700 bg-rose-50 border-rose-100';

                    return (
                      <div key={ms.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/80 flex flex-col gap-2.5 shadow-xs">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-slate-900 leading-snug">{ms.title}</h4>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                              <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                                Owner: {ms.owner}
                              </span>
                              <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md">
                                {ms.impactType}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                              {ms.status}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteMilestone(ms.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-100 italic leading-snug">
                          {ms.outcomeDetails}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Form to add a milestone */}
            <form onSubmit={handleAddMilestone} className="border border-slate-200 rounded-xl p-4 space-y-4 bg-slate-50/30">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Plus className="h-4 w-4 text-blue-600" /> Create Roadmap Milestone
              </span>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Milestone Action / Goal</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-blue-500"
                  value={msTitle}
                  onChange={e => setMsTitle(e.target.value)}
                  placeholder="e.g. Complete APAC team onboarding workshop"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Milestone Owner</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-blue-500"
                    value={msOwner}
                    onChange={e => setMsOwner(e.target.value)}
                    placeholder="e.g. Sarah Chen"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Target Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-blue-500"
                    value={msDue}
                    onChange={e => setMsDue(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Impact Type</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-blue-500"
                    value={msImpact}
                    onChange={e => setMsImpact(e.target.value as MilestoneImpact)}
                  >
                    <option value="Operational Efficiency">Operational Efficiency</option>
                    <option value="Financial Growth">Financial Growth</option>
                    <option value="Risk Mitigation">Risk Mitigation</option>
                    <option value="Strategic Expansion">Strategic Expansion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Initial Status</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-blue-500"
                    value={msStatus}
                    onChange={e => setMsStatus(e.target.value as MilestoneStatus)}
                  >
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="At Risk">At Risk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Quantitative Valuation / Specific Details</label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white h-16 focus:outline-none focus:border-blue-500 text-slate-600 leading-snug"
                  value={msOutcome}
                  onChange={e => setMsOutcome(e.target.value)}
                  placeholder="Describe exact business results or audit outputs delivered (e.g. Saved 45 hours / consolidated duplicate API logs)..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition shadow-sm cursor-pointer"
              >
                Insert Milestone to Roadmap
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

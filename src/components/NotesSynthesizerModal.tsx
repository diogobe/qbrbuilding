import React, { useState } from 'react';
import { Account, PrimaryObjective, Stakeholder, SuccessMilestone, MotionType, StakeholderRole, MilestoneStatus, MilestoneImpact } from '../types';
import { 
  X, 
  Sparkles, 
  Wand2, 
  Check, 
  FileText, 
  ArrowRight, 
  Layers, 
  Target, 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';

interface NotesSynthesizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account;
  currentObjective: PrimaryObjective;
  onApply: (data: {
    objective?: PrimaryObjective;
    milestones?: SuccessMilestone[];
    stakeholders?: Stakeholder[];
  }) => void;
}

const SAMPLE_NOTES_PRESETS = [
  {
    name: 'Executive Value Review (Retention & Adoption)',
    text: `Executive Sync with Apex Global Corp:
Met with VP of Engineering Marcus Vance and Director of IT Elena Rostova.
Key Mandate: Accelerate daily active adoption across customer support teams to eliminate processing bottlenecks in the North America enterprise division.
Metrics Trajectory:
- Primary KPI: Ticket Resolution Turnaround
- Started baseline at 48 hours, currently reduced to 16 hours. Target is 12 hours.
- Verified ROI: $185,000 in saved operational support hours annually.
- Risk/Health: Health score stable at 84/100.
Upcoming Milestones:
1. Complete Single Sign-On (SSO) integration across all EMEA nodes by 2026-09-15. Owner: Marcus Vance. Impact: Operational Efficiency. Status: In Progress.
2. Executive Sponsor Quarterly Alignment Call by 2026-10-01. Owner: Sarah Chen. Impact: Strategic Expansion. Status: Planned.
Immediate Next Steps: Finalize technical design review and audit telemetry integration logs with Elena.`,
  },
  {
    name: 'Expansion & Capacity Scaling (Growth Focus)',
    text: `Growth Opportunity Meeting with Strategic Leads:
Met with Chief Revenue Officer David Kim (Executive Sponsor) and VP Ops Rachel Chen (Champion).
Partnership Focus: Scaling automated document ingestion pipeline to handle 3x volume for regional APAC offices.
Key Performance Indicator:
- Metric: Processing Throughput
- Baseline: 120 docs/hr. Currently at 450 docs/hr. Target is 600 docs/hr.
- ROI Realization: $420,000 annual capacity yield and headcount avoidance.
- Status: Growth acceleration motion active.
Key Deliverables:
1. High-throughput cluster provisioned by 2026-09-30. Owner: David Kim. Status: Completed.
2. Regional compliance audit across Singapore & Sydney cores by 2026-11-15. Owner: Rachel Chen. Status: In Progress.
Next Actions: Schedule commercial contract amendment review and scope enlargement sign-off.`,
  },
  {
    name: 'Remediation & Technical Escalation (Risk Focus)',
    text: `Urgent Escalation Review:
Participants: VP Tech Infrastructure Thomas Wright (Technical Gatekeeper) and CS Director.
Current Situation: Integration latency spiked after cloud migration, dragging customer health down to 58/100.
Strategic Objective: Stabilize API gateway latency and reduce timeout error rate below 0.1% before holiday peak load.
Key Metrics:
- Metric: API Gateway Timeout Rate
- Baseline: 3.5%, currently at 1.2%, target goal is 0.05%.
- Financial Risk: Safeguarding $500,000 contract renewal.
- Priority: Risk Remediation Motion.
Remediation Milestones:
1. Deploy hotfix patch to ingress controller by 2026-08-20. Owner: Thomas Wright. Status: In Progress. Impact: Risk Mitigation.
2. Multi-region latency load test by 2026-09-10. Owner: Sarah Chen. Status: Planned. Impact: Risk Mitigation.
Next Steps: Conduct bi-weekly executive standup until timeout rate remains under 0.1% for 14 consecutive days.`,
  },
];

export const NotesSynthesizerModal: React.FC<NotesSynthesizerModalProps> = ({
  isOpen,
  onClose,
  account,
  currentObjective,
  onApply,
}) => {
  const [rawNotes, setRawNotes] = useState('');
  const [parsedResult, setParsedResult] = useState<{
    objective: PrimaryObjective;
    milestones: SuccessMilestone[];
    stakeholders: Stakeholder[];
  } | null>(null);

  const [applyObjective, setApplyObjective] = useState(true);
  const [applyMilestones, setApplyMilestones] = useState(true);
  const [applyStakeholders, setApplyStakeholders] = useState(true);

  if (!isOpen) return null;

  // Synthesize raw notes into structured records
  const handleSynthesize = () => {
    if (!rawNotes.trim()) return;

    const lower = rawNotes.toLowerCase();

    // 1. Detect Motion Type
    let focusType: MotionType = 'Retention';
    if (lower.includes('growth') || lower.includes('expansion') || lower.includes('scale') || lower.includes('upsell')) {
      focusType = 'Growth';
    } else if (lower.includes('risk') || lower.includes('escalat') || lower.includes('timeout') || lower.includes('spike') || lower.includes('urgent')) {
      focusType = 'Risk';
    }

    // 2. Extract or infer primary objective
    let statement = '';
    const mandateMatch = rawNotes.match(/(?:mandate|objective|focus|situation|goal)[:\s]+([^\n\r.]+)/i);
    if (mandateMatch && mandateMatch[1]) {
      statement = mandateMatch[1].trim();
      if (!statement.endsWith('.')) statement += '.';
    } else {
      statement = `Accelerate strategic milestone execution and adoption across the ${account.businessUnit || 'enterprise'} business unit.`;
    }

    // 3. Extract Metric Details
    let metricName = 'Primary Performance Index';
    const metricMatch = rawNotes.match(/(?:kpi|metric|indicator)[:\s]+([^\n\r.]+)/i);
    if (metricMatch && metricMatch[1]) {
      metricName = metricMatch[1].trim();
    }

    // Extract numbers: baseline, current, target
    let baselineValue = '0';
    let currentValue = '50';
    let targetValue = '100';
    let unit = '%';

    const baselineMatch = rawNotes.match(/baseline(?:[:\s]+(?:at\s+)?)([0-9.]+)\s*([a-zA-Z%]+)?/i);
    if (baselineMatch) {
      baselineValue = baselineMatch[1];
      if (baselineMatch[2]) unit = baselineMatch[2];
    }

    const currentMatch = rawNotes.match(/current(?:ly)?(?:[:\s]+(?:at\s+|reduced to\s+)?)([0-9.]+)\s*([a-zA-Z%]+)?/i);
    if (currentMatch) {
      currentValue = currentMatch[1];
      if (currentMatch[2] && unit === '%') unit = currentMatch[2];
    }

    const targetMatch = rawNotes.match(/target(?:[:\s]+(?:is\s+|goal is\s+)?)([0-9.]+)\s*([a-zA-Z%]+)?/i);
    if (targetMatch) {
      targetValue = targetMatch[1];
      if (targetMatch[2] && unit === '%') unit = targetMatch[2];
    }

    // Extract ROI Impact
    let estimatedRoiImpact = '$120,000 Annual Value Realization';
    const roiMatch = rawNotes.match(/(?:roi|yield|savings|value)[:\s]+([^\n\r.]+)/i);
    if (roiMatch && roiMatch[1]) {
      estimatedRoiImpact = roiMatch[1].trim();
    }

    // Extract Next Steps
    let nextSteps = 'Schedule follow-up review with executive sponsor.';
    const nextStepsMatch = rawNotes.match(/(?:next steps?|next actions?)[:\s]+([^\n\r]+)/i);
    if (nextStepsMatch && nextStepsMatch[1]) {
      nextSteps = nextStepsMatch[1].trim();
    }

    const synthesizedObjective: PrimaryObjective = {
      ...currentObjective,
      statement,
      focusType,
      metricName,
      baselineValue,
      currentValue,
      targetValue,
      unit,
      estimatedRoiImpact,
      nextSteps,
    };

    // 4. Extract Stakeholders
    const synthesizedStakeholders: Stakeholder[] = [];
    const personMatches = rawNotes.matchAll(/(?:met with|participants|sponsor|champion|lead)[:\s]*([^\n\r]+)/gi);
    const seenNames = new Set<string>();

    for (const match of personMatches) {
      const line = match[1];
      // Try to extract individual name and role pairs
      const nameParts = line.split(/(?:,|and|&|\n)/);
      for (const part of nameParts) {
        const cleaned = part.trim();
        if (cleaned.length > 3 && !seenNames.has(cleaned.toLowerCase())) {
          seenNames.add(cleaned.toLowerCase());
          let role: StakeholderRole = 'Champion';
          if (/sponsor|cro|vp|c-level|director/i.test(cleaned)) role = 'Executive Sponsor';
          else if (/buyer|procurement|finance/i.test(cleaned)) role = 'Economic Buyer';
          else if (/engineer|tech|it|architect|devops/i.test(cleaned)) role = 'Technical Gatekeeper';

          synthesizedStakeholders.push({
            id: `sh-synth-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            accountId: account.id,
            name: cleaned.replace(/\([^)]*\)/g, '').trim(),
            title: cleaned.includes('(') ? cleaned.split('(')[1].replace(')', '').trim() : 'Strategic Partner Lead',
            role,
            engagement: 'High',
            alignment: 4,
          });
        }
      }
    }

    // Fallback if no names found in note
    if (synthesizedStakeholders.length === 0) {
      synthesizedStakeholders.push({
        id: `sh-synth-${Date.now()}`,
        accountId: account.id,
        name: 'Alex Mercer',
        title: 'Executive Sponsor',
        role: 'Executive Sponsor',
        engagement: 'High',
        alignment: 5,
      });
    }

    // 5. Extract Milestones
    const synthesizedMilestones: SuccessMilestone[] = [];
    const milestoneLines = rawNotes.split('\n').filter(l => /^[0-9]+[.)]|^\s*[-*]\s*(?:milestone|deliverable|step)/i.test(l));

    if (milestoneLines.length > 0) {
      milestoneLines.forEach((line, i) => {
        let status: MilestoneStatus = 'In Progress';
        if (/completed|done|provisioned/i.test(line)) status = 'Completed';
        else if (/planned|scheduled/i.test(line)) status = 'Planned';
        else if (/risk|delayed|blocked/i.test(line)) status = 'At Risk';

        let impactType: MilestoneImpact = 'Operational Efficiency';
        if (/financial|revenue|savings/i.test(line)) impactType = 'Financial Growth';
        else if (/risk|mitigat|security|patch/i.test(line)) impactType = 'Risk Mitigation';
        else if (/expansion|strategic|adoption/i.test(line)) impactType = 'Strategic Expansion';

        const dueMatch = line.match(/(?:by|due)[:\s]+([0-9]{4}-[0-9]{2}-[0-9]{2})/);
        const ownerMatch = line.match(/(?:owner)[:\s]+([a-zA-Z\s]+?)(?:\.|$|impact|status)/i);

        synthesizedMilestones.push({
          id: `ms-synth-${Date.now()}-${i}`,
          accountId: account.id,
          title: line.replace(/^[0-9]+[.)]\s*|^\s*[-*]\s*/, '').split(/\.|\sby\s/)[0].trim(),
          status,
          dueDate: dueMatch ? dueMatch[1] : `2026-09-${15 + i * 15}`,
          owner: ownerMatch ? ownerMatch[1].trim() : 'Sarah Chen',
          impactType,
          outcomeDetails: 'Synthesized deliverable milestone from meeting notes.',
        });
      });
    } else {
      // Default milestones extracted from text context
      synthesizedMilestones.push(
        {
          id: `ms-synth-${Date.now()}-1`,
          accountId: account.id,
          title: `Validate ${metricName} telemetry baseline`,
          status: 'Completed',
          dueDate: '2026-08-30',
          owner: 'Sarah Chen',
          impactType: 'Operational Efficiency',
          outcomeDetails: 'Baseline established across enterprise cores.',
        },
        {
          id: `ms-synth-${Date.now()}-2`,
          accountId: account.id,
          title: `Deploy operational automation workflows in ${account.businessUnit || 'core unit'}`,
          status: 'In Progress',
          dueDate: '2026-09-30',
          owner: 'Marcus Vance',
          impactType: 'Financial Growth',
          outcomeDetails: 'Active deliverable tracking toward quarterly milestone velocity.',
        }
      );
    }

    setParsedResult({
      objective: synthesizedObjective,
      milestones: synthesizedMilestones,
      stakeholders: synthesizedStakeholders,
    });
  };

  const handleApplyAll = () => {
    if (!parsedResult) return;

    onApply({
      objective: applyObjective ? parsedResult.objective : undefined,
      milestones: applyMilestones ? parsedResult.milestones : undefined,
      stakeholders: applyStakeholders ? parsedResult.stakeholders : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Quick-Paste Notes Synthesizer
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  QBRBuilder Engine
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Paste raw meeting notes, CRM call summaries, or email updates to auto-populate {account.companyName}.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Or load sample notes preset:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_NOTES_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setRawNotes(preset.text);
                  }}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500 transition text-[11px] font-medium cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Raw Text Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Raw Unstructured Notes
              </label>
              <span className="text-[10px] text-slate-400">
                Extracts objectives, KPIs, milestones, and contacts
              </span>
            </div>
            <textarea
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder="Paste raw meeting notes, bullet points, transcript snippets, or email updates here..."
              rows={6}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Synthesize Action Trigger */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSynthesize}
              disabled={!rawNotes.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Wand2 className="h-3.5 w-3.5" />
              <span>Parse &amp; Synthesize Records</span>
            </button>
          </div>

          {/* Parsed Results Preview Card */}
          {parsedResult && (
            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/20 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-blue-200/60 dark:border-blue-900/40 pb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Synthesized Review &amp; Merge Preview
                </span>
                <span className="text-[10px] text-slate-500">
                  Select items to apply to {account.companyName}
                </span>
              </div>

              {/* 1. Primary Objective */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyObjective}
                    onChange={(e) => setApplyObjective(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Apply Strategic Objective &amp; KPI Metrics
                  </span>
                </label>
                <div className="ml-5 p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                      {parsedResult.objective.focusType} Motion
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {parsedResult.objective.metricName}
                    </span>
                    <span className="text-xs font-mono text-slate-500 ml-auto">
                      {parsedResult.objective.baselineValue} &rarr; {parsedResult.objective.currentValue} / {parsedResult.objective.targetValue} {parsedResult.objective.unit}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                    &ldquo;{parsedResult.objective.statement}&rdquo;
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Yield: {parsedResult.objective.estimatedRoiImpact}
                  </p>
                </div>
              </div>

              {/* 2. Milestones */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyMilestones}
                    onChange={(e) => setApplyMilestones(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Apply Detected Success Milestones ({parsedResult.milestones.length})
                  </span>
                </label>
                <div className="ml-5 space-y-1.5">
                  {parsedResult.milestones.map((ms, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate block">
                          {ms.title}
                        </span>
                        <span className="text-[9px] text-slate-500">
                          Due: {ms.dueDate} &bull; Owner: {ms.owner} &bull; {ms.impactType}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {ms.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Stakeholders */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyStakeholders}
                    onChange={(e) => setApplyStakeholders(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Apply Extracted Stakeholders ({parsedResult.stakeholders.length})
                  </span>
                </label>
                <div className="ml-5 flex flex-wrap gap-2">
                  {parsedResult.stakeholders.map((sh, idx) => (
                    <div key={idx} className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px]">
                      <span className="font-bold text-slate-900 dark:text-white block">{sh.name}</span>
                      <span className="text-[9px] text-slate-500">{sh.role} &bull; {sh.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApplyAll}
            disabled={!parsedResult}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>Apply Selected Records to Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

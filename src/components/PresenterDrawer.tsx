import React, { useState, useEffect } from 'react';
import { Account, PrimaryObjective, Stakeholder, SuccessMilestone, ReportType, UserProfile } from '../types';
import { PresentationTheme } from './ThemeConfig';
import { 
  X, 
  Copy, 
  Check, 
  Clock, 
  HelpCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  MessageSquare, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Award,
  Play,
  Pause,
  RotateCcw,
  Edit3,
  FileText
} from 'lucide-react';

interface PresenterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSlide: number;
  reportType: ReportType;
  account: Account;
  objective: PrimaryObjective;
  stakeholders: Stakeholder[];
  milestones: SuccessMilestone[];
  theme: PresentationTheme;
  profile: UserProfile;
  onSelectSlide?: (slideIndex: number) => void;
}

const SLIDE_NAV_NAMES = [
  '1. Executive Summary',
  '2. Outcomes & Value',
  '3. Risks & Blockers',
  '4. Stakeholders',
  '5. Renewal & Growth',
  '6. Next Steps'
];

export const PresenterDrawer: React.FC<PresenterDrawerProps> = ({
  isOpen,
  onClose,
  activeSlide,
  reportType,
  account,
  objective,
  stakeholders,
  milestones,
  theme,
  profile,
  onSelectSlide,
}) => {
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedSlideView, setSelectedSlideView] = useState<number>(activeSlide);
  const [activeTab, setActiveTab] = useState<'script' | 'customNotes'>('script');

  // Custom persistent private notes for this account and slide
  const [privateNotes, setPrivateNotes] = useState<string>('');

  // Meeting Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Sync internal view when parent activeSlide changes
  useEffect(() => {
    setSelectedSlideView(activeSlide);
  }, [activeSlide]);

  // Load custom notes for active account and slide
  useEffect(() => {
    const key = `impactstream_presenter_notes_${account.id}_${selectedSlideView}`;
    const saved = localStorage.getItem(key);
    setPrivateNotes(saved || '');
  }, [account.id, selectedSlideView]);

  // Save custom notes
  const handleSaveNotes = (text: string) => {
    setPrivateNotes(text);
    const key = `impactstream_presenter_notes_${account.id}_${selectedSlideView}`;
    localStorage.setItem(key, text);
  };

  // Stopwatch timer interval
  useEffect(() => {
    let timer: any = null;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const activeStakeholders = stakeholders.filter(s => s.accountId === account.id);
  const activeMilestones = milestones.filter(m => m.accountId === account.id);
  const executiveSponsor = activeStakeholders.find(s => s.role === 'Executive Sponsor');
  const delayedMilestones = activeMilestones.filter(m => m.status === 'Delayed' || m.status === 'At Risk');

  // Dynamic contextual slide scripts
  const getSlideContent = (slideIndex: number) => {
    if (reportType === 'QBR') {
      return {
        title: 'QBR Operations Sync',
        sectionKicker: 'QUARTERLY OPERATIONAL CADENCE',
        timing: '15-20 min total',
        focus: 'Operational Metric Attainment & Milestone Health',
        script: `Welcome everyone to our operational sync for ${account.companyName}. Today's focus is on operational cadence: our primary KPI '${objective.metricName}' has moved from a baseline of ${objective.baselineValue}${objective.unit} to ${objective.currentValue}${objective.unit}. We'll examine our milestone completion velocity, review open delivery items, and align on upcoming sprint deliverables for the ${account.businessUnit} team.`,
        keyBullets: [
          `Review performance trajectory against target of ${objective.targetValue}${objective.unit}.`,
          `Highlight ${activeMilestones.filter(m => m.status === 'Completed').length} completed milestones and confirm owners for remaining deliverables.`,
          `Address operational blockers and verify resource availability with engineering and operations leads.`,
        ],
        objections: [
          {
            q: 'Why did the metric plateau midway through the quarter?',
            a: 'The initial surge reflected early adopter onboarding; the plateau is expected as secondary cohorts configure their daily workflows. Scheduled training in the upcoming milestone will reignite trajectory.',
          },
          {
            q: 'Can we expedite delayed deliverables?',
            a: `Yes, we can reprioritize milestones with owner ${delayedMilestones[0]?.owner || 'the assigned technical lead'} to accelerate delivery without expanding scope.`,
          },
        ],
      };
    }

    if (reportType === 'OPR') {
      return {
        title: 'Executive One-Page Brief',
        sectionKicker: 'STRATEGIC OVERVIEW BRIEF',
        timing: '5-10 min total',
        focus: 'High-Level Value Yield & Partnership Mandate',
        script: `This high-level executive brief summarizes our partnership with ${account.companyName} at a glance. Our guiding mandate is: "${objective.statement}". We are tracking an annualized economic yield of ${objective.estimatedRoiImpact}, with governance health registered at ${account.healthScore}/100. Our immediate next action is: ${objective.nextSteps || 'Confirm roadmap authorizations.'}`,
        keyBullets: [
          `Emphasize financial and operational yield (${objective.estimatedRoiImpact}).`,
          `Confirm executive support for immediate next steps.`,
          `Set date for full quarterly deep-dive.`,
        ],
        objections: [
          {
            q: 'Is this value projection audited?',
            a: 'Yes, ROI figures are derived from agreed-upon capacity metrics and team hours saved, verified against customer baseline benchmarks.',
          },
        ],
      };
    }

    // Default: 6 EBR Slides
    switch (slideIndex) {
      case 0:
        return {
          title: 'Executive Partnership Review',
          sectionKicker: 'SLIDE 1 OF 6 · OPENING & FRAMING',
          timing: '3-4 mins',
          focus: 'Executive Alignment & Meeting Mandate',
          script: `Thank you everyone for joining today's Executive Business Review for ${account.companyName}. Over the past evaluation period, our collective focus has been: "${objective.statement}". Today, we have three clear objectives: first, verify the concrete business outcomes and ROI delivered to date; second, transparently address operational risks and blockers; and third, align on the mutual commitments and roadmap priorities for the coming quarter.`,
          keyBullets: [
            `Acknowledge ${executiveSponsor ? `Executive Sponsor ${executiveSponsor.name} (${executiveSponsor.title})` : 'all executive leaders present'}.`,
            `Anchor the review around business outcomes, not just software usage.`,
            `Confirm the ${account.accountTier} partnership model and set a collaborative executive tone.`,
          ],
          objections: [
            {
              q: 'What is the primary decision needed from leadership today?',
              a: 'We need executive validation of our delivery milestones and formal sign-off on the upcoming roadmap commitments outlined in Slide 6.',
            },
            {
              q: 'Are we on track for our mutual annual goals?',
              a: `Yes, we are actively tracking progress toward our target of ${objective.targetValue}${objective.unit}, with governance health at ${account.healthScore}/100.`,
            },
          ],
        };

      case 1:
        return {
          title: 'Business Outcomes & Value Delivered',
          sectionKicker: 'SLIDE 2 OF 6 · VALUE REALIZATION',
          timing: '5-6 mins',
          focus: 'Proof of ROI & Performance Trajectory',
          script: `Turning to value realization: our primary performance indicator '${objective.metricName}' has progressed from an initial baseline of ${objective.baselineValue}${objective.unit} to ${objective.currentValue}${objective.unit}, on our journey to the target goal of ${objective.targetValue}${objective.unit}. In financial terms, this operational transformation delivers an estimated yield of ${objective.estimatedRoiImpact}. Our milestone velocity timeline illustrates that deliverables are compounding into measurable capacity returns.`,
          keyBullets: [
            `Draw attention to the Recharts Milestone Velocity curve showing actual vs. projected progress.`,
            `Connect software adoption directly to the client's internal P&L or capacity savings.`,
            `Highlight verified milestone wins completed by the client's team.`,
          ],
          objections: [
            {
              q: 'How did we arrive at the estimated ROI figure?',
              a: 'The calculation multiplies hours saved per workflow across active seats by the average operational loaded cost, vetted alongside your finance stakeholders.',
            },
            {
              q: 'What will it take to reach 100% of the target value?',
              a: `Executing the next two upcoming roadmap milestones will close the remaining gap to ${objective.targetValue}${objective.unit}.`,
            },
          ],
        };

      case 2:
        return {
          title: 'Strategic Risks & Blockers',
          sectionKicker: 'SLIDE 3 OF 6 · PROACTIVE RISK AUDIT',
          timing: '4-5 mins',
          focus: 'Governance Health & Friction Remediation',
          script: `Partnership transparency is essential for long-term success. Our current relationship health index sits at ${account.healthScore}/100. ${account.healthScore < 70 ? `Because this score is flagged, we have initiated an active risk mitigation motion prioritizing stabilization and barrier removal over new scope.` : `Our health score indicates strong partnership mechanics, though we are tracking specific operational friction points to ensure uninterrupted momentum.`}`,
          keyBullets: [
            `Address friction before the executive sponsor brings it up; lead with ownership.`,
            delayedMilestones.length > 0 
              ? `Acknowledge delayed deliverable '${delayedMilestones[0].title}' and outline the containment strategy.`
              : `Confirm zero blocking dependencies currently jeopardizing the timeline.`,
            `Reassure leadership that engineering and customer success are fully resourced for mitigation.`,
          ],
          objections: [
            {
              q: 'Is this risk going to impact our quarterly commitments?',
              a: 'No. Our containment plan isolates this dependency so that parallel integration work continues uninterrupted.',
            },
            {
              q: 'Do you need additional technical resources from our side?',
              a: 'Only 2 hours of access from your technical gatekeeper to validate the API token permissions.',
            },
          ],
        };

      case 3:
        return {
          title: 'Stakeholder Alignment & Sponsor Status',
          sectionKicker: 'SLIDE 4 OF 6 · GOVERNANCE COVERAGE',
          timing: '3-4 mins',
          focus: 'Multi-threaded Sponsorship & Champion Security',
          script: `A resilient enterprise relationship requires multi-threaded leadership engagement. On this slide, we map our key stakeholders. ${executiveSponsor ? `We are grateful for ${executiveSponsor.name}'s ongoing sponsorship.` : `A key priority is formalizing executive sponsorship to guarantee strategic alignment.`} We also celebrate our champions who drive daily operational adoption.`,
          keyBullets: [
            `Audit organizational coverage: ${activeStakeholders.length > 2 ? 'Multi-threaded coverage is healthy across business and technical leads.' : 'Single-threaded vulnerability detected; propose onboarding additional champions.'}`,
            `Ask if any organizational restructuring or new leaders should be briefed.`,
            `Highlight positive sentiment from operational champions.`,
          ],
          objections: [
            {
              q: 'Our executive sponsor is moving to a new role next month. How do we transition?',
              a: 'We have a standard 14-day sponsor succession playbook. We will schedule an executive briefing with the incoming leader to transfer all baseline metrics seamlessly.',
            },
          ],
        };

      case 4:
        return {
          title: 'Renewal & Expansion Opportunities',
          sectionKicker: 'SLIDE 5 OF 6 · COMMERCIAL LIFECYCLE',
          timing: '3-4 mins',
          focus: 'Commercial Partnership & Expansion Standing',
          script: `${account.companyName} currently represents an annual recurring commitment of $${account.annualRecurringRevenue.toLocaleString()}. With renewal scheduled for ${new Date(account.contractRenewalDate).toLocaleDateString()}, our posture is focused on ensuring realized value far outpaces your investment. ${account.healthScore >= 75 ? `Given our strong partnership health (${account.healthScore}/100), we recommend exploring scope expansion inside the ${account.businessUnit} department.` : `Our immediate mandate remains solidifying baseline ROI before proposing footprint expansion.`}`,
          keyBullets: [
            `Reframe renewal as a natural outcome of value delivery, not an isolated sales negotiation.`,
            `Highlight expansion avenues only when health score supports it.`,
            `Confirm budget planning cycles and procurement timeline.`,
          ],
          objections: [
            {
              q: 'Why should we consider expanding before our renewal date?',
              a: `Expanding within the ${account.businessUnit} division now allows us to consolidate licensing discounts and scale existing integrations without duplicate setup costs.`,
            },
          ],
        };

      case 5:
        return {
          title: 'Immediate Path Forward & Ownership',
          sectionKicker: 'SLIDE 6 OF 6 · ACTION & SIGN-OFF',
          timing: '3-4 mins',
          focus: 'Mutual Accountability & Executive Authorization',
          script: `To conclude today's review, our concrete path forward is defined: "${objective.nextSteps || 'Execute scheduled roadmap deliverables'}". We have assigned specific milestone owners for the next 30, 60, and 90 days. We ask for leadership endorsement today so both teams can execute with full alignment.`,
          keyBullets: [
            `Walk through upcoming milestones and confirm accountable owners by name.`,
            `Request formal verbal sign-off from the executive sponsor.`,
            `Confirm next review cadence and interim milestone checkpoint date.`,
          ],
          objections: [
            {
              q: 'Who owns overall delivery accountability?',
              a: `As your Strategic Advisory Lead, ${profile.fullName} owns milestone coordination and weekly executive reporting.`,
            },
            {
              q: 'What is our first deliverable due date?',
              a: `${activeMilestones.find(m => m.status === 'Planned' || m.status === 'In Progress')?.dueDate || 'Within the next 30 days.'}`,
            },
          ],
        };

      default:
        return {
          title: 'Executive Review Slide',
          sectionKicker: 'EXECUTIVE REVIEW',
          timing: '3 mins',
          focus: 'Strategic Alignment',
          script: `Guide executive stakeholders through the strategic highlights of this section, tying all operational data back to the primary mandate: "${objective.statement}".`,
          keyBullets: ['Confirm executive alignment.', 'Answer stakeholder questions.', 'Document action items.'],
          objections: [],
        };
    }
  };

  const content = getSlideContent(selectedSlideView);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(content.script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end print:hidden">
      {/* Background Dim Backdrop (Click outside to close) */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative z-50 w-full sm:w-[460px] md:w-[500px] h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-250 select-text">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  Presenter Drawer
                </span>
                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">[N to toggle]</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                {content.title}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyScript}
              className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
              title="Copy current slide script to clipboard"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Close Presenter Drawer (ESC or N)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Slide Jump Selector (If in EBR view) */}
        {reportType === 'EBR' && (
          <div className="px-3 py-2 bg-slate-100/70 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            {SLIDE_NAV_NAMES.map((name, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedSlideView(idx);
                  if (onSelectSlide) onSelectSlide(idx);
                }}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition whitespace-nowrap cursor-pointer ${
                  selectedSlideView === idx
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {/* Stopwatch & Content View Tabs */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0 text-xs">
          {/* Meeting Elapsed Timer */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Timer:</span>
            <span className="font-mono text-xs font-extrabold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {formatTimer(elapsedSeconds)}
            </span>
            <button
              onClick={() => setIsTimerRunning(prev => !prev)}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              title={isTimerRunning ? 'Pause Timer' : 'Start Timer'}
            >
              {isTimerRunning ? <Pause className="h-3 w-3 text-amber-500" /> : <Play className="h-3 w-3 text-emerald-500" />}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setElapsedSeconds(0);
              }}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>

          {/* Sub-Tabs: AI Script vs Private Notes */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
            <button
              onClick={() => setActiveTab('script')}
              className={`px-2 py-0.5 rounded transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'script' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500'
              }`}
            >
              <FileText className="h-3 w-3" />
              <span>Talking Track</span>
            </button>
            <button
              onClick={() => setActiveTab('customNotes')}
              className={`px-2 py-0.5 rounded transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'customNotes' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Edit3 className="h-3 w-3" />
              <span>Private Notes</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-800 dark:text-slate-200">
          {activeTab === 'script' ? (
            <>
              {/* Timing & Focus Badge Card */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500 shrink-0" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {content.timing}
                  </span>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  {content.focus}
                </span>
              </div>

              {/* Word-for-Word Executive Narrative Script */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Executive Talking Track
                  </span>
                  <span className="text-[9px] text-slate-400 italic">Read or adapt naturally</span>
                </div>
                <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50 text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-medium select-text">
                  &ldquo;{content.script}&rdquo;
                </div>
              </div>

              {/* Bullet Talking Points for Slides */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Key Executive Anchors
                </span>
                <div className="space-y-1.5">
                  {content.keyBullets.map((bullet, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 text-[11px]"
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anticipated Sponsor Objections & Answers (Collapsible Accordion) */}
              {content.objections && content.objections.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
                    Sponsor Objections &amp; Responses
                  </span>

                  <div className="space-y-2">
                    {content.objections.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-800/30"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                          className="w-full flex items-center justify-between p-3 text-left text-[11px] font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition cursor-pointer"
                        >
                          <span className="pr-2">{item.q}</span>
                          {openFaqIndex === idx ? (
                            <ChevronUp className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          )}
                        </button>

                        {openFaqIndex === idx && (
                          <div className="p-3 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 leading-relaxed">
                            <span className="font-semibold text-blue-600 dark:text-blue-400 mr-1">Recommended Response:</span>
                            {item.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Custom Private Notes Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Private Slide Notes ({SLIDE_NAV_NAMES[selectedSlideView] || 'Active Slide'})
                </span>
                <span className="text-[10px] text-slate-400">Auto-saved to your browser</span>
              </div>
              <textarea
                value={privateNotes}
                onChange={(e) => handleSaveNotes(e.target.value)}
                placeholder="Type your personal observations, meeting takeaways, or stakeholder cues for this slide..."
                rows={12}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-sans text-xs leading-relaxed"
              />
              <p className="text-[10px] text-slate-400 italic">
                These notes remain private to you and will not appear on exported PDF or presentation slides.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 text-[10px] flex items-center justify-between text-slate-500 shrink-0">
          <span>Prepared by: <strong>{profile.fullName}</strong></span>
          <span>Account: <strong>{account.companyName}</strong></span>
        </div>
      </div>
    </div>
  );
};

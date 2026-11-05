import React, { useState, useEffect } from 'react';
import { Account, PrimaryObjective, Stakeholder, SuccessMilestone, ReportType, UserProfile } from '../types';
import { 
  Award, 
  Briefcase, 
  Calendar, 
  Check,
  CheckCircle2, 
  ChevronLeft,
  ChevronRight, 
  CornerDownRight, 
  CreditCard, 
  DollarSign, 
  Download, 
  Eye, 
  Layers, 
  Mail, 
  Maximize2,
  Minimize2,
  Play, 
  Printer, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Users,
  MessageSquare 
} from 'lucide-react';
import { PRESENTATION_THEMES, PresentationTheme } from './ThemeConfig';
import { MilestoneTimelineChart } from './MilestoneTimelineChart';
import { PresenterDrawer } from './PresenterDrawer';

const SLIDE_TITLES = [
  'Executive Summary',
  'Outcomes & Value',
  'Risks & Blockers',
  'Stakeholder Matrix',
  'Renewal & Growth',
  'Immediate Next Steps'
];

interface ReportPreviewProps {
  profile: UserProfile;
  account: Account;
  objective: PrimaryObjective;
  stakeholders: Stakeholder[];
  milestones: SuccessMilestone[];
  reportType: ReportType;
  onChangeReportType: (type: ReportType) => void;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({
  profile,
  account,
  objective,
  stakeholders,
  milestones,
  reportType,
  onChangeReportType,
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPresenterOpen, setIsPresenterOpen] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState<PresentationTheme>(() => {
    const stored = localStorage.getItem('impactstream_active_theme');
    return PRESENTATION_THEMES.find(t => t.id === stored) || PRESENTATION_THEMES[0];
  });

  // Filter local account stakeholders and milestones
  const activeStakeholders = stakeholders.filter(s => s.accountId === account.id);
  const activeMilestones = milestones.filter(m => m.accountId === account.id);

  // Calculations for progress bar
  const baseline = parseFloat(objective.baselineValue) || 0;
  const current = parseFloat(objective.currentValue) || 0;
  const target = parseFloat(objective.targetValue) || 100;

  let progressPercentage = 0;
  if (target - baseline !== 0) {
    progressPercentage = Math.round(((current - baseline) / (target - baseline)) * 100);
  }
  progressPercentage = Math.max(0, Math.min(100, progressPercentage)); // Bound to 0-100

  // Calculate project completion
  const completedMilestones = activeMilestones.filter(m => m.status === 'Completed').length;
  const totalMilestonesCount = activeMilestones.length;
  const milestoneProgress = totalMilestonesCount > 0 
    ? Math.round((completedMilestones / totalMilestonesCount) * 100)
    : 0;

  // Keyboard navigation for executive boardroom presentation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not intercept if user is typing in form controls
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement || 
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === 'Escape') {
        if (isPresenterOpen) {
          e.preventDefault();
          setIsPresenterOpen(false);
          return;
        }
        if (isFullscreen) {
          e.preventDefault();
          setIsFullscreen(false);
          return;
        }
      }

      // Hotkey 'n' or 'N' toggles Presenter Talking Points
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsPresenterOpen(prev => !prev);
        return;
      }

      if (reportType === 'EBR') {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
          e.preventDefault();
          setActiveSlide(prev => Math.min(5, prev + 1));
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          setActiveSlide(prev => Math.max(0, prev - 1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reportType, isFullscreen, isPresenterOpen]);

  // Handle browser printing with exact 16:9 multi-page slide pagination
  const handlePrint = () => {
    window.print();
  };

  // Export structured slide data package (.json) ready for Google Slides / PPTX pipelines
  const handleExportSlideDataPackage = () => {
    const daysLeft = Math.ceil((new Date(account.contractRenewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysLeft < 0;

    const exportPayload = {
      generator: "ImpactStream Executive Review System",
      schemaVersion: "1.0.0",
      exportTimestamp: new Date().toISOString(),
      presentationTarget: "Google Slides / PowerPoint PPTX Ready Data Package",
      account: {
        id: account.id,
        companyName: account.companyName,
        industry: account.industry,
        accountTier: account.accountTier,
        businessUnit: account.businessUnit,
        annualRecurringRevenue: account.annualRecurringRevenue,
        healthScore: account.healthScore,
        contractStartDate: account.contractStartDate,
        contractRenewalDate: account.contractRenewalDate,
        lifecycleStatus: isOverdue ? "Renewal Overdue" : `${daysLeft} Days to Renewal`,
      },
      advisoryLead: {
        name: profile.fullName,
        title: profile.jobTitle,
        email: profile.email,
        companyName: profile.companyName,
      },
      theme: {
        id: activeTheme.id,
        name: activeTheme.name,
        accentColor: activeTheme.accentColor,
        isDarkMode: activeTheme.id === 'modern-ops',
      },
      reportType,
      ebrDeck: {
        totalSlides: 6,
        aspectRatio: "16:9",
        slides: [
          {
            index: 1,
            title: "Executive Partnership Review",
            subtitle: "Strategic Alignment, Business Impact & Executive Roadmap",
            objective: objective.statement,
            focusType: objective.focusType,
            primaryMetric: {
              name: objective.metricName,
              baseline: `${objective.baselineValue}${objective.unit}`,
              current: `${objective.currentValue}${objective.unit}`,
              target: `${objective.targetValue}${objective.unit}`,
              progressAttainment: `${progressPercentage}%`,
            },
            commercialARR: account.annualRecurringRevenue,
            renewalDate: account.contractRenewalDate,
            governanceHealth: account.healthScore,
            speakerNotes: `Thank you everyone for joining today's Executive Business Review for ${account.companyName}. Over the past evaluation period, our collective focus has been: "${objective.statement}". Today, we have three clear objectives: verify business outcomes and ROI delivered, address operational risks, and align on upcoming roadmap commitments.`,
          },
          {
            index: 2,
            title: "Business Outcomes & Value Delivered",
            subtitle: "Performance Indicator Trends & Financial ROI Realization",
            metricTrajectory: `${objective.baselineValue}${objective.unit} -> ${objective.currentValue}${objective.unit}`,
            attainment: `${progressPercentage}%`,
            targetValue: `${objective.targetValue}${objective.unit}`,
            financialRoiNarrative: objective.estimatedRoiImpact,
            roiNumericImpact: objective.roiNumericImpact,
            speakerNotes: `Turning to value realization: our primary KPI '${objective.metricName}' has progressed from ${objective.baselineValue}${objective.unit} to ${objective.currentValue}${objective.unit}, delivering an estimated yield of ${objective.estimatedRoiImpact}. Milestone velocity indicates compounding returns.`,
            milestoneTimelineVelocity: {
              totalMilestones: activeMilestones.length,
              completedCount: activeMilestones.filter(m => m.status === 'Completed').length,
              timelinePoints: activeMilestones.map((m, i) => ({
                title: m.title,
                dueDate: m.dueDate,
                status: m.status,
                projectedPercent: Math.round(((i + 1) / Math.max(1, activeMilestones.length)) * 100),
                actualPercent: Math.round((activeMilestones.slice(0, i + 1).filter(x => x.status === 'Completed').length / Math.max(1, activeMilestones.length)) * 100),
              })),
            },
          },
          {
            index: 3,
            title: "Strategic Risks & Blockers",
            subtitle: "Governance Health Diagnostics, Stakeholder Alignment & Milestone Friction",
            governanceStatus: account.healthScore < 70 ? "At Risk" : "Stable",
            healthScore: account.healthScore,
            strategicFocus: objective.focusType,
            speakerNotes: `Partnership transparency is essential. Current health score is ${account.healthScore}/100. We are actively mitigating friction points to ensure uninterrupted momentum.`,
            blockers: activeMilestones
              .filter(m => m.status === 'Delayed' || m.status === 'Blocked')
              .map(m => ({ title: m.title, owner: m.owner, status: m.status, impactType: m.impactType })),
          },
          {
            index: 4,
            title: "Stakeholder Alignment & Sponsor Status",
            subtitle: "Executive Sponsor Mapping & Multi-threaded Governance Coverage",
            executiveSponsor: activeStakeholders.find(s => s.role === 'Executive Sponsor') || null,
            stakeholderCoverageCount: activeStakeholders.length,
            isMultiThreaded: activeStakeholders.length > 2,
            speakerNotes: `A resilient enterprise relationship requires multi-threaded engagement. Currently mapping ${activeStakeholders.length} strategic contacts across leadership and daily champion tiers.`,
            stakeholdersList: activeStakeholders.map(s => ({
              name: s.name,
              title: s.title,
              role: s.role,
              sentiment: s.sentiment,
            })),
          },
          {
            index: 5,
            title: "Renewal & Expansion Opportunities",
            subtitle: "Commercial Partnership Standing, Lifecycle Timelines & Scaling Recommendations",
            speakerNotes: `${account.companyName} represents an annual recurring commitment of $${account.annualRecurringRevenue.toLocaleString()}. Our mandate is ensuring value outpaces your investment ahead of our renewal on ${new Date(account.contractRenewalDate).toLocaleDateString()}.`,
            contractLifecycle: {
              annualRecurringRevenue: account.annualRecurringRevenue,
              contractStartDate: account.contractStartDate,
              contractRenewalDate: account.contractRenewalDate,
              daysRemaining: daysLeft,
            },
            expansionPosture: account.healthScore >= 75 ? "Active Expansion Candidate" : "Retention Safeguard",
          },
          {
            index: 6,
            title: "Immediate Path Forward & Ownership",
            subtitle: "Action Plan, Milestone Owners & Executive Authorization",
            advisoryDirective: objective.nextSteps,
            speakerNotes: `To conclude today's review, our concrete path forward is: "${objective.nextSteps || 'Execute scheduled roadmap deliverables'}". We have assigned milestone owners and ask for leadership authorization today.`,
            upcomingMilestones: activeMilestones
              .filter(m => m.status === 'Planned' || m.status === 'In Progress')
              .map(m => ({ title: m.title, owner: m.owner, dueDate: m.dueDate, impactType: m.impactType })),
            signoffAdvisoryLead: profile.fullName,
            signoffClientAuthorizationRequired: true,
          },
        ],
      },
    };

    const fileName = `${account.companyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${reportType.toLowerCase()}_presentation_data.json`;
    const jsonBlob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice(`Exported ${fileName}`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Top Controller */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 print:hidden shadow-xs">
        {/* Toggle between EBR, QBR, and OPR */}
        <div className="flex bg-slate-100 rounded-xl p-1 shadow-inner w-full xl:w-auto">
          <button
            onClick={() => onChangeReportType('EBR')}
            className={`flex-1 xl:flex-initial px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              reportType === 'EBR' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            EBR Slide deck
          </button>
          <button
            onClick={() => onChangeReportType('QBR')}
            className={`flex-1 xl:flex-initial px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              reportType === 'QBR' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            QBR Operations
          </button>
          <button
            onClick={() => onChangeReportType('OPR')}
            className={`flex-1 xl:flex-initial px-5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              reportType === 'OPR' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            One-Page Summary
          </button>
        </div>

        {/* Theme / Style Selector */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-xs w-full xl:w-auto">
          <Sparkles className="h-4 w-4 text-amber-500 ml-2 shrink-0" />
          <span className="text-xs font-bold text-slate-600 mr-1 hidden sm:inline">Theme Profile:</span>
          <select
            value={activeTheme.id}
            onChange={(e) => {
              const selected = PRESENTATION_THEMES.find(t => t.id === e.target.value);
              if (selected) {
                setActiveTheme(selected);
                localStorage.setItem('impactstream_active_theme', selected.id);
              }
            }}
            className="bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer py-1.5 pr-8 pl-1 rounded-lg w-full xl:w-auto"
          >
            {PRESENTATION_THEMES.map(t => (
              <option key={t.id} value={t.id}>{t.name} &bull; {t.id === 'modern-ops' ? 'Dark' : 'Light'}</option>
            ))}
          </select>
        </div>

        {/* Action Controls: Live Fullscreen, Presenter Notes, Print/PDF, and Slide Data Export */}
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
          <button
            onClick={() => setIsPresenterOpen(prev => !prev)}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 border text-xs font-bold rounded-xl transition shadow-xs cursor-pointer ${
              isPresenterOpen
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
            title="Toggle Live Presenter Talking Points Drawer (Hotkey: N)"
          >
            <MessageSquare className={`h-3.5 w-3.5 ${isPresenterOpen ? 'text-white' : 'text-blue-600'}`} />
            <span>Presenter Notes</span>
          </button>

          <button
            onClick={() => setIsFullscreen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white rounded-xl transition shadow-xs cursor-pointer"
            title="Launch Fullscreen Presentation Mode (← / → keys for slides, ESC to exit)"
          >
            <Maximize2 className="h-3.5 w-3.5 text-blue-400" />
            <span>Present Fullscreen</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-xl transition shadow-xs cursor-pointer"
            title="Generate direct PDF output via browser 16:9 pagination"
          >
            <Printer className="h-3.5 w-3.5 text-slate-600" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={handleExportSlideDataPackage}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-xl transition shadow-xs cursor-pointer"
            title="Export complete deck structure and tokens (.json) for Google Slides or PowerPoint"
          >
            <Download className="h-3.5 w-3.5 text-slate-600" />
            <span>Export Slide Data</span>
          </button>
        </div>
      </div>

      {/* Presenter Notes & Talking Points Drawer (QBRBuilder Style) */}
      <PresenterDrawer
        isOpen={isPresenterOpen}
        onClose={() => setIsPresenterOpen(false)}
        activeSlide={activeSlide}
        reportType={reportType}
        account={account}
        objective={objective}
        stakeholders={stakeholders}
        milestones={milestones}
        theme={activeTheme}
        profile={profile}
        onSelectSlide={setActiveSlide}
      />

      {/* Export notification toast */}
      {exportNotice && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-semibold animate-in fade-in slide-in-from-top-1 print:hidden">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{exportNotice} &bull; Ready for Google Slides &amp; PowerPoint pipelines.</span>
        </div>
      )}

      {/* Slide Navigation Tab Bar for EBR Slide deck (Interactive & Excluded from print outputs) */}
      {reportType === 'EBR' && (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 print:hidden shadow-xs">
          <div className="flex flex-wrap gap-1.5">
            {SLIDE_TITLES.map((title, idx) => {
              const icons = [Eye, TrendingUp, ShieldAlert, Users, CreditCard, Calendar];
              const Icon = icons[idx];
              return (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeSlide === idx 
                      ? 'text-white shadow-xs' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  style={activeSlide === idx ? { backgroundColor: activeTheme.accentColor } : {}}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden md:inline">{title}</span>
                  <span className="md:hidden">{idx + 1}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pr-2 text-slate-500 text-[11px] font-semibold hidden lg:flex">
            <span>Slide {activeSlide + 1} of 6</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-[10px] text-slate-400 font-mono">Use &larr; / &rarr; keys</span>
          </div>
        </div>
      )}

      {/* The Presentation Card (Interactive HTML Slide) */}
      <div 
        id="presentation-output" 
        className={
          isFullscreen 
            ? "fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-md flex flex-col justify-between p-4 md:p-6 overflow-hidden select-none animate-in fade-in duration-200"
            : "flex-1 flex flex-col justify-center"
        }
      >
        {/* Fullscreen Boardroom Top Control Bar */}
        {isFullscreen && (
          <div className="flex items-center justify-between px-5 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-white shadow-xl shrink-0 print:hidden mb-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded bg-blue-600 text-white">
                Live Executive Deck
              </span>
              <span className="text-xs font-bold text-slate-200">
                {account.companyName}
              </span>
              <span className="text-slate-500 text-xs hidden sm:inline">&bull;</span>
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                {reportType === 'EBR' ? `Slide ${activeSlide + 1} of 6: ${SLIDE_TITLES[activeSlide]}` : reportType}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {reportType === 'EBR' && (
                <div className="flex items-center gap-1.5 bg-slate-800/90 rounded-lg p-1">
                  <button
                    onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
                    disabled={activeSlide === 0}
                    className="p-1.5 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent rounded transition cursor-pointer text-slate-200"
                    title="Previous Slide (← Left Arrow)"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-mono font-bold px-2 text-slate-300">
                    {activeSlide + 1} / 6
                  </span>
                  <button
                    onClick={() => setActiveSlide(prev => Math.min(5, prev + 1))}
                    disabled={activeSlide === 5}
                    className="p-1.5 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent rounded transition cursor-pointer text-slate-200"
                    title="Next Slide (→ Right Arrow or Space)"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                [&larr; / &rarr; Arrow Keys]
              </span>

              <button
                onClick={() => setIsPresenterOpen(prev => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isPresenterOpen
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title="Toggle Live Presenter Talking Points (Hotkey: N)"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Notes (N)</span>
              </button>

              <button
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 text-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
                title="Exit Fullscreen (ESC)"
              >
                <Minimize2 className="h-3.5 w-3.5" />
                <span>Exit (ESC)</span>
              </button>
            </div>
          </div>
        )}

        <div className={isFullscreen ? "flex-1 flex items-center justify-center p-2 md:p-4 overflow-hidden w-full" : "w-full"}>
          <div className={isFullscreen ? "w-full max-w-6xl aspect-video flex flex-col shadow-2xl rounded-2xl overflow-hidden relative" : "w-full"}>
            {/* VIEW 1: EXECUTIVE BUSINESS REVIEW (EBR) */}
            {reportType === 'EBR' && (
              <div className="space-y-4 w-full">
                {/* Slide 0: Executive Summary */}
                <div className={`report-slide ${activeTheme.bgClass} rounded-2xl ${activeTheme.borderClass} ${activeTheme.shadowClass} ${activeTheme.fontSans} relative flex flex-col justify-between overflow-hidden p-10 md:p-12 slide-aspect-ratio w-full transition duration-300 print:shadow-none print:border-none print:p-0 print:m-0 ${
                  activeSlide === 0 ? 'flex' : 'hidden print:flex print:break-after-page'
                }`}>
                  {/* Watermark Design element */}
                  <div 
                className={`absolute top-0 right-0 w-80 h-80 rounded-full -translate-y-24 translate-x-24 ${activeTheme.glowOpacity} blur-3xl`}
                style={{ backgroundColor: activeTheme.accentColor }}
              ></div>

              {/* Slide Header */}
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block mb-1" style={{ color: activeTheme.accentColor }}>
                    EXECUTIVE BUSINESS REVIEW
                  </span>
                  <h3 className={`text-2xl md:text-3.5xl font-extrabold ${activeTheme.fontDisplay} ${activeTheme.textTitle} tracking-tight leading-none`}>
                    {account.companyName}
                  </h3>
                  <p className={`text-xs md:text-sm ${activeTheme.textMuted} mt-1 font-medium italic`}>
                    Business Unit: {account.businessUnit || "(Unassigned)"}
                  </p>
                </div>
                <img 
                  src={profile.companyLogoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"} 
                  alt="Brand Logo" 
                  className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-xl border border-slate-100 bg-white shadow-xs"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80";
                  }}
                />
              </div>

              {/* Middle Section */}
              <div className="grid grid-cols-12 gap-8 my-auto relative z-10 items-center">
                <div className="col-span-7 space-y-4">
                  <span className={`text-[9px] md:text-[10px] font-bold ${activeTheme.textMuted} uppercase tracking-widest block`}>Core Partnership Mandate</span>
                  <blockquote 
                    className={`text-base md:text-xl font-extrabold ${activeTheme.fontDisplay} ${activeTheme.textTitle} leading-tight border-l-4 pl-4 md:pl-6`}
                    style={{ borderLeftColor: activeTheme.accentColor }}
                  >
                    &ldquo;{objective.statement || "(Strategic partnership objective not defined yet)"}&rdquo;
                  </blockquote>
                  <p className={`text-[11px] md:text-xs ${activeTheme.textBody} leading-relaxed max-w-xl`}>
                    This Executive Business Review serves to align our mutual teams on the primary business outcomes, verify delivered value milestones, audit stakeholder coverage, address strategic delivery risks, and establish immediate milestones.
                  </p>
                </div>

                <div className={`col-span-5 space-y-2.5 ${activeTheme.cardBg} border ${activeTheme.cardBorder} p-5 rounded-2xl`}>
                  <span className={`text-[9px] font-extrabold ${activeTheme.textMuted} uppercase tracking-widest block mb-1`}>Portfolio Diagnostics</span>
                  <div className={`flex justify-between items-center py-1.5 border-b ${activeTheme.divider}`}>
                    <span className={`text-xs font-semibold ${activeTheme.textBody}`}>Governance Level</span>
                    <span className={`text-xs font-bold ${activeTheme.textTitle}`}>{account.accountTier} Account</span>
                  </div>
                  <div className={`flex justify-between items-center py-1.5 border-b ${activeTheme.divider}`}>
                    <span className={`text-xs font-semibold ${activeTheme.textBody}`}>Business Unit</span>
                    <span className={`text-xs font-bold ${activeTheme.textTitle} truncate max-w-[140px]`}>{account.businessUnit || "(Unassigned)"}</span>
                  </div>
                  <div className={`flex justify-between items-center py-1.5 border-b ${activeTheme.divider}`}>
                    <span className={`text-xs font-semibold ${activeTheme.textBody}`}>Industry Sector</span>
                    <span className={`text-xs font-bold ${activeTheme.textTitle}`}>{account.industry}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5">
                    <span className={`text-xs font-semibold ${activeTheme.textBody}`}>Relationship Index</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      account.healthScore >= 80 ? activeTheme.tagSuccess :
                      account.healthScore >= 60 ? activeTheme.tagWarning :
                      activeTheme.tagDanger
                    }`}>
                      {account.healthScore}/100 Score
                    </span>
                  </div>
                </div>
              </div>

              {/* Slide Footer */}
              <div className={`border-t ${activeTheme.divider} pt-5 flex justify-between items-center mt-auto`}>
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <p className={`text-[9px] uppercase tracking-wider ${activeTheme.textMuted} font-bold`}>Prepared Advisory Lead</p>
                    <p className={`text-xs font-bold ${activeTheme.textTitle} ${activeTheme.fontDisplay}`}>{profile.fullName}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-[9px] uppercase tracking-wider ${activeTheme.textMuted} font-bold`}>Renewal Target</p>
                  <p className="text-xs font-bold text-rose-600">
                    {new Date(account.contractRenewalDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Slide 1: Outcomes & Value */}
            <div className={`report-slide ${activeTheme.bgClass} rounded-2xl ${activeTheme.borderClass} ${activeTheme.shadowClass} ${activeTheme.fontSans} relative flex flex-col justify-between overflow-hidden p-10 md:p-12 slide-aspect-ratio w-full transition duration-300 print:shadow-none print:border-none print:p-0 print:m-0 ${
              activeSlide === 1 ? 'flex' : 'hidden print:flex print:break-after-page'
            }`}>
              <div 
                className={`absolute top-0 right-0 w-80 h-80 rounded-full -translate-y-24 translate-x-24 ${activeTheme.glowOpacity} blur-3xl`}
                style={{ backgroundColor: activeTheme.accentColor }}
              ></div>

              {/* Header */}
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block mb-1" style={{ color: activeTheme.accentColor }}>
                    EXECUTIVE BUSINESS REVIEW
                  </span>
                  <h3 className={`text-2xl md:text-3.5xl font-extrabold ${activeTheme.fontDisplay} ${activeTheme.textTitle} tracking-tight leading-none`}>
                    Business Outcomes & Value Delivered
                  </h3>
                  <p className={`text-xs ${activeTheme.textMuted} mt-1 font-medium italic`}>
                    Performance Indicator Trends & Financial ROI Realization
                  </p>
                </div>
                <img 
                  src={profile.companyLogoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"} 
                  alt="Brand Logo" 
                  className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-xl border border-slate-100 bg-white shadow-xs"
                />
              </div>

              {/* Middle Section */}
              <div className="grid grid-cols-12 gap-8 my-auto relative z-10 items-stretch">
                {/* Left: Metric Trend */}
                <div className={`col-span-6 flex flex-col justify-between pr-4 border-r ${activeTheme.divider}`}>
                  <div className="space-y-3">
                    <span className={`text-[9px] md:text-[10px] font-bold ${activeTheme.textMuted} uppercase tracking-widest block`}>Primary Performance Indicator</span>
                    <h4 className={`text-sm font-bold ${activeTheme.textTitle} ${activeTheme.fontDisplay} leading-tight`}>
                      {objective.metricName || "(Primary Metric Not Registered)"}
                    </h4>
                    
                    <div className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} p-4 rounded-xl space-y-2.5`}>
                      <div className="flex justify-between items-baseline">
                        <span className={`text-[11px] ${activeTheme.textMuted} font-medium`}>Metric Trajectory</span>
                        <span className={`text-base font-extrabold ${activeTheme.textTitle} font-mono`}>
                          {objective.baselineValue || "0"}{objective.unit} &rarr; {objective.currentValue || "0"}{objective.unit}
                        </span>
                      </div>
                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className={`w-full h-2 ${activeTheme.accentBg} rounded-full overflow-hidden`}>
                          <div 
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${progressPercentage}%`, backgroundColor: activeTheme.accentColor }}
                          ></div>
                        </div>
                        <div className={`flex justify-between text-[8px] ${activeTheme.textMuted} font-bold`}>
                          <span>0% Achievement</span>
                          <span>Target: {objective.targetValue || "100"}{objective.unit} ({progressPercentage}% Attainment)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: ROI & Milestone Accomplishments */}
                <div className="col-span-6 flex flex-col justify-between pl-2">
                  <div className="space-y-2.5">
                    <span className={`text-[9px] md:text-[10px] font-bold ${activeTheme.textMuted} uppercase tracking-widest block`}>Economic & Operational Yield</span>
                    
                    {/* ROI Banner */}
                    <div 
                      className="p-3 rounded-xl text-white shadow-xs flex items-center justify-between"
                      style={{ background: `linear-gradient(135deg, ${activeTheme.accentColor} 0%, ${activeTheme.id === 'modern-ops' ? '#111827' : '#334155'} 100%)` }}
                    >
                      <div>
                        <span className="text-[8px] font-bold text-blue-100 uppercase tracking-widest block">Financial ROI Projection</span>
                        <h4 className={`text-sm md:text-base font-black ${activeTheme.fontDisplay} mt-0.5`}>
                          {objective.estimatedRoiImpact || "(ROI impact not calculated)"}
                        </h4>
                      </div>
                      <Award className="h-4 w-4 text-white/40 shrink-0" />
                    </div>

                    {/* Recharts Timeline Visualization */}
                    <MilestoneTimelineChart
                      milestones={activeMilestones}
                      theme={activeTheme}
                      height={135}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`border-t ${activeTheme.divider} pt-5 flex justify-between items-center mt-auto`}>
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <p className={`text-[9px] uppercase tracking-wider ${activeTheme.textMuted} font-bold`}>Prepared Advisory Lead</p>
                    <p className={`text-xs font-bold ${activeTheme.textTitle} ${activeTheme.fontDisplay}`}>{profile.fullName}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-[9px] uppercase tracking-wider ${activeTheme.textMuted} font-bold`}>Attainment Level</p>
                  <p className="text-xs font-bold text-emerald-600">{progressPercentage}% Target Completed</p>
                </div>
              </div>
            </div>

            {/* Slide 2: Risks & Blockers */}
            <div className={`report-slide ${activeTheme.bgClass} rounded-2xl ${activeTheme.borderClass} ${activeTheme.shadowClass} ${activeTheme.fontSans} relative flex flex-col justify-between overflow-hidden p-10 md:p-12 slide-aspect-ratio w-full transition duration-300 print:shadow-none print:border-none print:p-0 print:m-0 ${
              activeSlide === 2 ? 'flex' : 'hidden print:flex print:break-after-page'
            }`}>
              <div 
                className={`absolute top-0 right-0 w-80 h-80 rounded-full -translate-y-24 translate-x-24 ${activeTheme.glowOpacity} blur-3xl`}
                style={{ backgroundColor: activeTheme.accentColor }}
              ></div>

              {/* Header */}
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block mb-1" style={{ color: activeTheme.accentColor }}>
                    EXECUTIVE BUSINESS REVIEW
                  </span>
                  <h3 className={`text-2xl md:text-3.5xl font-extrabold ${activeTheme.fontDisplay} ${activeTheme.textTitle} tracking-tight leading-none`}>
                    Strategic Risks & Blockers
                  </h3>
                  <p className={`text-xs ${activeTheme.textMuted} mt-1 font-medium italic`}>
                    Governance Health Diagnostics, Stakeholder Alignment & Milestone Friction
                  </p>
                </div>
                <img 
                  src={profile.companyLogoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"} 
                  alt="Brand Logo" 
                  className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-xl border border-slate-100 bg-white shadow-xs"
                />
              </div>

              {/* Middle Section */}
              <div className="grid grid-cols-12 gap-8 my-auto relative z-10 items-stretch">
                {/* Left Column: Health & Priority Risks */}
                <div className={`col-span-6 space-y-3.5 pr-4 border-r ${activeTheme.divider}`}>
                  <span className={`text-[9px] md:text-[10px] font-bold ${activeTheme.textMuted} uppercase tracking-widest block`}>Active Risk Assessment</span>
                  
                  {/* Health Warning Card */}
                  <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                    account.healthScore < 70 
                      ? 'bg-rose-50/10 border-rose-500/20 text-rose-400' 
                      : `${activeTheme.cardBg} ${activeTheme.cardBorder} ${activeTheme.textBody}`
                  }`}>
                    <ShieldAlert className={`h-4 w-4 shrink-0 mt-0.5 ${account.healthScore < 70 ? 'text-rose-500' : activeTheme.textMuted}`} />
                    <div>
                      <h4 className={`text-[11px] font-bold ${activeTheme.fontDisplay} uppercase tracking-wider`}>Account Governance Health</h4>
                      <p className="text-[10px] mt-0.5 leading-relaxed">
                        {account.healthScore < 70 
                          ? `Governance index is currently flagged as AT RISK (${account.healthScore}/100). Remediation is required to address friction or integration roadblocks.`
                          : `Governance index is currently STABLE (${account.healthScore}/100). Partnership mechanics are operating within standard parameters.`
                        }
                      </p>
                    </div>
                  </div>

                  {/* Focus Type Risk */}
                  {objective.focusType === 'Risk' ? (
                    <div className="p-3.5 rounded-xl border bg-amber-500/10 border-amber-500/20 text-amber-400 flex items-start gap-3">
                      <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className={`text-[11px] font-bold ${activeTheme.fontDisplay} uppercase tracking-wider`}>Remediation Motion Focus</h4>
                        <p className="text-[10px] mt-0.5 leading-relaxed">
                          The designated strategic motion is set to "Risk Remediation". Operational focus prioritizes stabilizing metrics over introducing expansion programs.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className={`p-3.5 rounded-xl border ${activeTheme.cardBg} ${activeTheme.cardBorder} ${activeTheme.textMuted} flex items-start gap-3`}>
                      <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider">Strategic Motion Baseline</h4>
                        <p className={`text-[10px] mt-0.5 leading-relaxed ${activeTheme.textBody}`}>
                          Standard operating posture is focused on "{objective.focusType}" with no active high-level strategic escalations requested.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Blocked Milestones or Low Stakeholders */}
                <div className="col-span-6 space-y-3 pl-2">
                  <span className={`text-[9px] md:text-[10px] font-bold ${activeTheme.textMuted} uppercase tracking-widest block`}>Roadmap & Alignment Friction</span>
                  
                  {/* Milestone Blockers list */}
                  <div className="space-y-1.5">
                    <span className={`text-[8px] font-bold uppercase tracking-wider ${activeTheme.textMuted} block`}>Milestones At Risk</span>
                    {activeMilestones.filter(m => m.status === 'At Risk').length === 0 ? (
                      <div className={`p-2.5 ${activeTheme.cardBg} border ${activeTheme.cardBorder} rounded-xl flex items-center gap-2`}>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className={`text-[10px] ${activeTheme.textBody} font-semibold`}>No milestones are flagged as At Risk.</span>
                      </div>
                    ) : (
                      activeMilestones.filter(m => m.status === 'At Risk').slice(0, 2).map(ms => (
                        <div key={ms.id} className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between">
                          <div className="min-w-0 flex-1 pr-2">
                            <h5 className="text-[11px] font-bold text-rose-400 truncate">{ms.title}</h5>
                            <p className="text-[8px] text-rose-300 truncate">Due: {ms.dueDate} &bull; Owner: {ms.owner}</p>
                          </div>
                          <span className="text-[8px] font-bold px-1.5 py-0.5 bg-rose-500/20 text-rose-400 rounded uppercase shrink-0 border border-rose-500/30">At Risk</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Stakeholder Alignment Risks */}
                  <div className="space-y-1.5">
                    <span className={`text-[8px] font-bold uppercase tracking-wider ${activeTheme.textMuted} block`}>Stakeholder Alignment Friction</span>
                    {activeStakeholders.filter(s => s.alignment <= 2 || s.engagement === 'Low').length === 0 ? (
                      <div className={`p-2.5 ${activeTheme.cardBg} border ${activeTheme.cardBorder} rounded-xl flex items-center gap-2`}>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className={`text-[10px] ${activeTheme.textBody} font-semibold`}>Stakeholder relationship matrix is secured.</span>
                      </div>
                    ) : (
                      activeStakeholders.filter(s => s.alignment <= 2 || s.engagement === 'Low').slice(0, 2).map(stk => (
                        <div key={stk.id} className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
                          <div className="min-w-0 flex-1 pr-2">
                            <h5 className="text-[11px] font-bold text-amber-400 truncate">{stk.name}</h5>
                            <p className="text-[8px] text-amber-300 truncate">{stk.role} &bull; Alignment: {stk.alignment}/5</p>
                          </div>
                          <span className="text-[8px] font-bold px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded uppercase shrink-0 border border-amber-500/30">{stk.engagement} Engagement</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`border-t ${activeTheme.divider} pt-5 flex justify-between items-center mt-auto`}>
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <p className={`text-[9px] uppercase tracking-wider ${activeTheme.textMuted} font-bold`}>Prepared Advisory Lead</p>
                    <p className={`text-xs font-bold ${activeTheme.textTitle} ${activeTheme.fontDisplay}`}>{profile.fullName}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-[9px] uppercase tracking-wider ${activeTheme.textMuted} font-bold`}>Risk Trajectory</p>
                  <p className={`text-xs font-bold ${activeTheme.textTitle}`}>
                    {activeMilestones.filter(m => m.status === 'At Risk').length > 0 ? "Remediations Pending" : "Stable Roadmap"}
                  </p>
                </div>
              </div>
            </div>

            {/* Slide 3: Stakeholder Alignment */}
            <div className={`report-slide ${activeTheme.bgClass} rounded-2xl ${activeTheme.borderClass} ${activeTheme.shadowClass} ${activeTheme.fontSans} relative flex flex-col justify-between overflow-hidden p-10 md:p-12 slide-aspect-ratio w-full transition duration-300 print:shadow-none print:border-none print:p-0 print:m-0 ${
              activeSlide === 3 ? 'flex' : 'hidden print:flex print:break-after-page'
            }`}>
              <div 
                className={`absolute top-0 right-0 w-80 h-80 rounded-full -translate-y-24 translate-x-24 ${activeTheme.glowOpacity} blur-3xl`}
                style={{ backgroundColor: activeTheme.accentColor }}
              ></div>

              {/* Header */}
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block mb-1" style={{ color: activeTheme.accentColor }}>
                    EXECUTIVE BUSINESS REVIEW
                  </span>
                  <h3 className={`text-2xl md:text-3.5xl font-extrabold ${activeTheme.fontDisplay} ${activeTheme.textTitle} tracking-tight leading-none`}>
                    Stakeholder Alignment & Sponsor Status
                  </h3>
                  <p className={`text-xs ${activeTheme.textMuted} mt-1 font-medium italic`}>
                    Executive Sponsor Mapping & Multi-threaded Governance Coverage
                  </p>
                </div>
                <img 
                  src={profile.companyLogoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"} 
                  alt="Brand Logo" 
                  className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-xl border border-slate-100 bg-white shadow-xs"
                />
              </div>

              {/* Middle Section */}
              <div className="grid grid-cols-12 gap-8 my-auto relative z-10 items-stretch">
                {/* Left Column: Executive Sponsor Details */}
                <div className={`col-span-5 pr-4 border-r ${activeTheme.divider} flex flex-col justify-center`}>
                  <div className="space-y-3">
                    <span className={`text-[9px] md:text-[10px] font-bold ${activeTheme.textMuted} uppercase tracking-widest block`}>Executive Sponsor Alignment</span>
                    
                    {(() => {
                      const sponsor = activeStakeholders.find(s => s.role === 'Executive Sponsor');
                      if (!sponsor) {
                        return (
                          <div className={`p-4 border border-dashed ${activeTheme.cardBorder} rounded-xl ${activeTheme.cardBg} text-center space-y-1.5`}>
                            <Users className="h-5 w-5 text-rose-400 mx-auto" />
                            <h5 className="text-[11px] font-bold text-rose-600">Unmapped Executive Sponsor</h5>
                            <p className="text-[9px] text-rose-500 leading-normal">
                              No Executive Sponsor has been mapped. Designating a sponsor is critical to align outcomes with corporate priorities.
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} p-4 rounded-xl space-y-3`}>
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full text-white font-bold flex items-center justify-center text-xs shrink-0" style={{ backgroundColor: activeTheme.accentColor }}>
                              {sponsor.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className={`text-[11px] font-bold ${activeTheme.textTitle} truncate`}>{sponsor.name}</h4>
                              <p className={`text-[9px] ${activeTheme.textMuted} truncate`}>{sponsor.title}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-center">
                            <div className={`${activeTheme.id === 'modern-ops' ? 'bg-slate-900' : 'bg-white'} p-2 rounded-lg border ${activeTheme.cardBorder}`}>
                              <span className={`text-[8px] ${activeTheme.textMuted} font-bold uppercase block`}>Engagement</span>
                              <span className={`text-[10px] font-extrabold ${activeTheme.textTitle} mt-0.5 block`}>{sponsor.engagement}</span>
                            </div>
                            <div className={`${activeTheme.id === 'modern-ops' ? 'bg-slate-900' : 'bg-white'} p-2 rounded-lg border ${activeTheme.cardBorder}`}>
                              <span className={`text-[8px] ${activeTheme.textMuted} font-bold uppercase block`}>Alignment</span>
                              <span className={`text-[10px] font-extrabold ${activeTheme.textTitle} mt-0.5 block`}>{sponsor.alignment}/5 Index</span>
                            </div>
                          </div>
                          
                          {sponsor.notes && (
                            <p className={`text-[9px] ${activeTheme.textMuted} italic leading-relaxed border-l-2 pl-2 ${activeTheme.divider}`}>
                              &ldquo;{sponsor.notes}&rdquo;
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Right Column: Key Decision Makers Coverage Map */}
                <div className="col-span-7 space-y-3.5 pl-2 flex flex-col justify-center">
                  <div className="space-y-2.5">
                    <span className={`text-[9px] md:text-[10px] font-bold ${activeTheme.textMuted} uppercase tracking-widest block`}>Governance Coverage Matrix</span>
                    
                    {/* Checkboxes of alignment role types */}
                    <div className="grid grid-cols-3 gap-2">
                      {['Executive Sponsor', 'Economic Buyer', 'Champion'].map(role => {
                        const isMapped = activeStakeholders.some(s => s.role === role);
                        return (
                          <div key={role} className={`p-2 border rounded-xl flex flex-col justify-between ${
                            isMapped ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : `${activeTheme.cardBorder} ${activeTheme.cardBg} opacity-60`
                          }`}>
                            <span className={`text-[8px] font-extrabold ${activeTheme.textMuted} uppercase tracking-wider`}>{role}</span>
                            <span className={`text-[10px] font-bold mt-1 block ${isMapped ? 'text-emerald-400' : activeTheme.textMuted}`}>
                              {isMapped ? '✓ Secured' : '⚠ Missing'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Stacked lists of all mapped stakeholders */}
                    <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                      {activeStakeholders.length === 0 ? (
                        <p className={`text-[10px] ${activeTheme.textMuted} text-center py-4 border border-dashed ${activeTheme.cardBorder} rounded-xl`}>
                          No key contacts mapped to this governance structure.
                        </p>
                      ) : (
                        activeStakeholders.map(stk => (
                          <div key={stk.id} className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} rounded-xl flex items-center justify-between text-[11px] p-2`}>
                            <div>
                              <span className={`font-bold ${activeTheme.textTitle} block leading-none`}>{stk.name}</span>
                              <span className={`text-[8px] ${activeTheme.textMuted} block mt-0.5`}>{stk.title} &bull; {stk.role}</span>
                            </div>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                              stk.alignment >= 4 ? activeTheme.tagSuccess :
                              stk.alignment >= 3 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              activeTheme.tagDanger
                            }`}>
                              Alignment: {stk.alignment}/5
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`border-t ${activeTheme.divider} pt-5 flex justify-between items-center mt-auto`}>
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <p className={`text-[9px] uppercase tracking-wider ${activeTheme.textMuted} font-bold`}>Prepared Advisory Lead</p>
                    <p className={`text-xs font-bold ${activeTheme.textTitle} ${activeTheme.fontDisplay}`}>{profile.fullName}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-[9px] uppercase tracking-wider ${activeTheme.textMuted} font-bold`}>Account Coverage</p>
                  <p className={`text-xs font-bold ${activeTheme.textTitle}`}>
                    {activeStakeholders.length > 2 ? "Multi-Threaded Alignment" : "Single-Threaded Warning"}
                  </p>
                </div>
              </div>
            </div>

            {/* Slide 4: Renewal & Growth */}
            <div className={`report-slide ${activeTheme.bgClass} rounded-2xl ${activeTheme.borderClass} ${activeTheme.shadowClass} ${activeTheme.fontSans} relative flex flex-col justify-between overflow-hidden p-10 md:p-12 slide-aspect-ratio w-full transition duration-300 print:shadow-none print:border-none print:p-0 print:m-0 ${
              activeSlide === 4 ? 'flex' : 'hidden print:flex print:break-after-page'
            }`}>
              <div 
                className={`absolute top-0 right-0 w-80 h-80 rounded-full -translate-y-24 translate-x-24 ${activeTheme.glowOpacity} blur-3xl`}
                style={{ backgroundColor: activeTheme.accentColor }}
              ></div>

              {/* Header */}
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block mb-1" style={{ color: activeTheme.accentColor }}>
                    EXECUTIVE BUSINESS REVIEW
                  </span>
                  <h3 className={`text-2xl md:text-3.5xl font-extrabold ${activeTheme.fontDisplay} ${activeTheme.textTitle} tracking-tight leading-none`}>
                    Renewal & Expansion Opportunities
                  </h3>
                  <p className={`text-xs ${activeTheme.textMuted} mt-1 font-medium italic`}>
                    Commercial Partnership Standing, Lifecycle Timelines & Scaling Recommendations
                  </p>
                </div>
                <img 
                  src={profile.companyLogoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"} 
                  alt="Brand Logo" 
                  className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-xl border border-slate-100 bg-white shadow-xs"
                />
              </div>

              {/* Middle Section */}
              <div className="grid grid-cols-12 gap-8 my-auto relative z-10 items-stretch">
                {/* Left Column: Commercial Standing & Lifecycle */}
                <div className={`col-span-6 pr-4 border-r ${activeTheme.divider} space-y-3.5 flex flex-col justify-center`}>
                  <span className={`text-[9px] md:text-[10px] font-bold ${activeTheme.textMuted} uppercase tracking-widest block`}>Commercial Contract Lifecycle</span>
                  
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} p-3.5 rounded-xl`}>
                      <span className={`text-[8px] ${activeTheme.textMuted} font-bold uppercase block`}>Annual Recurring Revenue</span>
                      <h5 className={`text-[11px] md:text-xs font-black ${activeTheme.textTitle} mt-1 font-mono`}>
                        ${account.annualRecurringRevenue.toLocaleString()} ARR
                      </h5>
                    </div>
                    
                    <div className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} p-3.5 rounded-xl`}>
                      <span className={`text-[8px] ${activeTheme.textMuted} font-bold uppercase block`}>Contract Initialized</span>
                      <h5 className={`text-[10px] font-bold ${activeTheme.textTitle} mt-1`}>
                        {new Date(account.contractStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </h5>
                    </div>
                  </div>

                  <div className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} p-3 rounded-xl flex items-center justify-between`}>
                    <div>
                      <span className={`text-[8px] ${activeTheme.textMuted} font-bold uppercase block`}>Renewal Alignment Target</span>
                      <h5 className={`text-[10px] font-bold ${activeTheme.textTitle} mt-0.5`}>
                        {new Date(account.contractRenewalDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </h5>
                    </div>
                    <div className="text-right">
                      {(() => {
                        const daysLeft = Math.ceil((new Date(account.contractRenewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                        const isOverdue = daysLeft < 0;
                        return (
                          <span className={`text-[8px] md:text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${
                            isOverdue ? activeTheme.tagDanger :
                            daysLeft < 90 ? activeTheme.tagWarning :
                            activeTheme.tagSuccess
                          }`}>
                            {isOverdue ? "Overdue for Renewal" : `${daysLeft} Days Remaining`}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Right Column: Strategic Momentum & Growth Recommendations */}
                <div className="col-span-6 space-y-3 pl-2 flex flex-col justify-center">
                  <div className="space-y-2.5">
                    <span className={`text-[9px] md:text-[10px] font-bold ${activeTheme.textMuted} uppercase tracking-widest block`}>Expansion & Expansion Standing</span>
                    
                    {(() => {
                      const isHighHealth = account.healthScore >= 75;
                      const isRiskMotion = objective.focusType === 'Risk';

                      if (isRiskMotion) {
                        return (
                          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1 text-amber-400">
                            <span className="text-[8px] font-extrabold uppercase bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-400 inline-block border border-amber-500/30">Remediation Motion Active</span>
                            <h5 className="text-[11px] font-bold">Stabilization Required Prior to Expansion</h5>
                            <p className="text-[10px] leading-relaxed text-amber-300">
                              Active strategic motion is set to "Risk". Our immediate mandate is metric restoration and sponsor security before expanding scope.
                            </p>
                          </div>
                        );
                      }

                      if (isHighHealth) {
                        return (
                          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1 text-emerald-400">
                            <span className="text-[8px] font-extrabold uppercase bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400 inline-block border border-emerald-500/30">Expansion Opportunity</span>
                            <h5 className="text-[11px] font-bold">Strong Partnership Index Prompts Scaling</h5>
                            <p className="text-[10px] leading-relaxed text-emerald-300">
                              Robust health score ({account.healthScore}/100) supports expanding capabilities. Target vector: explore scope enlargement inside the '{account.businessUnit}' unit.
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className={`p-3.5 ${activeTheme.cardBg} border ${activeTheme.cardBorder} rounded-xl space-y-1 ${activeTheme.textBody}`}>
                          <span className="text-[8px] font-extrabold uppercase bg-slate-500/20 px-1.5 py-0.5 rounded text-slate-400 inline-block">Retention Priority</span>
                          <h5 className="text-[11px] font-bold">Secure Metric Consistency & Baseline Alignment</h5>
                          <p className={`text-[10px] leading-relaxed ${activeTheme.textMuted}`}>
                            Consolidate baseline value on key metrics. Successful roadmap timeline execution is the primary retention safeguard.
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`border-t ${activeTheme.divider} pt-5 flex justify-between items-center mt-auto`}>
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <p className={`text-[9px] uppercase tracking-wider ${activeTheme.textMuted} font-bold`}>Prepared Advisory Lead</p>
                    <p className={`text-xs font-bold ${activeTheme.textTitle} ${activeTheme.fontDisplay}`}>{profile.fullName}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-[9px] uppercase tracking-wider ${activeTheme.textMuted} font-bold`}>Commercial Posture</p>
                  <p className={`text-xs font-bold ${activeTheme.textTitle}`}>{objective.focusType} Strategy Model</p>
                </div>
              </div>
            </div>

            {/* Slide 5: Immediate Next Steps */}
            <div className={`report-slide ${activeTheme.bgClass} rounded-2xl ${activeTheme.borderClass} ${activeTheme.shadowClass} ${activeTheme.fontSans} relative flex flex-col justify-between overflow-hidden p-10 md:p-12 slide-aspect-ratio w-full transition duration-300 print:shadow-none print:border-none print:p-0 print:m-0 ${
              activeSlide === 5 ? 'flex' : 'hidden print:flex print:break-after-page'
            }`}>
              <div 
                className={`absolute top-0 right-0 w-80 h-80 rounded-full -translate-y-24 translate-x-24 ${activeTheme.glowOpacity} blur-3xl`}
                style={{ backgroundColor: activeTheme.accentColor }}
              ></div>

              {/* Header */}
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block mb-1" style={{ color: activeTheme.accentColor }}>
                    EXECUTIVE BUSINESS REVIEW
                  </span>
                  <h3 className={`text-2xl md:text-3.5xl font-extrabold ${activeTheme.fontDisplay} ${activeTheme.textTitle} tracking-tight leading-none`}>
                    Immediate Path Forward & Ownership
                  </h3>
                  <p className={`text-xs ${activeTheme.textMuted} mt-1 font-medium italic`}>
                    Action Plan, Milestone Owners & Executive Authorization
                  </p>
                </div>
                <img 
                  src={profile.companyLogoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"} 
                  alt="Brand Logo" 
                  className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-xl border border-slate-100 bg-white shadow-xs"
                />
              </div>

              {/* Middle Section */}
              <div className="grid grid-cols-12 gap-8 my-auto relative z-10 items-stretch">
                {/* Left Column: Immediate Strategic Actions */}
                <div className={`col-span-6 pr-4 border-r ${activeTheme.divider} flex flex-col justify-between`}>
                  <div className="space-y-3.5">
                    <span className={`text-[9px] md:text-[10px] font-bold ${activeTheme.textMuted} uppercase tracking-widest block`}>Immediate Path Forward</span>
                    
                    <div className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} p-4 rounded-xl space-y-2`}>
                      <span className={`text-[8px] font-extrabold uppercase tracking-wider ${activeTheme.textMuted} block`}>Advisory Priority Directive</span>
                      <p className={`text-[11px] ${activeTheme.textTitle} leading-relaxed font-semibold italic`}>
                        &ldquo;{objective.nextSteps || "(Strategic next steps not registered. Update in workspace.)"}&rdquo;
                      </p>
                    </div>

                    <div className={`text-[10px] ${activeTheme.textMuted} leading-normal`}>
                      Accountability structures are established for immediate upcoming tasks. These achievements serve as baseline gates for the next strategic reporting period.
                    </div>
                  </div>
                </div>

                {/* Right Column: Roadmap Timeline & Signature Sign-off */}
                <div className="col-span-6 space-y-4 pl-2 flex flex-col justify-between">
                  {/* Active next milestones */}
                  <div className="space-y-1.5">
                    <span className={`text-[9px] font-bold ${activeTheme.textMuted} uppercase tracking-widest block`}>Upcoming Success Milestones</span>
                    
                    {activeMilestones.filter(m => m.status === 'Planned' || m.status === 'In Progress').length === 0 ? (
                      <div className={`p-3 ${activeTheme.cardBg} border border-dashed ${activeTheme.cardBorder} rounded-xl text-center text-[10px] ${activeTheme.textMuted} font-medium`}>
                        No active upcoming milestones mapped in success plan.
                      </div>
                    ) : (
                      activeMilestones.filter(m => m.status === 'Planned' || m.status === 'In Progress').slice(0, 2).map(ms => (
                        <div key={ms.id} className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} rounded-xl flex items-center justify-between text-[11px] p-2`}>
                          <div className="min-w-0 flex-1 pr-2">
                            <h5 className={`text-[11px] font-bold ${activeTheme.textTitle} truncate`}>{ms.title}</h5>
                            <p className={`text-[8px] ${activeTheme.textMuted} mt-0.5 truncate`}>Due: {ms.dueDate} &bull; Impact: {ms.impactType}</p>
                          </div>
                          <span className={`text-[9px] font-bold ${activeTheme.textTitle} ${activeTheme.cardBg} border ${activeTheme.cardBorder} px-2 py-0.5 rounded shrink-0`}>
                            Owner: {ms.owner}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Executive Sign-off Area */}
                  <div className={`pt-2.5 border-t ${activeTheme.divider} flex justify-between gap-4 text-[8px] ${activeTheme.textMuted}`}>
                    <div>
                      <span className="font-bold block uppercase">Prepared Advisory Lead</span>
                      <span className={`font-bold block text-[10px] mt-0.5 ${activeTheme.textTitle}`}>{profile.fullName}</span>
                      <span className="block text-[8px]">{profile.jobTitle}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold block uppercase">Client Approval Authorization</span>
                      <div className={`w-32 h-4 border-b border-dashed ${activeTheme.cardBorder} mt-1 ml-auto`}></div>
                      <span className="block mt-0.5 text-[8px] tracking-wider uppercase">Executive Sponsor Signature</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`border-t ${activeTheme.divider} pt-5 flex justify-between items-center mt-auto`}>
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <p className={`text-[9px] uppercase tracking-wider ${activeTheme.textMuted} font-bold`}>Prepared Advisory Lead</p>
                    <p className={`text-xs font-bold ${activeTheme.textTitle} ${activeTheme.fontDisplay}`}>{profile.fullName}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-[9px] uppercase tracking-wider ${activeTheme.textMuted} font-bold`}>Final Slide</p>
                  <p className={`text-xs font-bold ${activeTheme.textTitle}`}>EBR Segment 6 of 6</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: QUARTERLY BUSINESS REVIEW (QBR) - Operational Focus */}
        {reportType === 'QBR' && (
          <div className={`report-slide ${activeTheme.bgClass} rounded-2xl ${activeTheme.borderClass} ${activeTheme.shadowClass} ${activeTheme.fontSans} relative flex flex-col justify-between overflow-hidden p-10 md:p-14 slide-aspect-ratio w-full transition duration-300 print:shadow-none print:border-none print:p-0 print:m-0`}>
            {/* Header */}
            <div className={`flex justify-between items-start relative z-10 border-b ${activeTheme.divider} pb-5`}>
              <div>
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase block mb-1" style={{ color: activeTheme.accentColor }}>
                  QUARTERLY BUSINESS REVIEW (OPERATIONAL METRICS)
                </span>
                <h3 className={`text-xl md:text-2.5xl font-extrabold ${activeTheme.fontDisplay} ${activeTheme.textTitle} tracking-tight`}>
                  {account.companyName}
                </h3>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-bold ${activeTheme.textMuted} uppercase tracking-widest block`}>Account Tier</span>
                <span className={`text-xs font-bold ${activeTheme.textBody}`}>{account.accountTier} Level Engagement</span>
              </div>
            </div>

            {/* Main grid: Left metrics visualizer, Right Success milestones checklist */}
            <div className="grid grid-cols-12 gap-8 my-6 md:my-8 relative z-10 flex-1">
              
              {/* Left Column: Metric trends & ROI counters */}
              <div className="col-span-6 space-y-5">
                <span className={`text-[9px] uppercase tracking-wider ${activeTheme.textMuted} font-extrabold block`}>Metric Performance & Progress</span>
                
                {/* Metric progress bar card */}
                <div className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} rounded-2xl p-4 space-y-3.5`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`text-xs font-bold ${activeTheme.textTitle} truncate max-w-[180px]`}>
                        {objective.metricName || "(No Metric Target)"}
                      </h4>
                      <p className={`text-[10px] ${activeTheme.textMuted} mt-0.5`}>Primary Key Performance Indicator</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg md:text-2xl font-black" style={{ color: activeTheme.accentColor }}>
                        {objective.currentValue}
                      </span>
                      <span className={`text-xs ${activeTheme.textMuted}`}> {objective.unit}</span>
                    </div>
                  </div>

                  {/* Progress slide */}
                  <div className="space-y-1.5">
                    <div className="w-full h-1.5 bg-slate-200/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ width: `${progressPercentage}%`, backgroundColor: activeTheme.accentColor }}
                      ></div>
                    </div>
                    <div className={`flex justify-between text-[9px] ${activeTheme.textMuted} font-semibold`}>
                      <span>Baseline: {objective.baselineValue}</span>
                      <span>Target Goal: {objective.targetValue}</span>
                    </div>
                  </div>
                </div>

                {/* KPI block: Value Ledger currency impact */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} p-4 rounded-xl`}>
                    <span className={`text-[9px] ${activeTheme.textMuted} font-bold uppercase block mb-1`}>Financial Yield</span>
                    <h5 className={`text-base md:text-lg font-bold ${activeTheme.textTitle}`}>
                      {objective.estimatedRoiImpact || "(No Financial Impact Defined)"}
                    </h5>
                    <p className={`text-[9px] ${activeTheme.textMuted} mt-1`}>Verified ROI projection</p>
                  </div>

                  <div className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} p-4 rounded-xl`}>
                    <span className={`text-[9px] ${activeTheme.textMuted} font-bold uppercase block mb-1`}>Portfolio Health</span>
                    <h5 className={`text-base md:text-lg font-bold ${activeTheme.textTitle} flex items-center gap-1.5`}>
                      <span className={`h-2 w-2 rounded-full ${account.healthScore >= 75 ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                      {account.healthScore}% Index
                    </h5>
                    <p className={`text-[9px] ${activeTheme.textMuted} mt-1`}>CSM relationship matrix</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Roadmap Timeline milestone statuses */}
              <div className="col-span-6 space-y-3">
                <MilestoneTimelineChart
                  milestones={activeMilestones}
                  theme={activeTheme}
                  height={145}
                />

                <div className="space-y-1.5 max-h-[105px] overflow-y-auto pr-1">
                  {activeMilestones.length === 0 ? (
                    <div className={`text-center py-4 ${activeTheme.textMuted} text-xs`}>
                      No active milestones mapped to this roadmap yet.
                    </div>
                  ) : (
                    activeMilestones.slice(0, 2).map(ms => {
                      return (
                        <div key={ms.id} className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} rounded-xl flex items-center justify-between gap-3 p-2`}>
                          <div className="min-w-0 flex-1">
                            <h5 className={`text-[11px] font-bold ${activeTheme.textTitle} truncate`}>{ms.title}</h5>
                            <span className={`text-[8px] ${activeTheme.textMuted} mt-0.5 block truncate`}>
                              Impact: {ms.impactType} &bull; Due: {ms.dueDate} &bull; Owner: {ms.owner}
                            </span>
                          </div>
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded shrink-0 ${
                            ms.status === 'Completed' ? activeTheme.tagSuccess : 
                            ms.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            activeTheme.tagDanger
                          }`}>
                            {ms.status}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`border-t ${activeTheme.divider} pt-5 flex justify-between items-center mt-auto text-xs ${activeTheme.textMuted}`}>
              <span>Primary Strategic Lead: <strong>{profile.fullName}</strong></span>
              <span>Mutual Executive Alignment Project</span>
            </div>
          </div>
        )}

        {/* VIEW 3: ONE-PAGE SUMMARY (OPR) - Highly Concise Bento Layout */}
        {reportType === 'OPR' && (
          <div className={`report-slide ${activeTheme.bgClass} rounded-2xl ${activeTheme.borderClass} ${activeTheme.shadowClass} ${activeTheme.fontSans} relative flex flex-col justify-between overflow-hidden p-8 md:p-10 slide-aspect-ratio w-full transition duration-300 print:shadow-none print:border-none print:p-0 print:m-0`}>
            {/* Header */}
            <div className={`flex justify-between items-center border-b ${activeTheme.divider} pb-4`}>
              <div>
                <span className="text-[9px] font-bold tracking-wider uppercase block" style={{ color: activeTheme.accentColor }}>
                  ONE-PAGE EXECUTIVE BRIEF
                </span>
                <h3 className={`text-xl font-black ${activeTheme.fontDisplay} ${activeTheme.textTitle} leading-none`}>{account.companyName}</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] ${activeTheme.textMuted} font-semibold uppercase`}>{account.industry}</span>
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: activeTheme.accentColor }}></div>
                <span className={`text-[11px] font-bold ${activeTheme.textTitle}`}>${account.annualRecurringRevenue.toLocaleString()} ARR</span>
              </div>
            </div>

            {/* Bento Grid Body */}
            <div className="grid grid-cols-3 gap-5 my-4 flex-1">
              {/* Objective & Narrative block */}
              <div className={`col-span-2 ${activeTheme.cardBg} border ${activeTheme.cardBorder} p-4 rounded-xl flex flex-col justify-between`}>
                <div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${activeTheme.textMuted} block mb-1`}>Partnership Mandate</span>
                  <p className={`text-xs ${activeTheme.textTitle} leading-relaxed font-semibold italic`}>
                    &ldquo;{objective.statement || "(No Strategic Objective Defined)"}&rdquo;
                  </p>
                </div>
                <div className={`pt-3 border-t ${activeTheme.divider} mt-3`}>
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${activeTheme.textMuted} block mb-1`}>Immediate Path Forward</span>
                  <p className={`text-[11px] ${activeTheme.textBody} leading-tight`}>
                    {objective.nextSteps || "(No Next Actions Defined)"}
                  </p>
                </div>
              </div>

              {/* High Level ROI & Stats Bento block */}
              <div className="col-span-1 space-y-4">
                <div 
                  className="p-4 rounded-xl text-white flex flex-col justify-between"
                  style={{ backgroundColor: activeTheme.accentColor }}
                >
                  <span className="text-[9px] font-bold text-white/80 uppercase block">Projected Value Yield</span>
                  <h4 className="text-lg font-black mt-1 text-white">{objective.estimatedRoiImpact || "(No ROI Defined)"}</h4>
                </div>

                <div className={`${activeTheme.cardBg} border ${activeTheme.cardBorder} p-3 rounded-xl`}>
                  <span className={`text-[9px] font-bold ${activeTheme.textMuted} uppercase block mb-1`}>Metric Status</span>
                  <div className="flex justify-between items-baseline">
                    <span className={`text-xs font-bold ${activeTheme.textMuted}`}>Baseline vs. Current</span>
                    <span className={`text-sm font-extrabold ${activeTheme.textTitle}`}>{objective.baselineValue} &rarr; {objective.currentValue} {objective.unit}</span>
                  </div>
                </div>
              </div>

              {/* Milestones row */}
              <div className={`col-span-3 ${activeTheme.cardBg} border ${activeTheme.cardBorder} p-4 rounded-xl`}>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${activeTheme.textMuted} block mb-2`}>Roadmap Milestones Tracker</span>
                <div className="grid grid-cols-3 gap-3">
                  {activeMilestones.slice(0, 3).map((ms) => (
                    <div key={ms.id} className={`p-2.5 ${activeTheme.id === 'modern-ops' ? 'bg-slate-900' : 'bg-white'} border ${activeTheme.cardBorder} rounded-lg flex flex-col justify-between`}>
                      <span className={`text-[10px] font-bold ${activeTheme.textTitle} truncate`}>{ms.title}</span>
                      <div className="flex justify-between items-center mt-1.5">
                        <span className={`text-[8px] font-bold uppercase ${activeTheme.textMuted}`}>{ms.owner}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                          ms.status === 'Completed' ? activeTheme.tagSuccess : activeTheme.tagWarning
                        }`}>
                          {ms.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {activeMilestones.length < 3 && (
                    <div className={`col-span-1 p-2.5 border border-dashed ${activeTheme.cardBorder} rounded-lg flex items-center justify-center text-[9px] ${activeTheme.textMuted} font-semibold`}>
                      Waiting for additional roadmap entries...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Compact Footer */}
            <div className={`border-t ${activeTheme.divider} pt-3 flex justify-between items-center text-[10px] ${activeTheme.textMuted} mt-auto`}>
              <span>Prepared by: <strong>{profile.fullName}</strong> ({profile.email})</span>
              <span>Generated on ImpactStream platform</span>
            </div>
          </div>
        )}
          </div>
        </div>

        {/* Bottom Slide Strip in Fullscreen */}
        {isFullscreen && reportType === 'EBR' && (
          <div className="flex justify-center items-center gap-2 pt-2 shrink-0 print:hidden">
            {SLIDE_TITLES.map((title, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                  activeSlide === idx
                    ? 'bg-white text-slate-950 shadow-md scale-105'
                    : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {idx + 1}. {title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

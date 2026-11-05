# ImpactStream: Enterprise CS Operating System — Product Strategy, Hierarchy Architecture & Roadmap Backlog

## Executive Summary
This document establishes the long-term product vision, data model architecture, and phased development backlog for transforming **ImpactStream** from a standalone QBR/EBR deck generator into a comprehensive **Enterprise Customer Success Operating System**. 

It addresses multi-tier organizational hierarchy (Client Tenant → Director → Manager → CSM → Customer Company → Accounts/Projects → Stakeholders), in-app continuous meeting logging with dual-responsibility task assignment, emerging KPI detection, meeting memory feeds into executive reviews, and seamless roadmap sequencing toward QBRBuilder parity and CRM integration.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural direction below reflects the user's explicit strategic answers confirmed during the initial interview.

- **Confirmed Decision 1 (Phasing Order)**: Multi-tier data hierarchy refactoring is prioritized first to eliminate tech debt before building meeting memory and team collaboration features.
- **Confirmed Decision 2 (Hierarchy Taxonomy)**: Structured as `Client Organization` → `Customer Company` → `Multi-Account/Projects` → `Stakeholders & Assets`.
- **Confirmed Decision 3 (Meeting Logging & Continuous Memory)**: Built directly in ImpactStream with AI-powered dual-responsibility extraction (Customer vs. CSM tasks), instant KPI promotion, and direct memory feeds into future EBR/QBR decks.

---

## 1. Architectural Assessment: Current State vs. Target Model

### 1.1 Is Our Current Structure in a Good Place?
**Yes, as a strong foundation, but requiring an intentional domain refactor.**
- **Strengths of Current Codebase**: 
  - Clean TypeScript typing in `src/types.ts`.
  - Decoupled state management with robust `localStorage` sync and sample data fallback in `src/sampleData.ts`.
  - Modular presentation layer (`ReportPreview.tsx`) supporting multiple themes, aspect-ratio constraints, and Recharts milestone velocity timelines.
  - Full-stack Express backend in `server.ts` capable of hosting secure LLM proxy endpoints (`/api/generate-summary`).
- **Structural Gaps to Resolve**:
  1. **Flat Account Model**: Currently, `Account` combines the Customer Company and the Project (`companyName` + `businessUnit` in one flat record). If a enterprise customer (e.g., *Nexus Corp*) has 3 distinct contracts or projects with the client, they currently exist as completely detached accounts with duplicate company metadata.
  2. **Single-User Scope**: Current state models a single CSM profile (`UserProfile`). There is no concept of a parent Client Organization (who owns brand guidelines, slide themes, and corporate logos) or internal managerial hierarchy (Director → Manager → CSM).
  3. **Point-in-Time Review vs. Continuous Journey**: The current app treats an EBR as an isolated configuration rather than a milestone in an ongoing customer lifecycle fueled by weekly/bi-weekly meeting touchpoints.
  4. **Stakeholder Intelligence**: Stakeholders currently lack employment tracking (e.g., active tenure, departed champion risk alerts, LinkedIn references).

---

## 2. Target Domain Data Model & Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CLIENT ORGANIZATION (TENANT)                         │
│  - Org ID, Corporate Name, Master Brand Kit (Logo, Primary/Accent Hex)      │
│  - Slide Template Defaults, Custom Presentation Themes                      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ 1:N
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ORGANIZATIONAL TEAMS                              │
│  - Team ID, Division / Region (e.g., "Enterprise NA", "Strategic EMEA")     │
│  - Director ID (Executive oversight)                                        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ 1:N
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               USER ROLES                                    │
│  - Director: Division-wide portfolio rollup, aggregate ARR health           │
│  - Manager: Team-level coaching, account coverage, workload balance         │
│  - CSM (Analyst): Direct ownership of customer account portfolios           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ 1:N (CSM Assignment)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CUSTOMER COMPANY                                │
│  - Company ID, Legal Name, Domain/Website, Industry, Logo URL               │
│  - Parent Customer Entity (The customer of our client)                     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ 1:N
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ACCOUNT / PROJECT / CONTRACT                         │
│  - Account ID, Project/BU Name (e.g., "EMEA Cloud Security Operations")     │
│  - Assigned CSM ID, Tier (Strategic/Enterprise), ARR, Contract Dates       │
│  - Health Score, Renewal Stage, Risk Assessment                             │
└───────────────┬──────────────────────┼───────────────────────┬──────────────┘
                │ 1:N                  │ 1:N                   │ 1:N
                ▼                      ▼                       ▼
   ┌──────────────────────┐ ┌────────────────────┐ ┌───────────────────────────┐
   │     STAKEHOLDERS     │ │    OBJECTIVES &    │ │     MEETING LOGS &        │
   │ - Role, Alignment    │ │     MILESTONES     │ │   CONTINUOUS MEMORY       │
   │ - LinkedIn Profile   │ │ - Primary Mandate  │ │ - Meeting Date & Type     │
   │ - Employment Status  │ │ - ROI Metric & Unit│ │ - Attendee Stakeholders   │
   │   (Active / Risk /   │ │ - Milestones &     │ │ - Customer Action Items   │
   │    Departed)         │ │   Velocity Curve   │ │ - CSM Action Items        │
   │                      │ │ - Dynamic KPI Pool │ │ - Emerging Tracked KPIs   │
   │                      │ │                    │ │ - Sponsor Follow-up Draft │
   └──────────────────────┘ └────────────────────┘ └───────────────────────────┘
```

---

## 3. Product Roadmap & Phased Backlog

### Phase 1: Multi-Tier Data Hierarchy & Entity Architecture
*Objective*: Refactor core domain entities to support Client Org, Customer Companies, Projects/Accounts, and enriched Stakeholder intelligence while maintaining 100% backward compatibility with existing mock data and local storage.

- **Feature 1.1: Customer Company vs. Project Entity Separation**
  - Extract `CustomerCompany` (`id`, `name`, `logoUrl`, `domain`, `industry`, `tier`) from `Account`.
  - Update `Account` to represent a specific contract, business unit, or project referencing `companyId`.
  - Provide a migration utility in `sampleData.ts` that automatically upgrades existing stored accounts without data loss.
- **Feature 1.2: Client Organization & Master Brand Kit**
  - Create `ClientOrganization` settings entity owning corporate logos, brand palette tokens, default disclaimers, and typography rules.
  - Update `UserProfile` to link to `organizationId` with role attributes (`Director` | `Manager` | `CSM`).
- **Feature 1.3: Stakeholder Intelligence & Risk Signals**
  - Enrich `Stakeholder` model with `employmentStatus` (`'Active' | 'Role Changed' | 'Left Company' | 'Unknown'`), `linkedInUrl`, and `lastContactDate`.
  - Add visual indicators for champion departure risk directly on the Stakeholder Matrix slide and intake panel.
- **Feature 1.4: Multi-Account Portfolio Selector in UI**
  - Group accounts in the `BookOfBusiness` dashboard by Customer Company, allowing CSMs to see all projects under one client organization.

> **Impact on Phase 2**: Establishes clean foreign keys (`companyId`, `accountId`, `stakeholderId`) required for logging meetings, linking attendees, and scoping continuous memory records.

---

### Phase 2: Continuous Meeting Memory Engine & Sponsor Follow-Up
*Objective*: Enable CSMs to log customer interactions directly in ImpactStream, automatically extract dual-responsibility action items, detect emerging KPIs, and bridge meeting outcomes directly into the next QBR/EBR.

- **Feature 2.1: In-App Meeting Logger Modal & Drawer**
  - Quick-log interface for customer touchpoints: Date, Title, Meeting Type (`Executive Alignment`, `Bi-Weekly Check-in`, `Technical Review`, `Renewal Negotiation`).
  - Multi-select attendee picker referencing account stakeholders.
  - Raw notes input with structured voice/notes paste.
- **Feature 2.2: AI-Powered Dual-Responsibility Task Extraction**
  - Uses Gemini 3.8 Flash (`/api/extract-meeting-insights`) with local heuristic fallback.
  - Automatically parses notes into two distinct buckets:
    1. **Customer Responsibilities** (e.g., *"Customer champion to provide SSO certificate by Friday"*).
    2. **CSM Responsibilities** (e.g., *"CSM to prepare custom ROI model for EMEA team"*).
  - Each action item includes an owner, due date, and completion toggle.
- **Feature 2.3: Emerging KPI Auto-Promotion**
  - When a customer mentions a new metric they plan to track during a meeting, the engine flags it as an *Emerging KPI candidate*.
  - With 1 click, the CSM can promote it into the account's active `PrimaryObjective` or secondary metric pool so it is tracked immediately for the next QBR.
- **Feature 2.4: 1-Click Executive Sponsor Follow-Up Email Composer**
  - Generates a polished, C-level executive email summarizing:
    - Meeting date, context, and key decisions reached.
    - Agreed customer next steps and verified owners.
    - CSM deliverables and target turnaround times.
    - Proposed date and agenda for the next milestone check-in.
  - Copy to clipboard with tone selection (*Formal C-Level*, *Collaborative Partner*).
- **Feature 2.5: Meeting Memory Bridge to Report Deck**
  - Adds a "Recent Cadence & Operational Agreements" section or card in the EBR/QBR deck reflecting completed customer action items and progress since the last formal review.

> **Impact on Phase 3**: Meeting frequency, action item completion velocity, and stakeholder sentiment logged in Phase 2 become the real-time operational data rolled up in Manager and Director views.

---

### Phase 3: Team Organizational Hierarchy & Manager/Director Workspaces
*Objective*: Expand ImpactStream beyond individual CSM utility into an organizational system for CS leaders.

- **Feature 3.1: Persona Switcher & Role-Based Views**
  - Prototype toggle in header: `CSM View` vs. `Manager View` vs. `Director View`.
- **Feature 3.2: Manager Portfolio Rollup View**
  - Dashboard showing team accounts aggregated by CSM.
  - Account health distribution, upcoming QBR schedules, and unlogged meeting alerts (>30 days without touchpoint).
  - Workload balance indicators (ARR per CSM, at-risk accounts per CSM).
- **Feature 3.3: Director Executive Overview**
  - Gross Revenue Retention (GRR) and Net Revenue Retention (NRR) forecast across the client organization.
  - Division-level milestone completion velocity curve.
  - Sponsor relationship matrix (percentage of accounts with an aligned Executive Sponsor vs. accounts with champion risk).
- **Feature 3.4: Account Assignment & Reallocation Workflow**
  - Manager ability to reassign an account between CSMs with preserved meeting memory and stakeholder notes.

> **Impact on Phase 4**: Ensures presentation decks and internal strategy briefs reflect organizational ownership and multi-stakeholder governance.

---

### Phase 4: QBRBuilder Feature Parity & Advanced Presentation Capabilities
*Objective*: Close remaining competitive gaps against QBRBuilder.com.

- **Feature 4.1: Internal Pre-Meeting Strategy Brief (The 3rd Signature Output)**
  - Add 4th view toggle alongside EBR, QBR, and OPR: `'INTERNAL_BRIEF'`.
  - Designed exclusively for internal leadership (VP of CS, Account Executive, VP of Sales) prior to entering the executive review:
    - Renewal commercial posture and expansion targets.
    - Champion political capital and hidden blockers.
    - Technical escalations and internal red flags.
    - "Win conditions" and agenda defensive playbooks.
- **Feature 4.2: Client-Side Native `.pptx` Presentation Export**
  - Integrate `pptxgenjs` to generate 16:9 PowerPoint slides matching the active theme's colors, typography, tables, and milestone timelines.
- **Feature 4.3: Drag-and-Drop Document Ingestion**
  - Dropzone for `.csv`, `.txt`, `.md`, and `.pdf` files in the Notes Synthesizer, parsing unstructured account notes directly in the browser.

> **Impact on Phase 5**: Generates standardized digital and binary presentation artifacts that can be attached to CRM records automatically.

---

### Phase 5: CRM Integration & External Stakeholder Intelligence (Strategic Horizon)
*Objective*: Connect ImpactStream bidirectionally with the enterprise tech stack.

- **Feature 5.1: CRM Data Ingestion Architecture (Salesforce / HubSpot)**
  - Specification for OAuth-based account sync (Account Name, ARR, Renewal Date, Opportunity Stage, Primary Contacts).
  - Field mapping wizard allowing CSMs to link CRM custom fields to ImpactStream metric models.
- **Feature 5.2: External Meeting & Calendar Sync**
  - Google Calendar / Microsoft 365 calendar hook to automatically prompt the CSM to log a meeting after customer events conclude.
- **Feature 5.3: Stakeholder Career & LinkedIn Intelligence**
  - Webhook or automated alert when a tracked champion or economic buyer updates their role or changes companies.
  - Churn risk flag automatically triggered on the account dashboard when a primary sponsor departs.

---

## 4. Technical Architecture & Data Strategy

### 4.1 Refactored TypeScript Schema Blueprint

```typescript
// 1. Client Organization (Tenant)
export interface ClientOrganization {
  id: string;
  name: string;
  logoUrl: string;
  brandPrimaryColor: string;
  brandSecondaryColor?: string;
  defaultTheme: 'modern-slate' | 'executive-navy' | 'emerald-minimal';
  createdAt: string;
}

// 2. User & Organizational Hierarchy
export type UserRole = 'CSM' | 'Manager' | 'Director' | 'Admin';

export interface UserProfile {
  id: string;
  organizationId: string;
  teamId?: string;
  managerId?: string;
  fullName: string;
  jobTitle: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  linkedinUrl?: string;
}

// 3. Customer Company (Parent Customer Entity)
export interface CustomerCompany {
  id: string;
  organizationId: string; // Scoped to client tenant
  name: string;
  logoUrl?: string;
  industry: string;
  domain?: string;
  tier: 'Strategic' | 'Enterprise' | 'Mid-Market';
}

// 4. Account / Project / Contract
export interface Account {
  id: string;
  companyId: string; // Foreign key to CustomerCompany
  assignedCsmId: string; // Foreign key to UserProfile
  businessUnit: string; // Project / Division name
  contractStartDate: string;
  contractRenewalDate: string;
  annualRecurringRevenue: number;
  healthScore: number; // 1-100
  renewalStage: 'Early Engagement' | 'Executive Alignment' | 'Proposal' | 'Closed Won' | 'At Risk';
}

// 5. Stakeholder with Tenure Intelligence
export type StakeholderStatus = 'Active' | 'Role Changed' | 'Left Company' | 'Unknown';

export interface Stakeholder {
  id: string;
  accountId: string;
  name: string;
  title: string;
  role: 'Executive Sponsor' | 'Economic Buyer' | 'Champion' | 'Technical Gatekeeper' | 'User Advocate';
  engagement: 'High' | 'Medium' | 'Low';
  alignment: number; // 1 to 5
  employmentStatus: StakeholderStatus;
  linkedinUrl?: string;
  notes?: string;
  lastContactDate?: string;
}

// 6. Meeting Memory & Interaction Log
export type MeetingType = 'EBR' | 'QBR' | 'Cadence' | 'Executive Alignment' | 'Escalation';

export interface ActionItem {
  id: string;
  ownerType: 'CUSTOMER' | 'CSM';
  ownerName: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface EmergingKpi {
  id: string;
  name: string;
  currentValue: string;
  targetValue: string;
  unit: string;
  promotedToObjectiveId?: string;
}

export interface MeetingLog {
  id: string;
  accountId: string;
  csmId: string;
  meetingDate: string;
  title: string;
  meetingType: MeetingType;
  attendeeStakeholderIds: string[];
  rawNotes?: string;
  executiveSummary: string;
  actionItems: ActionItem[];
  emergingKpis: EmergingKpi[];
  followUpEmailDraft?: string;
}
```

---

## 5. Timeline & Prioritized Execution Sequence

| Phase | Core Deliverable | Target Focus | Dependencies | Impact / Value |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | **Multi-Tier Hierarchy** | Data model refactor, Company vs. Project separation, Stakeholder tenure | None (Foundational) | Eliminates structural tech debt; scales to multi-account customers |
| **Phase 2** | **Meeting Memory Engine** | In-app meeting logger, dual task extraction, sponsor email composer, EBR feed | Phase 1 (requires account & stakeholder IDs) | Daily CSM utility; automated continuous memory into decks |
| **Phase 3** | **Leadership Hierarchy** | Manager team rollup, Director portfolio health, role switcher | Phase 1 & 2 (needs accounts & activity logs) | Unlocks enterprise CS team adoption and organizational value |
| **Phase 4** | **QBRBuilder Parity** | Internal Pre-Meeting Brief, `.pptx` export, file drag-and-drop | Phase 1 | Complete deck and document suite matching leading competitors |
| **Phase 5** | **Integrations** | CRM sync (Salesforce/HubSpot), calendar sync, LinkedIn alerts | Phase 1, 2, 3 | Hands-free data ingestion and automated relationship monitoring |

---

## 6. Recommendations & Next Steps

1. **Approve Phase 1 Implementation**: Proceed with updating `src/types.ts` and `src/sampleData.ts` to implement the `CustomerCompany` and `Account` separation and enriched `Stakeholder` schema with full backward-compatibility guarantees.
2. **Execute Phase 2 Immediately Following Phase 1**: Deliver the In-App Meeting Logger and Sponsor Follow-Up Composer in `ReportPreview` and `IntakeFlow`, providing immediate day-to-day workflow value for CSMs.

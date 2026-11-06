export interface UserProfile {
  fullName: string;
  jobTitle: string;
  email: string;
  companyName: string;
  companyLogoUrl: string;
  brandPrimaryColor: string;
  linkedinUrl?: string;
}

export type AccountTier = 'Strategic' | 'Enterprise' | 'Mid-Market';
export type MotionType = 'Growth' | 'Retention' | 'Risk';
export type StakeholderRole = 'Executive Sponsor' | 'Economic Buyer' | 'Champion' | 'Technical Gatekeeper' | 'User Advocate';
export type EngagementLevel = 'High' | 'Medium' | 'Low';
export type MilestoneStatus = 'Planned' | 'In Progress' | 'Completed' | 'At Risk';
export type MilestoneImpact = 'Operational Efficiency' | 'Financial Growth' | 'Risk Mitigation' | 'Strategic Expansion';

export interface CustomerCompany {
  id: string;
  name: string;
  industry: string;
  tier: AccountTier;
  domain?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Account {
  id: string;
  companyId?: string;
  /** @deprecated Use companyId and lookup via CustomerCompany. Kept as temporary backward-compatibility bridge. */
  companyName?: string;
  industry: string;
  contractStartDate: string;
  contractRenewalDate: string;
  annualRecurringRevenue?: number;
  accountTier: AccountTier;
  businessUnit: string;
  healthScore?: number; // 1-100, optional when unknown
}

export interface Stakeholder {
  id: string;
  accountId: string;
  name: string;
  title: string;
  role: StakeholderRole;
  engagement: EngagementLevel;
  alignment: number; // 1 to 5
  notes?: string;
}

export interface SuccessMilestone {
  id: string;
  accountId: string;
  title: string;
  status: MilestoneStatus;
  dueDate: string;
  owner: string;
  impactType: MilestoneImpact;
  outcomeDetails: string;
}

export interface PrimaryObjective {
  id: string;
  accountId: string;
  statement: string;
  focusType: MotionType;
  metricName: string;
  baselineValue: string;
  currentValue: string;
  targetValue: string;
  unit: string;
  estimatedRoiImpact: string;
  roiNumericImpact: number;
  nextSteps: string;
}

export interface FullAccountContext {
  account: Account;
  objective: PrimaryObjective;
  stakeholders: Stakeholder[];
  milestones: SuccessMilestone[];
}

export type ReportType = 'EBR' | 'QBR' | 'OPR';

export interface ImpactStreamStateV2 {
  schemaVersion: 2;
  profile: UserProfile;
  companies: CustomerCompany[];
  accounts: Account[];
  objectives: PrimaryObjective[];
  stakeholders: Stakeholder[];
  milestones: SuccessMilestone[];
}

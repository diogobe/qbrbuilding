import { UserProfile, CustomerCompany, Account, PrimaryObjective, Stakeholder, SuccessMilestone, FullAccountContext, ImpactStreamStateV2 } from './types';

export const defaultUserProfile: UserProfile = {
  fullName: "Sarah Chen",
  jobTitle: "Senior Strategic Customer Success Director",
  email: "sarah.chen@impactstream.io",
  companyName: "ImpactStream Solutions",
  companyLogoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80", // Premium geometric logo asset
  brandPrimaryColor: "#2563EB",
  linkedinUrl: "https://linkedin.com/in/sarah-chen-customer-success"
};

export const sampleCompanies: CustomerCompany[] = [
  {
    id: "comp-1",
    name: "Nexus Infrastructure Ltd.",
    industry: "Cloud Infrastructure & Hosting",
    tier: "Strategic",
    createdAt: "2024-03-01T00:00:00.000Z"
  },
  {
    id: "comp-2",
    name: "Acme Dynamics Corp",
    industry: "Industrial Software & RPA",
    tier: "Enterprise",
    createdAt: "2025-01-15T00:00:00.000Z"
  },
  {
    id: "comp-3",
    name: "CoreSentry Networks",
    industry: "Cybersecurity & Telecom",
    tier: "Strategic",
    createdAt: "2024-09-01T00:00:00.000Z"
  }
];

export const sampleAccounts: Account[] = [
  {
    id: "acc-1",
    companyId: "comp-1",
    companyName: "Nexus Infrastructure Ltd.",
    industry: "Cloud Infrastructure & Hosting",
    contractStartDate: "2024-03-01",
    contractRenewalDate: "2026-12-15",
    annualRecurringRevenue: 450000,
    accountTier: "Strategic",
    businessUnit: "Global Security Operations (EMEA & APAC)",
    healthScore: 92
  },
  {
    id: "acc-2",
    companyId: "comp-2",
    companyName: "Acme Dynamics Corp",
    industry: "Industrial Software & RPA",
    contractStartDate: "2025-01-15",
    contractRenewalDate: "2027-01-14",
    annualRecurringRevenue: 210000,
    accountTier: "Enterprise",
    businessUnit: "Financial Automation Systems",
    healthScore: 84
  },
  {
    id: "acc-3",
    companyId: "comp-3",
    companyName: "CoreSentry Networks",
    industry: "Cybersecurity & Telecom",
    contractStartDate: "2024-09-01",
    contractRenewalDate: "2026-08-31",
    annualRecurringRevenue: 180000,
    accountTier: "Strategic",
    businessUnit: "High-Availability Failover Services",
    healthScore: 58 // Low health score indicating risk
  }
];

export const sampleObjectives: PrimaryObjective[] = [
  {
    id: "obj-1",
    accountId: "acc-1",
    statement: "Consolidate multicloud security governance to reduce critical security incident response times by 35% through automated orchestration.",
    focusType: "Growth",
    metricName: "Average Incident Response Time (SLA)",
    baselineValue: "42",
    currentValue: "28",
    targetValue: "25",
    unit: "mins",
    estimatedRoiImpact: "$285,400 Annual Net Savings",
    roiNumericImpact: 285400,
    nextSteps: "Rollout APAC automated response playbooks and complete Q3 executive alignment review."
  },
  {
    id: "obj-2",
    accountId: "acc-2",
    statement: "Standardize Robotic Process Automation (RPA) templates to drive 15,000 hours of monthly administrative task savings across the accounting division.",
    focusType: "Retention",
    metricName: "Monthly Admin Hours Reclaimed",
    baselineValue: "2500",
    currentValue: "11800",
    targetValue: "15000",
    unit: "hours",
    estimatedRoiImpact: "$470,000 Labor Reallocation Value",
    roiNumericImpact: 470000,
    nextSteps: "Conduct workshop for Accounts Payable division and publish the standardized automation templates directory."
  },
  {
    id: "obj-3",
    accountId: "acc-3",
    statement: "Establish robust multi-node failover architecture to mitigate catastrophic business interruption and network outage risks.",
    focusType: "Risk",
    metricName: "Primary Failover Synchronization Latency",
    baselineValue: "18.5",
    currentValue: "4.8",
    targetValue: "3.0",
    unit: "seconds",
    estimatedRoiImpact: "$600,000 Down-time Liability Prevented",
    roiNumericImpact: 600000,
    nextSteps: "Finalize high-availability failover service level agreements and resolve the secondary cluster physical connectivity concerns."
  }
];

export const sampleStakeholders: Stakeholder[] = [
  {
    id: "st-1",
    accountId: "acc-1",
    name: "David Marcus",
    title: "Chief Technology Officer",
    role: "Executive Sponsor",
    engagement: "High",
    alignment: 5,
    notes: "Highly enthusiastic about consolidating legacy tooling. Prefers direct, business-outcome reporting with concise financial impacts."
  },
  {
    id: "st-2",
    accountId: "acc-1",
    name: "Elena Rodriguez",
    title: "VP of Security Engineering",
    role: "Champion",
    engagement: "High",
    alignment: 4,
    notes: "Main driver of operational automation. Highly aligned with team metrics and reduction in SLA breaches."
  },
  {
    id: "st-3",
    accountId: "acc-1",
    name: "Trevor Higgins",
    title: "Lead DevOps Architect",
    role: "Technical Gatekeeper",
    engagement: "Medium",
    alignment: 3,
    notes: "Pragmatic but receptive. Needs reassurance regarding compatibility with multi-cloud legacy networks."
  },
  // Acme Dynamics Stakeholders
  {
    id: "st-4",
    accountId: "acc-2",
    name: "Robert Vance",
    title: "VP of Finance Shared Services",
    role: "Executive Sponsor",
    engagement: "Medium",
    alignment: 4,
    notes: "Focused heavily on resource optimization. Wants to reallocate staff to higher-value analytical work."
  },
  {
    id: "st-5",
    accountId: "acc-2",
    name: "Sophia Martinez",
    title: "Director of Accounts Operations",
    role: "Champion",
    engagement: "High",
    alignment: 5,
    notes: "Exceptional advocate. Hosts weekly feedback sessions to drive custom template adoption."
  },
  // CoreSentry Networks Stakeholders
  {
    id: "st-6",
    accountId: "acc-3",
    name: "Amanda Cole",
    title: "Director of Network Operations",
    role: "Champion",
    engagement: "Medium",
    alignment: 4,
    notes: "Understands risk of outages but faces internal budget barriers."
  },
  {
    id: "st-7",
    accountId: "acc-3",
    name: "Gregory Vance",
    title: "VP of Telecom Systems",
    role: "Executive Sponsor",
    engagement: "Low",
    alignment: 2,
    notes: "Critical stakeholder. Critical of recent regional hardware faults. Urgent executive alignment required."
  }
];

export const sampleMilestones: SuccessMilestone[] = [
  // Nexus Infrastructure Ltd. Milestones
  {
    id: "ms-1",
    accountId: "acc-1",
    title: "Phase 1: Multi-Cloud Security Audit & Ingestion Mapping",
    status: "Completed",
    dueDate: "2026-02-15",
    owner: "Elena Rodriguez",
    impactType: "Operational Efficiency",
    outcomeDetails: "Mapped 45 discrete APIs and consolidated fragmented vulnerability scan reports into a single glass pane."
  },
  {
    id: "ms-2",
    accountId: "acc-1",
    title: "Phase 2: EMEA Region Alert Ingestion & Orchestration Automation",
    status: "Completed",
    dueDate: "2026-04-10",
    owner: "Sarah Chen",
    impactType: "Operational Efficiency",
    outcomeDetails: "Reduced duplicate alert noise by 55%, preventing engineers from alert fatigue."
  },
  {
    id: "ms-3",
    accountId: "acc-1",
    title: "Phase 3: APAC Corridors Ingestion & Team Training Rollout",
    status: "In Progress",
    dueDate: "2026-07-15",
    owner: "Trevor Higgins",
    impactType: "Strategic Expansion",
    outcomeDetails: "Integrating 3 main APAC hosting clusters. 85% of regional engineers trained."
  },
  {
    id: "ms-4",
    accountId: "acc-1",
    title: "Phase 4: Q3 Final Value Assessment & SLA Validation",
    status: "Planned",
    dueDate: "2026-09-01",
    owner: "Sarah Chen",
    impactType: "Financial Growth",
    outcomeDetails: "Quantify real-world financial savings from incident prevention and present to David Marcus."
  },
  // Acme Dynamics Corp Milestones
  {
    id: "ms-5",
    accountId: "acc-2",
    title: "Process Ingestion Pilot & Core Template Development",
    status: "Completed",
    dueDate: "2026-01-20",
    owner: "Sophia Martinez",
    impactType: "Financial Growth",
    outcomeDetails: "Automated 5 highly repetitive administrative tasks, saving an initial 2,500 hours/month."
  },
  {
    id: "ms-6",
    accountId: "acc-2",
    title: "Finance Division Training & Onboarding Workshop",
    status: "Completed",
    dueDate: "2026-03-15",
    owner: "Sarah Chen",
    impactType: "Operational Efficiency",
    outcomeDetails: "Delivered 4 hands-on workshops to 120 accounting analysts to accelerate standardization."
  },
  {
    id: "ms-7",
    accountId: "acc-2",
    title: "Accounts Payable Multi-System Integration Rollout",
    status: "In Progress",
    dueDate: "2026-06-30",
    owner: "Sophia Martinez",
    impactType: "Operational Efficiency",
    outcomeDetails: "Migrating core invoice verification flows. Expecting an additional 3,200 hours saved."
  },
  // CoreSentry Networks Milestones
  {
    id: "ms-8",
    accountId: "acc-3",
    title: "Disaster Recovery Node Reconfiguration & Routing Review",
    status: "Completed",
    dueDate: "2026-03-05",
    owner: "Amanda Cole",
    impactType: "Risk Mitigation",
    outcomeDetails: "Cleaned up orphaned routes and optimized packet delivery between backup clusters."
  },
  {
    id: "ms-9",
    accountId: "acc-3",
    title: "Failover Latency Load Testing & Route Optimization",
    status: "Completed",
    dueDate: "2026-04-18",
    owner: "Sarah Chen",
    impactType: "Risk Mitigation",
    outcomeDetails: "Achieved baseline reduction down to 4.8 seconds. Simulated hardware failure tested successfully."
  },
  {
    id: "ms-10",
    accountId: "acc-3",
    title: "Executive High-Availability SLA Mapping",
    status: "In Progress",
    dueDate: "2026-07-01",
    owner: "Gregory Vance",
    impactType: "Risk Mitigation",
    outcomeDetails: "Formalizing contract guarantees for outage indemnities. Aligning with Gregory Vance to restore confidence."
  }
];

export const STORAGE_KEYS = {
  // Legacy v1 keys (preserved intact for rollback safety)
  LEGACY_PROFILE: 'impactstream_profile',
  LEGACY_ACCOUNTS: 'impactstream_accounts',
  LEGACY_OBJECTIVES: 'impactstream_objectives',
  LEGACY_STAKEHOLDERS: 'impactstream_stakeholders',
  LEGACY_MILESTONES: 'impactstream_milestones',

  // Modern v2 keys (isolated namespace)
  V2_VERSION: 'impactstream_v2_schema_version',
  V2_PROFILE: 'impactstream_v2_profile',
  V2_COMPANIES: 'impactstream_v2_companies',
  V2_ACCOUNTS: 'impactstream_v2_accounts',
  V2_OBJECTIVES: 'impactstream_v2_objectives',
  V2_STAKEHOLDERS: 'impactstream_v2_stakeholders',
  V2_MILESTONES: 'impactstream_v2_milestones'
};

/**
 * Non-destructive migration function that transforms v1 legacy state into normalized v2 schema.
 * 
 * Rules:
 * 1. Checks schemaVersion === 2. If present, returns state.
 * 2. Does NOT substitute 0 for unknown/missing data; missing ARR and healthScore remain undefined.
 * 3. Extracts distinct CustomerCompany entities deterministically based on trimmed companyName.
 * 4. Links each account to companyId while preserving companyName as a backward-compatibility bridge.
 */
export function migrateLegacyState(raw: any): ImpactStreamStateV2 {
  if (raw && raw.schemaVersion === 2 && Array.isArray(raw.companies) && raw.companies.length > 0) {
    return raw as ImpactStreamStateV2;
  }

  const legacyAccounts: any[] = Array.isArray(raw?.accounts) ? raw.accounts : [];
  const companies: CustomerCompany[] = [];
  const migratedAccounts: Account[] = [];

  legacyAccounts.forEach((legacyAcc: any, idx: number) => {
    const rawCompanyName = typeof legacyAcc.companyName === 'string' && legacyAcc.companyName.trim()
      ? legacyAcc.companyName.trim()
      : 'Unassigned Customer';

    // Find or create company deterministically
    let company = companies.find(c => c.name.toLowerCase() === rawCompanyName.toLowerCase());
    if (!company) {
      company = {
        id: `comp-${idx + 1}-${Date.now()}`,
        name: rawCompanyName,
        industry: legacyAcc.industry || 'Unspecified',
        tier: legacyAcc.accountTier || 'Enterprise',
        createdAt: new Date().toISOString()
      };
      companies.push(company);
    }

    // Mandatory Rule: Do NOT use 0 as a substitute for unknown data. Missing values remain undefined.
    const arrVal = typeof legacyAcc.annualRecurringRevenue === 'number' && !isNaN(legacyAcc.annualRecurringRevenue)
      ? legacyAcc.annualRecurringRevenue
      : undefined;

    const healthVal = typeof legacyAcc.healthScore === 'number' && !isNaN(legacyAcc.healthScore)
      ? legacyAcc.healthScore
      : undefined;

    migratedAccounts.push({
      id: legacyAcc.id || `acc-${idx + 1}-${Date.now()}`,
      companyId: company.id,
      companyName: rawCompanyName, // Temporary deprecated bridge
      industry: legacyAcc.industry || 'Unspecified',
      contractStartDate: legacyAcc.contractStartDate || '',
      contractRenewalDate: legacyAcc.contractRenewalDate || '',
      annualRecurringRevenue: arrVal,
      accountTier: legacyAcc.accountTier || 'Enterprise',
      businessUnit: legacyAcc.businessUnit || 'General Operations',
      healthScore: healthVal
    });
  });

  const finalCompanies = companies.length > 0 ? companies : sampleCompanies;
  const finalAccounts = migratedAccounts.length > 0 ? migratedAccounts : sampleAccounts;

  return {
    schemaVersion: 2,
    profile: raw?.profile || defaultUserProfile,
    companies: finalCompanies,
    accounts: finalAccounts,
    objectives: Array.isArray(raw?.objectives) ? raw.objectives : sampleObjectives,
    stakeholders: Array.isArray(raw?.stakeholders) ? raw.stakeholders : sampleStakeholders,
    milestones: Array.isArray(raw?.milestones) ? raw.milestones : sampleMilestones
  };
}

export const getInitialState = (): ImpactStreamStateV2 => {
  try {
    // 1. First, check if promoted v2 state exists
    const v2Version = localStorage.getItem(STORAGE_KEYS.V2_VERSION);
    if (v2Version === '2') {
      const savedProfile = localStorage.getItem(STORAGE_KEYS.V2_PROFILE);
      const savedCompanies = localStorage.getItem(STORAGE_KEYS.V2_COMPANIES);
      const savedAccounts = localStorage.getItem(STORAGE_KEYS.V2_ACCOUNTS);
      const savedObjectives = localStorage.getItem(STORAGE_KEYS.V2_OBJECTIVES);
      const savedStakeholders = localStorage.getItem(STORAGE_KEYS.V2_STAKEHOLDERS);
      const savedMilestones = localStorage.getItem(STORAGE_KEYS.V2_MILESTONES);

      if (savedCompanies && savedAccounts) {
        return {
          schemaVersion: 2,
          profile: savedProfile ? JSON.parse(savedProfile) : defaultUserProfile,
          companies: JSON.parse(savedCompanies),
          accounts: JSON.parse(savedAccounts),
          objectives: savedObjectives ? JSON.parse(savedObjectives) : sampleObjectives,
          stakeholders: savedStakeholders ? JSON.parse(savedStakeholders) : sampleStakeholders,
          milestones: savedMilestones ? JSON.parse(savedMilestones) : sampleMilestones
        };
      }
    }

    // 2. Next, check for legacy v1 state to migrate
    const legacyAccountsRaw = localStorage.getItem(STORAGE_KEYS.LEGACY_ACCOUNTS);
    if (legacyAccountsRaw) {
      try {
        const legacyProfileRaw = localStorage.getItem(STORAGE_KEYS.LEGACY_PROFILE);
        const legacyObjectivesRaw = localStorage.getItem(STORAGE_KEYS.LEGACY_OBJECTIVES);
        const legacyStakeholdersRaw = localStorage.getItem(STORAGE_KEYS.LEGACY_STAKEHOLDERS);
        const legacyMilestonesRaw = localStorage.getItem(STORAGE_KEYS.LEGACY_MILESTONES);

        const legacyData = {
          profile: legacyProfileRaw ? JSON.parse(legacyProfileRaw) : defaultUserProfile,
          accounts: JSON.parse(legacyAccountsRaw),
          objectives: legacyObjectivesRaw ? JSON.parse(legacyObjectivesRaw) : sampleObjectives,
          stakeholders: legacyStakeholdersRaw ? JSON.parse(legacyStakeholdersRaw) : sampleStakeholders,
          milestones: legacyMilestonesRaw ? JSON.parse(legacyMilestonesRaw) : sampleMilestones
        };

        // Run non-destructive migration
        const migrated = migrateLegacyState(legacyData);

        // Validation before promotion: Ensure valid companies and accounts
        if (Array.isArray(migrated.companies) && migrated.companies.length > 0 && Array.isArray(migrated.accounts)) {
          // Two-phase promotion: Write to isolated v2 keys.
          // CRITICAL ROLLBACK SAFEGUARD: Legacy keys are NEVER deleted or overwritten.
          localStorage.setItem(STORAGE_KEYS.V2_PROFILE, JSON.stringify(migrated.profile));
          localStorage.setItem(STORAGE_KEYS.V2_COMPANIES, JSON.stringify(migrated.companies));
          localStorage.setItem(STORAGE_KEYS.V2_ACCOUNTS, JSON.stringify(migrated.accounts));
          localStorage.setItem(STORAGE_KEYS.V2_OBJECTIVES, JSON.stringify(migrated.objectives));
          localStorage.setItem(STORAGE_KEYS.V2_STAKEHOLDERS, JSON.stringify(migrated.stakeholders));
          localStorage.setItem(STORAGE_KEYS.V2_MILESTONES, JSON.stringify(migrated.milestones));
          // Final promotion marker
          localStorage.setItem(STORAGE_KEYS.V2_VERSION, '2');

          return migrated;
        }
      } catch (migrationError) {
        // Rollback strategy: if migration throws, fallback to intact legacy data without overwriting anything
        console.error("Migration validation failed, rolling back to intact legacy v1 state", migrationError);
        const legacyAccounts = JSON.parse(legacyAccountsRaw);
        return {
          schemaVersion: 2,
          profile: defaultUserProfile,
          companies: sampleCompanies,
          accounts: legacyAccounts.map((a: any) => ({
            ...a,
            companyId: sampleCompanies[0]?.id || 'comp-1'
          })),
          objectives: sampleObjectives,
          stakeholders: sampleStakeholders,
          milestones: sampleMilestones
        };
      }
    }

    // 3. Fresh instance: seed normalized v2 defaults
    return {
      schemaVersion: 2,
      profile: defaultUserProfile,
      companies: sampleCompanies,
      accounts: sampleAccounts,
      objectives: sampleObjectives,
      stakeholders: sampleStakeholders,
      milestones: sampleMilestones
    };
  } catch (e) {
    console.error("Error reading storage, using safe v2 default sample data", e);
    return {
      schemaVersion: 2,
      profile: defaultUserProfile,
      companies: sampleCompanies,
      accounts: sampleAccounts,
      objectives: sampleObjectives,
      stakeholders: sampleStakeholders,
      milestones: sampleMilestones
    };
  }
};

export const saveStateToLocalStorage = (state: {
  profile: UserProfile;
  companies: CustomerCompany[];
  accounts: Account[];
  objectives: PrimaryObjective[];
  stakeholders: Stakeholder[];
  milestones: SuccessMilestone[];
}) => {
  try {
    localStorage.setItem(STORAGE_KEYS.V2_VERSION, '2');
    localStorage.setItem(STORAGE_KEYS.V2_PROFILE, JSON.stringify(state.profile));
    localStorage.setItem(STORAGE_KEYS.V2_COMPANIES, JSON.stringify(state.companies));
    localStorage.setItem(STORAGE_KEYS.V2_ACCOUNTS, JSON.stringify(state.accounts));
    localStorage.setItem(STORAGE_KEYS.V2_OBJECTIVES, JSON.stringify(state.objectives));
    localStorage.setItem(STORAGE_KEYS.V2_STAKEHOLDERS, JSON.stringify(state.stakeholders));
    localStorage.setItem(STORAGE_KEYS.V2_MILESTONES, JSON.stringify(state.milestones));
  } catch (e) {
    console.error("Error saving v2 state to localStorage", e);
  }
};

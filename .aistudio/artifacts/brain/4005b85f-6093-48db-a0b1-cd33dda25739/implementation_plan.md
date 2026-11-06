# Batch 002: Company Grouping in Book of Business UI

## 1. Objective
Update the Book of Business interface (`BookOfBusiness.tsx`) to visually group accounts/projects under their parent `CustomerCompany`, enabling CSMs to clearly manage enterprise clients with multiple projects or business units while preserving single-click account selection, existing KPI summary metrics, and backward-compatible account creation.

## 2. Why Now
Batch 001 normalized the relational foundation (`CustomerCompany` and `Account.companyId`). Batch 002 surfaces this hierarchy to the user, allowing them to see all contracts/projects under a given enterprise client, resolving the flat portfolio limitation before we introduce multi-objective intake (Batch 003).

## 3. Scope
- Update `BookOfBusinessProps` to accept `companies: CustomerCompany[]` alongside `accounts: Account[]`.
- Pass `companies` from `App.tsx` to `BookOfBusiness`.
- Group accounts by `companyId` (with fallback to `companyName` for legacy accounts).
- Render each `CustomerCompany` container with:
  - Company name, industry, tier badge/text, and aggregated company contract ARR.
  - Project/business unit cards or rows displaying health score, ARR, renewal date, and 1-click "Select Project" action.
- Update the "Add Account" modal in `BookOfBusiness.tsx`:
  - Allow selecting an existing company from a dropdown OR typing a new company name.
  - Assign the selected/created `companyId` to the newly added `Account`.
- Update top KPI summary stat cards in `BookOfBusiness`:
  - Show Total Book Value (ARR), Portfolio Average Health, Strategic Accounts count, and **Total Customer Companies** count alongside active projects.
- Preserve 100% of existing selection, deletion, and navigation flows.

## 4. Explicitly Out of Scope
- **NO changes to `IntakeFlow.tsx`** (remains identical; deferred to B-003 / B-004).
- **NO changes to `ReportPreview.tsx`** (remains identical).
- **NO multiple objectives per account** (deferred to B-003).
- **NO risks, decisions, or action items** (deferred to B-004).
- **NO report versioning** (deferred to B-005).
- **NO AI features or endpoints** (deferred to B-007).
- **NO exports or meeting memory** (deferred to B-008 / B-009).

## 5. Files to Create or Modify
1. `src/components/BookOfBusiness.tsx`: Accept `companies: CustomerCompany[]`, render company-grouped view, and allow attaching new accounts to existing companies.
2. `src/App.tsx`: Pass `companies` prop to `<BookOfBusiness ... />`.

*(No other files need modification in this batch).*

## 6. Exact UI and Interaction Changes
1. **Grouping Presentation**:
   - Instead of an unorganized grid of cards, accounts are grouped under clean company header panels.
   - Company headers display: Company Name, Industry, Tier, Total Aggregate ARR across all projects, and count of active projects.
   - Inside each company panel, individual project/business unit cards show: Business Unit Title, Health Score (or "—" if undefined), Annual Recurring Revenue (or "—" if undefined), Renewal Target, Delete action, and Select button.
2. **Account Creation Modal**:
   - The modal provides a toggle/select: "Existing Company" (dropdown of current companies) or "New Company" (text input for new client entity).
   - Prevents duplicate company names from being created inadvertently.

## 7. Implementation Steps
1. **Step 1**: In `src/components/BookOfBusiness.tsx`, import `CustomerCompany` from `../types` and update `BookOfBusinessProps` to include `companies: CustomerCompany[]`.
2. **Step 2**: Add company selector in `handleSubmit` and form inputs (`selectedCompanyId: string`, with option `'__NEW__'`).
3. **Step 3**: Group accounts by company using a `useMemo` grouping map.
4. **Step 4**: In `src/App.tsx`, pass `companies={companies}` to `<BookOfBusiness ... />`.
5. **Step 5**: Run validation commands: `bun run lint` and `bun run build`.

## 8. Acceptance Criteria
1. The app compiles and lints with **zero errors** (`bun run lint`, `bun run build`).
2. Accounts in Book of Business are clearly grouped under their respective `CustomerCompany`.
3. If an enterprise company has multiple accounts/projects, all projects appear together under that single company header.
4. Clicking "Select Portfolio Unit" / "Configure Report" on any account seamlessly transitions to the builder workspace for that active account.
5. Creating an account linked to an existing company does not create a duplicate company record.
6. Creating an account with a new company creates both the company and the project.
7. Deleting an account removes it from its company group; if a company has zero accounts, it displays an empty state or is cleanly handled.

## 9. Manual Test Script
1. **Grouping Verification**:
   - Open Book of Business.
   - Confirm company names (*Nexus Infrastructure Ltd.*, *Acme Dynamics Corp*, *CoreSentry Networks*) appear as parent group headers.
   - Confirm project cards (*Global Security Operations*, *Financial Automation Systems*, *High-Availability Failover Services*) render inside their respective company sections.
2. **Multi-Project Creation**:
   - Click "Add Account".
   - Select existing company "Nexus Infrastructure Ltd.".
   - Enter business unit "Cloud Migration APAC", ARR $120,000, Renewal "2027-12-31".
   - Click "Add Active Account".
   - Verify that *Nexus Infrastructure Ltd.* now shows 2 project cards beneath it and its aggregate ARR updates.
3. **Selection Flow**:
   - Click "Select Portfolio Unit" on the new project.
   - Verify the Advisory Builder opens with the new project context active.

## 10. Rollback Strategy
- The grouping logic in `BookOfBusiness.tsx` purely enhances presentation using existing props. If any issue arises, the view can instantly revert to the flat map without affecting state or stored data.

## 11. Risks and Mitigations
- **Risk**: An account has an invalid or orphaned `companyId`.
  - **Mitigation**: The grouping logic falls back to matching by `companyName` or placing orphaned accounts in an "Other Accounts" group.
- **Risk**: Cluttered cards when companies have 5+ projects.
  - **Mitigation**: Clean grid layout per company with subtle border separation adhering to the Universal Frontend Design Constitution (no nested card-in-card clutter, unboxed metadata).

## 12. Approval Gate
- Requires explicit user sign-off prior to writing any code for Batch 002.

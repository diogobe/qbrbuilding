export interface PresentationTheme {
  id: string;
  name: string;
  description: string;
  fontDisplay: string; // display font class
  fontSans: string;    // sans font class
  bgClass: string;     // outer slide background
  borderClass: string; // outer slide border
  shadowClass: string; // outer slide shadow
  textTitle: string;   // primary slide headers
  textBody: string;    // standard text
  textMuted: string;   // labels and muted helper text
  accentColor: string; // hex color for standard dynamic progress bars/SVG fills
  accentBg: string;    // light backdrop for accent highlights
  accentText: string;  // text colored with the accent
  accentBorder: string;// border color with the accent
  cardBg: string;      // block card background
  cardBorder: string;  // block card border
  divider: string;     // divider/border-b classes
  glowOpacity: string; // blur-3xl blob watermark opacity
  tagSuccess: string;  // badge success styles
  tagWarning: string;  // badge warning styles
  tagDanger: string;   // badge danger styles
}

export const PRESENTATION_THEMES: PresentationTheme[] = [
  {
    id: 'executive-classic',
    name: 'Executive Classic',
    description: 'Traditional, stately, and authoritative. Excellent for board and leadership alignment.',
    fontDisplay: 'font-serif-classic font-semibold tracking-tight',
    fontSans: 'font-sans',
    bgClass: 'bg-white',
    borderClass: 'border-2 border-slate-900/10',
    shadowClass: 'shadow-2xl shadow-slate-900/5',
    textTitle: 'text-slate-900',
    textBody: 'text-slate-800',
    textMuted: 'text-slate-400',
    accentColor: '#1E293B', // Deep Slate
    accentBg: 'bg-slate-50',
    accentText: 'text-slate-900',
    accentBorder: 'border-slate-900',
    cardBg: 'bg-slate-50/80',
    cardBorder: 'border-slate-100',
    divider: 'border-slate-100',
    glowOpacity: 'opacity-5',
    tagSuccess: 'bg-emerald-50 text-emerald-800 border border-emerald-150',
    tagWarning: 'bg-amber-50 text-amber-800 border border-amber-150',
    tagDanger: 'bg-rose-50 text-rose-800 border border-rose-150',
  },
  {
    id: 'modern-ops',
    name: 'Modern Ops',
    description: 'Sleek, data-centric, and tech-forward. High-contrast developer-inspired dark theme.',
    fontDisplay: 'font-sans-ops font-black tracking-tight uppercase',
    fontSans: 'font-mono text-[11px]',
    bgClass: 'bg-[#090d16]',
    borderClass: 'border border-slate-800/80',
    shadowClass: 'shadow-2xl shadow-emerald-950/20',
    textTitle: 'text-white',
    textBody: 'text-slate-300',
    textMuted: 'text-slate-500',
    accentColor: '#10B981', // Neon Emerald
    accentBg: 'bg-slate-900/70',
    accentText: 'text-emerald-400',
    accentBorder: 'border-emerald-500',
    cardBg: 'bg-[#111827]',
    cardBorder: 'border-slate-800/80',
    divider: 'border-slate-800',
    glowOpacity: 'opacity-15',
    tagSuccess: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    tagWarning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    tagDanger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
  },
  {
    id: 'premium-insight',
    name: 'Premium Insight',
    description: 'Warm, editorial, and sophisticated. Designed like a luxury publication review.',
    fontDisplay: 'font-serif-premium font-bold tracking-tight italic',
    fontSans: 'font-sans tracking-wide',
    bgClass: 'bg-[#FAF8F5]', // Warm linen paper feel
    borderClass: 'border border-[#D9CFC1]',
    shadowClass: 'shadow-xl shadow-stone-800/5',
    textTitle: 'text-[#2C221E]', // Deep warm espresso
    textBody: 'text-[#5C4D46]',  // Warm charcoal
    textMuted: 'text-[#8C7A70]',  // Warm taupe
    accentColor: '#C5A880',      // Muted brass/gold
    accentBg: 'bg-[#F4EFE6]',
    accentText: 'text-[#C5A880]',
    accentBorder: 'border-[#C5A880]',
    cardBg: 'bg-[#F5F2EC]',
    cardBorder: 'border-[#EBE6DC]',
    divider: 'border-[#E5DEC9]',
    glowOpacity: 'opacity-5',
    tagSuccess: 'bg-emerald-50/70 text-emerald-800 border border-emerald-200/50',
    tagWarning: 'bg-amber-50/70 text-amber-800 border border-amber-200/50',
    tagDanger: 'bg-rose-50/70 text-rose-800 border border-rose-200/50',
  },
];

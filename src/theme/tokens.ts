/**
 * OmniSync Social Design System & Theme Tokens
 * Theme: Playful Pastel Studio
 * High-legibility modern pastel aesthetic with soft tints and deep ink typography.
 */

export const BRAND_CONFIG = {
  name: 'OmniSync Social',
  shortName: 'OmniSync',
  edition: 'Multi-Channel Social Studio',
  tagline: 'Precision Multi-Channel Social Orchestration & Content Intelligence',
  version: '4.2',
  supportEmail: 'hello@omnisync.io',
} as const;

export const THEME_TOKENS = {
  colors: {
    brand: {
      primary: '#8B5CF6',       // Vibrant violet
      primaryHover: '#7C3AED',
      primaryLight: '#F3E8FF',  // Pastel lilac
      secondary: '#06B6D4',     // Cyan pastel breeze
      secondaryHover: '#0891B2',
      secondaryLight: '#ECFEFF',
    },
    canvas: {
      light: '#FAF5FF',         // Soft pastel lilac background wash
      dark: '#0F172A',
    },
    surface: {
      white: '#FFFFFF',
      subtle: '#FAF5FF',
      card: '#FFFFFF',
      lilacWash: '#F5F3FF',
      mintFrost: '#F0FDF4',
      skyBreeze: '#F0F9FF',
      peachGlow: '#FFF7ED',
      blushPetal: '#FDF2F8',
    },
    border: {
      subtle: '#F3E8FF',
      default: '#E9D5FF',
      card: '#E2E8F0',
      active: '#8B5CF6',
    },
    text: {
      primary: '#1E1B4B',       // Deep ink violet (WCAG AAA contrast on light)
      secondary: '#475569',     // Slate graphite
      muted: '#94A3B8',
      inverse: '#FFFFFF',
    },
    accent: {
      blush: '#F472B6',
      mint: '#10B981',
      sunflower: '#F59E0B',
      sky: '#0EA5E9',
      purple: '#8B5CF6',
    },
    status: {
      published: {
        text: 'text-emerald-800',
        bg: 'bg-emerald-50/80',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      },
      scheduled: {
        text: 'text-purple-800',
        bg: 'bg-purple-50/80',
        border: 'border-purple-200',
        dot: 'bg-purple-500',
      },
      draft: {
        text: 'text-amber-800',
        bg: 'bg-amber-50/80',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      },
      failed: {
        text: 'text-rose-800',
        bg: 'bg-rose-50/80',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
      },
      cancelled: {
        text: 'text-slate-600',
        bg: 'bg-slate-100',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
      },
    },
  },
  typography: {
    fontSans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    fontMono: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
  },
  elevation: {
    card: 'shadow-[0_2px_8px_0_rgba(139,92,246,0.04)] border border-purple-100/80',
    cardHover: 'hover:shadow-[0_8px_20px_0_rgba(139,92,246,0.08)] hover:border-purple-200 transition-all duration-200',
    modal: 'shadow-[0_24px_60px_-12px_rgba(30,27,75,0.25)] border border-purple-100',
  },
  radii: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
  },
} as const;

export const SOCIAL_PLATFORMS_SPEC: Record<
  string,
  {
    id: 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'youtube';
    displayName: string;
    shortLabel: string;
    charLimit: number;
    maxMedia: number;
    mediaMandatory: boolean;
    brandColor: string;
    chipBg: string;
    chipText: string;
    chipBorder: string;
    pastelIconBg: string;
  }
> = {
  twitter: {
    id: 'twitter',
    displayName: 'X (Twitter)',
    shortLabel: 'X',
    charLimit: 280,
    maxMedia: 4,
    mediaMandatory: false,
    brandColor: '#0f1419',
    chipBg: 'bg-slate-100',
    chipText: 'text-slate-800',
    chipBorder: 'border-slate-200',
    pastelIconBg: 'bg-slate-200/70 text-slate-800',
  },
  instagram: {
    id: 'instagram',
    displayName: 'Instagram',
    shortLabel: 'IG',
    charLimit: 2200,
    maxMedia: 10,
    mediaMandatory: true,
    brandColor: '#E1306C',
    chipBg: 'bg-pink-50',
    chipText: 'text-pink-800',
    chipBorder: 'border-pink-200',
    pastelIconBg: 'bg-pink-100 text-pink-700',
  },
  facebook: {
    id: 'facebook',
    displayName: 'Facebook',
    shortLabel: 'FB',
    charLimit: 63206,
    maxMedia: 10,
    mediaMandatory: false,
    brandColor: '#1877F2',
    chipBg: 'bg-blue-50',
    chipText: 'text-blue-800',
    chipBorder: 'border-blue-200',
    pastelIconBg: 'bg-blue-100 text-blue-700',
  },
  linkedin: {
    id: 'linkedin',
    displayName: 'LinkedIn',
    shortLabel: 'IN',
    charLimit: 3000,
    maxMedia: 9,
    mediaMandatory: false,
    brandColor: '#0A66C2',
    chipBg: 'bg-sky-50',
    chipText: 'text-sky-800',
    chipBorder: 'border-sky-200',
    pastelIconBg: 'bg-sky-100 text-sky-700',
  },
  youtube: {
    id: 'youtube',
    displayName: 'YouTube',
    shortLabel: 'YT',
    charLimit: 5000,
    maxMedia: 5,
    mediaMandatory: false,
    brandColor: '#FF0000',
    chipBg: 'bg-rose-50',
    chipText: 'text-rose-800',
    chipBorder: 'border-rose-200',
    pastelIconBg: 'bg-rose-100 text-rose-700',
  },
};

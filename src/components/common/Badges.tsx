import React from 'react';
import { SocialPlatformId, PostStatus, UserRole } from '../../types';
import { SOCIAL_PLATFORMS_SPEC, THEME_TOKENS } from '../../theme/tokens';

export const PlatformTag: React.FC<{
  platform: SocialPlatformId;
  size?: 'sm' | 'md';
  variant?: 'subtle' | 'outline' | 'filled';
}> = ({ platform, size = 'sm' }) => {
  const spec = SOCIAL_PLATFORMS_SPEC[platform] || {
    displayName: platform,
    shortLabel: platform.toUpperCase(),
    brandColor: '#64748b',
    chipBg: 'bg-slate-100 dark:bg-slate-800',
    chipText: 'text-slate-800 dark:text-slate-200',
  };

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium transition-colors ${
        isSmall ? 'text-[11px] px-2 py-0.5 rounded-md' : 'text-xs px-2.5 py-1 rounded-lg'
      } ${spec.chipBg} ${spec.chipText} border border-slate-200/60 dark:border-slate-700/60`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: spec.brandColor }}
      />
      <span className="font-sans font-semibold">{spec.displayName}</span>
    </span>
  );
};

export const StatusTag: React.FC<{
  status: PostStatus;
  size?: 'sm' | 'md';
}> = ({ status, size = 'sm' }) => {
  const metaMap: Record<
    PostStatus,
    { label: string; text: string; bg: string; border: string; dot: string }
  > = {
    PUBLISHED: {
      label: 'Published',
      text: 'text-emerald-700 dark:text-emerald-300',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      dot: 'bg-emerald-500',
    },
    SCHEDULED: {
      label: 'Scheduled',
      text: 'text-indigo-700 dark:text-indigo-300',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-200 dark:border-indigo-800/60',
      dot: 'bg-indigo-500',
    },
    DRAFT: {
      label: 'Draft',
      text: 'text-amber-700 dark:text-amber-300',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800/60',
      dot: 'bg-amber-500',
    },
    FAILED: {
      label: 'Failed',
      text: 'text-rose-700 dark:text-rose-300',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-800/60',
      dot: 'bg-rose-500',
    },
    CANCELLED: {
      label: 'Cancelled',
      text: 'text-slate-600 dark:text-slate-400',
      bg: 'bg-slate-100 dark:bg-slate-800/50',
      border: 'border-slate-200 dark:border-slate-700/60',
      dot: 'bg-slate-400',
    },
  };

  const meta = metaMap[status] || metaMap.DRAFT;
  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border ${
        isSmall ? 'text-[11px] px-2 py-0.5 rounded-md' : 'text-xs px-2.5 py-1 rounded-lg'
      } ${meta.bg} ${meta.text} ${meta.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dot}`} />
      <span>{meta.label}</span>
    </span>
  );
};

export const RoleTag: React.FC<{ role: UserRole }> = ({ role }) => {
  const styles: Record<UserRole, { label: string; text: string; bg: string; border: string }> = {
    ADMIN: {
      label: 'Admin',
      text: 'text-purple-700 dark:text-purple-300',
      bg: 'bg-purple-50 dark:bg-purple-950/50',
      border: 'border-purple-200 dark:border-purple-800/50',
    },
    MANAGER: {
      label: 'Manager',
      text: 'text-blue-700 dark:text-blue-300',
      bg: 'bg-blue-50 dark:bg-blue-950/50',
      border: 'border-blue-200 dark:border-blue-800/50',
    },
    EDITOR: {
      label: 'Editor',
      text: 'text-emerald-700 dark:text-emerald-300',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      border: 'border-emerald-200 dark:border-emerald-800/50',
    },
    VIEWER: {
      label: 'Viewer',
      text: 'text-slate-600 dark:text-slate-400',
      bg: 'bg-slate-100 dark:bg-slate-800/50',
      border: 'border-slate-200 dark:border-slate-700/50',
    },
  };

  const current = styles[role] || styles.VIEWER;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold font-mono tracking-wider uppercase border ${current.bg} ${current.text} ${current.border}`}
    >
      {current.label}
    </span>
  );
};

// Also export original names for compatibility
export { PlatformTag as PlatformBadge, StatusTag as StatusBadge, RoleTag as RoleBadge };

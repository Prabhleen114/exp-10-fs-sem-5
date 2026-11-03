import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  Check,
  Activity,
  Palette,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { markAsRead } from '../../store/slices/notificationSlice';
import { NavTab } from './NavigationSidebar';
import { RoleTag } from '../common/Badges';
import { BRAND_CONFIG } from '../../theme/tokens';
import { useAppTheme, AppTheme } from '../../context/ThemeContext';

interface AppHeaderProps {
  activeTab: NavTab;
  onOpenComposer: () => void;
  onOpenKafkaConsole: () => void;
  isPresentationMode?: boolean;
  onTogglePresentationMode?: () => void;
}

const TAB_METADATA: Record<NavTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Command Dashboard',
    subtitle: 'Real-time multi-channel engagement, telemetry, and queue metrics',
  },
  composer: {
    title: 'Multi-Channel Post Studio',
    subtitle: 'Author, validate, preview, and syndicate across 5 social channels',
  },
  calendar: {
    title: 'Interactive Content Calendar',
    subtitle: 'Manage cross-network schedule queues with drag-and-drop orchestration',
  },
  drafts: {
    title: 'Drafts Vault',
    subtitle: 'Autosaved drafts, collaborative copy, and channel templates',
  },
  accounts: {
    title: 'Connected Channels',
    subtitle: 'AES-256-GCM encrypted credentials and platform rate limits',
  },
  analytics: {
    title: 'Performance & Intelligence',
    subtitle: 'Cross-channel audience trends and Redis cache acceleration metrics',
  },
  users: {
    title: 'Team & RBAC Permissions',
    subtitle: 'Fine-grained access tiers for Admins, Managers, Editors, and Viewers',
  },
  audit: {
    title: 'Security Audit Trail',
    subtitle: 'Forensic event trail with correlation IDs and IP traceability',
  },
  kafka: {
    title: 'Event Bus Console',
    subtitle: 'Apache Kafka event partitions, offsets, and Dead Letter Queue (DLQ)',
  },
};

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeTab,
  onOpenComposer,
  onOpenKafkaConsole,
  isPresentationMode = false,
  onTogglePresentationMode,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { notifications, unreadCount } = useAppSelector((state) => state.notifications);
  const { theme, setTheme } = useAppTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const currentMeta = TAB_METADATA[activeTab] || {
    title: 'Dashboard',
    subtitle: 'Operational Overview',
  };

  const canCreatePost =
    user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'EDITOR';

  const themeOptions: Array<{ id: AppTheme; label: string; icon: React.ReactNode; color: string }> = [
    { id: 'playful-pastel', label: 'Playful Pastel', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'bg-purple-200' },
    { id: 'clean-studio', label: 'Clean Studio', icon: <Sun className="w-3.5 h-3.5" />, color: 'bg-slate-200' },
    { id: 'dark-obsidian', label: 'Obsidian Dark', icon: <Moon className="w-3.5 h-3.5" />, color: 'bg-slate-900 text-white' },
  ];

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-purple-100/90 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20 shadow-[0_1px_4px_rgba(139,92,246,0.03)] transition-colors">
      {/* Zone 1: Breadcrumbs & Section Title */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-xs text-purple-700 dark:text-purple-400 font-medium">
          <span className="font-semibold text-purple-900 dark:text-purple-300">
            {BRAND_CONFIG.shortName}
          </span>
          <span className="text-purple-300 dark:text-purple-600">/</span>
          <span className="capitalize text-slate-700 dark:text-slate-300">{activeTab}</span>
        </div>
        <h1 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
          {currentMeta.title}
        </h1>
      </div>

      {/* Zone 2: Search, Presentation Tools & Live Heartbeat */}
      <div className="flex items-center gap-2.5">
        {/* Global Search Input */}
        <div className="relative hidden lg:block w-48">
          <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search system..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-purple-50/50 dark:bg-slate-800 border border-purple-200/60 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-purple-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
        </div>

        {/* Theme Switcher Popover */}
        <div className="relative">
          <button
            onClick={() => setShowThemePicker(!showThemePicker)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-purple-200/80 dark:border-slate-700 bg-purple-50/40 dark:bg-slate-800 hover:bg-purple-100/60 text-xs font-semibold text-purple-900 dark:text-purple-300 transition-colors"
            title="Switch Visual Presentation Theme"
          >
            <Palette className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline capitalize">
              {theme === 'playful-pastel' ? 'Pastel' : theme === 'clean-studio' ? 'Studio' : 'Dark'}
            </span>
          </button>

          {showThemePicker && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-purple-100 dark:border-slate-800 overflow-hidden z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100">
              <span className="px-2.5 py-1 block text-[10px] font-bold uppercase tracking-wider text-purple-800 dark:text-purple-400">
                Visual Theme
              </span>
              {themeOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTheme(opt.id);
                    setShowThemePicker(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    theme === opt.id
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-950 dark:text-purple-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {opt.icon}
                    <span>{opt.label}</span>
                  </div>
                  {theme === opt.id && <Check className="w-3.5 h-3.5 text-purple-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Presentation Fullscreen Mode Toggle */}
        {onTogglePresentationMode && (
          <button
            onClick={onTogglePresentationMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-purple-900 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
            title={isPresentationMode ? 'Exit Presentation Mode' : 'Enter Stage Presentation Mode'}
          >
            {isPresentationMode ? (
              <Minimize2 className="w-4 h-4 text-purple-600" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Direct Download to PC Button */}
        <a
          href="/omnisync-social-project.zip"
          download="omnisync-social-project.zip"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200/80 dark:border-slate-700 bg-purple-50/40 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-slate-700 text-xs font-bold text-purple-900 dark:text-purple-300 transition-colors"
          title="Download Complete Project ZIP to your PC"
        >
          <svg className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Save to PC</span>
        </a>

        {/* Kafka Broker Live Pulse Button */}
        <button
          onClick={onOpenKafkaConsole}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-purple-200/80 dark:border-slate-700 bg-purple-50/40 dark:bg-slate-800 hover:bg-purple-100/60 text-xs text-purple-900 dark:text-purple-300 font-medium transition-colors"
          title="Open Kafka & Redis Event Console"
        >
          <Activity className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
          <span className="font-mono text-[11px] font-semibold">Kafka Bus: Active</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-purple-900 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-purple-100 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3.5 border-b border-purple-100 dark:border-slate-800 flex items-center justify-between bg-purple-50/50 dark:bg-slate-800/50">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Notifications ({unreadCount} unread)
                </span>
                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-mono font-medium">
                  Live Stream
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-purple-50 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <p className="p-6 text-xs text-slate-400 text-center">No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs transition-colors ${
                        n.read ? 'bg-white dark:bg-slate-900' : 'bg-purple-50/40 dark:bg-purple-950/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-slate-800 dark:text-slate-100">{n.title}</p>
                        {!n.read && (
                          <button
                            onClick={() => dispatch(markAsRead(n.id))}
                            className="text-purple-500 hover:text-purple-800 p-0.5"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        {new Date(n.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button: Create Post */}
        {canCreatePost && (
          <button
            onClick={onOpenComposer}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Post</span>
          </button>
        )}

        {/* Current User Role Tag */}
        {user && <RoleTag role={user.role} />}
      </div>
    </header>
  );
};

export { AppHeader as TopNavbar };

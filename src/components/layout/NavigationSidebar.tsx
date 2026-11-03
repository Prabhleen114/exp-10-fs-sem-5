import React, { useState } from 'react';
import {
  LayoutDashboard,
  PenTool,
  Calendar as CalendarIcon,
  FileText,
  Share2,
  BarChart3,
  Users,
  ShieldCheck,
  Cpu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  Radio,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { logoutUser, switchRoleDemo } from '../../store/slices/authSlice';
import { RoleTag } from '../common/Badges';
import { UserRole } from '../../types';
import { BRAND_CONFIG } from '../../theme/tokens';

export type NavTab =
  | 'dashboard'
  | 'composer'
  | 'calendar'
  | 'drafts'
  | 'accounts'
  | 'analytics'
  | 'users'
  | 'audit'
  | 'kafka';

interface NavigationSidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenKafkaConsole: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenKafkaConsole,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ReactNode;
    requiredRoles?: UserRole[];
    badge?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'composer',
      label: 'Create Post',
      icon: <PenTool className="w-4 h-4" />,
      requiredRoles: ['ADMIN', 'MANAGER', 'EDITOR'],
    },
    { id: 'calendar', label: 'Content Calendar', icon: <CalendarIcon className="w-4 h-4" /> },
    { id: 'drafts', label: 'Drafts Vault', icon: <FileText className="w-4 h-4" /> },
    { id: 'accounts', label: 'Connected Channels', icon: <Share2 className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics & Reports', icon: <BarChart3 className="w-4 h-4" /> },
    {
      id: 'users',
      label: 'Team & RBAC',
      icon: <Users className="w-4 h-4" />,
      requiredRoles: ['ADMIN', 'MANAGER'],
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      icon: <ShieldCheck className="w-4 h-4" />,
      requiredRoles: ['ADMIN', 'MANAGER'],
    },
  ];

  const handleRoleSwitch = (newRole: UserRole) => {
    dispatch(switchRoleDemo(newRole));
  };

  const currentRole = user?.role || 'VIEWER';

  return (
    <aside
      className={`bg-white dark:bg-slate-900 border-r border-purple-100 dark:border-slate-800 flex flex-col transition-all duration-300 z-30 shrink-0 select-none shadow-[2px_0_12px_rgba(139,92,246,0.03)] ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-purple-100/80 dark:border-slate-800 bg-gradient-to-r from-purple-50/60 to-pink-50/30 dark:from-slate-800/80 dark:to-slate-800/40">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-500/25 shrink-0">
            <Radio className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base leading-none">
                {BRAND_CONFIG.shortName}
              </span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold tracking-wider uppercase mt-1">
                Social Studio
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-400 hover:text-purple-700 dark:hover:text-purple-300 p-1.5 rounded-lg hover:bg-purple-100/60 dark:hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-2.5 space-y-1">
        {navItems.map((item) => {
          const isAllowed = !item.requiredRoles || item.requiredRoles.includes(currentRole);
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (isAllowed) onSelectTab(item.id);
              }}
              disabled={!isAllowed}
              title={!isAllowed ? `Requires ${item.requiredRoles?.join(' or ')} role` : item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                  : isAllowed
                  ? 'text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 hover:text-purple-700 dark:hover:text-purple-300'
                  : 'text-slate-400 cursor-not-allowed opacity-50'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <div className="shrink-0">{item.icon}</div>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {!isCollapsed && !isAllowed && (
                <span className="ml-auto text-[9px] uppercase px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold">
                  Restricted
                </span>
              )}
            </button>
          );
        })}

        {/* Separator */}
        <div className="pt-2 pb-1">
          <div className="border-t border-purple-100" />
        </div>

        {/* Kafka & Redis Event Console Button */}
        <button
          onClick={onOpenKafkaConsole}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-amber-800 bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/60 ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Kafka & Redis Bus Inspector"
        >
          <Cpu className="w-4 h-4 shrink-0 text-amber-600" />
          {!isCollapsed && (
            <div className="flex items-center justify-between w-full">
              <span className="truncate">Kafka & Redis Bus</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          )}
        </button>
      </div>

      {/* Role Switcher Demo Box (For Examiners and Testing) */}
      {!isCollapsed && (
        <div className="px-3 py-2.5 mx-2.5 mb-2 rounded-xl bg-purple-50/80 dark:bg-slate-800/80 border border-purple-200/70 dark:border-slate-700">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase text-purple-900 dark:text-purple-300 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              Role Switcher
            </span>
            <RoleTag role={currentRole} />
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2 leading-tight">Test RBAC permissions:</p>
          <div className="grid grid-cols-2 gap-1 text-[11px]">
            {(['ADMIN', 'MANAGER', 'EDITOR', 'VIEWER'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => handleRoleSwitch(r)}
                className={`py-1 px-1.5 rounded-lg font-bold text-center transition-colors ${
                  currentRole === r
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-slate-600 text-purple-900 dark:text-purple-200 border border-purple-200/60 dark:border-slate-600'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-purple-100 dark:border-slate-800 flex items-center justify-between bg-purple-50/30 dark:bg-slate-800/40">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <img
            src={
              user?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80'
            }
            alt={user?.name || 'User'}
            className="w-8 h-8 rounded-full object-cover shrink-0 border border-purple-200 dark:border-slate-700"
          />
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate leading-snug">
                {user?.name || 'Operator'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
                {user?.email || 'user@omnisync.io'}
              </span>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={() => dispatch(logoutUser())}
            className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};

export { NavigationSidebar as Sidebar };

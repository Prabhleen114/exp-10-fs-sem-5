import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchAnalyticsOverview } from '../../store/slices/analyticsSlice';
import { fetchPosts } from '../../store/slices/postSlice';
import { fetchAuditLogs } from '../../store/slices/userSlice';
import { MetricCardsGrid } from './MetricCardsGrid';
import { PerformanceChartSuite } from './PerformanceChartSuite';
import { ScheduledQueuePanel } from './ScheduledQueuePanel';
import { SystemActivityStream } from './SystemActivityStream';
import { NavTab } from '../layout/NavigationSidebar';
import { Zap, RefreshCw, Sparkles, Send, Filter } from 'lucide-react';
import { SocialPlatformId } from '../../types';
import { SOCIAL_PLATFORMS_SPEC } from '../../theme/tokens';

interface OverviewDashboardProps {
  onNavigate: (tab: NavTab) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onNavigate }) => {
  const dispatch = useAppDispatch();
  const { metrics, weeklyActivity, engagementTrends, fromCache, isLoading } = useAppSelector(
    (state) => state.analytics
  );
  const { posts } = useAppSelector((state) => state.posts);
  const { auditLogs } = useAppSelector((state) => state.users);

  const [selectedChannel, setSelectedChannel] = useState<SocialPlatformId | 'ALL'>('ALL');

  const loadData = () => {
    dispatch(fetchAnalyticsOverview());
    dispatch(fetchPosts({ page: 0, size: 20 }));
    dispatch(fetchAuditLogs(20));
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  // Filter posts if a specific channel is selected
  const filteredPosts =
    selectedChannel === 'ALL'
      ? posts
      : posts.filter((p) => p.platforms.includes(selectedChannel));

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / System Status in Playful Pastel style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-100 via-pink-50 to-sky-50 dark:from-slate-800 dark:via-purple-950/40 dark:to-slate-800 border border-purple-200/70 dark:border-slate-700 shadow-[0_4px_16px_rgba(139,92,246,0.06)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-white/90 dark:bg-slate-800 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-slate-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              OmniSync Studio Active
            </span>
            {fromCache && (
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-100/90 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 font-mono shadow-xs">
                <Zap className="w-3 h-3 text-amber-600" />
                Redis Cache Hit
              </span>
            )}
          </div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white mt-1.5">
            Multi-Channel Social Orchestration
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
            Active sync across PostgreSQL 16, Redis Cache, and Apache Kafka Event Stream.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-slate-700 text-xs font-bold transition-all shadow-xs disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-purple-600 dark:text-purple-400 ${
                isLoading ? 'animate-spin' : ''
              }`}
            />
            <span>Refresh Data</span>
          </button>
          <button
            onClick={() => onNavigate('composer')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      {/* Channel Focus Filter Bar */}
      <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-purple-100 dark:border-slate-800 shadow-[0_1px_4px_rgba(139,92,246,0.03)] overflow-x-auto gap-2">
        <div className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 px-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-purple-600" />
          <span>Channel Focus:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedChannel('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              selectedChannel === 'ALL'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-slate-800'
            }`}
          >
            All Channels
          </button>
          {Object.values(SOCIAL_PLATFORMS_SPEC).map((plat) => (
            <button
              type="button"
              key={plat.id}
              onClick={() => setSelectedChannel(plat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedChannel === plat.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-slate-800'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: plat.brandColor }}
              />
              <span>{plat.displayName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <MetricCardsGrid metrics={metrics} />

      {/* Performance Charts Visualization */}
      <PerformanceChartSuite
        weeklyActivity={weeklyActivity}
        engagementTrends={engagementTrends}
      />

      {/* 2-Column Split: Upcoming Scheduled Queue & System Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScheduledQueuePanel posts={filteredPosts} onOpenCalendar={() => onNavigate('calendar')} />
        <SystemActivityStream logs={auditLogs} onOpenAuditLogs={() => onNavigate('audit')} />
      </div>
    </div>
  );
};

export { OverviewDashboard as DashboardView };

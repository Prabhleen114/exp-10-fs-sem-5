import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchAnalyticsOverview,
  fetchPlatformAnalytics,
} from '../../store/slices/analyticsSlice';
import { kafkaApi } from '../../services/api';
import { addToast } from '../../store/slices/notificationSlice';
import { PlatformTag } from '../common/Badges';
import {
  BarChart3,
  Zap,
  Award,
  RefreshCw,
} from 'lucide-react';
import { BRAND_CONFIG } from '../../theme/tokens';

export const AnalyticsStudio: React.FC = () => {
  const dispatch = useAppDispatch();
  const { metrics, platformBreakdown, fromCache, isLoading } = useAppSelector(
    (state) => state.analytics
  );
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [selectedRange, setSelectedRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const loadAll = () => {
    dispatch(fetchAnalyticsOverview());
    dispatch(fetchPlatformAnalytics());
    kafkaApi
      .getCacheStats()
      .then((res) => setCacheStats(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    loadAll();
  }, [dispatch, selectedRange]);

  const handleClearCache = async () => {
    try {
      await kafkaApi.clearCache();
      dispatch(
        addToast({
          type: 'info',
          title: 'Redis Cache Evicted',
          message: 'All @Cacheable keys flushed. Next query will read directly from database.',
        })
      );
      loadAll();
    } catch {
      dispatch(addToast({ type: 'error', message: 'Failed to clear cache' }));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Range Controls in Playful Pastel style */}
      <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-[0_2px_8px_rgba(139,92,246,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span>Audience Telemetry & Performance</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-channel engagement metrics, impressions, and Redis read-through cache health.
          </p>
        </div>

        {/* Date Range Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-purple-50/80 p-1 rounded-xl border border-purple-200/70">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`px-3.5 py-1 text-xs font-bold rounded-lg uppercase transition-all ${
                  selectedRange === range
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-purple-900 hover:bg-purple-100/60'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={loadAll}
            className="p-2 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100 text-purple-800 transition-colors"
            title="Refresh analytics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Redis Cache Telemetry Box with Playful Pastel Style */}
      {cacheStats && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-900 text-purple-100 p-5 rounded-2xl border border-purple-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-800/60 text-amber-300">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white block text-sm">
                Redis 7 Cache Layer (@Cacheable / @CacheEvict)
              </span>
              <span className="text-[11px] text-purple-200 font-mono">
                Hit Rate: {cacheStats.hitRate} · Active Keys: {cacheStats.totalKeys} · Evictions:{' '}
                {cacheStats.evictions}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {fromCache ? (
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[11px] font-bold">
                Served from Cache (0.4ms)
              </span>
            ) : (
              <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[11px] font-bold">
                Database Query (Cached)
              </span>
            )}
            <button
              onClick={handleClearCache}
              className="px-3 py-1.5 rounded-xl bg-purple-800/80 hover:bg-purple-700 text-white text-xs font-bold border border-purple-600 transition-colors"
            >
              Flush Cache
            </button>
          </div>
        </div>
      )}

      {/* Platform Performance Table */}
      <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-[0_2px_8px_rgba(139,92,246,0.04)]">
        <div className="p-4 border-b border-purple-100 bg-purple-50/50 flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-purple-950 uppercase tracking-wider">
            Performance Breakdown by Channel
          </h3>
          <span className="text-xs text-purple-700 font-mono font-medium">
            Normalized cross-channel stats
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-purple-50/30 border-b border-purple-100 text-purple-900 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-5 font-bold">Social Channel</th>
                <th className="py-3 px-5 font-bold text-right">Published Posts</th>
                <th className="py-3 px-5 font-bold text-right">Audience Follows</th>
                <th className="py-3 px-5 font-bold text-right">Gross Impressions</th>
                <th className="py-3 px-5 font-bold text-right">Estimated Reach</th>
                <th className="py-3 px-5 font-bold text-right">Avg Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50 font-mono">
              {platformBreakdown.map((row) => (
                <tr key={row.platform} className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-3.5 px-5 font-sans font-bold text-slate-900">
                    <PlatformTag platform={row.platform as any} />
                  </td>
                  <td className="py-3.5 px-5 text-right tabular-nums text-slate-700 font-medium">
                    {row.postsCount}
                  </td>
                  <td className="py-3.5 px-5 text-right tabular-nums text-slate-700 font-medium">
                    {row.followers.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-5 text-right tabular-nums font-extrabold text-purple-950">
                    {row.impressions.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-5 text-right tabular-nums text-slate-700 font-medium">
                    {row.reach.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-5 text-right tabular-nums text-emerald-700 font-extrabold">
                    {row.engagementRate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performing Publications */}
      <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-[0_2px_8px_rgba(139,92,246,0.04)] space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-extrabold text-slate-900">Top Performing Publications</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-extrabold">
                Highest Reach
              </span>
              <span className="text-xs font-mono text-slate-400">Oct 28, 2026</span>
            </div>
            <p className="text-xs text-slate-800 font-bold leading-relaxed">
              We are thrilled to unveil {BRAND_CONFIG.name}! Effortless multi-channel orchestration with automated scheduling...
            </p>
            <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs font-mono text-slate-600">
              <span>Impressions: 48,500</span>
              <span className="text-emerald-700 font-extrabold">5.8% CTR</span>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-purple-200/80 bg-purple-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase bg-purple-100 text-purple-900 px-2 py-0.5 rounded-md font-extrabold">
                Highest Engagement
              </span>
              <span className="text-xs font-mono text-slate-400">Oct 30, 2026</span>
            </div>
            <p className="text-xs text-slate-800 font-bold leading-relaxed">
              Deep dive: How event-driven architecture with Apache Kafka and Dead Letter Queues prevents social publishing failures...
            </p>
            <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between text-xs font-mono text-slate-600">
              <span>Impressions: 31,200</span>
              <span className="text-emerald-700 font-extrabold">6.4% CTR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Audience Reach & Growth Forecaster Card */}
      <div className="bg-gradient-to-r from-purple-50/70 via-pink-50/40 to-sky-50/60 dark:from-slate-900 dark:to-slate-800 p-6 rounded-2xl border border-purple-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(139,92,246,0.04)] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-purple-950 dark:text-purple-300 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-600" />
            <span>Cross-Network Growth Forecaster</span>
          </h3>
          <span className="text-[11px] font-mono text-purple-700 dark:text-purple-400 font-bold">
            Predictive Model: Active
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Based on your current 5.8% average cross-platform engagement rate and 79,700 monthly impressions, increasing your publication cadence by 3 weekly posts is projected to generate <strong className="text-purple-900 dark:text-purple-300">+28,400 additional impressions</strong> and <strong className="text-purple-900 dark:text-purple-300">+1,650 new clicks</strong> next month.
        </p>
      </div>
    </div>
  );
};

export { AnalyticsStudio as AnalyticsView };

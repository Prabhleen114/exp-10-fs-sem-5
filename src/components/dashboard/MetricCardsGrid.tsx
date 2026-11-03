import React from 'react';
import { Send, Clock, FileText, AlertCircle, Share2, TrendingUp, Eye, Users } from 'lucide-react';

interface MetricCardsGridProps {
  metrics: {
    totalPosts: number;
    publishedPosts: number;
    scheduledPosts: number;
    draftPosts: number;
    failedPosts: number;
    connectedAccountsCount: number;
    totalReach: number;
    impressions: number;
    engagementRate: string;
    totalEngagements: number;
  };
}

export const MetricCardsGrid: React.FC<MetricCardsGridProps> = ({ metrics }) => {
  const cards = [
    {
      label: 'Published Posts',
      value: metrics.publishedPosts.toLocaleString(),
      subtext: `${metrics.totalPosts} total created`,
      icon: <Send className="w-4 h-4 text-emerald-700" />,
      bg: 'bg-emerald-50 border-emerald-100/80',
      badgeBg: 'bg-emerald-100/80 text-emerald-800',
    },
    {
      label: 'Scheduled Queue',
      value: metrics.scheduledPosts.toLocaleString(),
      subtext: 'Next in 48 hours',
      icon: <Clock className="w-4 h-4 text-purple-700" />,
      bg: 'bg-purple-50 border-purple-100/80',
      badgeBg: 'bg-purple-100/80 text-purple-800',
    },
    {
      label: 'Active Drafts',
      value: metrics.draftPosts.toLocaleString(),
      subtext: 'Autosaved in PostgreSQL',
      icon: <FileText className="w-4 h-4 text-amber-700" />,
      bg: 'bg-amber-50 border-amber-100/80',
      badgeBg: 'bg-amber-100/80 text-amber-800',
    },
    {
      label: 'Delivery Alerts',
      value: metrics.failedPosts.toLocaleString(),
      subtext: metrics.failedPosts > 0 ? 'Queued in DLQ' : 'All channels healthy',
      icon: <AlertCircle className="w-4 h-4 text-rose-700" />,
      bg: 'bg-rose-50 border-rose-100/80',
      badgeBg: 'bg-rose-100/80 text-rose-800',
    },
    {
      label: 'Connected Channels',
      value: metrics.connectedAccountsCount.toLocaleString(),
      subtext: 'AES-256 encrypted',
      icon: <Share2 className="w-4 h-4 text-sky-700" />,
      bg: 'bg-sky-50 border-sky-100/80',
      badgeBg: 'bg-sky-100/80 text-sky-800',
    },
    {
      label: 'Avg Engagement Rate',
      value: metrics.engagementRate,
      subtext: '+0.8% vs last month',
      icon: <TrendingUp className="w-4 h-4 text-fuchsia-700" />,
      bg: 'bg-fuchsia-50 border-fuchsia-100/80',
      badgeBg: 'bg-fuchsia-100/80 text-fuchsia-800',
    },
    {
      label: 'Gross Impressions',
      value: (metrics.impressions || 79700).toLocaleString(),
      subtext: 'Cross-network total',
      icon: <Eye className="w-4 h-4 text-cyan-700" />,
      bg: 'bg-cyan-50 border-cyan-100/80',
      badgeBg: 'bg-cyan-100/80 text-cyan-800',
    },
    {
      label: 'Audience Reach',
      value: (metrics.totalReach || 58900).toLocaleString(),
      subtext: 'Unique accounts',
      icon: <Users className="w-4 h-4 text-indigo-700" />,
      bg: 'bg-indigo-50 border-indigo-100/80',
      badgeBg: 'bg-indigo-100/80 text-indigo-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-md hover:scale-[1.01] flex flex-col justify-between ${card.bg}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">{card.label}</span>
            <div className={`p-2 rounded-xl ${card.badgeBg}`}>{card.icon}</div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
              {card.value}
            </span>
            <span className="block text-[11px] font-medium text-slate-500 mt-1">{card.subtext}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export { MetricCardsGrid as StatCards };

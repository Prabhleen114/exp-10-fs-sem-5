import React from 'react';

interface PerformanceChartSuiteProps {
  weeklyActivity: Array<{ day: string; scheduled: number; published: number }>;
  engagementTrends: Array<{ date: string; impressions: number; engagements: number; clicks: number }>;
}

export const PerformanceChartSuite: React.FC<PerformanceChartSuiteProps> = ({
  weeklyActivity,
  engagementTrends,
}) => {
  // SVG Area Chart calculation for Engagement Trends
  const trendData =
    engagementTrends.length > 0
      ? engagementTrends
      : [
          { date: 'Oct 18', impressions: 4200, engagements: 280, clicks: 120 },
          { date: 'Oct 20', impressions: 5800, engagements: 390, clicks: 170 },
          { date: 'Oct 22', impressions: 7100, engagements: 510, clicks: 230 },
          { date: 'Oct 24', impressions: 6400, engagements: 440, clicks: 195 },
          { date: 'Oct 26', impressions: 8900, engagements: 620, clicks: 310 },
          { date: 'Oct 28', impressions: 12500, engagements: 890, clicks: 450 },
          { date: 'Oct 30', impressions: 15400, engagements: 1120, clicks: 580 },
          { date: 'Nov 01', impressions: 14200, engagements: 980, clicks: 510 },
        ];

  const maxImp = Math.max(...trendData.map((d) => d.impressions), 16000);
  const chartHeight = 160;
  const chartWidth = 500;
  const points = trendData.map((d, i) => {
    const x = (i / (trendData.length - 1)) * chartWidth;
    const y = chartHeight - (d.impressions / maxImp) * (chartHeight - 20) - 10;
    return { x, y, data: d };
  });

  const linePath = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaPath = `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  // Platform Performance comparison data with pastel colors
  const platformData = [
    { name: 'X (Twitter)', percent: 72, color: 'bg-slate-800', count: '34.2K impr' },
    { name: 'LinkedIn', percent: 89, color: 'bg-sky-500', count: '48.5K impr' },
    { name: 'Instagram', percent: 64, color: 'bg-pink-500', count: '28.9K impr' },
    { name: 'Facebook', percent: 45, color: 'bg-blue-500', count: '18.4K impr' },
    { name: 'YouTube', percent: 55, color: 'bg-rose-500', count: '22.1K impr' },
  ];

  // Weekly activity data
  const weekly =
    weeklyActivity.length > 0
      ? weeklyActivity
      : [
          { day: 'Mon', scheduled: 2, published: 3 },
          { day: 'Tue', scheduled: 4, published: 4 },
          { day: 'Wed', scheduled: 1, published: 5 },
          { day: 'Thu', scheduled: 5, published: 2 },
          { day: 'Fri', scheduled: 3, published: 6 },
          { day: 'Sat', scheduled: 2, published: 1 },
          { day: 'Sun', scheduled: 4, published: 2 },
        ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart 1: Impressions Trend with Pastel Violet Wash */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-purple-100 shadow-[0_2px_8px_rgba(139,92,246,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Audience Growth & Impression Curve
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live cross-network reach progression over recent publication runs
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>Impressions</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-300" />
              <span>Engagements</span>
            </span>
          </div>
        </div>

        {/* SVG Area Chart */}
        <div className="w-full overflow-hidden pt-2">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
            <defs>
              <linearGradient id="pastelPurpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            {/* Guide Gridlines */}
            {[0.25, 0.5, 0.75, 1].map((ratio, idx) => (
              <line
                key={idx}
                x1="0"
                y1={chartHeight * ratio}
                x2={chartWidth}
                y2={chartHeight * ratio}
                stroke="#F3E8FF"
                strokeWidth="1"
              />
            ))}
            {/* Area & Line */}
            <path d={areaPath} fill="url(#pastelPurpleGradient)" />
            <path d={linePath} fill="none" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
            {/* Hover Points */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="4"
                className="fill-white stroke-purple-600 stroke-[2.5] transition-transform hover:scale-150 cursor-pointer"
              />
            ))}
          </svg>
          {/* X Axis Date Labels */}
          <div className="flex justify-between text-[11px] text-purple-700 font-mono mt-2 pt-2 border-t border-purple-100">
            {trendData.map((d, i) => (
              <span key={i}>{d.date}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 2: Channel Performance Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-[0_2px_8px_rgba(139,92,246,0.04)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Channel Share</h3>
              <p className="text-xs text-slate-500 mt-0.5">Impression distribution</p>
            </div>
            <span className="text-[11px] font-mono font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-lg">
              LinkedIn Top
            </span>
          </div>

          <div className="space-y-3.5">
            {platformData.map((plat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{plat.name}</span>
                  <span className="text-purple-700 font-mono tabular-nums">{plat.count}</span>
                </div>
                <div className="w-full bg-purple-50 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${plat.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${plat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-purple-100 mt-4 text-[11px] text-slate-500 flex justify-between font-medium">
          <span>Target Reach: 100K</span>
          <span className="font-mono text-purple-900 font-bold">Progress: 79.7%</span>
        </div>
      </div>

      {/* Chart 3: Weekly Activity Cadence */}
      <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-purple-100 shadow-[0_2px_8px_rgba(139,92,246,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Weekly Rhythm: Published vs Scheduled
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Balanced cadence of queued releases across weekdays
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-purple-600" />
              <span className="text-slate-700">Published</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-purple-200" />
              <span className="text-slate-700">Scheduled</span>
            </span>
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div className="grid grid-cols-7 gap-3 pt-2">
          {weekly.map((w, idx) => {
            const maxPosts = 10;
            const pubHeight = (w.published / maxPosts) * 100;
            const schHeight = (w.scheduled / maxPosts) * 100;
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="h-28 w-full flex items-end justify-center gap-1.5 pb-2">
                  <div
                    className="w-5 bg-purple-600 rounded-t-lg transition-all duration-300 hover:opacity-90 relative group shadow-xs"
                    style={{ height: `${Math.max(pubHeight, 8)}%` }}
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity font-mono pointer-events-none whitespace-nowrap shadow-md">
                      {w.published} published
                    </span>
                  </div>
                  <div
                    className="w-5 bg-purple-200 rounded-t-lg transition-all duration-300 hover:opacity-90 relative group shadow-xs"
                    style={{ height: `${Math.max(schHeight, 8)}%` }}
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity font-mono pointer-events-none whitespace-nowrap shadow-md">
                      {w.scheduled} scheduled
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-800 font-mono mt-1">{w.day}</span>
                <span className="text-[10px] text-purple-600 font-mono font-medium tabular-nums">
                  {w.published + w.scheduled} posts
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { PerformanceChartSuite as Charts };

import React from 'react';
import { SocialPlatformId } from '../../types';
import { PLATFORMS_META } from './PlatformMatrixSelector';

interface CharacterMeterProps {
  contentLength: number;
  selectedPlatforms: SocialPlatformId[];
}

export const CharacterMeter: React.FC<CharacterMeterProps> = ({
  contentLength,
  selectedPlatforms,
}) => {
  if (selectedPlatforms.length === 0) {
    return (
      <div className="text-xs text-slate-500 font-mono">
        <span className="font-bold text-purple-700 tabular-nums">{contentLength}</span> characters
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {selectedPlatforms.map((platId) => {
        const meta = PLATFORMS_META.find((p) => p.id === platId);
        if (!meta) return null;
        const remaining = meta.charLimit - contentLength;
        const isOver = remaining < 0;
        const isWarning = remaining >= 0 && remaining <= 30;

        const percent = Math.min(100, (contentLength / meta.charLimit) * 100);
        const circumference = 2 * Math.PI * 8;
        const strokeDashoffset = circumference - (percent / 100) * circumference;

        return (
          <div
            key={platId}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-colors ${
              isOver
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : isWarning
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-purple-50/70 border-purple-200/80 text-purple-900'
            }`}
          >
            {/* Circular progress meter */}
            <svg className="w-4 h-4 -rotate-90 shrink-0" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8" fill="none" stroke="#E9D5FF" strokeWidth="2.5" />
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke={isOver ? '#E11D48' : isWarning ? '#D97706' : '#8B5CF6'}
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <span className="font-bold">{meta.name.split(' ')[0]}:</span>
            <span className={`tabular-nums font-extrabold ${isOver ? 'text-rose-600' : ''}`}>
              {isOver ? `-${Math.abs(remaining)}` : remaining}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export { CharacterMeter as CharacterCounter };

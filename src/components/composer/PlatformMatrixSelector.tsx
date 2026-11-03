import React from 'react';
import { SocialPlatformId } from '../../types';
import { Check } from 'lucide-react';
import { SOCIAL_PLATFORMS_SPEC } from '../../theme/tokens';

interface PlatformMatrixSelectorProps {
  selectedPlatforms: SocialPlatformId[];
  onTogglePlatform: (platformId: SocialPlatformId) => void;
}

export const PLATFORMS_META = Object.values(SOCIAL_PLATFORMS_SPEC).map((spec) => ({
  id: spec.id,
  name: spec.displayName,
  charLimit: spec.charLimit,
  color: spec.brandColor,
  pastelBg: spec.chipBg,
  pastelIconBg: spec.pastelIconBg,
}));

export const PlatformMatrixSelector: React.FC<PlatformMatrixSelectorProps> = ({
  selectedPlatforms,
  onTogglePlatform,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800">Destination Channels</label>
        <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
          {selectedPlatforms.length} of {PLATFORMS_META.length} selected
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {PLATFORMS_META.map((plat) => {
          const isSelected = selectedPlatforms.includes(plat.id);
          return (
            <button
              type="button"
              key={plat.id}
              onClick={() => onTogglePlatform(plat.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-purple-500 bg-purple-50/80 text-purple-950 font-bold shadow-xs scale-[1.01]'
                  : 'border-purple-100 bg-white hover:border-purple-300 text-slate-700 hover:bg-purple-50/30'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: plat.color }}
                />
                <div className="truncate">
                  <span className="text-xs truncate block font-bold">{plat.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {plat.charLimit.toLocaleString()} chars
                  </span>
                </div>
              </div>
              <div
                className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'bg-purple-600 text-white' : 'border border-purple-200 bg-white'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { PlatformMatrixSelector as PlatformSelector };

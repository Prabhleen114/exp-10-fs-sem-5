import React, { useState } from 'react';
import { MediaAsset } from '../../types';
import { X, Plus, Sparkles, Image as ImageIcon } from 'lucide-react';

interface MediaVaultUploaderProps {
  media: MediaAsset[];
  onChange: (media: MediaAsset[]) => void;
  maxCount?: number;
}

const SAMPLE_ASSETS: MediaAsset[] = [
  {
    id: 'sample_dash',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    name: 'analytics_preview.png',
    sizeBytes: 420000,
  },
  {
    id: 'sample_team',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    name: 'team_meeting.jpg',
    sizeBytes: 520000,
  },
  {
    id: 'sample_code',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    name: 'cloud_architecture.jpg',
    sizeBytes: 680000,
  },
  {
    id: 'sample_mobile',
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    name: 'mobile_experience.jpg',
    sizeBytes: 380000,
  },
];

export const MediaVaultUploader: React.FC<MediaVaultUploaderProps> = ({
  media,
  onChange,
  maxCount = 4,
}) => {
  const [showGallery, setShowGallery] = useState(false);

  const handleAddSample = (asset: MediaAsset) => {
    if (media.length >= maxCount) return;
    if (media.some((m) => m.id === asset.id)) return;
    onChange([...media, asset]);
  };

  const handleRemove = (assetId: string) => {
    onChange(media.filter((m) => m.id !== assetId));
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const customAsset: MediaAsset = {
        id: `custom_${Date.now()}`,
        url: reader.result as string,
        type: 'image',
        name: file.name,
        sizeBytes: file.size,
      };
      if (media.length < maxCount) {
        onChange([...media, customAsset]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800">Media Attachments</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGallery(!showGallery)}
            className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200/80 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>{showGallery ? 'Hide Presets' : 'Sample Assets'}</span>
          </button>
          <span className="text-[11px] font-mono font-bold text-slate-500">
            ({media.length}/{maxCount})
          </span>
        </div>
      </div>

      {/* Sample Assets Quick Picker Drawer */}
      {showGallery && (
        <div className="p-3.5 bg-gradient-to-r from-purple-50/80 via-pink-50/50 to-purple-50/80 rounded-xl border border-purple-200/80 space-y-2.5 animate-in fade-in duration-150">
          <p className="text-[11px] font-semibold text-purple-900">
            Select high-resolution stock photography to attach instantly:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {SAMPLE_ASSETS.map((asset) => {
              const isAttached = media.some((m) => m.id === asset.id);
              return (
                <button
                  type="button"
                  key={asset.id}
                  onClick={() => handleAddSample(asset)}
                  disabled={isAttached || media.length >= maxCount}
                  className={`relative rounded-xl overflow-hidden border text-left group transition-all ${
                    isAttached
                      ? 'border-purple-600 opacity-50 cursor-not-allowed'
                      : 'border-purple-200 hover:border-purple-500 hover:shadow-sm'
                  }`}
                >
                  <img src={asset.url} alt={asset.name} className="w-full h-16 object-cover" />
                  <div className="p-1.5 text-[10px] truncate text-slate-700 font-bold bg-white">
                    {asset.name}
                  </div>
                  {isAttached && (
                    <div className="absolute inset-0 bg-purple-900/50 flex items-center justify-center text-white text-[10px] font-extrabold uppercase tracking-wider">
                      Attached
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Attached Media Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {media.map((item) => (
          <div
            key={item.id}
            className="relative rounded-xl overflow-hidden border border-purple-200 bg-purple-50/40 group shadow-2xs"
          >
            <img src={item.url} alt={item.name} className="w-full h-24 object-cover" />
            <div className="p-2 bg-white text-[10px] flex items-center justify-between border-t border-purple-100">
              <span className="truncate text-slate-700 font-bold">{item.name}</span>
              <span className="text-purple-600 font-mono font-medium">
                {(item.sizeBytes / 1024).toFixed(0)}KB
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              className="absolute top-1.5 right-1.5 bg-slate-900/80 hover:bg-rose-600 text-white p-1 rounded-full transition-colors"
              title="Remove media asset"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Upload Trigger Button */}
        {media.length < maxCount && (
          <label className="border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-xl h-24 flex flex-col items-center justify-center gap-1 cursor-pointer bg-purple-50/30 hover:bg-purple-50/70 transition-all text-slate-600 hover:text-purple-700">
            <input type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />
            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="text-xs font-bold text-slate-800">Upload Image</span>
            <span className="text-[10px] text-slate-400">JPG, PNG up to 10MB</span>
          </label>
        )}
      </div>
    </div>
  );
};

export { MediaVaultUploader as MediaUploader };

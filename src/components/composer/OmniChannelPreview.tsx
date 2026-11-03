import React, { useState } from 'react';
import { SocialPlatformId, MediaAsset } from '../../types';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Send,
  CheckCircle,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { BRAND_CONFIG } from '../../theme/tokens';

interface OmniChannelPreviewProps {
  content: string;
  media: MediaAsset[];
  hashtags: string[];
  links: string[];
  selectedPlatforms: SocialPlatformId[];
}

export const OmniChannelPreview: React.FC<OmniChannelPreviewProps> = ({
  content,
  media,
  hashtags,
  links,
  selectedPlatforms,
}) => {
  const activePlatforms =
    selectedPlatforms.length > 0 ? selectedPlatforms : (['twitter'] as SocialPlatformId[]);
  const [activePreviewTab, setActivePreviewTab] = useState<SocialPlatformId>(activePlatforms[0]);
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');

  const currentTab = activePlatforms.includes(activePreviewTab)
    ? activePreviewTab
    : activePlatforms[0];

  const fullContent = [content, hashtags.join(' '), links.join(' ')].filter(Boolean).join('\n\n');

  return (
    <div className="bg-purple-50/40 dark:bg-slate-900/40 p-5 rounded-2xl border border-purple-200/80 dark:border-slate-800 flex flex-col h-full shadow-[0_2px_8px_rgba(139,92,246,0.03)] transition-colors">
      {/* Platform & Device Mode Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-purple-200/70 dark:border-slate-800 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
            Live Simulator
          </span>
          {/* Device Mockup Toggle */}
          <div className="flex items-center bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-purple-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setDeviceMode('mobile')}
              className={`p-1 rounded-md text-xs transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-purple-700'
              }`}
              title="Mobile phone viewport"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('desktop')}
              className={`p-1 rounded-md text-xs transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-purple-700'
              }`}
              title="Desktop feed viewport"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Channel Selector */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-purple-200 dark:border-slate-700 shadow-2xs overflow-x-auto">
          {activePlatforms.map((plat) => (
            <button
              type="button"
              key={plat}
              onClick={() => setActivePreviewTab(plat)}
              className={`px-3 py-1 text-xs font-bold rounded-lg capitalize transition-all whitespace-nowrap ${
                currentTab === plat
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-slate-700'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Viewport: Mobile Phone Mockup or Desktop Card */}
      <div className="flex-1 flex items-center justify-center p-2">
        {deviceMode === 'mobile' ? (
          <div className="w-full max-w-[340px] rounded-[36px] bg-slate-900 p-3 shadow-2xl border-4 border-slate-700 ring-1 ring-slate-800">
            {/* Dynamic Island / Speaker Notch */}
            <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2" />
            <div className="rounded-[28px] overflow-hidden bg-white max-h-[500px] overflow-y-auto">
              {currentTab === 'twitter' && <TwitterPreview content={fullContent} media={media} isMobile />}
              {currentTab === 'instagram' && (
                <InstagramPreview content={content} hashtags={hashtags} media={media} isMobile />
              )}
              {currentTab === 'linkedin' && <LinkedInPreview content={fullContent} media={media} isMobile />}
              {currentTab === 'facebook' && <FacebookPreview content={fullContent} media={media} isMobile />}
              {currentTab === 'youtube' && <YouTubePreview content={fullContent} media={media} isMobile />}
            </div>
            {/* Home indicator bar */}
            <div className="w-28 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
          </div>
        ) : (
          <div className="w-full flex justify-center">
            {currentTab === 'twitter' && <TwitterPreview content={fullContent} media={media} />}
            {currentTab === 'instagram' && (
              <InstagramPreview content={content} hashtags={hashtags} media={media} />
            )}
            {currentTab === 'linkedin' && <LinkedInPreview content={fullContent} media={media} />}
            {currentTab === 'facebook' && <FacebookPreview content={fullContent} media={media} />}
            {currentTab === 'youtube' && <YouTubePreview content={fullContent} media={media} />}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-purple-200/70 dark:border-slate-800 mt-4 text-[11px] text-purple-700 dark:text-purple-400 text-center font-mono font-medium flex items-center justify-between">
        <span>Device: {deviceMode.toUpperCase()}</span>
        <span>Target: {currentTab.toUpperCase()}</span>
      </div>
    </div>
  );
};

// 1. Twitter / X Preview Card
const TwitterPreview: React.FC<{ content: string; media: MediaAsset[]; isMobile?: boolean }> = ({
  content,
  media,
  isMobile,
}) => (
  <div className={`bg-white rounded-2xl border border-slate-200 p-4 w-full shadow-sm text-slate-900 ${isMobile ? 'text-xs' : 'max-w-md'}`}>
    <div className="flex items-start gap-2.5">
      <img
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&h=100&q=80"
        alt="OmniSync"
        className="w-9 h-9 rounded-full object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 truncate">
            <span className="font-bold text-slate-900 truncate">{BRAND_CONFIG.shortName}</span>
            <CheckCircle className="w-3.5 h-3.5 text-sky-500 fill-sky-500 text-white shrink-0" />
            <span className="text-[11px] text-slate-500 font-mono truncate">@omnisync</span>
          </div>
          <MoreHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
        </div>
        <p className="text-slate-800 whitespace-pre-wrap mt-1 leading-relaxed text-xs">
          {content || 'Start drafting your post to see the live Twitter/X preview...'}
        </p>
        {media.length > 0 && (
          <div
            className={`mt-2.5 rounded-xl overflow-hidden border border-slate-200 grid gap-1 ${
              media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {media.map((m) => (
              <img key={m.id} src={m.url} alt={m.name} className="w-full h-36 object-cover" />
            ))}
          </div>
        )}
        <div className="flex items-center justify-between text-slate-500 text-xs mt-3 pt-2 border-t border-slate-100 max-w-xs">
          <span className="flex items-center gap-1 hover:text-sky-500">
            <MessageCircle className="w-3.5 h-3.5" /> 18
          </span>
          <span className="flex items-center gap-1 hover:text-emerald-500">
            <Repeat2 className="w-3.5 h-3.5" /> 42
          </span>
          <span className="flex items-center gap-1 hover:text-rose-500">
            <Heart className="w-3.5 h-3.5" /> 189
          </span>
          <span className="flex items-center gap-1 hover:text-sky-500">
            <Share className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  </div>
);

// 2. Instagram Feed Card Preview
const InstagramPreview: React.FC<{
  content: string;
  hashtags: string[];
  media: MediaAsset[];
  isMobile?: boolean;
}> = ({ content, hashtags, media, isMobile }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 w-full overflow-hidden shadow-sm text-slate-900 ${isMobile ? '' : 'max-w-sm'}`}>
    <div className="flex items-center justify-between p-3 border-b border-slate-100">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=100&h=100&q=80"
            alt="Instagram"
            className="w-full h-full rounded-full object-cover border border-white"
          />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-900 block leading-tight">omnisync.app</span>
          <span className="text-[10px] text-slate-400 block leading-tight">Sponsored</span>
        </div>
      </div>
      <MoreHorizontal className="w-4 h-4 text-slate-400" />
    </div>
    <div className="w-full h-56 bg-purple-50 flex items-center justify-center overflow-hidden">
      {media.length > 0 ? (
        <img src={media[0].url} alt="Attached" className="w-full h-full object-cover" />
      ) : (
        <div className="text-center p-4">
          <p className="text-xs text-rose-500 font-bold">Image attachment required</p>
          <p className="text-[10px] text-slate-400 mt-1">Upload media to validate Instagram feed.</p>
        </div>
      )}
    </div>
    <div className="p-3">
      <div className="flex items-center justify-between pb-1.5">
        <div className="flex items-center gap-3 text-slate-800">
          <Heart className="w-4 h-4 hover:text-rose-500 cursor-pointer" />
          <MessageCircle className="w-4 h-4 cursor-pointer" />
          <Send className="w-4 h-4 cursor-pointer" />
        </div>
        <Bookmark className="w-4 h-4 text-slate-800 cursor-pointer" />
      </div>
      <p className="text-[11px] font-bold text-slate-900">1,248 likes</p>
      <div className="text-xs text-slate-800 mt-1 leading-relaxed">
        <span className="font-bold mr-1.5">omnisync.app</span>
        <span>{content || 'Your Instagram caption will appear here...'}</span>
      </div>
      {hashtags.length > 0 && (
        <p className="text-xs text-purple-700 font-medium mt-1 space-x-1">
          {hashtags.map((h, i) => (
            <span key={i}>{h}</span>
          ))}
        </p>
      )}
      <span className="text-[10px] text-slate-400 uppercase mt-2 block font-medium">Just now</span>
    </div>
  </div>
);

// 3. LinkedIn Update Preview
const LinkedInPreview: React.FC<{ content: string; media: MediaAsset[]; isMobile?: boolean }> = ({
  content,
  media,
  isMobile,
}) => (
  <div className={`bg-white rounded-2xl border border-slate-200 p-4 w-full shadow-sm text-slate-900 ${isMobile ? 'text-xs' : 'max-w-md'}`}>
    <div className="flex items-center justify-between mb-2.5">
      <div className="flex items-center gap-2">
        <img
          src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=100&h=100&q=80"
          alt="LinkedIn"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <span className="text-xs font-bold text-slate-900 block leading-tight">
            {BRAND_CONFIG.name}
          </span>
          <span className="text-[10px] text-slate-500 block leading-tight">
            34,100 followers · Promoted
          </span>
        </div>
      </div>
      <MoreHorizontal className="w-4 h-4 text-slate-400" />
    </div>
    <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed mb-2.5">
      {content || 'LinkedIn professional update preview text...'}
    </p>
    {media.length > 0 && (
      <div className="rounded-xl overflow-hidden border border-slate-200 mb-2.5">
        <img src={media[0].url} alt="Attached" className="w-full h-40 object-cover" />
      </div>
    )}
    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600 font-semibold">
      <button className="flex items-center gap-1 hover:text-sky-700 py-1">
        <ThumbsUp className="w-3.5 h-3.5" /> Like
      </button>
      <button className="flex items-center gap-1 hover:text-sky-700 py-1">
        <MessageSquare className="w-3.5 h-3.5" /> Comment
      </button>
      <button className="flex items-center gap-1 hover:text-sky-700 py-1">
        <Repeat2 className="w-3.5 h-3.5" /> Repost
      </button>
      <button className="flex items-center gap-1 hover:text-sky-700 py-1">
        <Send className="w-3.5 h-3.5" /> Send
      </button>
    </div>
  </div>
);

// 4. Facebook Preview
const FacebookPreview: React.FC<{ content: string; media: MediaAsset[]; isMobile?: boolean }> = ({
  content,
  media,
  isMobile,
}) => (
  <div className={`bg-white rounded-2xl border border-slate-200 p-4 w-full shadow-sm text-slate-900 ${isMobile ? 'text-xs' : 'max-w-md'}`}>
    <div className="flex items-center gap-2 mb-2">
      <img
        src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=100&h=100&q=80"
        alt="Facebook"
        className="w-8 h-8 rounded-full object-cover"
      />
      <div>
        <span className="text-xs font-bold text-slate-900 block leading-tight">
          {BRAND_CONFIG.shortName} Systems
        </span>
        <span className="text-[10px] text-slate-400 block leading-tight">Just now · 🌐</span>
      </div>
    </div>
    <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed mb-2.5">
      {content || 'Facebook page post preview...'}
    </p>
    {media.length > 0 && (
      <img src={media[0].url} alt="Attached" className="w-full h-40 object-cover rounded-xl mb-2" />
    )}
  </div>
);

// 5. YouTube Preview
const YouTubePreview: React.FC<{ content: string; media: MediaAsset[]; isMobile?: boolean }> = ({
  content,
  media,
  isMobile,
}) => (
  <div className={`bg-white rounded-2xl border border-slate-200 p-4 w-full shadow-sm text-slate-900 ${isMobile ? 'text-xs' : 'max-w-md'}`}>
    <div className="flex items-center gap-2 mb-2">
      <img
        src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=100&h=100&q=80"
        alt="YouTube"
        className="w-8 h-8 rounded-full object-cover"
      />
      <div>
        <span className="text-xs font-bold text-slate-900 block leading-tight">
          {BRAND_CONFIG.shortName} Engineering
        </span>
        <span className="text-[10px] text-slate-400 block leading-tight">
          15.3K subscribers · Community Post
        </span>
      </div>
    </div>
    <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed mb-2.5">
      {content || 'YouTube community post text...'}
    </p>
    {media.length > 0 && (
      <img src={media[0].url} alt="Attached" className="w-full h-40 object-cover rounded-xl mb-2" />
    )}
  </div>
);

export { OmniChannelPreview as PostPreview };

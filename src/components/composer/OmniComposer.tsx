import React, { useState, useEffect, useRef } from 'react';
import { SocialPlatformId, MediaAsset, Post } from '../../types';
import { PlatformMatrixSelector, PLATFORMS_META } from './PlatformMatrixSelector';
import { CharacterMeter } from './CharacterMeter';
import { MediaVaultUploader } from './MediaVaultUploader';
import { HashtagManager } from './HashtagManager';
import { OmniChannelPreview } from './OmniChannelPreview';
import { useAppDispatch, useAppSelector } from '../../store';
import { createNewPost } from '../../store/slices/postSlice';
import { autoSaveDraftThunk, saveNewDraft } from '../../store/slices/draftSlice';
import { addToast } from '../../store/slices/notificationSlice';
import {
  Send,
  Calendar,
  Save,
  AlertCircle,
  CheckCircle2,
  Clock,
  Link as LinkIcon,
  X,
  Sparkles,
  Wand2,
  Bookmark,
  Zap,
} from 'lucide-react';

interface OmniComposerProps {
  initialDraft?: Partial<Post>;
  onPostSuccess?: () => void;
}

// Industry Post Templates for instant drafting
const POST_TEMPLATES = [
  {
    name: '🚀 Product Launch',
    content:
      'We are beyond excited to unveil OmniSync 4.0! 🚀 Seamless multi-channel orchestration with automated scheduling, real-time analytics, and enterprise RBAC security.\n\nExperience the next evolution of social management.',
    hashtags: ['#ProductLaunch', '#SaaS', '#SocialMediaTech'],
    links: ['https://omnisync.io/launch'],
  },
  {
    name: '📊 Growth Milestone',
    content:
      'Celebrating a monumental milestone: over 1,000,000 publications successfully coordinated across 5 major networks through OmniSync this quarter!\n\nThank you to our incredible community of creators and marketing teams.',
    hashtags: ['#Milestone', '#GrowthMarketing', '#CommunityFirst'],
    links: ['https://omnisync.io/stats'],
  },
  {
    name: '💡 Tech Architecture',
    content:
      'Engineering Deep-Dive: How event-driven architecture with Apache Kafka and Dead Letter Queues guarantees zero missed social posts during peak viral traffic windows.\n\nRead our technical architecture breakdown.',
    hashtags: ['#ApacheKafka', '#SoftwareArchitecture', '#CloudNative'],
    links: ['https://omnisync.io/eng/kafka'],
  },
  {
    name: '🎙️ Live Event / Webinar',
    content:
      'Join our engineering and marketing teams this Thursday at 10 AM PST for our live workshop: "Mastering Cross-Platform Distribution in 2026".\n\nReserve your complimentary seat today.',
    hashtags: ['#Webinar', '#LiveWorkshop', '#SocialStrategy'],
    links: ['https://omnisync.io/webinar'],
  },
];

// Calculated Peak Audience Windows per channel
const OPTIMAL_WINDOWS: Record<SocialPlatformId, { hour: number; minute: number; label: string }> = {
  twitter: { hour: 13, minute: 30, label: '1:30 PM (Peak Breaktime)' },
  instagram: { hour: 18, minute: 45, label: '6:45 PM (Evening Commute)' },
  facebook: { hour: 15, minute: 0, label: '3:00 PM (Mid-Afternoon Dip)' },
  linkedin: { hour: 8, minute: 45, label: '8:45 AM (Pre-Work Routine)' },
  youtube: { hour: 16, minute: 15, label: '4:15 PM (Pre-Prime)' },
};

export const OmniComposer: React.FC<OmniComposerProps> = ({ initialDraft, onPostSuccess }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { autoSaveStatus, lastSavedAt } = useAppSelector((state) => state.drafts);

  // Form states
  const [content, setContent] = useState(initialDraft?.content || '');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatformId[]>(
    initialDraft?.platforms && initialDraft.platforms.length > 0
      ? initialDraft.platforms
      : ['twitter', 'linkedin']
  );
  const [media, setMedia] = useState<MediaAsset[]>(initialDraft?.media || []);
  const [hashtags, setHashtags] = useState<string[]>(
    initialDraft?.hashtags || ['#OmniSync', '#SaaS', '#Growth']
  );
  const [links, setLinks] = useState<string[]>(initialDraft?.links || []);
  const [newLinkInput, setNewLinkInput] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date(Date.now() + 86400000 * 2);
    return d.toISOString().slice(0, 16);
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save debounce timer
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentDraftIdRef = useRef<string | undefined>(initialDraft?.id);

  useEffect(() => {
    if (!content.trim()) return;
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      dispatch(
        autoSaveDraftThunk({
          id: currentDraftIdRef.current,
          data: {
            content,
            platforms: selectedPlatforms,
            media,
            hashtags,
            links,
          },
        })
      ).then((action: any) => {
        if (action.payload?.id) {
          currentDraftIdRef.current = action.payload.id;
        }
      });
    }, 2500);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [content, selectedPlatforms, media, hashtags, links, dispatch]);

  const togglePlatform = (id: SocialPlatformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleApplyTemplate = (tmpl: (typeof POST_TEMPLATES)[0]) => {
    setContent(tmpl.content);
    setHashtags(tmpl.hashtags);
    setLinks(tmpl.links);
    setShowTemplates(false);
    dispatch(
      addToast({
        type: 'info',
        title: 'Template Loaded',
        message: `Applied "${tmpl.name}" preset copy into the studio.`,
      })
    );
  };

  // AI Assistant Style Rewriter
  const handleSmartRewrite = (style: 'viral' | 'executive' | 'punchy') => {
    if (!content.trim()) {
      setContent(
        'Exciting product milestone: OmniSync Social now delivers unified multi-network scheduling with sub-millisecond telemetry!'
      );
      return;
    }

    if (style === 'viral') {
      setContent(
        `🚨 Stop manual cross-posting in 2026.\n\n${content}\n\nWhat’s your current social distribution workflow? Drop your thoughts below 👇`
      );
    } else if (style === 'executive') {
      setContent(
        `Strategic update: As modern organizations expand their digital footprint, channel governance is paramount.\n\n${content}\n\nScaling with discipline, security, and measurable audience ROI.`
      );
    } else if (style === 'punchy') {
      setContent(`Big update.\n\n${content.split('.')[0]}.\n\nReady? Let’s dive in.`);
    }

    dispatch(
      addToast({
        type: 'success',
        title: 'Smart Hook Applied',
        message: `Refined copy using the ${style.toUpperCase()} tone formula.`,
      })
    );
  };

  // Auto-apply Optimal Window
  const handleApplyOptimalWindow = () => {
    const primaryPlat = selectedPlatforms[0] || 'linkedin';
    const opt = OPTIMAL_WINDOWS[primaryPlat];
    const target = new Date();
    target.setDate(target.getDate() + 1); // Tomorrow
    target.setHours(opt.hour, opt.minute, 0, 0);

    setScheduledDate(target.toISOString().slice(0, 16));
    dispatch(
      addToast({
        type: 'success',
        title: 'Peak Timing Selected',
        message: `Set to ${opt.label} based on audience telemetry for ${primaryPlat.toUpperCase()}.`,
      })
    );
  };

  const handleAddLink = () => {
    let clean = newLinkInput.trim();
    if (!clean) return;
    if (!clean.startsWith('http')) clean = `https://${clean}`;
    if (!links.includes(clean)) {
      setLinks([...links, clean]);
      setNewLinkInput('');
    }
  };

  const handleRemoveLink = (linkToRemove: string) => {
    setLinks(links.filter((l) => l !== linkToRemove));
  };

  // Platform Validation Engine
  const validateForm = () => {
    const errors: string[] = [];
    if (!content.trim()) {
      errors.push('Post content is required.');
    }
    if (selectedPlatforms.length === 0) {
      errors.push('Please select at least one destination social channel.');
    }
    selectedPlatforms.forEach((pId) => {
      const meta = PLATFORMS_META.find((m) => m.id === pId);
      if (meta && content.length > meta.charLimit) {
        errors.push(
          `${meta.name}: Content length exceeds limit (${content.length}/${meta.charLimit} chars).`
        );
      }
      if (pId === 'instagram' && media.length === 0) {
        errors.push('Instagram: Requires at least one attached image or video asset.');
      }
    });
    return errors;
  };

  const validationErrors = validateForm();
  const isValid = validationErrors.length === 0;

  // Handle Manual Save Draft
  const handleSaveDraft = async () => {
    try {
      await dispatch(
        saveNewDraft({
          content,
          platforms: selectedPlatforms,
          media,
          hashtags,
          links,
        })
      ).unwrap();
      dispatch(
        addToast({
          type: 'success',
          title: 'Draft Saved',
          message: 'Post draft successfully persisted to database.',
        })
      );
    } catch (err: any) {
      dispatch(addToast({ type: 'error', message: err || 'Failed to save draft' }));
    }
  };

  // Handle Publish Now
  const handlePublishNow = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      await dispatch(
        createNewPost({
          content,
          platforms: selectedPlatforms,
          media,
          hashtags,
          links,
          status: 'PUBLISHED',
        })
      ).unwrap();
      dispatch(
        addToast({
          type: 'success',
          title: 'Post Published',
          message: `Dispatched to ${selectedPlatforms.join(
            ', '
          )} and broadcast via Kafka topic 'post-published'.`,
        })
      );
      setContent('');
      setMedia([]);
      setLinks([]);
      onPostSuccess?.();
    } catch (err: any) {
      dispatch(
        addToast({ type: 'error', title: 'Publishing Failed', message: err || 'Publish failed' })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Schedule Post
  const handleConfirmSchedule = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      await dispatch(
        createNewPost({
          content,
          platforms: selectedPlatforms,
          media,
          hashtags,
          links,
          status: 'SCHEDULED',
          scheduledTime: new Date(scheduledDate).toISOString(),
        })
      ).unwrap();
      dispatch(
        addToast({
          type: 'success',
          title: 'Post Scheduled',
          message: `Post scheduled for ${new Date(
            scheduledDate
          ).toLocaleString()} via Kafka topic 'post-scheduled'.`,
        })
      );
      setShowScheduleModal(false);
      setContent('');
      setMedia([]);
      setLinks([]);
      onPostSuccess?.();
    } catch (err: any) {
      dispatch(
        addToast({ type: 'error', title: 'Schedule Failed', message: err || 'Schedule failed' })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
      {/* Left Column: Form & Inputs */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-purple-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(139,92,246,0.04)] space-y-6 transition-colors">
        {/* Autosave Status Header & Quick Template Launcher */}
        <div className="flex items-center justify-between pb-3.5 border-b border-purple-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-extrabold text-slate-900 dark:text-white">
              Compose Social Broadcast
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Template Library Button */}
            <button
              type="button"
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-slate-700 flex items-center gap-1 transition-colors"
            >
              <Bookmark className="w-3 h-3 text-purple-600" />
              <span>{showTemplates ? 'Hide Presets' : 'Templates'}</span>
            </button>

            {/* Autosave Status Indicator */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              {autoSaveStatus === 'saving' && (
                <span className="flex items-center gap-1 text-purple-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                  <span>Auto-saving...</span>
                </span>
              )}
              {autoSaveStatus === 'saved' && (
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Saved{' '}
                    {lastSavedAt
                      ? new Date(lastSavedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'just now'}
                  </span>
                </span>
              )}
              {autoSaveStatus === 'idle' && (
                <span className="text-purple-600 dark:text-purple-400 font-medium">Autosave on</span>
              )}
            </div>
          </div>
        </div>

        {/* Templates Drawer */}
        {showTemplates && (
          <div className="p-4 bg-gradient-to-r from-purple-50 via-pink-50/40 to-purple-50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl border border-purple-200/80 dark:border-slate-700 space-y-2.5 animate-in fade-in duration-150">
            <span className="text-xs font-bold text-purple-900 dark:text-purple-200 block">
              Choose an Industry Template:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {POST_TEMPLATES.map((tmpl, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="p-2.5 text-left rounded-xl bg-white dark:bg-slate-900 hover:border-purple-500 hover:shadow-sm border border-purple-100 dark:border-slate-700 transition-all group"
                >
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block group-hover:text-purple-600">
                    {tmpl.name}
                  </span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {tmpl.content}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 1. Target Platforms */}
        <PlatformMatrixSelector
          selectedPlatforms={selectedPlatforms}
          onTogglePlatform={togglePlatform}
        />

        {/* 2. Content Editor with AI Tone Rewriter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Post Copy
              </label>
              {/* AI Style Assistant Pill Buttons */}
              <div className="hidden sm:flex items-center gap-1">
                <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 flex items-center gap-1 font-bold">
                  <Wand2 className="w-3 h-3" />
                  Hook:
                </span>
                <button
                  type="button"
                  onClick={() => handleSmartRewrite('viral')}
                  className="text-[10px] font-bold text-purple-800 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-slate-700 px-2 py-0.5 rounded-md border border-purple-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors"
                >
                  Engaging
                </button>
                <button
                  type="button"
                  onClick={() => handleSmartRewrite('executive')}
                  className="text-[10px] font-bold text-purple-800 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-slate-700 px-2 py-0.5 rounded-md border border-purple-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors"
                >
                  Executive
                </button>
                <button
                  type="button"
                  onClick={() => handleSmartRewrite('punchy')}
                  className="text-[10px] font-bold text-purple-800 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-slate-700 px-2 py-0.5 rounded-md border border-purple-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors"
                >
                  Punchy
                </button>
              </div>
            </div>
            <CharacterMeter contentLength={content.length} selectedPlatforms={selectedPlatforms} />
          </div>
          <textarea
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your cross-channel announcement, launch notes, or product highlights..."
            className="w-full p-4 bg-purple-50/30 dark:bg-slate-800/60 border border-purple-200/80 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-purple-400/80 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 leading-relaxed transition-all font-normal"
          />
        </div>

        {/* Optimal Timing Bar */}
        <div className="p-3 bg-gradient-to-r from-purple-50/70 to-sky-50/50 dark:from-slate-800 dark:to-slate-800/60 rounded-xl border border-purple-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Audience Peak for {selectedPlatforms[0]?.toUpperCase() || 'LINKEDIN'}:{' '}
              <strong className="text-purple-900 dark:text-purple-300">
                {OPTIMAL_WINDOWS[selectedPlatforms[0] || 'linkedin']?.label}
              </strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleApplyOptimalWindow}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-purple-200 dark:border-slate-600 hover:bg-purple-100 text-purple-900 dark:text-purple-200 font-bold transition-colors text-[11px] whitespace-nowrap self-start sm:self-auto"
          >
            Apply Optimal Slot
          </button>
        </div>

        {/* 3. Media Uploader */}
        <MediaVaultUploader media={media} onChange={setMedia} maxCount={4} />

        {/* 4. Hashtag Chips Input */}
        <HashtagManager hashtags={hashtags} onChange={setHashtags} maxTags={15} />

        {/* 5. External Web Links */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Target Web Links</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              placeholder="https://omnisync.io/launch"
              value={newLinkInput}
              onChange={(e) => setNewLinkInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLink())}
              className="flex-1 px-3.5 py-2 bg-purple-50/40 dark:bg-slate-800 border border-purple-200/80 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white placeholder-purple-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="button"
              onClick={handleAddLink}
              className="px-3.5 py-2 rounded-xl border border-purple-200 dark:border-slate-700 bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-slate-700 text-xs font-bold text-purple-900 dark:text-purple-300 transition-colors"
            >
              Add Link
            </button>
          </div>
          {links.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {links.map((link) => (
                <span
                  key={link}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-purple-900 dark:text-purple-300 text-xs font-mono"
                >
                  <span className="truncate max-w-[220px]">{link}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(link)}
                    className="text-purple-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 6. Validation Errors Banner */}
        {validationErrors.length > 0 && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl space-y-1 animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Platform Constraints Notice:</span>
            </div>
            <ul className="list-disc list-inside text-xs text-rose-700 dark:text-rose-400 space-y-0.5 pl-1 font-medium">
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-purple-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-purple-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 text-xs font-bold text-purple-900 dark:text-purple-300 transition-colors"
          >
            <Save className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Save to Drafts</span>
          </button>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              disabled={!isValid || isSubmitting}
              onClick={() => setShowScheduleModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/80 hover:bg-purple-200 text-purple-900 dark:text-purple-300 text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calendar className="w-4 h-4 text-purple-700 dark:text-purple-400" />
              <span>Schedule Post</span>
            </button>
            <button
              type="button"
              disabled={!isValid || isSubmitting}
              onClick={handlePublishNow}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Live Platform Previews */}
      <div className="lg:col-span-5 flex flex-col">
        <OmniChannelPreview
          content={content}
          media={media}
          hashtags={hashtags}
          links={links}
          selectedPlatforms={selectedPlatforms}
        />
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-purple-100 dark:border-slate-800 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Schedule Broadcast
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Target date for automated syndication across{' '}
              <strong className="text-purple-900 dark:text-purple-300">
                {selectedPlatforms.join(', ')}
              </strong>
              . Broadcast will be processed via Kafka <code className="font-mono bg-purple-50 dark:bg-slate-800 text-purple-800 dark:text-purple-300 px-1 py-0.5 rounded">post-scheduled</code>.
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Scheduled Date & Time (UTC)
              </label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-purple-50/40 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="pt-3 border-t border-purple-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 rounded-xl border border-purple-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSchedule}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm shadow-purple-500/25"
              >
                {isSubmitting ? 'Enqueuing...' : 'Confirm Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { OmniComposer as PostComposer };

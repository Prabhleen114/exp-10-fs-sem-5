import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchDrafts,
  deleteDraftThunk,
  duplicateDraftThunk,
  setDraftSearch,
  setDraftPlatformFilter,
  setDraftSort,
} from '../../store/slices/draftSlice';
import { addToast } from '../../store/slices/notificationSlice';
import { Draft } from '../../types';
import { PlatformTag } from '../common/Badges';
import {
  FileText,
  Search,
  Copy,
  Trash2,
  Edit3,
  ArrowUpDown,
  Plus,
  AlertCircle,
} from 'lucide-react';

interface DraftsVaultProps {
  onEditDraftInComposer: (draft: Draft) => void;
  onCreateNew: () => void;
}

export const DraftsVault: React.FC<DraftsVaultProps> = ({
  onEditDraftInComposer,
  onCreateNew,
}) => {
  const dispatch = useAppDispatch();
  const { drafts, isLoading, searchQuery, platformFilter, sortBy } = useAppSelector(
    (state) => state.drafts
  );
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchDrafts());
  }, [dispatch, searchQuery, platformFilter, sortBy]);

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteDraftThunk(id)).unwrap();
      dispatch(
        addToast({
          type: 'success',
          title: 'Draft Deleted',
          message: 'Draft removed from database.',
        })
      );
      setConfirmDeleteId(null);
    } catch (err: any) {
      dispatch(addToast({ type: 'error', message: err || 'Failed to delete draft' }));
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await dispatch(duplicateDraftThunk(id)).unwrap();
      dispatch(
        addToast({
          type: 'success',
          title: 'Draft Duplicated',
          message: 'Created duplicate copy of draft in drafts vault.',
        })
      );
    } catch (err: any) {
      dispatch(addToast({ type: 'error', message: err || 'Failed to duplicate draft' }));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Controls in Playful Pastel style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-purple-100 shadow-[0_2px_8px_rgba(139,92,246,0.04)]">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <span>Drafts Vault</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage, duplicate, filter, and resume pending post compositions.
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Draft</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-purple-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(139,92,246,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search & Tag Shortcuts */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search drafts by keywords, tags, or author..."
              value={searchQuery}
              onChange={(e) => dispatch(setDraftSearch(e.target.value))}
              className="w-full pl-10 pr-3.5 py-2 bg-purple-50/40 dark:bg-slate-800 border border-purple-200/80 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-purple-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
            />
          </div>
          {/* Quick Tag Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['#Roadmap', '#CaseStudy', '#Culture'].map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => dispatch(setDraftSearch(searchQuery === tag ? '' : tag))}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-colors ${
                  searchQuery === tag
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-purple-50 dark:bg-slate-800 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-slate-700 hover:bg-purple-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => dispatch(setDraftPlatformFilter(e.target.value as any))}
            className="px-3.5 py-2 bg-purple-50/50 border border-purple-200 rounded-xl text-xs text-purple-900 font-bold focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="ALL">All Channels</option>
            <option value="twitter">X (Twitter)</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-purple-50/50 border border-purple-200 rounded-xl px-3 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-purple-500" />
            <select
              value={sortBy}
              onChange={(e) => dispatch(setDraftSort(e.target.value as any))}
              className="bg-transparent text-xs text-purple-900 focus:outline-none font-bold"
            >
              <option value="updatedAt,desc">Recently Modified</option>
              <option value="updatedAt,asc">Oldest Modified</option>
              <option value="createdAt,desc">Newest Created</option>
              <option value="createdAt,asc">Oldest Created</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drafts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-purple-50/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : drafts.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-purple-100 shadow-[0_2px_8px_rgba(139,92,246,0.04)] text-center space-y-3">
          <FileText className="w-10 h-10 text-purple-300 mx-auto" />
          <h3 className="text-sm font-extrabold text-slate-800">No Drafts Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || platformFilter !== 'ALL'
              ? 'No drafts match the selected filters. Try clearing your search parameters.'
              : 'You do not have any saved drafts yet. Create one in the post studio.'}
          </p>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Create Your First Draft
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="bg-white rounded-2xl border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all p-5 flex flex-col justify-between group"
            >
              <div>
                {/* Header: Platforms & Date */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {draft.platforms.map((plat) => (
                      <PlatformTag key={plat} platform={plat} size="sm" />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-purple-700 font-bold">
                    {new Date(draft.updatedAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Content Excerpt */}
                <p className="text-xs text-slate-800 line-clamp-4 leading-relaxed font-normal whitespace-pre-wrap">
                  {draft.content || <em className="text-slate-400">Empty draft content</em>}
                </p>

                {/* Media thumbnail if present */}
                {draft.media && draft.media.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 overflow-x-auto py-1">
                    {draft.media.map((m) => (
                      <img
                        key={m.id}
                        src={m.url}
                        alt={m.name}
                        className="w-12 h-12 rounded-lg object-cover border border-purple-100 shrink-0"
                      />
                    ))}
                  </div>
                )}

                {/* Hashtag Chips */}
                {draft.hashtags && draft.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {draft.hashtags.slice(0, 3).map((h, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md font-mono font-bold"
                      >
                        {h}
                      </span>
                    ))}
                    {draft.hashtags.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        +{draft.hashtags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer: Author & Actions */}
              <div className="mt-5 pt-3 border-t border-purple-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] truncate font-medium">
                  By {draft.authorName}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDuplicate(draft.id)}
                    className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Duplicate draft"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(draft.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete draft"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onEditDraftInComposer(draft)}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold rounded-lg text-[11px] transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-extrabold text-slate-900">Delete Post Draft?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will permanently delete the draft from PostgreSQL. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="px-3.5 py-1.5 rounded-xl border border-purple-200 text-xs font-bold text-slate-700 hover:bg-purple-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Delete Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { DraftsVault as DraftManagement };

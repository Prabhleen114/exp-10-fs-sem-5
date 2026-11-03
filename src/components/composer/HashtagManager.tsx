import React, { useState } from 'react';
import { Hash, X, Sparkles } from 'lucide-react';

interface HashtagManagerProps {
  hashtags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

const SUGGESTED_TAGS = [
  '#SaaS',
  '#SocialMediaTech',
  '#ContentStrategy',
  '#Marketing',
  '#DevOps',
  '#Productivity',
  '#TechLaunch',
];

export const HashtagManager: React.FC<HashtagManagerProps> = ({
  hashtags,
  onChange,
  maxTags = 15,
}) => {
  const [inputVal, setInputVal] = useState('');

  const addTag = (tag: string) => {
    let clean = tag.trim();
    if (!clean) return;
    if (!clean.startsWith('#')) clean = `#${clean}`;
    if (hashtags.includes(clean)) return;
    if (hashtags.length >= maxTags) return;
    onChange([...hashtags, clean]);
    setInputVal('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(hashtags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputVal);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-purple-600" />
          <span>Hashtags</span>
        </label>
        <span className="text-[11px] font-mono font-medium text-slate-400">
          ({hashtags.length}/{maxTags})
        </span>
      </div>

      {/* Chips Container & Input */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-purple-50/40 border border-purple-200/70 rounded-xl focus-within:border-purple-500 focus-within:bg-white transition-all">
        {hashtags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-purple-100/80 text-purple-900 text-xs font-bold border border-purple-200/60"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-purple-400 hover:text-purple-900 transition-colors ml-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {hashtags.length < maxTags && (
          <input
            type="text"
            placeholder={
              hashtags.length === 0 ? 'Type tag and press Enter (e.g. #Tech)...' : 'Add hashtag...'
            }
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => inputVal && addTag(inputVal)}
            className="bg-transparent text-xs text-slate-800 placeholder-purple-400 focus:outline-none flex-1 min-w-[140px] py-1"
          />
        )}
      </div>

      {/* Suggested Tags Row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-purple-500" />
          Suggestions:
        </span>
        {SUGGESTED_TAGS.filter((t) => !hashtags.includes(t))
          .slice(0, 5)
          .map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => addTag(tag)}
              className="text-[10px] font-bold text-purple-700 hover:text-purple-950 bg-white hover:bg-purple-100/70 px-2 py-0.5 rounded-md border border-purple-200 transition-colors"
            >
              + {tag}
            </button>
          ))}
      </div>
    </div>
  );
};

export { HashtagManager as HashtagInput };

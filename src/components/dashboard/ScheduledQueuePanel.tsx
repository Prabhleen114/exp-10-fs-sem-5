import React from 'react';
import { Calendar, Clock, PlayCircle } from 'lucide-react';
import { Post } from '../../types';
import { PlatformTag } from '../common/Badges';
import { useAppDispatch, useAppSelector } from '../../store';
import { publishPostNow } from '../../store/slices/postSlice';
import { addToast } from '../../store/slices/notificationSlice';

interface ScheduledQueuePanelProps {
  posts: Post[];
  onOpenCalendar: () => void;
}

export const ScheduledQueuePanel: React.FC<ScheduledQueuePanelProps> = ({
  posts,
  onOpenCalendar,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const scheduledPosts = posts.filter((p) => p.status === 'SCHEDULED').slice(0, 4);
  const canManage =
    user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'EDITOR';

  const handleInstantPublish = async (post: Post) => {
    try {
      await dispatch(publishPostNow(post.id)).unwrap();
      dispatch(
        addToast({
          type: 'success',
          title: 'Post Published',
          message: `Post ${post.id} dispatched across ${post.platforms.join(
            ', '
          )} via Kafka pipeline.`,
        })
      );
    } catch (err: any) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Publishing Error',
          message: err || 'Failed to publish post',
        })
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-[0_2px_8px_rgba(139,92,246,0.04)] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-extrabold text-slate-900">Upcoming Release Queue</h3>
          </div>
          <button
            onClick={onOpenCalendar}
            className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-purple-50"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Open Calendar</span>
          </button>
        </div>

        {scheduledPosts.length === 0 ? (
          <div className="py-10 text-center bg-purple-50/40 rounded-xl border border-dashed border-purple-200">
            <Clock className="w-8 h-8 text-purple-300 mx-auto mb-2" />
            <p className="text-xs text-purple-900 font-semibold">No scheduled posts queued.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Use the composer to schedule your next launch.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduledPosts.map((post) => (
              <div
                key={post.id}
                className="p-3.5 rounded-xl border border-purple-100/90 bg-purple-50/30 hover:bg-purple-50/70 transition-all flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {post.platforms.map((plat) => (
                      <PlatformTag key={plat} platform={plat} size="sm" />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-purple-700">
                    {post.scheduledTime
                      ? new Date(post.scheduledTime).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Pending'}
                  </span>
                </div>
                <p className="text-xs text-slate-800 line-clamp-2 leading-relaxed font-normal">
                  {post.content}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-purple-100 text-[11px]">
                  <span className="text-slate-500 font-medium">Author: {post.authorName}</span>
                  {canManage && (
                    <button
                      onClick={() => handleInstantPublish(post)}
                      className="text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 hover:underline"
                      title="Trigger immediate publication"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-purple-600" />
                      <span>Publish Now</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-purple-100 text-[11px] text-slate-500 flex justify-between font-medium">
        <span>Timezone: UTC</span>
        <span className="text-purple-700 font-mono">Kafka Consumer: Idle</span>
      </div>
    </div>
  );
};

export { ScheduledQueuePanel as UpcomingQueue };

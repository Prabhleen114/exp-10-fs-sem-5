import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchCalendarEvents,
  rescheduleCalendarEvent,
  cancelCalendarEvent,
  setViewMode,
  setSelectedDate,
  setCalendarPlatformFilter,
  setCalendarStatusFilter,
  setTimezone,
  setSelectedEvent,
} from '../../store/slices/calendarSlice';
import { publishPostNow } from '../../store/slices/postSlice';
import { addToast } from '../../store/slices/notificationSlice';
import { CalendarEventItem, SocialPlatformId, PostStatus } from '../../types';
import { PlatformTag, StatusTag } from '../common/Badges';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  Plus,
  PlayCircle,
  XCircle,
  X,
} from 'lucide-react';

interface UnifiedContentCalendarProps {
  onScheduleNew: () => void;
}

export const UnifiedContentCalendar: React.FC<UnifiedContentCalendarProps> = ({
  onScheduleNew,
}) => {
  const dispatch = useAppDispatch();
  const {
    events,
    viewMode,
    selectedDate,
    platformFilter,
    statusFilter,
    timezone,
    isLoading,
    selectedEvent,
  } = useAppSelector((state) => state.calendar);
  const { user } = useAppSelector((state) => state.auth);

  const [rescheduleModalEvent, setRescheduleModalEvent] = useState<CalendarEventItem | null>(null);
  const [newTargetDate, setNewTargetDate] = useState('');
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCalendarEvents());
  }, [dispatch, platformFilter, statusFilter]);

  const canManage =
    user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'EDITOR';

  const currentDateObj = new Date(selectedDate);
  const currentYear = currentDateObj.getFullYear();
  const currentMonth = currentDateObj.getMonth();

  const handlePrev = () => {
    const d = new Date(currentDateObj);
    if (viewMode === 'month') d.setMonth(d.getMonth() - 1);
    else if (viewMode === 'week') d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    dispatch(setSelectedDate(d.toISOString().split('T')[0]));
  };

  const handleNext = () => {
    const d = new Date(currentDateObj);
    if (viewMode === 'month') d.setMonth(d.getMonth() + 1);
    else if (viewMode === 'week') d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    dispatch(setSelectedDate(d.toISOString().split('T')[0]));
  };

  const handleToday = () => {
    dispatch(setSelectedDate(new Date().toISOString().split('T')[0]));
  };

  // Month grid day generator
  const getDaysInMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days: Array<{ dateStr: string; dayNum: number; isCurrentMonth: boolean }> = [];

    // Prev month padding
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const dateStr = new Date(currentYear, currentMonth - 1, d).toISOString().split('T')[0];
      days.push({ dateStr, dayNum: d, isCurrentMonth: false });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = new Date(currentYear, currentMonth, d).toISOString().split('T')[0];
      days.push({ dateStr, dayNum: d, isCurrentMonth: true });
    }

    // Next month padding
    const remaining = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const dateStr = new Date(currentYear, currentMonth + 1, d).toISOString().split('T')[0];
      days.push({ dateStr, dayNum: d, isCurrentMonth: false });
    }
    return days;
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    e.dataTransfer.setData('text/plain', eventId);
    setDraggedEventId(eventId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnDate = async (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('text/plain') || draggedEventId;
    if (!eventId) return;
    const event = events.find((ev) => ev.id === eventId);
    if (!event) return;

    const origTime = new Date(event.start).toTimeString().slice(0, 8);
    const newScheduledIso = `${targetDateStr}T${origTime}Z`;
    try {
      await dispatch(
        rescheduleCalendarEvent({ id: event.id, scheduledTime: newScheduledIso })
      ).unwrap();
      dispatch(
        addToast({
          type: 'success',
          title: 'Rescheduled Post',
          message: `Post ${event.id} rescheduled to ${targetDateStr} via Kafka event stream.`,
        })
      );
    } catch (err: any) {
      dispatch(addToast({ type: 'error', message: err || 'Failed to reschedule' }));
    } finally {
      setDraggedEventId(null);
    }
  };

  const handleInstantPublish = async (id: string) => {
    try {
      await dispatch(publishPostNow(id)).unwrap();
      dispatch(
        addToast({
          type: 'success',
          title: 'Post Published',
          message: 'Post was immediately published to all designated channels.',
        })
      );
      dispatch(fetchCalendarEvents());
      dispatch(setSelectedEvent(null));
    } catch (err: any) {
      dispatch(addToast({ type: 'error', message: err || 'Failed to publish post' }));
    }
  };

  const handleCancelEvent = async (id: string) => {
    try {
      await dispatch(cancelCalendarEvent(id)).unwrap();
      dispatch(addToast({ type: 'info', message: 'Scheduled event cancelled' }));
      dispatch(setSelectedEvent(null));
    } catch (err: any) {
      dispatch(addToast({ type: 'error', message: err || 'Failed to cancel event' }));
    }
  };

  const handleManualReschedule = async () => {
    if (!rescheduleModalEvent || !newTargetDate) return;
    try {
      await dispatch(
        rescheduleCalendarEvent({
          id: rescheduleModalEvent.id,
          scheduledTime: new Date(newTargetDate).toISOString(),
        })
      ).unwrap();
      dispatch(
        addToast({
          type: 'success',
          title: 'Post Rescheduled',
          message: `Scheduled time updated to ${new Date(newTargetDate).toLocaleString()}.`,
        })
      );
      setRescheduleModalEvent(null);
      dispatch(setSelectedEvent(null));
    } catch (err: any) {
      dispatch(addToast({ type: 'error', message: err || 'Failed to reschedule' }));
    }
  };

  const daysGrid = getDaysInMonth();
  const monthName = currentDateObj.toLocaleString([], { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 pb-12">
      {/* Calendar Header Controls in Playful Pastel styling */}
      <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-[0_2px_8px_rgba(139,92,246,0.04)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Month Title & Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-purple-50 p-1 rounded-xl border border-purple-200/60">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg hover:bg-white text-purple-700 transition-colors"
              title="Previous period"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg hover:bg-white text-purple-700 transition-colors"
              title="Next period"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-base font-extrabold text-slate-900 capitalize w-48 font-mono">
            {monthName}
          </h2>
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 transition-colors"
          >
            Today
          </button>
        </div>

        {/* Center: View Mode Switcher */}
        <div className="flex items-center bg-purple-50/80 p-1 rounded-xl border border-purple-200/70">
          {(['month', 'week', 'day', 'list'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => dispatch(setViewMode(mode))}
              className={`px-3.5 py-1 text-xs font-bold rounded-lg capitalize transition-all ${
                viewMode === mode
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-900 hover:bg-purple-100/60'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Right: Filters & Schedule Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => dispatch(setCalendarPlatformFilter(e.target.value as any))}
            className="px-3 py-1.5 bg-purple-50/50 border border-purple-200 rounded-xl text-xs text-purple-900 font-bold focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="ALL">All Channels</option>
            <option value="twitter">X (Twitter)</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => dispatch(setCalendarStatusFilter(e.target.value as any))}
            className="px-3 py-1.5 bg-purple-50/50 border border-purple-200 rounded-xl text-xs text-purple-900 font-bold focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="PUBLISHED">Published</option>
            <option value="FAILED">Failed</option>
          </select>

          {/* Timezone Selector */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-purple-50/50 border border-purple-200 rounded-xl text-xs text-purple-900 font-medium">
            <Globe className="w-3.5 h-3.5 text-purple-500" />
            <select
              value={timezone}
              onChange={(e) => dispatch(setTimezone(e.target.value))}
              className="bg-transparent text-xs text-purple-900 font-mono font-bold focus:outline-none"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">EST (New York)</option>
              <option value="Europe/London">GMT (London)</option>
              <option value="Asia/Kolkata">IST (Kolkata)</option>
              <option value="Asia/Tokyo">JST (Tokyo)</option>
            </select>
          </div>

          {/* Export Action */}
          <button
            onClick={() => {
              const exportData = events.map((e) => ({
                id: e.id,
                title: e.title,
                channels: e.platforms.join(', '),
                status: e.status,
                timestamp: e.start,
                author: e.authorName,
              }));
              const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json',
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `omnisync-calendar-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
              dispatch(
                addToast({
                  type: 'success',
                  title: 'Calendar Exported',
                  message: `Successfully exported ${events.length} queued events to JSON report.`,
                })
              );
            }}
            className="px-3 py-1.5 rounded-xl border border-purple-200 dark:border-slate-700 bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 text-purple-900 dark:text-purple-300 text-xs font-bold transition-colors"
            title="Export calendar events"
          >
            Export Queue
          </button>

          {canManage && (
            <button
              onClick={onScheduleNew}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs shadow-purple-500/20"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Schedule</span>
            </button>
          )}
        </div>
      </div>

      {/* Month Calendar Grid View */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-[0_2px_8px_rgba(139,92,246,0.04)]">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-purple-100 bg-purple-50/70 text-center text-xs font-bold text-purple-900 py-3 font-mono">
            <span>SUN</span>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
          </div>

          {/* Grid Cells with HTML5 Drag-and-Drop */}
          <div className="grid grid-cols-7 divide-x divide-y divide-purple-100/80 min-h-[580px]">
            {daysGrid.map((day, idx) => {
              const dayEvents = events.filter((e) => {
                const eventDate = e.start.split('T')[0];
                return eventDate === day.dateStr;
              });
              const isToday = day.dateStr === new Date().toISOString().split('T')[0];
              return (
                <div
                  key={idx}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnDate(e, day.dateStr)}
                  className={`p-2.5 flex flex-col justify-between transition-colors min-h-[115px] ${
                    day.isCurrentMonth
                      ? 'bg-white hover:bg-purple-50/30'
                      : 'bg-purple-50/20 text-slate-400'
                  } ${isToday ? 'ring-2 ring-inset ring-purple-500 bg-purple-50/30' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isToday
                          ? 'w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-extrabold shadow-xs'
                          : day.isCurrentMonth
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {day.dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md">
                        {dayEvents.length} post{dayEvents.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Day Events Stack */}
                  <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[85px]">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        draggable={canManage}
                        onDragStart={(e) => handleDragStart(e, ev.id)}
                        onClick={() => dispatch(setSelectedEvent(ev))}
                        className={`p-1.5 rounded-lg border text-[11px] cursor-pointer transition-all select-none hover:shadow-xs hover:scale-[1.01] ${
                          ev.status === 'PUBLISHED'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : ev.status === 'SCHEDULED'
                            ? 'bg-purple-50 border-purple-200 text-purple-900'
                            : 'bg-rose-50 border-rose-200 text-rose-900'
                        }`}
                        title="Click to view details or drag to reschedule"
                      >
                        <div className="flex items-center gap-1 font-mono text-[9px] mb-0.5">
                          <span className="font-extrabold uppercase text-purple-900">
                            {ev.platforms.join(', ')}
                          </span>
                          <span>·</span>
                          <span>
                            {new Date(ev.start).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="line-clamp-1 font-semibold">{ev.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List / Agenda View */}
      {(viewMode === 'list' || viewMode === 'week' || viewMode === 'day') && (
        <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden divide-y divide-purple-100 shadow-[0_2px_8px_rgba(139,92,246,0.04)]">
          <div className="p-4 bg-purple-50/50 font-bold text-xs text-purple-900 flex items-center justify-between">
            <span>Scheduled & Broadcast Events Queue</span>
            <span className="font-mono text-purple-700 font-bold">{events.length} total events</span>
          </div>
          {events.length === 0 ? (
            <p className="p-10 text-xs text-slate-400 text-center">
              No calendar events found for the active filter.
            </p>
          ) : (
            events.map((ev) => (
              <div
                key={ev.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-purple-50/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <StatusTag status={ev.status} size="sm" />
                    {ev.platforms.map((p) => (
                      <PlatformTag key={p} platform={p} size="sm" />
                    ))}
                    <span className="text-xs text-purple-800 font-mono font-medium">
                      {new Date(ev.start).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                    {ev.content}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-1 block">Author: {ev.authorName}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {canManage && ev.status === 'SCHEDULED' && (
                    <>
                      <button
                        onClick={() => handleInstantPublish(ev.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-colors"
                      >
                        <PlayCircle className="w-3.5 h-3.5 text-purple-600" />
                        <span>Publish Now</span>
                      </button>
                      <button
                        onClick={() => {
                          setRescheduleModalEvent(ev);
                          setNewTargetDate(new Date(ev.start).toISOString().slice(0, 16));
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-purple-200 hover:bg-purple-50 text-purple-900 text-xs font-bold transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        <span>Reschedule</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => dispatch(setSelectedEvent(ev))}
                    className="px-3 py-1.5 rounded-xl border border-purple-200 hover:bg-purple-50 text-slate-700 text-xs font-bold transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Event Details Drawer/Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <StatusTag status={selectedEvent.status} />
                <span className="text-xs font-mono text-purple-700 font-semibold">
                  ID: {selectedEvent.id}
                </span>
              </div>
              <button
                onClick={() => dispatch(setSelectedEvent(null))}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Destination Channels
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {selectedEvent.platforms.map((p) => (
                  <PlatformTag key={p} platform={p} size="md" />
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Content
              </label>
              <div className="p-3.5 bg-purple-50/40 border border-purple-200/70 rounded-xl text-xs text-slate-900 whitespace-pre-wrap leading-relaxed font-normal">
                {selectedEvent.content}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-700 bg-purple-50/40 p-3 rounded-xl border border-purple-100">
              <div>
                <span className="text-purple-600 block text-[10px] font-bold">TIMESTAMP</span>
                <span className="font-semibold">{new Date(selectedEvent.start).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-purple-600 block text-[10px] font-bold">CREATOR</span>
                <span className="font-semibold">{selectedEvent.authorName}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-purple-100 flex items-center justify-between gap-2">
              {canManage && selectedEvent.status === 'SCHEDULED' ? (
                <>
                  <button
                    onClick={() => handleCancelEvent(selectedEvent.id)}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                  >
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Cancel Schedule</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setRescheduleModalEvent(selectedEvent);
                        setNewTargetDate(new Date(selectedEvent.start).toISOString().slice(0, 16));
                      }}
                      className="px-3.5 py-2 rounded-xl border border-purple-200 hover:bg-purple-50 text-xs font-bold text-purple-900 transition-colors"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleInstantPublish(selectedEvent.id)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs shadow-purple-500/20"
                    >
                      Publish Now
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => dispatch(setSelectedEvent(null))}
                  className="ml-auto px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-900">Reschedule Broadcast</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Choose a new target date and time for automated publication.
            </p>
            <input
              type="datetime-local"
              value={newTargetDate}
              onChange={(e) => setNewTargetDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRescheduleModalEvent(null)}
                className="px-3.5 py-2 rounded-xl border border-purple-200 text-xs font-bold text-slate-700 hover:bg-purple-50"
              >
                Cancel
              </button>
              <button
                onClick={handleManualReschedule}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs shadow-purple-500/20"
              >
                Update Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { UnifiedContentCalendar as ContentCalendar };

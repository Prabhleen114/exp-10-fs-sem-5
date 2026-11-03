import React, { useEffect, useState } from 'react';
import { kafkaApi } from '../../services/api';
import { KafkaEventItem } from '../../types';
import { addToast } from '../../store/slices/notificationSlice';
import { useAppDispatch } from '../../store';
import {
  Cpu,
  RefreshCw,
  Repeat2,
  X,
  FileCode,
} from 'lucide-react';

interface EventStreamConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventStreamConsole: React.FC<EventStreamConsoleProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [topics, setTopics] = useState<any[]>([]);
  const [messages, setMessages] = useState<KafkaEventItem[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<KafkaEventItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadKafkaData = async () => {
    setIsLoading(true);
    try {
      const [topicsRes, eventsRes] = await Promise.all([
        kafkaApi.getTopics(),
        kafkaApi.getEvents(selectedTopic !== 'all' ? selectedTopic : undefined, 50),
      ]);
      setTopics(topicsRes.data.topics);
      setMessages(eventsRes.data.messages);
      if (eventsRes.data.messages.length > 0 && !selectedMessage) {
        setSelectedMessage(eventsRes.data.messages[0]);
      }
    } catch (err) {
      console.error('Failed to load Kafka broker state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadKafkaData();
    }
  }, [isOpen, selectedTopic]);

  const handleReplayDlq = async (eventId: string) => {
    try {
      await kafkaApi.replayDlqMessage(eventId);
      dispatch(
        addToast({
          type: 'success',
          title: 'DLQ Event Replayed',
          message: `Event ${eventId} re-enqueued for consumer group processing.`,
        })
      );
      loadKafkaData();
    } catch {
      dispatch(addToast({ type: 'error', message: 'Failed to replay DLQ event' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-800/80 rounded-2xl shadow-2xl max-w-5xl w-full h-[85vh] flex flex-col text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="h-16 px-6 border-b border-purple-900/60 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-tight">
                  Apache Kafka Event Stream Console
                </h2>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                  Cluster: Healthy
                </span>
              </div>
              <p className="text-[11px] text-purple-200">
                Partitioned topics with FIFO delivery, deduplication cache, and Dead Letter Queue
                (DLQ)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadKafkaData}
              className="p-1.5 rounded-lg border border-purple-800/80 hover:bg-purple-900/40 text-purple-300"
              title="Refresh topic logs"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-purple-800/80 hover:bg-purple-900/40 text-purple-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Topics Summary Bar */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-purple-900/60 flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setSelectedTopic('all')}
            className={`px-3 py-1 rounded-lg text-xs transition-colors font-bold ${
              selectedTopic === 'all'
                ? 'bg-purple-600 text-white'
                : 'text-purple-300 hover:bg-purple-950 hover:text-white'
            }`}
          >
            All Topics ({messages.length})
          </button>
          {topics.map((t) => (
            <button
              key={t.name}
              onClick={() => setSelectedTopic(t.name)}
              className={`px-3 py-1 rounded-lg text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap font-bold ${
                selectedTopic === t.name
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-300 hover:bg-purple-950 hover:text-white'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  t.name === 'post-dlq' ? 'bg-rose-500' : 'bg-purple-400'
                }`}
              />
              <span>{t.name}</span>
              <span className="text-[10px] opacity-75">({t.count})</span>
            </button>
          ))}
        </div>

        {/* Main Body: 2-Column Split */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Event Stream Log */}
          <div className="md:col-span-6 border-r border-purple-900/60 flex flex-col h-full overflow-hidden">
            <div className="p-3 bg-slate-950/40 border-b border-purple-900/60 text-[11px] font-mono text-purple-300 flex justify-between">
              <span>Event Stream Logs (Last 50 messages)</span>
              <span>Ordering: Descending</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-purple-900/40">
              {messages.length === 0 ? (
                <p className="p-8 text-center text-xs text-purple-400">
                  No Kafka messages in this topic.
                </p>
              ) : (
                messages.map((msg) => {
                  const isSelected = selectedMessage?.eventId === msg.eventId;
                  return (
                    <div
                      key={msg.eventId}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-3 text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-950/80 border-l-3 border-purple-500 text-white'
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                        <span className="font-bold text-purple-300">{msg.topic}</span>
                        <span className="text-purple-400/80">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mb-1">
                        <span>P:{msg.partition}</span>
                        <span>·</span>
                        <span>Offset:{msg.offset}</span>
                        <span>·</span>
                        <span className="text-purple-200 font-semibold truncate">Key:{msg.key}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            msg.status === 'PROCESSED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : msg.status === 'ROUTED_TO_DLQ'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {msg.status}
                        </span>
                        {msg.topic === 'post-dlq' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReplayDlq(msg.eventId);
                            }}
                            className="flex items-center gap-1 text-[11px] font-bold text-rose-300 hover:text-white bg-rose-950/70 hover:bg-rose-900 px-2 py-0.5 rounded-lg border border-rose-800/60"
                          >
                            <Repeat2 className="w-3 h-3" />
                            <span>Replay DLQ</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Event Details & JSON Payload Inspector */}
          <div className="md:col-span-6 flex flex-col h-full bg-slate-950/70 overflow-hidden">
            <div className="p-3 bg-slate-950 border-b border-purple-900/60 text-[11px] font-mono text-purple-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-purple-400" />
                <span>Message Payload Inspector</span>
              </span>
              {selectedMessage && (
                <span className="text-purple-400">ID: {selectedMessage.eventId}</span>
              )}
            </div>
            {selectedMessage ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
                {/* Meta Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] p-3 rounded-xl bg-slate-900 border border-purple-900/60">
                  <div>
                    <span className="text-purple-400 block text-[10px]">CORRELATION ID</span>
                    <span className="text-purple-200 truncate block">
                      {selectedMessage.correlationId}
                    </span>
                  </div>
                  <div>
                    <span className="text-purple-400 block text-[10px]">PARTITION & OFFSET</span>
                    <span className="text-slate-200">
                      Partition {selectedMessage.partition} / Offset {selectedMessage.offset}
                    </span>
                  </div>
                  <div>
                    <span className="text-purple-400 block text-[10px]">ATTEMPTS</span>
                    <span className="text-slate-200">{selectedMessage.attempts} (Max: 3)</span>
                  </div>
                  <div>
                    <span className="text-purple-400 block text-[10px]">CONSUMER GROUP</span>
                    <span className="text-slate-200">omnisync-workers-v1</span>
                  </div>
                </div>

                {/* Raw JSON Payload */}
                <div>
                  <span className="text-purple-300 block text-[10px] uppercase font-bold mb-1">
                    De-serialized Event Payload
                  </span>
                  <pre className="p-3.5 rounded-xl bg-slate-900 border border-purple-900/60 text-emerald-400 text-[11px] overflow-x-auto leading-relaxed font-mono">
                    {JSON.stringify(selectedMessage.payload, null, 2)}
                  </pre>
                </div>

                {/* Idempotency & Delivery Guarantee Card */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-purple-900/60 text-[11px] text-purple-200/90 space-y-1">
                  <span className="font-bold text-purple-100 block">
                    Kafka Delivery Guarantee
                  </span>
                  <p className="leading-relaxed text-slate-400">
                    Messages are keyed by Post ID (<code className="text-purple-300">{selectedMessage.key}</code>)
                    ensuring strict FIFO ordering within each partition. Consumer idempotency filters duplicate
                    deliveries, preventing accidental double-publishing during network timeouts.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-purple-400">
                Select an event from the stream to inspect payload.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="h-12 px-6 border-t border-purple-900/60 flex items-center justify-between bg-slate-950 text-xs font-mono text-purple-400">
          <span>Broker: PLAINTEXT://localhost:9092</span>
          <span>Spring Kafka 3.x Producer / Consumer</span>
        </div>
      </div>
    </div>
  );
};

export { EventStreamConsole as KafkaInspectorModal };

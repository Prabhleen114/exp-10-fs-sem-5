import React from 'react';
import { Activity, CheckCircle, Clock, AlertTriangle, Layers, ShieldCheck } from 'lucide-react';
import { AuditLogItem } from '../../types';

interface SystemActivityStreamProps {
  logs: AuditLogItem[];
  onOpenAuditLogs: () => void;
}

export const SystemActivityStream: React.FC<SystemActivityStreamProps> = ({
  logs,
  onOpenAuditLogs,
}) => {
  const displayLogs = logs.slice(0, 5);

  const getActionIcon = (action: string) => {
    if (action.includes('PUBLISH')) {
      return (
        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
          <CheckCircle className="w-3.5 h-3.5" />
        </div>
      );
    }
    if (action.includes('SCHEDULE')) {
      return (
        <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
          <Clock className="w-3.5 h-3.5" />
        </div>
      );
    }
    if (action.includes('FAILED') || action.includes('ERROR')) {
      return (
        <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
          <AlertTriangle className="w-3.5 h-3.5" />
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
        <Layers className="w-3.5 h-3.5" />
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-[0_2px_8px_rgba(139,92,246,0.04)] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-extrabold text-slate-900">Recent Operational Events</h3>
          </div>
          <button
            onClick={onOpenAuditLogs}
            className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-purple-50"
          >
            <span>Full Audit Log</span>
          </button>
        </div>

        {displayLogs.length === 0 ? (
          <div className="py-10 text-center bg-purple-50/40 rounded-xl border border-dashed border-purple-200">
            <ShieldCheck className="w-8 h-8 text-purple-300 mx-auto mb-2" />
            <p className="text-xs text-purple-900 font-semibold">No recent events recorded.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-2.5 rounded-xl border border-purple-50 hover:bg-purple-50/40 transition-colors text-xs"
              >
                {getActionIcon(log.action)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 font-mono text-[11px] truncate">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-purple-700 font-mono shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-slate-600 truncate mt-0.5">{log.details}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-mono">
                    <span className="font-semibold text-purple-600">
                      @{log.userEmail.split('@')[0]}
                    </span>
                    <span>·</span>
                    <span className="truncate">CID: {log.correlationId.slice(0, 14)}...</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-purple-100 text-[11px] text-slate-500 flex justify-between font-medium">
        <span>Security: Immutable Audit</span>
        <span className="text-purple-700 font-mono">Correlation IDs: Enforced</span>
      </div>
    </div>
  );
};

export { SystemActivityStream as RecentActivity };

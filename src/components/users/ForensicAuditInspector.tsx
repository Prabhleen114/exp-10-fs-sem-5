import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchAuditLogs } from '../../store/slices/userSlice';
import { ShieldCheck, Search, RefreshCw } from 'lucide-react';

export const ForensicAuditInspector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { auditLogs, isLoading } = useAppSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAuditLogs(100));
  }, [dispatch]);

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.correlationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-[0_2px_8px_rgba(139,92,246,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
            <span>Forensic Security & Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable structured operational logs with distributed correlation IDs and network IP traces.
          </p>
        </div>
        <button
          onClick={() => dispatch(fetchAuditLogs(100))}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-purple-600 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Trail</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-[0_2px_8px_rgba(139,92,246,0.04)] flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Correlation ID, action, user email, or entity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 bg-purple-50/40 border border-purple-200/80 rounded-xl text-xs text-slate-800 placeholder-purple-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
          />
        </div>
        <span className="text-xs font-mono font-bold text-purple-700">
          Showing {filteredLogs.length} of {auditLogs.length} events
        </span>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-[0_2px_8px_rgba(139,92,246,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-purple-50/50 border-b border-purple-100 text-purple-900 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-5 font-bold">Timestamp (UTC)</th>
                <th className="py-3 px-5 font-bold">Action</th>
                <th className="py-3 px-5 font-bold">User Operator</th>
                <th className="py-3 px-5 font-bold">Entity</th>
                <th className="py-3 px-5 font-bold">Details</th>
                <th className="py-3 px-5 font-bold">Correlation ID</th>
                <th className="py-3 px-5 font-bold text-right">IP Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-3 px-5 text-slate-600 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-5 font-bold text-slate-900 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-extrabold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-purple-700 font-sans font-semibold">
                    {log.userEmail}
                  </td>
                  <td className="py-3 px-5 text-slate-700 font-bold">{log.targetEntity}</td>
                  <td className="py-3 px-5 text-slate-700 font-sans max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="py-3 px-5 text-purple-500 text-[11px] truncate max-w-[140px]">
                    {log.correlationId}
                  </td>
                  <td className="py-3 px-5 text-right text-slate-400">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { ForensicAuditInspector as AuditLogViewer };

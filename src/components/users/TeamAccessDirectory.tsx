import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchUsers, updateUserRole, inviteNewUser } from '../../store/slices/userSlice';
import { addToast } from '../../store/slices/notificationSlice';
import { UserRole } from '../../types';
import { RoleTag } from '../common/Badges';
import { Users, UserPlus, Shield, Lock, X } from 'lucide-react';

export const TeamAccessDirectory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, isLoading } = useAppSelector((state) => state.users);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('EDITOR');
  const [inviteDepartment, setInviteDepartment] = useState('Marketing');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const isAdmin = currentUser?.role === 'ADMIN';

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!isAdmin) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Permission Denied (403)',
          message: 'Only ADMIN accounts have permission to alter team RBAC roles.',
        })
      );
      return;
    }
    try {
      await dispatch(updateUserRole({ id: userId, role: newRole })).unwrap();
      dispatch(
        addToast({
          type: 'success',
          title: 'Role Updated',
          message: `User role successfully assigned to ${newRole}.`,
        })
      );
    } catch (err: any) {
      dispatch(addToast({ type: 'error', message: err || 'Failed to update user role' }));
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        inviteNewUser({
          name: inviteName,
          email: inviteEmail,
          role: inviteRole,
          department: inviteDepartment,
        })
      ).unwrap();
      dispatch(
        addToast({
          type: 'success',
          title: 'Member Invited',
          message: `Invitation sent to ${inviteEmail} with role ${inviteRole}.`,
        })
      );
      setShowInviteModal(false);
      setInviteName('');
      setInviteEmail('');
    } catch (err: any) {
      dispatch(addToast({ type: 'error', message: err || 'Failed to invite user' }));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-[0_2px_8px_rgba(139,92,246,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span>Team & Role-Based Access Control (RBAC)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure operator permissions across Admin, Manager, Editor, and Viewer tiers.
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* RBAC Privilege Hierarchy & Live Matrix Sandbox */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-purple-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(139,92,246,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-purple-950 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-purple-600" />
            <span>Interactive RBAC Permission Matrix</span>
          </h3>
          <span className="text-[11px] text-purple-700 dark:text-purple-400 font-mono">
            Spring Security 6 @PreAuthorize
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200/80 dark:border-purple-800/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-purple-900 dark:text-purple-200 block">ADMIN</span>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-200 px-1.5 rounded">All Access</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Full system control: modify user roles, audit logs, external OAuth connections, DLQ replay, and cache flushes.
            </p>
          </div>
          <div className="p-3.5 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200/80 dark:border-sky-800/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sky-900 dark:text-sky-200 block">MANAGER</span>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-200 px-1.5 rounded">Coordinator</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Team coordinator: invite members, schedule posts, manage social accounts, and view analytics.
            </p>
          </div>
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-emerald-900 dark:text-emerald-200 block">EDITOR</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-200 px-1.5 rounded">Author</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Content specialist: compose, edit, schedule, save drafts, and publish to connected channels.
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-800 dark:text-slate-200 block">VIEWER</span>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-1.5 rounded">Auditor</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Read-only stakeholder: inspect dashboards, review analytics, and view content calendar.
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-[0_2px_8px_rgba(139,92,246,0.04)]">
        <div className="p-4 bg-purple-50/50 border-b border-purple-100 font-bold text-xs text-purple-950 flex items-center justify-between">
          <span>Active Team Operators ({users.length})</span>
          {!isAdmin && (
            <span className="text-[11px] text-amber-700 flex items-center gap-1 font-semibold">
              <Lock className="w-3.5 h-3.5" />
              Role modification restricted to ADMIN accounts
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-purple-50/30 border-b border-purple-100 text-purple-900 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-5 font-bold">User</th>
                <th className="py-3 px-5 font-bold">Department</th>
                <th className="py-3 px-5 font-bold">Role Tier</th>
                <th className="py-3 px-5 font-bold">Status</th>
                <th className="py-3 px-5 font-bold text-right">Role Assignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          u.avatarUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80'
                        }
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover border border-purple-200 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{u.name}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-slate-600 font-medium">{u.department}</td>
                  <td className="py-3.5 px-5">
                    <RoleTag role={u.role} />
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <select
                      value={u.role}
                      disabled={!isAdmin || u.id === currentUser?.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="px-3 py-1 bg-purple-50/50 border border-purple-200 rounded-lg text-xs font-bold text-purple-900 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleInviteSubmit}
            className="bg-white rounded-2xl shadow-2xl border border-purple-100 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <h3 className="text-sm font-extrabold text-slate-900">Invite Team Member</h3>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Smith"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jordan@omnisync.io"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="EDITOR">EDITOR</option>
                    <option value="VIEWER">VIEWER</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    value={inviteDepartment}
                    onChange={(e) => setInviteDepartment(e.target.value)}
                    className="w-full px-3.5 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-purple-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 rounded-xl border border-purple-200 text-xs font-bold text-slate-700 hover:bg-purple-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs shadow-purple-500/20"
              >
                Send Invite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export { TeamAccessDirectory as UserManagement };

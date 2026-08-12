/**
 * User Registration & Roles Approval Manager
 * Halqa-e-Usmania Admin Panel
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppUser, Branch, UserRole } from '../../types';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Plus, 
  Search, 
  Check, 
  X, 
  ShieldAlert, 
  Building2, 
  Edit, 
  Trash2,
  Mail,
  Phone
} from 'lucide-react';

interface UserRegistrationManagerProps {
  appUsers: AppUser[];
  branches: Branch[];
  onApproveUser: (userId: string, assignedRole?: UserRole, assignedBranchId?: string) => void;
  onBulkApproveUsers?: (userIds: string[], assignedRole?: UserRole, assignedBranchId?: string) => void;
  onRejectUser: (userId: string, reason: string) => void;
  onBlockUser?: (userId: string, reason: string) => void;
  onUnblockUser?: (userId: string) => void;
  onCreateUser: (userData: any) => void;
  onEditUser: (user: AppUser) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserRegistrationManager: React.FC<UserRegistrationManagerProps> = ({
  appUsers,
  branches,
  onApproveUser,
  onBulkApproveUsers,
  onRejectUser,
  onBlockUser = (_userId: string, _reason: string) => {},
  onUnblockUser = (_userId: string) => {},
  onCreateUser,
  onEditUser,
  onDeleteUser
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'rejected' | 'blocked'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');

  // Bulk Selection & Approval State
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [showBulkApproveModal, setShowBulkApproveModal] = useState(false);
  const [bulkBranch, setBulkBranch] = useState<string>('keep_original');
  const [bulkRole, setBulkRole] = useState<UserRole>('registered_user');
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCity, setFormCity] = useState('Karachi');
  const [formBranchCode, setFormBranchCode] = useState(branches[0]?.code || 'HQ01');
  const [formRole, setFormRole] = useState<UserRole>('registered_user');
  const [formStatus, setFormStatus] = useState<'pending' | 'active' | 'rejected' | 'blocked'>('active');

  // Quick Approval Modal State
  const [approvingUser, setApprovingUser] = useState<AppUser | null>(null);
  const [approveBranch, setApproveBranch] = useState<string>(branches[0]?.code || 'HQ01');
  const [approveRole, setApproveRole] = useState<UserRole>('registered_user');

  // Rejection Reason Modal State
  const [rejectingUser, setRejectingUser] = useState<AppUser | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Block User Modal State
  const [blockingUser, setBlockingUser] = useState<AppUser | null>(null);
  const [blockReason, setBlockReason] = useState('');

  const confirmRejection = () => {
    if (!rejectingUser || !rejectionReason.trim()) return;
    onRejectUser(rejectingUser.id, rejectionReason.trim());
    setRejectingUser(null);
    setRejectionReason('');
  };

  const confirmBlock = () => {
    if (!blockingUser || !blockReason.trim()) return;
    onBlockUser(blockingUser.id, blockReason.trim());
    setBlockingUser(null);
    setBlockReason('');
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormUsername('');
    setFormEmail('');
    setFormPhone('');
    setFormCity('Karachi');
    setFormBranchCode(branches[0]?.code || 'HQ01');
    setFormRole('registered_user');
    setFormStatus('active');
    setShowAddModal(true);
  };

  const openEditModal = (u: AppUser) => {
    setEditingUser(u);
    setFormName(u.fullName);
    setFormUsername(u.username);
    setFormEmail(u.email || '');
    setFormPhone(u.phone || '');
    setFormCity(u.city || 'Karachi');
    setFormBranchCode(u.branchCode || branches[0]?.code || 'HQ01');
    setFormRole(u.role);
    setFormStatus(u.status);
    setShowAddModal(true);
  };

  const handleCreateOrEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formUsername.trim()) return;

    if (editingUser) {
      onEditUser({
        ...editingUser,
        fullName: formName.trim(),
        username: formUsername.trim(),
        email: formEmail.trim() || undefined,
        phone: formPhone.trim() || undefined,
        city: formCity.trim(),
        branchCode: formBranchCode,
        role: formRole,
        status: formStatus
      });
    } else {
      onCreateUser({
        fullName: formName.trim(),
        username: formUsername.trim(),
        email: formEmail.trim() || undefined,
        phone: formPhone.trim() || undefined,
        city: formCity.trim(),
        branchCode: formBranchCode,
        role: formRole,
        status: formStatus
      });
    }

    setShowAddModal(false);
  };

  const confirmApproval = () => {
    if (!approvingUser) return;
    onApproveUser(approvingUser.id, approveBranch, approveRole);
    setApprovingUser(null);
  };

  const filteredUsers = appUsers.filter((u) => {
    if (u.status !== activeTab && !(activeTab === 'active' && u.status === 'approved')) return false;
    if (branchFilter !== 'ALL' && u.branchCode !== branchFilter) return false;
    if (!searchTerm.trim()) return true;

    const q = searchTerm.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.userId && u.userId.toLowerCase().includes(q)) ||
      (u.mobile && u.mobile.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  const pendingCount = appUsers.filter((u) => u.status === 'pending').length;
  const activeCount = appUsers.filter((u) => u.status === 'active' || u.status === 'approved').length;
  const rejectedCount = appUsers.filter((u) => u.status === 'rejected').length;
  const blockedCount = appUsers.filter((u) => u.status === 'blocked').length;

  const pendingUsersInView = filteredUsers.filter((u) => u.status === 'pending');
  const isAllPendingSelected =
    pendingUsersInView.length > 0 &&
    pendingUsersInView.every((u) => selectedUserIds.includes(u.id));

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllPending = () => {
    if (isAllPendingSelected) {
      const pendingIds = new Set(pendingUsersInView.map((u) => u.id));
      setSelectedUserIds((prev) => prev.filter((id) => !pendingIds.has(id)));
    } else {
      const newIds = new Set([...selectedUserIds, ...pendingUsersInView.map((u) => u.id)]);
      setSelectedUserIds(Array.from(newIds));
    }
  };

  return (
    <div className="space-y-4 text-left" dir="ltr">

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
            <Users size={22} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">User Registrations & Access Control</h2>
            <p className="text-[11px] text-slate-400">
              Approve registrations, record rejection reasons, block/unblock accounts, and assign roles
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Direct Create User</span>
        </button>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setActiveTab('pending'); setSelectedUserIds([]); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <span>Pending Approvals</span>
            <span className="bg-slate-900 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('active'); setSelectedUserIds([]); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <span>Active Users</span>
            <span className="bg-slate-900 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
              {activeCount}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('rejected'); setSelectedUserIds([]); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-red-900 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <span>Rejected</span>
            <span className="bg-slate-900 text-red-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
              {rejectedCount}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('blocked'); setSelectedUserIds([]); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'blocked'
                ? 'bg-purple-900 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <span>Blocked Logins</span>
            <span className="bg-slate-900 text-purple-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
              {blockedCount}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.code}>
                {b.code} - {b.name}
              </option>
            ))}
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 pl-8 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bulk Action Bar for Pending Approvals */}
      {activeTab === 'pending' && selectedUserIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-slate-900 border border-amber-600/50 rounded-2xl p-3 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-xl"
        >
          <div className="flex items-center gap-2.5 text-amber-200 text-xs font-bold">
            <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg">
              <UserCheck size={18} />
            </div>
            <span>
              {selectedUserIds.length} pending user registration{selectedUserIds.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedUserIds([])}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Clear Selection
            </button>
            <button
              onClick={() => {
                setBulkBranch('keep_original');
                setBulkRole('registered_user');
                setShowBulkApproveModal(true);
              }}
              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Check size={16} />
              <span>Bulk Approve Selected ({selectedUserIds.length})</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Users Table */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase font-mono text-[10px] text-slate-400 tracking-wider">
              <tr>
                {activeTab === 'pending' && (
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllPendingSelected}
                      onChange={toggleSelectAllPending}
                      className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer accent-emerald-500"
                      title="Select / Deselect all visible pending users"
                    />
                  </th>
                )}
                <th className="py-3 px-4">User ID / Username</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Branch Code</th>
                <th className="py-3 px-4">System Role</th>
                <th className="py-3 px-4">Status / Reason</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {appUsers.length === 0 ? (
                <tr>
                  <td colSpan={activeTab === 'pending' ? 7 : 6} className="py-8 text-center text-slate-400 font-medium">
                    No registered users available.
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={activeTab === 'pending' ? 7 : 6} className="py-8 text-center text-slate-500 italic">
                    No users found in "{activeTab}" status.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                    {activeTab === 'pending' && (
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(u.id)}
                          onChange={() => toggleSelectUser(u.id)}
                          className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer accent-emerald-500"
                        />
                      </td>
                    )}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-amber-400">
                        {u.userId || 'NOT ASSIGNED'}
                      </div>
                      <div className="text-[10px] text-slate-400">@{u.username}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {u.fullName}
                      <div className="text-[10px] text-slate-400 font-normal">{u.city}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {u.branchCode || 'HQ01'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-amber-300 border border-slate-700">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px]">
                      {u.status === 'rejected' && u.rejectionReason && (
                        <div className="text-red-400 font-mono text-[10px]">Reason: {u.rejectionReason}</div>
                      )}
                      {u.status === 'blocked' && u.blockedReason && (
                        <div className="text-purple-300 font-mono text-[10px]">Blocked: {u.blockedReason}</div>
                      )}
                      {u.status === 'active' && (
                        <div className="text-emerald-400 font-mono text-[10px]">ACTIVE</div>
                      )}
                      {u.status === 'pending' && (
                        <div className="text-amber-300 font-mono text-[10px]">PENDING APPROVAL</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      {activeTab === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              setApprovingUser(u);
                              setApproveBranch(u.branchCode || branches[0]?.code || 'HQ01');
                              setApproveRole('registered_user');
                            }}
                            className="bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Check size={12} />
                            <span>Approve & Assign ID</span>
                          </button>
                          <button
                            onClick={() => {
                              setRejectingUser(u);
                              setRejectionReason('');
                            }}
                            className="bg-red-950 hover:bg-red-900 text-red-300 px-2 py-1 rounded-lg text-[10px] font-bold shadow transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <X size={12} />
                            <span>Reject & Record Reason</span>
                          </button>
                        </>
                      )}

                      {activeTab === 'active' && (
                        <>
                          <button
                            onClick={() => {
                              setBlockingUser(u);
                              setBlockReason('');
                            }}
                            className="bg-purple-950 hover:bg-purple-900 text-purple-300 px-2 py-1 rounded-lg text-[10px] font-bold shadow transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <ShieldAlert size={12} />
                            <span>Block Login</span>
                          </button>
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteUser(u.id)}
                            className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}

                      {activeTab === 'blocked' && (
                        <>
                          <button
                            onClick={() => onUnblockUser(u.id)}
                            className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Check size={12} />
                            <span>Unblock Account</span>
                          </button>
                          <button
                            onClick={() => onDeleteUser(u.id)}
                            className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}

                      {activeTab === 'rejected' && (
                        <button
                          onClick={() => onDeleteUser(u.id)}
                          className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </motion.div>
      </AnimatePresence>

      {/* Approval & Role Assignment Modal */}
      <AnimatePresence>
        {approvingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              transition={{ duration: 0.18 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left space-y-4 shadow-2xl"
            >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <UserCheck className="text-emerald-400" size={18} />
                <span>Approve User Registration</span>
              </h3>
              <button
                onClick={() => setApprovingUser(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs space-y-1">
              <div className="text-white font-bold">{approvingUser.fullName}</div>
              <div className="text-slate-400">Username: @{approvingUser.username}</div>
              <div className="text-slate-400">City: {approvingUser.city}</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Assign Branch:
                </label>
                <select
                  value={approveBranch}
                  onChange={(e) => setApproveBranch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.code}>
                      {b.code} - {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Assign System Role:
                </label>
                <select
                  value={approveRole}
                  onChange={(e) => setApproveRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-amber-300 font-bold"
                >
                  <option value="registered_user">Registered User (View own slips)</option>
                  <option value="muhaqqiq_operator">Muhaqqiq / Operator (Perform calculations & generate slips)</option>
                  <option value="branch_admin">Branch Admin (Manage single branch)</option>
                  <option value="central_admin">Central Admin (Manage all branches)</option>
                  <option value="super_admin">Super Admin (Full system control)</option>
                </select>
              </div>
            </div>

            <button
              onClick={confirmApproval}
              className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md mt-2"
            >
              Confirm Approval & Issue Official ID
            </button>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Add / Edit User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              transition={{ duration: 0.18 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left space-y-4 shadow-2xl"
            >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">
                {editingUser ? 'Edit User Record' : 'Direct Create App User'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrEditSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Full Name: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Muhammad Tariq Usmani"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Username: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="tariq_usmani"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-amber-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Phone:
                  </label>
                  <input
                    type="text"
                    placeholder="+92 300 0000000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    City:
                  </label>
                  <input
                    type="text"
                    placeholder="Karachi"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Branch:
                </label>
                <select
                  value={formBranchCode}
                  onChange={(e) => setFormBranchCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.code}>
                      {b.code} - {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  System Role:
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-amber-300 font-bold"
                >
                  <option value="registered_user">Registered User</option>
                  <option value="muhaqqiq_operator">Muhaqqiq / Operator</option>
                  <option value="branch_admin">Branch Admin</option>
                  <option value="central_admin">Central Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md mt-2"
              >
                {editingUser ? 'Save User Changes' : 'Create User'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Rejection Modal with Reason Record */}
      <AnimatePresence>
        {rejectingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              transition={{ duration: 0.18 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left space-y-4 shadow-2xl"
            >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <UserX className="text-red-400" size={18} />
                <span>Reject Registration Request</span>
              </h3>
              <button
                onClick={() => setRejectingUser(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs space-y-1">
              <div className="text-white font-bold">{rejectingUser.fullName}</div>
              <div className="text-slate-400">Username: @{rejectingUser.username}</div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Reason for Rejection: <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Unverified identity or invalid contact details"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              onClick={confirmRejection}
              disabled={!rejectionReason.trim()}
              className="w-full bg-red-900 hover:bg-red-800 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              Record Rejection & Notify
            </button>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Block Login Modal with Reason */}
      <AnimatePresence>
        {blockingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              transition={{ duration: 0.18 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left space-y-4 shadow-2xl"
            >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldAlert className="text-purple-400" size={18} />
                <span>Block User Login Access</span>
              </h3>
              <button
                onClick={() => setBlockingUser(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs space-y-1">
              <div className="text-white font-bold">{blockingUser.fullName}</div>
              <div className="text-amber-400 font-mono">User ID: {blockingUser.userId || 'NOT ASSIGNED'}</div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Reason for Blocking Login: <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Suspicious login activity or policy violation"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={confirmBlock}
              disabled={!blockReason.trim()}
              className="w-full bg-purple-900 hover:bg-purple-800 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              Confirm Account Block
            </button>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Bulk Approval Modal */}
      <AnimatePresence>
        {showBulkApproveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              transition={{ duration: 0.18 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-left space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <UserCheck className="text-emerald-400" size={20} />
                  <span>Bulk Approve Registrations ({selectedUserIds.length})</span>
                </h3>
                <button
                  onClick={() => setShowBulkApproveModal(false)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-slate-300">
                You are about to approve <strong className="text-amber-400 font-mono">{selectedUserIds.length}</strong> pending registration request{selectedUserIds.length > 1 ? 's' : ''} in a single batch. Each user will be assigned a unique official User ID automatically.
              </p>

              {/* Selected Users Preview */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 max-h-36 overflow-y-auto space-y-1 text-xs">
                <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">Selected Registrations:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedUserIds.map((id) => {
                    const u = appUsers.find((usr) => usr.id === id);
                    return u ? (
                      <span key={id} className="bg-slate-900 border border-slate-800 text-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5">
                        <span className="font-bold text-emerald-400">{u.fullName}</span>
                        <span className="text-slate-500 font-mono text-[10px]">(@{u.username})</span>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Configuration */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Assign Branch for Selected Users:
                  </label>
                  <select
                    value={bulkBranch}
                    onChange={(e) => setBulkBranch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="keep_original">Keep Requested Branch (Per User)</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.code}>
                        {b.code} - {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Assign System Role for Selected Users:
                  </label>
                  <select
                    value={bulkRole}
                    onChange={(e) => setBulkRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="registered_user">Registered User (Standard Access)</option>
                    <option value="murid">Murid / Disciple</option>
                    <option value="branch_admin">Branch Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setShowBulkApproveModal(false)}
                  disabled={isProcessingBulk}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setIsProcessingBulk(true);
                    if (onBulkApproveUsers) {
                      await onBulkApproveUsers(selectedUserIds, bulkRole, bulkBranch);
                    } else {
                      for (const uid of selectedUserIds) {
                        const usr = appUsers.find((u) => u.id === uid);
                        const bCode = bulkBranch === 'keep_original' ? usr?.branchCode || branches[0]?.code || 'HQ01' : bulkBranch;
                        await onApproveUser(uid, bulkRole, bCode);
                      }
                    }
                    setIsProcessingBulk(false);
                    setSelectedUserIds([]);
                    setShowBulkApproveModal(false);
                  }}
                  disabled={isProcessingBulk}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isProcessingBulk ? (
                    <span>Approving Batch...</span>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Confirm Bulk Approve ({selectedUserIds.length})</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

/**
 * Branch Master Manager Component
 * Halqa-e-Usmania Admin Panel
 */

import React, { useState } from 'react';
import { Branch, AppUser } from '../../types';
import { BranchPerformanceChart } from './BranchPerformanceChart';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Phone, 
  Mail, 
  Search, 
  Globe, 
  X 
} from 'lucide-react';

interface BranchMasterManagerProps {
  branches: Branch[];
  appUsers?: AppUser[];
  onAddBranch: (branch: Omit<Branch, 'id' | 'createdAt'>) => void;
  onEditBranch: (branch: Branch) => void;
  onDeleteBranch: (id: string) => void;
  onToggleBranchStatus: (id: string) => void;
}

export const BranchMasterManager: React.FC<BranchMasterManagerProps> = ({
  branches,
  appUsers = [],
  onAddBranch,
  onEditBranch,
  onDeleteBranch,
  onToggleBranchStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formCountry, setFormCountry] = useState('Pakistan');
  const [formAddress, setFormAddress] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');

  const openAddModal = () => {
    setEditingBranch(null);
    setFormName('');
    setFormCode('');
    setFormCity('Karachi');
    setFormCountry('Pakistan');
    setFormAddress('');
    setFormPhone('');
    setFormStatus('active');
    setShowAddModal(true);
  };

  const openEditModal = (b: Branch) => {
    setEditingBranch(b);
    setFormName(b.name);
    setFormCode(b.code);
    setFormCity(b.city);
    setFormCountry(b.country);
    setFormAddress(b.address);
    setFormPhone(b.phone || '');
    setFormStatus(b.status);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) return;

    if (editingBranch) {
      onEditBranch({
        ...editingBranch,
        name: formName.trim(),
        code: formCode.trim().toUpperCase(),
        city: formCity.trim(),
        country: formCountry.trim(),
        address: formAddress.trim(),
        phone: formPhone.trim() || undefined,
        status: formStatus
      });
    } else {
      onAddBranch({
        name: formName.trim(),
        code: formCode.trim().toUpperCase(),
        city: formCity.trim(),
        country: formCountry.trim(),
        address: formAddress.trim(),
        phone: formPhone.trim() || undefined,
        status: formStatus
      });
    }

    setShowAddModal(false);
  };

  const filteredBranches = branches.filter((b) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.code.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 text-left" dir="ltr">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
            <Building2 size={22} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Branch Master Management</h2>
            <p className="text-[11px] text-slate-400">
              Manage KhanQah & Aastana branches and branch codes for slip ID generation
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Branch</span>
        </button>
      </div>

      {/* Branch Performance Overview Recharts Card */}
      <BranchPerformanceChart branches={branches} appUsers={appUsers} />

      {/* Filter / Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex justify-between items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search branch name, code, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pl-8"
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-500 pointer-events-none" />
        </div>

        <span className="text-xs font-mono text-slate-400">
          Total Branches: <strong>{branches.length}</strong>
        </span>
      </div>

      {/* Branches Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase font-mono text-[10px] text-slate-400 tracking-wider">
              <tr>
                <th className="py-3 px-4">Branch Code</th>
                <th className="py-3 px-4">Branch Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredBranches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">
                    {b.code}
                  </td>
                  <td className="py-3 px-4 font-bold text-white">
                    {b.name}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {b.address}, {b.city}, {b.country}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {b.phone || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onToggleBranchStatus(b.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                        b.status === 'active'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                          : 'bg-red-950 text-red-300 border-red-800 hover:bg-red-900'
                      }`}
                    >
                      {b.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(b)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                      title="Edit Branch"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteBranch(b.id)}
                      className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg transition-colors"
                      title="Delete Branch"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">
                {editingBranch ? 'Edit Branch Master' : 'Add New Branch Master'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Branch Code (e.g. MALIR01): <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="MALIR01"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-amber-400 font-mono uppercase focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Branch Name: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Aastana Usmania Malir"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    City:
                  </label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Country:
                  </label>
                  <input
                    type="text"
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Complete Address:
                </label>
                <input
                  type="text"
                  placeholder="Plot 12, Main Malir Road"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Phone / WhatsApp:
                </label>
                <input
                  type="text"
                  placeholder="+92 300 1234567"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Status:
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                >
                  <option value="active font-bold">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md mt-2"
              >
                {editingBranch ? 'Save Branch Changes' : 'Create Branch'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

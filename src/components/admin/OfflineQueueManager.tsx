import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OfflineQueueItem } from '../../types';
import { 
  Wifi, 
  WifiOff, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Plus, 
  Database, 
  FileText, 
  Users, 
  Building2, 
  RefreshCw, 
  Layers, 
  Search, 
  Eye, 
  Zap, 
  CloudOff,
  CloudCheck,
  Check,
  ArrowUpRight,
  Info
} from 'lucide-react';

interface OfflineQueueManagerProps {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  queueItems: OfflineQueueItem[];
  onAddQueueItem: (item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'status'>) => void;
  onRemoveQueueItem: (id: string) => void;
  onClearSyncedItems: () => void;
  onClearAllQueue: () => void;
  onSyncQueue: () => Promise<void>;
  isSyncing: boolean;
}

export const OfflineQueueManager: React.FC<OfflineQueueManagerProps> = ({
  isOnline,
  isSimulatedOffline,
  onToggleSimulatedOffline,
  queueItems,
  onAddQueueItem,
  onRemoveQueueItem,
  onClearSyncedItems,
  onClearAllQueue,
  onSyncQueue,
  isSyncing
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'synced' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItemDetail, setSelectedItemDetail] = useState<OfflineQueueItem | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const effectiveOnline = isOnline && !isSimulatedOffline;

  // Filter queue items
  const filteredItems = queueItems.filter(item => {
    const matchesFilter = activeFilter === 'all' ? true : item.status === activeFilter;
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.titleUrdu && item.titleUrdu.includes(searchTerm)) ||
      item.actionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = queueItems.filter(i => i.status === 'pending').length;
  const syncedCount = queueItems.filter(i => i.status === 'synced').length;
  const failedCount = queueItems.filter(i => i.status === 'failed').length;

  const handleSyncClick = async () => {
    await onSyncQueue();
    setLastSyncTime(new Date().toLocaleTimeString());
  };

  const handleAddDemoOfflineItem = () => {
    const demoItems = [
      {
        actionType: 'UPDATE_DATASET',
        title: 'Friday Day Dataset Adad Update',
        titleUrdu: 'جمعہ کے روزانہ اعداد کی تبدیلی',
        category: 'Khanqah Datasets',
        payload: { day: 'friday', mizaj: 'Aatashi', adadValue: 786, wazifa: 'یا اللہ یا رحمن' }
      },
      {
        actionType: 'ADD_POST',
        title: 'New Spiritual Guidance Note',
        titleUrdu: 'جدید روحانی رہنمائی',
        category: 'CMS Articles',
        payload: { title: 'New Spiritual Guidance Note', category: 'articles', isDraft: true }
      },
      {
        actionType: 'APPROVE_USER',
        title: 'Approve Hafiz Amir Account',
        titleUrdu: 'حافط عامر کے اکاؤنٹ کی منظوری',
        category: 'User Registrations',
        payload: { userId: 'user-demo-1', role: 'mureed', status: 'approved' }
      },
      {
        actionType: 'BRANCH_UPDATE',
        title: 'Karachi Central Branch Timings',
        titleUrdu: 'کراچی سنٹرل برانچ کے اوقات',
        category: 'Branch Management',
        payload: { branchCode: 'KHI-01', activeStatus: true }
      }
    ];

    const randomChoice = demoItems[Math.floor(Math.random() * demoItems.length)];
    onAddQueueItem(randomChoice);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'khanqah datasets': return <Database size={16} className="text-amber-400" />;
      case 'cms articles': return <FileText size={16} className="text-emerald-400" />;
      case 'user registrations': return <Users size={16} className="text-cyan-400" />;
      case 'branch management': return <Building2 size={16} className="text-purple-400" />;
      default: return <Layers size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Network & Offline Status Banner Card */}
      <div className={`rounded-3xl p-5 border shadow-xl transition-all ${
        !effectiveOnline
          ? 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-amber-500/50 text-white'
          : 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40 text-white'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-3 rounded-2xl border ${
              !effectiveOnline 
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse' 
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}>
              {!effectiveOnline ? <WifiOff size={24} /> : <Wifi size={24} />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold tracking-tight">
                  {!effectiveOnline ? 'Offline Mode Active (آف لائن حالت)' : 'Network Connected (آن لائن نظام)'}
                </h3>
                {isSimulatedOffline && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase rounded-full">
                    Simulated Offline
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {!effectiveOnline
                  ? 'انٹرنیٹ رابطہ منقطع ہے یا آف لائن موڈ فعال ہے۔ تمام نئی تبدیلیاں مقامی طور پر محفوظ ہوں گی اور دوبارہ رابطہ پر سنک کی جائیں گی۔'
                  : 'Internet connection is active. You can review pending offline queue entries or simulate offline state for testing.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
            {/* Simulation toggle */}
            <button
              onClick={onToggleSimulatedOffline}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                isSimulatedOffline
                  ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-400 shadow-lg'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              {isSimulatedOffline ? <WifiOff size={15} /> : <Wifi size={15} />}
              <span>{isSimulatedOffline ? 'Disable Offline Sim' : 'Simulate Offline'}</span>
            </button>

            {/* Sync Now Button */}
            <button
              onClick={handleSyncClick}
              disabled={isSyncing || pendingCount === 0 || !effectiveOnline}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 shadow-lg ${
                !effectiveOnline || pendingCount === 0 || isSyncing
                  ? 'bg-slate-800 text-slate-500 border-slate-800 cursor-not-allowed opacity-60'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 cursor-pointer animate-pulse'
              }`}
            >
              <RotateCw size={15} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Syncing Queue...' : `Sync Now (${pendingCount})`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
            <CloudOff size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Pending Sync</span>
            <span className="text-xl font-black text-amber-400 font-mono">{pendingCount}</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <CloudCheck size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Synced Items</span>
            <span className="text-xl font-black text-emerald-400 font-mono">{syncedCount}</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl">
            <AlertTriangle size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Sync Conflicts</span>
            <span className="text-xl font-black text-red-400 font-mono">{failedCount}</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl">
            <Zap size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Last Sync</span>
            <span className="text-xs font-bold text-slate-200 font-mono">
              {lastSyncTime ? lastSyncTime : 'Never in Session'}
            </span>
          </div>
        </div>
      </div>

      {/* Queue Toolbar & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Layers size={18} className="text-amber-400" />
              <span>Offline Action Queue Ledger (آف لائن صفِ اعمال)</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Review, manage, or edit queued actions generated during offline connectivity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAddDemoOfflineItem}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Queue Test Action</span>
            </button>

            {syncedCount > 0 && (
              <button
                onClick={onClearSyncedItems}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Clear Synced
              </button>
            )}

            {queueItems.length > 0 && (
              <button
                onClick={onClearAllQueue}
                className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeFilter === 'all' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({queueItems.length})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeFilter === 'pending' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setActiveFilter('synced')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                activeFilter === 'synced' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Synced ({syncedCount})
            </button>
            {failedCount > 0 && (
              <button
                onClick={() => setActiveFilter('failed')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeFilter === 'failed' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Failed ({failedCount})
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search offline queue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Queue Items List Table */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-500 mx-auto flex items-center justify-center">
              <CloudCheck size={24} />
            </div>
            <h5 className="text-sm font-bold text-slate-300">No Offline Queue Items</h5>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {queueItems.length === 0
                ? 'Your offline queue is completely empty. When you perform actions while offline, they will be listed here automatically.'
                : 'No offline queue items match your search filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Category & Action</th>
                  <th className="p-3">Title / Description</th>
                  <th className="p-3">Queued Time</th>
                  <th className="p-3 text-center">Sync Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-all">
                    <td className="p-3 font-medium text-slate-200">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(item.category)}
                        <div>
                          <span className="block font-bold text-white text-xs">{item.category}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{item.actionType}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-white">{item.title}</div>
                      {item.titleUrdu && (
                        <div className="font-urdu text-amber-300 text-xs mt-0.5">{item.titleUrdu}</div>
                      )}
                    </td>

                    <td className="p-3 text-slate-400 font-mono text-[11px]">
                      {new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>

                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : item.status === 'syncing'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse'
                          : item.status === 'synced'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {item.status === 'pending' && <CloudOff size={11} />}
                        {item.status === 'syncing' && <RotateCw size={11} className="animate-spin" />}
                        {item.status === 'synced' && <Check size={11} />}
                        {item.status === 'failed' && <AlertTriangle size={11} />}
                        <span className="capitalize">{item.status}</span>
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedItemDetail(item)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg transition-all"
                          title="View Payload Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => onRemoveQueueItem(item.id)}
                          className="p-1.5 bg-slate-800 hover:bg-red-950 text-red-400 rounded-lg transition-all"
                          title="Delete Queued Item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payload Modal Details View */}
      <AnimatePresence>
        {selectedItemDetail && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Info size={18} className="text-amber-400" />
                  <h4 className="text-base font-bold text-white">Queued Action Payload Details</h4>
                </div>
                <button
                  onClick={() => setSelectedItemDetail(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Action Type</span>
                  <span className="text-amber-300 font-mono font-bold text-sm">{selectedItemDetail.actionType}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Item Title</span>
                  <span className="text-white font-bold">{selectedItemDetail.title}</span>
                  {selectedItemDetail.titleUrdu && (
                    <div className="font-urdu text-amber-300 mt-0.5">{selectedItemDetail.titleUrdu}</div>
                  )}
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Timestamp</span>
                  <span className="text-slate-300 font-mono">{new Date(selectedItemDetail.timestamp).toLocaleString()}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Payload JSON</span>
                  <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-48">
                    {JSON.stringify(selectedItemDetail.payload, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedItemDetail(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

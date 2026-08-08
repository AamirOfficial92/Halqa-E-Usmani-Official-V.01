/**
 * Day-Wise Spiritual Datasets Manager & Bulk Importer
 * Halqa-e-Usmania Admin Panel
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DayDatasetRecord } from '../../types';
import { DailyAdadWeeklyChart } from './DailyAdadWeeklyChart';
import { 
  Database, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Sparkles, 
  X,
  Code,
  Download
} from 'lucide-react';

interface DayDatasetsManagerProps {
  dayDatasets: DayDatasetRecord[];
  onAddRecord: (rec: Omit<DayDatasetRecord, 'id' | 'createdAt'>) => void;
  onEditRecord: (rec: DayDatasetRecord) => void;
  onDeleteRecord: (id: string) => void;
  onBulkImportRecords: (records: Omit<DayDatasetRecord, 'id' | 'createdAt'>[]) => void;
}

const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DayDatasetsManager: React.FC<DayDatasetsManagerProps> = ({
  dayDatasets,
  onAddRecord,
  onEditRecord,
  onDeleteRecord,
  onBulkImportRecords
}) => {
  const [selectedDayTab, setSelectedDayTab] = useState<string>('Monday');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DayDatasetRecord | null>(null);

  // Single Record Form State
  const [formAdad, setFormAdad] = useState<number>(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [formDay, setFormDay] = useState<string>('Monday');
  const [formMizaj, setFormMizaj] = useState<'Aatashi' | 'Baadi' | 'Aabi' | 'Khaaki'>('Aatashi');
  const [formTashkhees, setFormTashkhees] = useState<string>('نظربد، اعصابی بوجھ، بے خوابی');
  const [formSadqa, setFormSadqa] = useState<string>('سرخ کپڑا، کچھ گوشت یا غلہ، صدقہ خیرات');
  const [formWazifa, setFormWazifa] = useState<string>('یا حَیُّ یا قَیُّومُ ۱۰۰ بار روزانہ');
  const [formDuration, setFormDuration] = useState<string>('۷ دن');
  const [formNotes, setFormNotes] = useState<string>('نمازِ پنجگانہ کی پابندی لازمی ہے');
  const [formReference, setFormReference] = useState<string>('بیاضِ عثمانی جلد ۱، صفحہ ۴۵');

  // Bulk Import State
  const [bulkInput, setBulkInput] = useState<string>('');
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkParsedCount, setBulkParsedCount] = useState<number>(0);

  const openAddModal = () => {
    setEditingRecord(null);
    setFormError(null);
    setFormAdad(0);
    setFormDay(selectedDayTab);
    setFormMizaj('Aatashi');
    setFormTashkhees('نظربد، اعصابی بوجھ');
    setFormSadqa('گوشت یا سرخ چیزیں');
    setFormWazifa('یا سلامُ ۱۱۱ بار');
    setFormDuration('۷ دن');
    setFormNotes('طہارت کا خاص خیال رکھیں');
    setFormReference('حلقہ عثمانیہ ریکارڈز');
    setShowAddModal(true);
  };

  const openEditModal = (rec: DayDatasetRecord) => {
    setEditingRecord(rec);
    setFormError(null);
    setFormAdad(rec.adadValue ?? rec.adad ?? rec.sadqaAdad ?? 0);
    setFormDay((rec.dayName ?? rec.day) as string);
    setFormMizaj(rec.mizaj);
    setFormTashkhees(rec.tashkhees.join(', '));
    setFormSadqa(rec.sadqa.join(', '));
    setFormWazifa(rec.wazifa);
    setFormDuration(rec.duration || rec.recommendedDays || '۷ دن');
    setFormNotes(rec.notes || rec.specialNotes || '');
    setFormReference(rec.references || rec.referenceText || '');
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const adadNum = Number(formAdad);
    
    if (isNaN(adadNum) || adadNum < 0) {
      setFormError('Value cannot be negative.');
      return;
    }

    const tashkheesArr = formTashkhees.split(',').map((s) => s.trim()).filter(Boolean);
    const sadqaArr = formSadqa.split(',').map((s) => s.trim()).filter(Boolean);
    
    const rawDayStr = (formDay || selectedDayTab || 'Monday').toString().trim();
    const normalizedDay = daysList.find(d => d.toLowerCase() === rawDayStr.toLowerCase()) 
      || (rawDayStr ? (rawDayStr.charAt(0).toUpperCase() + rawDayStr.slice(1).toLowerCase()) : 'Monday');

    if (editingRecord) {
      onEditRecord({
        ...editingRecord,
        adad: adadNum,
        adadValue: adadNum,
        day: normalizedDay,
        dayName: normalizedDay,
        mizaj: formMizaj,
        tashkhees: tashkheesArr.length ? tashkheesArr : ['نظربد'],
        sadqa: sadqaArr.length ? sadqaArr : ['صدقہ'],
        wazifa: formWazifa.trim(),
        duration: formDuration.trim(),
        recommendedDays: formDuration.trim(),
        notes: formNotes.trim(),
        specialNotes: formNotes.trim(),
        references: formReference.trim(),
        referenceText: formReference.trim()
      });
    } else {
      onAddRecord({
        adad: adadNum,
        adadValue: adadNum,
        day: normalizedDay,
        dayName: normalizedDay,
        mizaj: formMizaj,
        tashkhees: tashkheesArr.length ? tashkheesArr : ['نظربد'],
        sadqa: sadqaArr.length ? sadqaArr : ['صدقہ'],
        wazifa: formWazifa.trim(),
        duration: formDuration.trim(),
        recommendedDays: formDuration.trim(),
        notes: formNotes.trim(),
        specialNotes: formNotes.trim(),
        references: formReference.trim(),
        referenceText: formReference.trim()
      });
    }

    setShowAddModal(false);
  };

  const handleBulkSubmit = () => {
    setBulkError(null);
    try {
      const parsed = JSON.parse(bulkInput);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON input must be an array of records.');
      }

      const formatted: Omit<DayDatasetRecord, 'id' | 'createdAt'>[] = parsed.map((item: any, idx: number) => {
        const adadVal = Number(item.adadValue ?? item.adad);
        const rawDay = (item.dayName ?? item.day ?? 'Monday').toString().trim();
        const normalizedDay = daysList.find(d => d.toLowerCase() === rawDay.toLowerCase()) 
          || (rawDay ? (rawDay.charAt(0).toUpperCase() + rawDay.slice(1).toLowerCase()) : 'Monday');

        if (isNaN(adadVal) || adadVal < 0) {
          throw new Error('Value cannot be negative.');
        }
        if (!rawDay) {
          throw new Error(`Record at index ${idx} is missing day.`);
        }
        return {
          adad: adadVal,
          adadValue: adadVal,
          day: normalizedDay,
          dayName: normalizedDay,
          mizaj: item.mizaj || 'Aatashi / آتشین',
          tashkhees: Array.isArray(item.tashkhees) ? item.tashkhees : [item.tashkhees || 'نظربد'],
          sadqa: Array.isArray(item.sadqa) ? item.sadqa : [item.sadqa || 'صدقہ'],
          wazifa: item.wazifa || 'یا اللہ',
          duration: item.duration || item.recommendedDays || '۷ دن',
          recommendedDays: item.duration || item.recommendedDays || '۷ دن',
          notes: item.notes || item.specialNotes || '',
          specialNotes: item.notes || item.specialNotes || '',
          references: item.references || item.referenceText || '',
          referenceText: item.references || item.referenceText || ''
        };
      });

      onBulkImportRecords(formatted);
      setShowBulkModal(false);
      setBulkInput('');
    } catch (err: any) {
      setBulkError(err.message || 'Invalid JSON format');
    }
  };

  const handleExportCSV = () => {
    if (!dayDatasets || dayDatasets.length === 0) {
      alert('کوئی ڈیٹا سیٹ ریکارڈ کی رپورٹ کے لیے موجود نہیں ہے۔ (No dataset records available to export)');
      return;
    }

    const headers = [
      'Record ID',
      'Day',
      'Mizaj (Temperament)',
      'Adad Value',
      'Tashkhees (Diagnosis)',
      'Sadqa Recommendation',
      'Wazifa / Azkaar',
      'Duration',
      'Notes / Special Instructions',
      'Reference'
    ];

    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      if (Array.isArray(val)) {
        val = val.join('; ');
      }
      const stringVal = String(val).replace(/"/g, '""');
      return `"${stringVal}"`;
    };

    const rows = dayDatasets.map((rec) => [
      escapeCSV(rec.id),
      escapeCSV(rec.dayName || rec.day || ''),
      escapeCSV(rec.mizaj || ''),
      escapeCSV(rec.adadValue ?? rec.adad ?? ''),
      escapeCSV(rec.tashkhees || ''),
      escapeCSV(rec.sadqa || ''),
      escapeCSV(rec.wazifa || ''),
      escapeCSV(rec.duration || rec.recommendedDays || ''),
      escapeCSV(rec.notes || rec.specialNotes || ''),
      escapeCSV(rec.references || rec.referenceText || '')
    ]);

    // Add BOM (\uFEFF) for Excel UTF-8 compatibility (Urdu support)
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `khanqah_day_datasets_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const sampleJsonTemplate = `[
  {
    "adadValue": 12,
    "dayName": "Monday",
    "mizaj": "Aabi",
    "tashkhees": ["اعصابی دباؤ", "نظرِ بد کی علامات"],
    "sadqa": ["کچھ سفید کپڑا یا دال مسور"],
    "wazifa": "یا سَلامُ ۱۱۱ بار بعد نمازِ فجر",
    "recommendedDays": "۷ دن",
    "specialNotes": "باوضو رہیں اور صبح شام تلاوت کریں",
    "referenceText": "حلقہ عثمانیہ ریکارڈز ج۱"
  }
]`;

  const dayFilteredRecords = dayDatasets.filter(
    (d) => (d.dayName || d.day || '').toString().toLowerCase() === selectedDayTab.toLowerCase()
  );

  return (
    <div className="space-y-4 text-left" dir="ltr">

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
            <Database size={22} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Day-Wise Spiritual Datasets Manager</h2>
            <p className="text-[11px] text-slate-400">
              Approved Tashkhees, Sadqa, and Wazifa records categorized by birth/calculation day
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            title="Export Day Datasets to CSV file for reporting"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setBulkInput(sampleJsonTemplate);
              setBulkError(null);
              setShowBulkModal(true);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <Upload size={14} />
            <span>Bulk Import (JSON)</span>
          </button>

          <button
            onClick={openAddModal}
            className="bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <Plus size={16} />
            <span>Add Single Record</span>
          </button>
        </div>
      </div>

      {/* Recharts Daily Adad & Weekly Participation Dashboard Card */}
      <DailyAdadWeeklyChart dayDatasets={dayDatasets} />

      {/* Days Tabs (Monday - Sunday) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 bg-slate-900 border border-slate-800 rounded-2xl p-2">
        {daysList.map((day) => {
          const count = dayDatasets.filter(
            (d) => (d.dayName || d.day || '').toString().toLowerCase() === day.toLowerCase()
          ).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDayTab(day)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                selectedDayTab === day
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Calendar size={14} />
              <span>{day}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedDayTab === day ? 'bg-amber-400 text-slate-950 font-mono font-bold' : 'bg-slate-800 text-slate-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dataset Records Table */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDayTab}
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
                <th className="py-3 px-4">Adad Value</th>
                <th className="py-3 px-4">Mizaj</th>
                <th className="py-3 px-4">Tashkhees (روحانی معائینہ)</th>
                <th className="py-3 px-4">Sadqa (صدقہ)</th>
                <th className="py-3 px-4">Wazifa (مسنون وظیفہ)</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {dayFilteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                    No records entered for {selectedDayTab} yet. Click "Add Single Record" or "Bulk Import".
                  </td>
                </tr>
              ) : (
                dayFilteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400 text-sm">
                      {rec.adadValue ?? rec.adad ?? rec.sadqaAdad ?? 0}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {rec.mizaj}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-emerald-300 font-serif text-right text-xs" dir="rtl">
                      {rec.tashkhees.join('، ')}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-serif text-right text-xs" dir="rtl">
                      {rec.sadqa.join('، ')}
                    </td>
                    <td className="py-3 px-4 text-amber-300 font-serif text-right text-xs font-bold" dir="rtl">
                      {rec.wazifa}
                    </td>
                    <td className="py-3 px-4 font-serif text-xs text-slate-400">
                      {rec.recommendedDays || '۷ دن'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(rec)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                        title="Edit Record"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteRecord(rec.id)}
                        className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </motion.div>
      </AnimatePresence>

      {/* Add / Edit Record Modal */}
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
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-left space-y-4 shadow-2xl"
            >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">
                {editingRecord ? 'Edit Spiritual Dataset Record' : 'Add Spiritual Dataset Record'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {formError && (
                <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Adad Value: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formAdad}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormAdad(val);
                      if (val < 0) {
                        setFormError('Value cannot be negative.');
                      } else {
                        setFormError(null);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Day:
                  </label>
                  <select
                    value={formDay}
                    onChange={(e) => setFormDay(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {daysList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Mizaj (مزاج):
                  </label>
                  <select
                    value={formMizaj}
                    onChange={(e) => setFormMizaj(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Aatashi">آتشی (Aatashi)</option>
                    <option value="Baadi">بادی (Baadi)</option>
                    <option value="Aabi">آبی (Aabi)</option>
                    <option value="Khaaki">خاکی (Khaaki)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Tashkhees Array (comma separated Urdu):
                </label>
                <input
                  type="text"
                  required
                  dir="rtl"
                  placeholder="نظربد، اعصابی کھنچاؤ، بے خوابی"
                  value={formTashkhees}
                  onChange={(e) => setFormTashkhees(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-emerald-300 font-serif"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Sadqa Array (comma separated Urdu):
                </label>
                <input
                  type="text"
                  required
                  dir="rtl"
                  placeholder="سرخ کپڑا، کچھ گوشت یا دال مسور"
                  value={formSadqa}
                  onChange={(e) => setFormSadqa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-serif"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Wazifa (مسنون وظیفہ):
                </label>
                <input
                  type="text"
                  required
                  dir="rtl"
                  placeholder="یا سلامُ ۱۱۱ بار بعد نماز فجر"
                  value={formWazifa}
                  onChange={(e) => setFormWazifa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-amber-300 font-serif font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Duration (مدت):
                  </label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-serif"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Reference Text:
                  </label>
                  <input
                    type="text"
                    value={formReference}
                    onChange={(e) => setFormReference(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Special Instructions / Notes:
                </label>
                <input
                  type="text"
                  dir="rtl"
                  placeholder="نمازِ پنجگانہ کا اہتمام فرمائیں"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 font-serif"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md mt-2"
              >
                {editingRecord ? 'Save Record Changes' : 'Create Record'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Bulk Import Modal */}
      <AnimatePresence>
        {showBulkModal && (
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
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-left space-y-4 shadow-2xl"
            >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="text-amber-400" size={18} />
                <h3 className="font-bold text-sm text-white">
                  Bulk Import Spiritual Datasets (JSON)
                </h3>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Paste a JSON array containing spiritual records. They will be validated and appended to the admin dataset.
            </p>

            <textarea
              rows={10}
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-amber-400"
            />

            {bulkError && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{bulkError}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setBulkInput(sampleJsonTemplate)}
                className="text-xs text-amber-400 underline hover:text-white"
              >
                Load Sample Schema
              </button>

              <button
                onClick={handleBulkSubmit}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Import & Append Records
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

    </div>
  );
};

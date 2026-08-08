/**
 * Mod Formula Configuration Manager
 * Halqa-e-Usmania Admin Panel
 */

import React, { useState } from 'react';
import { ModSettings } from '../../types';
import { Settings, Sparkles, Check, RefreshCw } from 'lucide-react';

interface ModSettingsManagerProps {
  modSettings: ModSettings;
  onUpdateModSettings: (settings: ModSettings) => void;
}

export const ModSettingsManager: React.FC<ModSettingsManagerProps> = ({
  modSettings,
  onUpdateModSettings
}) => {
  const [enableMod, setEnableMod] = useState<boolean>(modSettings.enableModFormula);
  const [divisor, setDivisor] = useState<number>(modSettings.modDivisor);
  const [remainderMode, setRemainderMode] = useState<'rem' | 'mod1'>(modSettings.remainderMode);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateModSettings({
      enableModFormula: enableMod,
      modDivisor: Number(divisor),
      remainderMode: remainderMode
    });
  };

  return (
    <div className="space-y-4 text-left max-w-xl mx-auto" dir="ltr">

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
          <Settings size={22} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">Abjad Mod Formula Engine Settings</h2>
          <p className="text-[11px] text-slate-400">
            Configure optional modulo formula reduction for Abjad total values
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="text-xs font-bold text-white">Enable Modulo Reduction Formula</div>
            <div className="text-[10px] text-slate-400">When enabled, total Adad is reduced using (Total Adad % Divisor)</div>
          </div>
          <button
            type="button"
            onClick={() => setEnableMod(!enableMod)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
              enableMod ? 'bg-emerald-600' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                enableMod ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            Modulo Divisor (e.g. 7 for 7 Days of Week, 12 for Zodiac, 28 for Abjad Houses):
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={divisor}
            onChange={(e) => setDivisor(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-amber-400 font-mono font-bold"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            Remainder Index Mode:
          </label>
          <select
            value={remainderMode}
            onChange={(e) => setRemainderMode(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
          >
            <option value="rem">Standard Remainder (0 to Divisor - 1)</option>
            <option value="mod1">1-Based Remainder (If remainder is 0, set to Divisor)</option>
          </select>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
          <div className="text-amber-300 font-bold flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>Formula Preview</span>
          </div>
          <div className="text-slate-400 font-mono">
            {(() => {
              const safeDivisor = !divisor || isNaN(divisor) || divisor <= 0 ? 1 : divisor;
              const rem = 247 % safeDivisor;
              const val = rem === 0 && remainderMode === 'mod1' ? safeDivisor : rem;
              return `Input Example: 247 → ${enableMod ? `(247 % ${safeDivisor}) = ${val}` : '247 (No modulo)'}`;
            })()}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Check size={16} />
          <span>Save Mod Formula Settings</span>
        </button>
      </form>

    </div>
  );
};

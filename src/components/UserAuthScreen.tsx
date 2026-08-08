/**
 * User Registration & Login Component
 * Halqa-e-Usmania
 */

import React, { useState } from 'react';
import { Branch, AppUser } from '../types';
import { 
  UserPlus, 
  LogIn, 
  MapPin, 
  Phone, 
  Mail, 
  Lock, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';

interface UserAuthScreenProps {
  branches: Branch[];
  appUsers: AppUser[];
  activeUser: AppUser | null;
  onSelectActiveUser: (user: AppUser | null) => void;
  onSelfRegisterUser: (userData: any) => AppUser;
}

export const UserAuthScreen: React.FC<UserAuthScreenProps> = ({
  branches,
  appUsers,
  activeUser,
  onSelectActiveUser,
  onSelfRegisterUser
}) => {
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'switch'>('login');
  
  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regFullName, setRegFullName] = useState('');
  const [regMotherName, setRegMotherName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regCnic, setRegCnic] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regBranchId, setRegBranchId] = useState(branches[0]?.id || '');
  const [regPassword, setRegPassword] = useState('');
  const [pendingNoticeUser, setPendingNoticeUser] = useState<AppUser | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const q = loginIdentifier.trim().toLowerCase();

    const matched = appUsers.find(
      (u) =>
        (u.id.toLowerCase() === q ||
          u.mobile.toLowerCase() === q ||
          (u.email && u.email.toLowerCase() === q)) &&
        u.password === loginPassword
    );

    if (!matched) {
      setLoginError('رسائی ممکن نہ ہو سکی۔ آپ کی فراہم کردہ معلومات درست نہیں ہیں۔ براہِ کرم اپنی یوزر آئی ڈی اور پاس ورڈ دوبارہ چیک کریں۔ اگر مسئلہ برقرار رہے تو براہِ کرحلقہ عثمانیہ محمدیہ رشیدیہ قدیریہ ایڈمن سے رابطہ کریں');
      return;
    }

    if (matched.status === 'pending') {
      setLoginError('آپ کا اکاؤنٹ منظوری کے لیے زیرِ التوا ہے۔ آستانہ انتظامیہ سے رابطہ کریں۔');
      return;
    }

    if (matched.status === 'rejected') {
      const reasonText = matched.rejectionReason ? ` (وجہ: ${matched.rejectionReason})` : '';
      setLoginError(`آپ کی رجسٹریشن کی درخواست منظور نہیں ہوئی۔${reasonText}`);
      return;
    }

    if (matched.status === 'blocked') {
      const blockText = matched.blockedReason ? ` (وجہ: ${matched.blockedReason})` : '';
      setLoginError(`سیکیورٹی وجہ سے آپ کا اکاؤنٹ بلاک کر دیا گیا ہے۔${blockText}`);
      return;
    }

    if (matched.status !== 'approved' && matched.status !== 'active') {
      setLoginError('آپ کا اکاؤنٹ منظوری کے بغیر لاگ ان کے لیے فعال نہیں ہے۔ انتظامیہ سے رابطہ کریں۔');
      return;
    }

    onSelectActiveUser(matched);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regMobile.trim() || !regBranchId) return;

    const newPendingUser = onSelfRegisterUser({
      fullName: regFullName.trim(),
      fatherOrHusbandName: regMotherName.trim() || 'والد / خاوند',
      mobile: regMobile.trim(),
      cnic: regCnic.trim() || undefined,
      email: regEmail.trim() || undefined,
      address: regAddress.trim() || undefined,
      city: regCity.trim() || 'کراچی',
      country: 'Pakistan',
      branchId: regBranchId,
      password: regPassword || '123456'
    });

    setPendingNoticeUser(newPendingUser);
  };

  return (
    <div className="w-full space-y-4 text-right" dir="rtl">
      
      {/* Active User Card / Header */}
      {activeUser ? (
        <div className="bg-emerald-950 text-white border border-emerald-700/80 rounded-2xl p-4 shadow-lg flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800 border border-amber-400 text-amber-300 flex items-center justify-center font-bold text-base shadow-inner">
              <UserCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">{activeUser.fullName}</h3>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full font-mono">
                  {activeUser.role}
                </span>
              </div>
              <p className="text-[10px] text-emerald-200 font-mono mt-0.5">
                ID: {activeUser.id} • شاخ: {activeUser.branchName} ({activeUser.branchCode})
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectActiveUser(null)}
            className="bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700/60 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            لاگ آؤٹ
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-l from-slate-900 via-emerald-950 to-slate-900 border border-slate-800 rounded-2xl p-4 text-white shadow-md flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-800/80 text-amber-400 rounded-xl border border-amber-500/30">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-sm font-bold font-serif text-white">
                حلقۂ عثمانیہ پورٹل لاگ ان و رجسٹریشن
              </h2>
              <p className="text-[11px] text-slate-400">
                اپنے مرکزی آستانہ کے کھاتے میں لاگ ان کریں یا نئی رجسٹریشن کرائیں
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex border border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          onClick={() => { setAuthTab('login'); setPendingNoticeUser(null); }}
          className={`flex-1 py-2.5 rounded-lg text-center transition-all ${
            authTab === 'login'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          اکاؤنٹ لاگ ان (Login)
        </button>

        <button
          onClick={() => { setAuthTab('register'); setPendingNoticeUser(null); }}
          className={`flex-1 py-2.5 rounded-lg text-center transition-all ${
            authTab === 'register'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          نئی رجسٹریشن (Self Register)
        </button>

        <button
          onClick={() => { setAuthTab('switch'); setPendingNoticeUser(null); }}
          className={`flex-1 py-2.5 rounded-lg text-center transition-all ${
            authTab === 'switch'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          فوری اکاؤنٹ کوئیک سوئچ
        </button>
      </div>

      {/* LOGIN TAB */}
      {authTab === 'login' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                یوزر آئی ڈی / موبائل نمبر / ای میل:
              </label>
              <input
                type="text"
                required
                placeholder="مثلاً: HU-MALIR01-U000005 یا 03001234567"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                پاسورڈ:
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {loginError && (
              <div className="bg-red-950/90 border-2 border-red-500/80 text-red-100 p-4 rounded-2xl text-xs space-y-3 shadow-lg" dir="rtl">
                <div className="flex items-start gap-2.5">
                  <AlertCircle size={20} className="shrink-0 text-red-400 mt-0.5" />
                  <p className="leading-relaxed font-medium text-xs text-red-100">
                    {loginError}
                  </p>
                </div>
                
                <a
                  href="tel:+923114992292"
                  className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all w-full text-center cursor-pointer"
                >
                  <Phone size={15} />
                  <span>Call Admin (ایڈمن سے رابطہ کریں)</span>
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn size={16} />
              <span>پورٹل میں داخل ہوں</span>
            </button>
          </form>
        </div>
      )}

      {/* REGISTER TAB */}
      {authTab === 'register' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          
          {pendingNoticeUser ? (
            <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500 rounded-2xl p-5 text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-md">
                <Clock size={24} />
              </div>

              <h3 className="font-serif font-bold text-base text-amber-900 dark:text-amber-300">
                رجسٹریشن کی درخواست کامیابی سے موصول ہو گئی!
              </h3>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
                آپ کی درخواست آستانہ انتظامیہ (شاخ: <strong>{pendingNoticeUser.branchName}</strong>) کو موصول ہو گئی ہے۔ انتظامیہ کی منظوری کے بعد آپ کو آفیشل یوزر آئی ڈی جاری کر دی جائے گی۔
              </p>

              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-amber-300 text-xs font-mono text-slate-800 dark:text-slate-200 inline-block">
                موقتی ٹریکنگ آئی ڈی: <strong>{pendingNoticeUser.id}</strong>
              </div>

              <button
                onClick={() => { setAuthTab('login'); setPendingNoticeUser(null); }}
                className="w-full bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                لاگ ان پیج پر جائیں
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Branch Picker */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  مرکزی آستانہ / شاخ منتخب کریں: <span className="text-red-500">*</span>
                </label>
                <select
                  value={regBranchId}
                  onChange={(e) => setRegBranchId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.code}) - {b.city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    مکمل نام: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="محمد زبیر"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 text-xs rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    والد / والدہ / خاوند کا نام:
                  </label>
                  <input
                    type="text"
                    placeholder="عبد الرشید"
                    value={regMotherName}
                    onChange={(e) => setRegMotherName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 text-xs rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    موبائل نمبر: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="03001234567"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 text-xs rounded-xl p-2.5 font-mono text-left"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    شناختی کارڈ نمبر (اختیاری):
                  </label>
                  <input
                    type="text"
                    placeholder="42101-1234567-1"
                    value={regCnic}
                    onChange={(e) => setRegCnic(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 text-xs rounded-xl p-2.5 font-mono text-left"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    شہر:
                  </label>
                  <input
                    type="text"
                    placeholder="کراچی"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 text-xs rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    پاسورڈ بنائیں:
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 text-xs rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus size={16} />
                <span>درخواست برائے رجسٹریشن جمع کریں</span>
              </button>
            </form>
          )}

        </div>
      )}

      {/* QUICK SWITCH TAB */}
      {authTab === 'switch' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            رجسٹرڈ اور منظور شدہ اکاؤنٹس:
          </p>

          <div className="space-y-2">
            {appUsers.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium text-xs font-serif">
                No registered users available.
              </div>
            ) : (
              appUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => onSelectActiveUser(u)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    activeUser?.id === u.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs text-slate-900 dark:text-white">{u.fullName}</strong>
                      <span className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-2 py-0.5 rounded-full font-mono">
                        {u.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      ID: {u.id} • شاخ: {u.branchName} ({u.branchCode})
                    </p>
                  </div>

                  {activeUser?.id === u.id && (
                    <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 size={16} /> منتخب شدہ
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};

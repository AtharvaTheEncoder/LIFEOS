/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Sidebar, navItems } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { DailyLog } from './components/DailyLog';
import { HabitTracker } from './components/HabitTracker';
import { LifeChecklist } from './components/LifeChecklist';
import { Rulebook } from './components/Rulebook';
import { KnowledgeVault } from './components/KnowledgeVault';
import { Planning } from './components/Planning';
import { Wealth } from './components/Wealth';
import { Memories } from './components/Memories';
import { AppLock } from './components/AppLock';
import { FakeFaceLock } from './components/FakeFaceLock';
import { GitHubSettingsSection } from './components/GitHubSettingsSection';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, X, Trash2, AlertTriangle, Check, ShieldCheck, Lock, Unlock } from 'lucide-react';

export default function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('active_tab') || 'dashboard';
  });
  const [logDate, setLogDate] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [confirmDeleteStorage, setConfirmDeleteStorage] = useState(false);
  const [isStorageCleared, setIsStorageCleared] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('app_theme') as 'dark' | 'light') || 'dark';
  });

  // App Lock setting: stored per browser in localStorage, defaults to ON (true)
  const [isAppLockEnabled, setIsAppLockEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('app_lock_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  const handleClearLocalStorage = () => {
    try {
      localStorage.clear();
      setIsStorageCleared(true);
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (err) {
      console.error('Error clearing localStorage:', err);
    }
  };

  const [isUnlocked, setIsUnlocked] = useState(() => {
    const savedLock = localStorage.getItem('app_lock_enabled');
    const isLockEnabled = savedLock !== null ? savedLock === 'true' : true;
    if (!isLockEnabled) return true; // Direct entry if app lock is turned off on this device
    return sessionStorage.getItem('app_unlocked') === 'true';
  });
  const [showFaceLock, setShowFaceLock] = useState(true);

  const handleToggleAppLock = (enabled: boolean) => {
    setIsAppLockEnabled(enabled);
    localStorage.setItem('app_lock_enabled', enabled ? 'true' : 'false');
    if (!enabled) {
      sessionStorage.setItem('app_unlocked', 'true');
      setIsUnlocked(true);
    }
  };

  const handleLockNow = () => {
    sessionStorage.removeItem('app_unlocked');
    setShowFaceLock(true);
    setIsUnlocked(false);
    setShowSettings(false);
  };

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('theme-light');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  useEffect(() => {
    sessionStorage.setItem('active_tab', activeTab);
  }, [activeTab]);

  const activeItem = navItems.find(item => item.id === activeTab) || navItems[0];

  if (isAppLockEnabled && !isUnlocked) {
    if (showFaceLock) {
      return <FakeFaceLock onBypass={() => setShowFaceLock(false)} />;
    }
    return <AppLock onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-black text-zinc-100' : 'bg-[#fcfcfc] text-zinc-900'}`}>
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSettingsClick={() => setShowSettings(true)}
      />
      
      <main className={`flex-1 flex flex-col min-w-0 overflow-hidden relative transition-colors duration-300 ${theme === 'dark' ? 'bg-black' : 'bg-[#fcfcfc]'}`}>
        <Header 
          toggleMobile={() => setIsMobileOpen(true)} 
          activeTabName={activeItem.name} 
          activeColorClass={activeItem.color}
          onOpenSettings={() => setShowSettings(true)}
        />
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="w-full max-w-[1600px] mx-auto h-full flex flex-col">
            {activeTab === 'dashboard' ? (
              <Dashboard 
                onDayClick={(date) => {
                  setLogDate(date);
                  setActiveTab('daily-log');
                }} 
                onNavigate={(tab) => setActiveTab(tab)}
              />
            ) : activeTab === 'daily-log' ? (
              <DailyLog initialDate={logDate} />
            ) : activeTab === 'habit-tracker' ? (
              <HabitTracker />
            ) : activeTab === 'planning' ? (
              <Planning />
            ) : activeTab === 'wealth' ? (
              <Wealth />
            ) : activeTab === 'memories' ? (
              <Memories />
            ) : activeTab === 'life-checklist' ? (
              <LifeChecklist />
            ) : activeTab === 'rulebook' ? (
              <Rulebook />
            ) : activeTab === 'knowledge-vault' ? (
              <KnowledgeVault />
            ) : (
              <>
                {/* Placeholder Content for other tabs */}
                <div className="mb-8">
                  <h1 className={`text-3xl md:text-4xl font-semibold tracking-tight mb-2 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                    <activeItem.icon className={activeItem.color} size={32} />
                    {activeItem.name}
                  </h1>
                  <p className="text-zinc-500 text-sm md:text-base">
                    This is a placeholder for the {activeItem.name.toLowerCase()} module. Data will be stored locally in the data folder.
                  </p>
                </div>
                
                <div className={`flex-1 border border-dashed rounded-2xl flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.02]'}`}>
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full ${activeItem.bg} flex items-center justify-center mx-auto mb-4`}>
                      <activeItem.icon className={activeItem.color} size={28} />
                    </div>
                    <p className={`font-mono text-sm uppercase tracking-widest ${activeItem.color}`}>Module Under Construction</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Settings Pop-up */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative w-full max-w-md max-h-[88vh] overflow-y-auto rounded-3xl p-6 shadow-2xl border transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-zinc-200'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Settings</h3>
                <button 
                  onClick={() => {
                    setShowSettings(false);
                    setConfirmDeleteStorage(false);
                  }}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${theme === 'dark' ? 'hover:bg-white/5 text-zinc-400' : 'hover:bg-black/5 text-zinc-500'}`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={`text-xs font-mono uppercase tracking-widest mb-3 block ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>
                    Appearance
                  </label>
                  <div className={`grid grid-cols-2 gap-3 p-1.5 rounded-2xl ${theme === 'dark' ? 'bg-black/40' : 'bg-zinc-100'}`}>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${theme === 'dark' ? 'bg-zinc-800 text-white shadow-lg shadow-black/20' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                      <Moon size={16} />
                      Dark
                    </button>
                    <button 
                      onClick={() => setTheme('light')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${theme === 'light' ? 'bg-white text-zinc-900 shadow-md shadow-black/5' : 'text-zinc-500 hover:text-zinc-700 font-bold'}`}
                    >
                      <Sun size={16} />
                      Light
                    </button>
                  </div>
                </div>

                {/* App Lock (Stored in local browser storage) */}
                <div className={`pt-4 border-t ${theme === 'dark' ? 'border-white/5' : 'border-zinc-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label className={`text-xs font-mono uppercase tracking-widest block ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>
                        App Lock (This Device)
                      </label>
                      <p className={`text-[11px] mt-0.5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        Require face scan & PIN code on launch
                      </p>
                    </div>
                    <span 
                      id="app-lock-status-badge"
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isAppLockEnabled 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                      }`}
                    >
                      {isAppLockEnabled ? 'ON' : 'OFF'}
                    </span>
                  </div>

                  <div className={`p-4 rounded-2xl border transition-colors ${
                    theme === 'dark' ? 'bg-black/30 border-white/5' : 'bg-zinc-50 border-zinc-200'
                  }`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          isAppLockEnabled 
                            ? 'bg-emerald-500/15 text-emerald-400' 
                            : 'bg-zinc-500/10 text-zinc-500'
                        }`}>
                          {isAppLockEnabled ? <Lock size={18} /> : <Unlock size={18} />}
                        </div>
                        <div>
                          <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                            {isAppLockEnabled ? 'App Lock is ON' : 'App Lock is OFF'}
                          </div>
                          <div className="text-[11px] text-zinc-500 leading-tight">
                            {isAppLockEnabled 
                              ? 'Face ID & PIN prompt appears when opening app' 
                              : 'Direct entry — no lock screen on this browser'}
                          </div>
                        </div>
                      </div>

                      {/* App Lock Toggle Button */}
                      <button
                        id="app-lock-toggle-button"
                        type="button"
                        role="switch"
                        aria-checked={isAppLockEnabled}
                        onClick={() => handleToggleAppLock(!isAppLockEnabled)}
                        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isAppLockEnabled ? 'bg-emerald-500' : (theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-300')
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            isAppLockEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {isAppLockEnabled && (
                      <div className="mt-3 pt-3 border-t border-dashed border-zinc-500/20 flex items-center justify-between">
                        <span className="text-[11px] text-zinc-500 font-mono">Test lock screen:</span>
                        <button
                          id="lock-app-now-btn"
                          type="button"
                          onClick={handleLockNow}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                            theme === 'dark' 
                              ? 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10' 
                              : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 shadow-xs'
                          }`}
                        >
                          <Lock size={12} />
                          <span>Lock Now</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* GitHub Auto-Push Integration */}
                <div className={`pt-4 border-t ${theme === 'dark' ? 'border-white/5' : 'border-zinc-200'}`}>
                  <GitHubSettingsSection theme={theme} />
                </div>

                {/* Storage & Data Management */}
                <div className={`pt-4 border-t ${theme === 'dark' ? 'border-white/5' : 'border-zinc-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-xs font-mono uppercase tracking-widest block ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>
                      Browser Data
                    </label>
                    <span className="text-[10px] font-mono text-emerald-500 font-semibold flex items-center gap-1">
                      <ShieldCheck size={12} />
                      JSON Files Safe
                    </span>
                  </div>

                  {!confirmDeleteStorage ? (
                    <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50/60 border-rose-200'}`}>
                      <p className={`text-xs leading-relaxed mb-3 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        Permanently delete all browser <code className="font-mono text-[11px] text-rose-400 font-semibold">localStorage</code> data. The application will restore fresh default values from your project JSON files.
                      </p>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteStorage(true)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-400 hover:text-rose-300 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                      >
                        <Trash2 size={14} />
                        <span>Delete Local Browser Data</span>
                      </button>
                    </div>
                  ) : (
                    <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-rose-950/40 border-rose-500/40' : 'bg-rose-100 border-rose-300'}`}>
                      <div className="flex items-center gap-2 text-rose-400 mb-2">
                        <AlertTriangle size={16} className="shrink-0 text-rose-400" />
                        <span className="text-xs font-bold font-mono uppercase tracking-wide">Confirm Permanent Wipe</span>
                      </div>
                      <p className={`text-xs leading-relaxed mb-3 ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                        Permanently remove all browser storage data? <strong>JSON files will not be deleted</strong>, and the app will reload fresh from JSON baselines.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteStorage(false)}
                          className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold transition-colors border ${
                            theme === 'dark' 
                              ? 'bg-white/5 border-white/10 text-zinc-400 hover:text-white' 
                              : 'bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleClearLocalStorage}
                          disabled={isStorageCleared}
                          className="py-2 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {isStorageCleared ? (
                            <>
                              <Check size={14} />
                              <span>Wiping...</span>
                            </>
                          ) : (
                            <>
                              <Trash2 size={14} />
                              <span>Confirm Wipe</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50/50 border border-orange-200'}`}>
                  <p className={`text-xs font-medium leading-relaxed ${theme === 'dark' ? 'text-orange-300' : 'text-orange-700'}`}>
                    Local browser data enables offline execution and instant updates. Your JSON files in <span className="font-mono font-bold">/data/</span> remain the source of truth.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

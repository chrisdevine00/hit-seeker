import React, { useState, useEffect, useMemo } from 'react';
import { X, Info, RefreshCw, LogOut, Trash2, Copy, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Wifi, WifiOff, MapPin, Download, Key, Award, Play, Globe } from 'lucide-react';
import { subscribeToErrors, clearErrorLog } from '../../lib/errorCapture';
import { supabase } from '../../lib/supabase';
import { hapticLight, hapticSuccess, hapticError } from '../../lib/haptics';
import { vegasCasinos } from '../../data/casinos';
import { SLOT_BADGES } from '../../badges/definitions/slotBadges';
import { VP_BADGES } from '../../badges/definitions/vpBadges';
import { BLOODY_BADGES } from '../../badges/definitions/bloodyBadges';
import { TRIP_BADGES } from '../../badges/definitions/tripBadges';

// Info tooltip component
function InfoButton({ title, children }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => { e.stopPropagation(); hapticLight(); setShowInfo(!showInfo); }}
        className="w-6 h-6 rounded-full bg-[#333] hover:bg-[#444] flex items-center justify-center"
      >
        <Info size={14} className="text-[#888]" />
      </button>
      {showInfo && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setShowInfo(false)} />
          <div className="absolute right-0 top-8 w-64 bg-[#1a1a1a] border border-[#444] rounded-lg p-3 z-50 shadow-xl">
            <p className="text-[#d4a855] font-semibold text-sm mb-1">{title}</p>
            <p className="text-[#aaa] text-xs leading-relaxed">{children}</p>
          </div>
        </>
      )}
    </div>
  );
}

// Action button with info
function ActionButton({ icon: Icon, label, info, infoTitle, onClick, variant = 'default', disabled }) {
  const variants = {
    default: 'bg-[#0d0d0d] text-[#aaa] hover:text-white hover:bg-[#1a1a1a]',
    danger: 'bg-red-900/30 text-red-400 hover:bg-red-900/50',
    success: 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50',
  };

  // Use Icon variable to satisfy ESLint
  const IconComponent = Icon;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex-1 flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <IconComponent size={16} />
        {label}
      </button>
      <InfoButton title={infoTitle}>{info}</InfoButton>
    </div>
  );
}

export function DevModePanel({
  isOpen,
  onClose,
  user,
  currentTrip,
  myCheckIn,
  notesCount,
  notes = [],
  onForceRefresh,
  debugGeoMode,
  setDebugGeoMode,
  onShowStrategyValidator,
  onPreviewBadge,
  onForceCheckIn,
  demoModeEnabled,
  onToggleDemoMode,
  networkLog = [],
  onClearNetworkLog,
}) {
  const [errors, setErrors] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const [copying, setCopying] = useState(false);
  const [actionStatus, setActionStatus] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [showLocalStorage, setShowLocalStorage] = useState(false);
  const [localStorageKeys, setLocalStorageKeys] = useState([]);
  const [selectedBadgeId, setSelectedBadgeId] = useState('');
  const [showNetworkLog, setShowNetworkLog] = useState(false);

  // Combined badges for unlock dropdown
  const allBadges = useMemo(() => [
    ...SLOT_BADGES.map(b => ({ ...b, domainLabel: 'Slot' })),
    ...VP_BADGES.map(b => ({ ...b, domainLabel: 'VP' })),
    ...BLOODY_BADGES.map(b => ({ ...b, domainLabel: 'Bloody' })),
    ...TRIP_BADGES.map(b => ({ ...b, domainLabel: 'Trip' })),
  ], []);

  // Subscribe to error log
  useEffect(() => {
    return subscribeToErrors(setErrors);
  }, []);

  // Check Supabase connection and refresh localStorage
  useEffect(() => {
    if (!isOpen) return;
    checkConnection();
    refreshLocalStorage();
  }, [isOpen]);

  const refreshLocalStorage = () => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        keys.push({
          key,
          value: value?.substring(0, 100) + (value && value.length > 100 ? '...' : ''),
          size: value?.length || 0,
        });
      }
    }
    setLocalStorageKeys(keys.sort((a, b) => a.key.localeCompare(b.key)));
  };

  const deleteLocalStorageKey = (key) => {
    if (confirm(`Delete "${key}" from localStorage?`)) {
      localStorage.removeItem(key);
      refreshLocalStorage();
      hapticSuccess();
    }
  };

  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      const start = Date.now();
      const { error } = await supabase.from('profiles').select('id').limit(1).single();
      const latency = Date.now() - start;
      if (error && error.code !== 'PGRST116') throw error;
      setConnectionStatus(`connected (${latency}ms)`);
    } catch {
      setConnectionStatus('disconnected');
    }
  };

  const handleForceRefresh = async () => {
    hapticLight();
    setActionStatus({ type: 'loading', message: 'Refreshing data...' });
    try {
      await onForceRefresh?.();
      hapticSuccess();
      setActionStatus({ type: 'success', message: 'Data refreshed!' });
    } catch (e) {
      hapticError();
      setActionStatus({ type: 'error', message: e.message });
    }
    setTimeout(() => setActionStatus(null), 3000);
  };

  const handleReauth = async () => {
    hapticLight();
    setActionStatus({ type: 'loading', message: 'Refreshing session...' });
    try {
      const { error } = await supabase.auth.refreshSession();
      if (error) throw error;
      hapticSuccess();
      setActionStatus({ type: 'success', message: 'Session refreshed!' });
    } catch (e) {
      hapticError();
      setActionStatus({ type: 'error', message: e.message });
    }
    setTimeout(() => setActionStatus(null), 3000);
  };

  const handleClearCache = () => {
    hapticLight();
    if (confirm('This will clear all local data and reload the app. Continue?')) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  const handleCopyDebugReport = async () => {
    hapticLight();
    setCopying(true);

    const report = {
      timestamp: new Date().toISOString(),
      app: {
        platform: window.Capacitor?.getPlatform?.() || 'web',
        isNative: window.Capacitor?.isNativePlatform?.() || false,
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        online: navigator.onLine,
      },
      auth: {
        userId: user?.id,
        email: user?.email,
        sessionValid: !!user,
      },
      trip: {
        tripId: currentTrip?.id,
        tripName: currentTrip?.name,
        checkedIn: myCheckIn ? myCheckIn.casino_name : null,
        notesCount,
      },
      connection: connectionStatus,
      recentErrors: errors.slice(0, 5).map(e => ({
        time: e.time,
        message: e.message,
        source: e.source,
      })),
    };

    const text = `--- HitSeeker Debug Report ---
${new Date().toLocaleString()}

PLATFORM
- Type: ${report.app.platform}
- Native: ${report.app.isNative}
- Screen: ${report.app.screenSize}
- Online: ${report.app.online}

AUTH
- User: ${report.auth.email || 'Not logged in'}
- Session: ${report.auth.sessionValid ? 'Valid' : 'Invalid'}

TRIP
- Name: ${report.trip.tripName || 'None'}
- Checked In: ${report.trip.checkedIn || 'No'}
- Notes: ${report.trip.notesCount || 0}

CONNECTION
- Status: ${report.connection}

RECENT ERRORS (${errors.length} total)
${errors.length === 0 ? 'None' : errors.slice(0, 5).map(e => `[${e.time}] ${e.source}: ${e.message}`).join('\n')}

--- End Report ---`;

    try {
      await navigator.clipboard.writeText(text);
      hapticSuccess();
      setActionStatus({ type: 'success', message: 'Copied to clipboard!' });
    } catch {
      hapticError();
      setActionStatus({ type: 'error', message: 'Failed to copy' });
    }
    setCopying(false);
    setTimeout(() => setActionStatus(null), 3000);
  };

  const handleExportData = async () => {
    hapticLight();
    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user?.id,
        email: user?.email,
      },
      trip: {
        id: currentTrip?.id,
        name: currentTrip?.name,
      },
      checkIn: myCheckIn,
      notes: notes.slice(0, 50), // Limit to recent 50 notes
      localStorage: localStorageKeys.reduce((acc, { key }) => {
        acc[key] = localStorage.getItem(key);
        return acc;
      }, {}),
      errors: errors.slice(0, 10),
    };

    try {
      const json = JSON.stringify(exportData, null, 2);
      await navigator.clipboard.writeText(json);
      hapticSuccess();
      setActionStatus({ type: 'success', message: 'Data exported to clipboard!' });
    } catch {
      hapticError();
      setActionStatus({ type: 'error', message: 'Failed to export' });
    }
    setTimeout(() => setActionStatus(null), 3000);
  };

  const handleForceCheckInSelect = (e) => {
    const casinoId = e.target.value;
    if (!casinoId) return;
    const casino = vegasCasinos.find(c => c.id === casinoId);
    if (casino && onForceCheckIn) {
      hapticSuccess();
      onForceCheckIn(casino);
      setActionStatus({ type: 'success', message: `Checked in to ${casino.name}!` });
      setTimeout(() => setActionStatus(null), 3000);
    }
    e.target.value = '';
  };

  const handleBadgeUnlock = () => {
    if (!selectedBadgeId) return;
    const badge = allBadges.find(b => b.id === selectedBadgeId);
    if (badge && onPreviewBadge) {
      hapticSuccess();
      onPreviewBadge(badge.tier); // Trigger the tier-based preview
      setSelectedBadgeId('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center">
      <div className="w-full max-w-lg max-h-[85vh] bg-[#161616] rounded-t-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#333]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
            <h2 className="text-white font-bold">Developer Tools</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#333] rounded-full">
            <X size={20} className="text-[#888]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Status Banner */}
          {actionStatus && (
            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              actionStatus.type === 'success' ? 'bg-emerald-900/30 text-emerald-400' :
              actionStatus.type === 'error' ? 'bg-red-900/30 text-red-400' :
              'bg-[#333] text-[#aaa]'
            }`}>
              {actionStatus.type === 'success' && <CheckCircle2 size={16} />}
              {actionStatus.type === 'error' && <AlertTriangle size={16} />}
              {actionStatus.type === 'loading' && <RefreshCw size={16} className="animate-spin" />}
              <span className="text-sm">{actionStatus.message}</span>
            </div>
          )}

          {/* App State */}
          <div className="bg-[#0d0d0d] rounded-lg p-3">
            <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">App State</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-[#666]">Connection</div>
              <div className={`flex items-center gap-1 ${connectionStatus.includes('connected') ? 'text-emerald-400' : 'text-red-400'}`}>
                {connectionStatus.includes('connected') ? <Wifi size={14} /> : <WifiOff size={14} />}
                {connectionStatus}
              </div>

              <div className="text-[#666]">User</div>
              <div className="text-white truncate">{user?.email || 'Not logged in'}</div>

              <div className="text-[#666]">Trip</div>
              <div className="text-white truncate">{currentTrip?.name || 'None'}</div>

              <div className="text-[#666]">Checked In</div>
              <div className="text-white">{myCheckIn?.casino_name || 'No'}</div>

              <div className="text-[#666]">Notes</div>
              <div className="text-white">{notesCount || 0}</div>

              <div className="text-[#666]">Platform</div>
              <div className="text-white">{window.Capacitor?.getPlatform?.() || 'web'}</div>

              <div className="text-[#666]">Errors</div>
              <div className={errors.length > 0 ? 'text-red-400' : 'text-emerald-400'}>
                {errors.length} captured
              </div>
            </div>
          </div>

          {/* Error Log */}
          <div className="bg-[#0d0d0d] rounded-lg p-3">
            <button
              onClick={() => setShowErrors(!showErrors)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <p className="text-purple-400 text-xs font-bold uppercase tracking-wider">Error Log</p>
                {errors.length > 0 && (
                  <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">{errors.length}</span>
                )}
              </div>
              {showErrors ? <ChevronUp size={16} className="text-[#666]" /> : <ChevronDown size={16} className="text-[#666]" />}
            </button>

            {showErrors && (
              <div className="mt-3 space-y-2">
                {errors.length === 0 ? (
                  <p className="text-emerald-400 text-sm">No errors captured</p>
                ) : (
                  <>
                    <button
                      onClick={() => { clearErrorLog(); hapticLight(); }}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Clear All
                    </button>
                    {errors.map(err => (
                      <div key={err.id} className="bg-[#1a1a1a] p-2 rounded text-xs">
                        <div className="flex justify-between text-[#666] mb-1">
                          <span>{err.source}</span>
                          <span>{err.time}</span>
                        </div>
                        <p className="text-red-400 break-words">{err.message}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-[#0d0d0d] rounded-lg p-3">
            <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">Quick Fixes</p>
            <div className="space-y-2">
              <ActionButton
                icon={RefreshCw}
                label="Force Refresh Data"
                infoTitle="When to use"
                info="Use when spots aren't showing up for trip members, notes seem outdated, or data looks wrong. This re-fetches all data from the server."
                onClick={handleForceRefresh}
                variant="success"
              />

              <ActionButton
                icon={LogOut}
                label="Refresh Auth Session"
                infoTitle="When to use"
                info="Use when you're getting auth errors, can't save notes, or the app says you're not logged in but you should be. This refreshes your login session."
                onClick={handleReauth}
              />

              <ActionButton
                icon={Trash2}
                label="Clear Cache & Reload"
                infoTitle="When to use"
                info="Nuclear option - use when the app is completely broken, showing old data that won't go away, or acting weird. This clears ALL local data and reloads fresh."
                onClick={handleClearCache}
                variant="danger"
              />

              <ActionButton
                icon={Copy}
                label={copying ? 'Copying...' : 'Copy Debug Report'}
                infoTitle="When to use"
                info="Copies a text report with your current app state, connection status, and recent errors. Text this to yourself or paste it somewhere to troubleshoot later."
                onClick={handleCopyDebugReport}
                disabled={copying}
              />
            </div>
          </div>

          {/* Demo Mode Toggle */}
          <div className="bg-[#0d0d0d] rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play size={14} className="text-purple-400" />
                <p className="text-purple-400 text-xs font-bold uppercase tracking-wider">Demo Mode</p>
              </div>
              <button
                onClick={() => { onToggleDemoMode?.(); hapticLight(); }}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  demoModeEnabled ? 'bg-purple-600' : 'bg-[#333]'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  demoModeEnabled ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <p className="text-[#666] text-xs mt-2">
              {demoModeEnabled
                ? 'Demo mode ON - showing sample data for demonstrations'
                : 'Show fake data when demoing the app to others'}
            </p>
          </div>

          {/* Geo Simulator */}
          <div className="bg-[#0d0d0d] rounded-lg p-3">
            <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">Geolocation Simulator</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'near-casino', label: 'Near Bellagio' },
                { value: 'not-near', label: 'Not Near Casino' },
                { value: 'error', label: 'GPS Error' },
                { value: null, label: 'Real Location' },
              ].map(opt => (
                <button
                  key={opt.value || 'real'}
                  onClick={() => { setDebugGeoMode(opt.value); hapticLight(); }}
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    debugGeoMode === opt.value ? 'bg-purple-600 text-white' : 'bg-[#1a1a1a] text-[#aaa] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Force Check-in */}
          <div className="bg-[#0d0d0d] rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={14} className="text-purple-400" />
              <p className="text-purple-400 text-xs font-bold uppercase tracking-wider">Force Check-in</p>
            </div>
            <p className="text-[#666] text-xs mb-2">Bypass geolocation and check in directly</p>
            <select
              onChange={handleForceCheckInSelect}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-sm text-[#aaa] focus:outline-none focus:border-purple-500"
            >
              <option value="">Select a casino...</option>
              {vegasCasinos.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* LocalStorage Viewer */}
          <div className="bg-[#0d0d0d] rounded-lg p-3">
            <button
              onClick={() => { setShowLocalStorage(!showLocalStorage); refreshLocalStorage(); }}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <Key size={14} className="text-purple-400" />
                <p className="text-purple-400 text-xs font-bold uppercase tracking-wider">LocalStorage</p>
                <span className="text-[#666] text-xs">({localStorageKeys.length} keys)</span>
              </div>
              {showLocalStorage ? <ChevronUp size={16} className="text-[#666]" /> : <ChevronDown size={16} className="text-[#666]" />}
            </button>

            {showLocalStorage && (
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {localStorageKeys.length === 0 ? (
                  <p className="text-[#666] text-sm">No localStorage data</p>
                ) : (
                  localStorageKeys.map(({ key, value, size }) => (
                    <div key={key} className="bg-[#1a1a1a] p-2 rounded text-xs flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[#aaa] font-medium truncate">{key}</p>
                        <p className="text-[#666] truncate">{value}</p>
                        <p className="text-[#555] text-[10px]">{size} chars</p>
                      </div>
                      <button
                        onClick={() => deleteLocalStorageKey(key)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Network Request Log */}
          <div className="bg-[#0d0d0d] rounded-lg p-3">
            <button
              onClick={() => setShowNetworkLog(!showNetworkLog)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-purple-400" />
                <p className="text-purple-400 text-xs font-bold uppercase tracking-wider">Network Log</p>
                <span className="text-[#666] text-xs">({networkLog.length} requests)</span>
              </div>
              {showNetworkLog ? <ChevronUp size={16} className="text-[#666]" /> : <ChevronDown size={16} className="text-[#666]" />}
            </button>

            {showNetworkLog && (
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {networkLog.length === 0 ? (
                  <p className="text-[#666] text-sm">No network requests logged yet</p>
                ) : (
                  <>
                    <button
                      onClick={() => { onClearNetworkLog?.(); hapticLight(); }}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Clear All
                    </button>
                    {networkLog.map(entry => (
                      <div key={entry.id} className="bg-[#1a1a1a] p-2 rounded text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            entry.status === 'success' ? 'bg-emerald-900/50 text-emerald-400' :
                            entry.status === 'error' ? 'bg-red-900/50 text-red-400' :
                            'bg-[#333] text-[#aaa]'
                          }`}>
                            {entry.status?.toUpperCase() || 'PENDING'}
                          </span>
                          <span className="text-[#555]">{entry.time}</span>
                        </div>
                        <p className="text-[#aaa] font-medium truncate">{entry.table || entry.operation}</p>
                        {entry.error && <p className="text-red-400 truncate mt-1">{entry.error}</p>}
                        {entry.duration && <p className="text-[#555] text-[10px]">{entry.duration}ms</p>}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Badge Unlock Test */}
          <div className="bg-[#0d0d0d] rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3">
              <Award size={14} className="text-purple-400" />
              <p className="text-purple-400 text-xs font-bold uppercase tracking-wider">Badge Unlock Test</p>
            </div>
            <p className="text-[#666] text-xs mb-2">Preview unlock celebration for any badge</p>
            <div className="flex gap-2">
              <select
                value={selectedBadgeId}
                onChange={(e) => setSelectedBadgeId(e.target.value)}
                className="flex-1 bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-sm text-[#aaa] focus:outline-none focus:border-purple-500"
              >
                <option value="">Select a badge...</option>
                {allBadges.map(b => (
                  <option key={b.id} value={b.id}>[{b.domainLabel}] {b.name} ({b.tier})</option>
                ))}
              </select>
              <button
                onClick={handleBadgeUnlock}
                disabled={!selectedBadgeId}
                className="px-3 py-2 bg-purple-600 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500"
              >
                Test
              </button>
            </div>
          </div>

          {/* Data Export */}
          <div className="bg-[#0d0d0d] rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3">
              <Download size={14} className="text-purple-400" />
              <p className="text-purple-400 text-xs font-bold uppercase tracking-wider">Data Export</p>
            </div>
            <p className="text-[#666] text-xs mb-2">Export all app data as JSON for debugging</p>
            <button
              onClick={handleExportData}
              className="w-full px-3 py-2 bg-[#1a1a1a] text-[#aaa] hover:text-white hover:bg-emerald-900/30 rounded text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Download size={14} />
              Export to Clipboard
            </button>
          </div>

          {/* Badge Preview */}
          <div className="bg-[#0d0d0d] rounded-lg p-3">
            <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">Badge Celebration Preview</p>

            {/* By Tier */}
            <p className="text-[#666] text-xs mb-2">By Tier</p>
            <div className="grid grid-cols-5 gap-1 mb-3">
              {[
                { key: 'common', label: 'Com', color: 'bg-gray-700' },
                { key: 'uncommon', label: 'Unc', color: 'bg-green-900' },
                { key: 'rare', label: 'Rare', color: 'bg-blue-900' },
                { key: 'epic', label: 'Epic', color: 'bg-purple-900' },
                { key: 'legendary', label: 'Leg', color: 'bg-amber-900' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => {
                    if (onPreviewBadge) onPreviewBadge(opt.key);
                    hapticLight();
                  }}
                  className={`px-2 py-1.5 rounded text-xs ${opt.color} text-white hover:opacity-80 transition-opacity`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* By Domain */}
            <p className="text-[#666] text-xs mb-2">By Domain</p>
            <div className="grid grid-cols-4 gap-1 mb-3">
              {[
                { key: 'slot', label: 'Slots', color: 'bg-amber-800' },
                { key: 'vp', label: 'VP', color: 'bg-green-800' },
                { key: 'bloody', label: 'Bloody', color: 'bg-red-800' },
                { key: 'trip', label: 'Trip', color: 'bg-gradient-to-r from-pink-600 via-yellow-500 to-green-500' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => {
                    if (onPreviewBadge) onPreviewBadge(opt.key);
                    hapticLight();
                  }}
                  className={`px-2 py-1.5 rounded text-xs ${opt.color} text-white hover:opacity-80 transition-opacity`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Special Effects */}
            <p className="text-[#666] text-xs mb-2">Special Effects</p>
            <div className="grid grid-cols-1 gap-1">
              <button
                onClick={() => {
                  if (onPreviewBadge) onPreviewBadge('spicy');
                  hapticLight();
                }}
                className="px-2 py-1.5 rounded text-xs bg-gradient-to-r from-orange-600 to-red-600 text-white hover:opacity-80 transition-opacity flex items-center justify-center gap-1"
              >
                🔥 Spicy (Fire Effect)
              </button>
            </div>
          </div>

          {/* Other Tools */}
          <div className="bg-[#0d0d0d] rounded-lg p-3">
            <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">Other Tools</p>
            <button
              onClick={() => { onShowStrategyValidator(); onClose(); }}
              className="w-full text-left px-3 py-2 rounded text-sm bg-[#1a1a1a] text-[#aaa] hover:text-white hover:bg-emerald-900/30"
            >
              Run Strategy Validator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

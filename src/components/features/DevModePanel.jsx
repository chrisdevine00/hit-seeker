import React, { useState, useEffect } from 'react';
import { X, Info, RefreshCw, LogOut, Trash2, Copy, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Wifi, WifiOff } from 'lucide-react';
import { subscribeToErrors, clearErrorLog, getErrorLog } from '../../lib/errorCapture';
import { supabase } from '../../lib/supabase';
import { hapticLight, hapticSuccess, hapticError } from '../../lib/haptics';

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

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex-1 flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Icon size={16} />
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
  onForceRefresh,
  debugGeoMode,
  setDebugGeoMode,
  onShowStrategyValidator,
  onPreviewBadge
}) {
  const [errors, setErrors] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const [copying, setCopying] = useState(false);
  const [actionStatus, setActionStatus] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  // Subscribe to error log
  useEffect(() => {
    return subscribeToErrors(setErrors);
  }, []);

  // Check Supabase connection
  useEffect(() => {
    if (!isOpen) return;
    checkConnection();
  }, [isOpen]);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      const start = Date.now();
      const { error } = await supabase.from('profiles').select('id').limit(1).single();
      const latency = Date.now() - start;
      if (error && error.code !== 'PGRST116') throw error;
      setConnectionStatus(`connected (${latency}ms)`);
    } catch (e) {
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
    } catch (e) {
      hapticError();
      setActionStatus({ type: 'error', message: 'Failed to copy' });
    }
    setCopying(false);
    setTimeout(() => setActionStatus(null), 3000);
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
            <div className="grid grid-cols-4 gap-1">
              {[
                { key: 'slot', label: 'Slots', color: 'bg-amber-800' },
                { key: 'vp', label: 'VP', color: 'bg-sky-800' },
                { key: 'bloody', label: 'Bloody', color: 'bg-red-800' },
                { key: 'trip', label: 'Trip', color: 'bg-green-800' },
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

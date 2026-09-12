import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  AlertTriangle,
  Lock,
  RefreshCw,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  Terminal,
  Activity,
  UserCheck,
  Ban,
  Radio,
  Cpu,
} from 'lucide-react';
import { api } from '../../lib/api';
import { ActivityLog, SecurityStats } from '../../types';

export const AdminSecurityActivityView: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      const [fetchedLogs, fetchedStats] = await Promise.all([
        api.getSecurityLogs(150),
        api.getSecurityStats(),
      ]);
      setLogs(fetchedLogs);
      setStats(fetchedStats);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to fetch security logs.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
    // Auto-poll security stats every 30 seconds
    const interval = setInterval(fetchSecurityData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateProbe = async (type: 'sql_injection_probe' | 'path_traversal_probe' | 'scanner_probe') => {
    try {
      setIsSimulating(true);
      setStatusMessage(null);
      const res = await api.simulateSecurityProbe(type);
      setStatusMessage({
        type: 'success',
        text: `Intrusion Sentinel Active: ${res.message}`,
      });
      await fetchSecurityData();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to execute security probe test.',
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear audit activity logs? This cannot be undone.')) {
      return;
    }
    try {
      setLoading(true);
      await api.clearSecurityLogs();
      setStatusMessage({ type: 'success', text: 'Activity and security logs cleared.' });
      await fetchSecurityData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to clear logs.' });
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filterType === 'attacks' && !(log.type === 'hack_attempt' || log.type === 'security_alert')) {
      return false;
    }
    if (filterType === 'logins' && !(log.type === 'login_success' || log.type === 'login_failed')) {
      return false;
    }
    if (filterType === 'admin' && !(log.type === 'admin_action' || log.type === 'data_update')) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = log.title?.toLowerCase().includes(q);
      const matchDesc = log.description?.toLowerCase().includes(q);
      const matchIp = log.ip?.toLowerCase().includes(q);
      const matchPath = log.path?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchIp || matchPath;
    }

    return true;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'danger':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950/80 text-red-400 border border-red-800/60">
            <ShieldAlert className="w-3 h-3" />
            Threat Blocked
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/60">
            <AlertTriangle className="w-3 h-3" />
            Warning
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
            <CheckCircle2 className="w-3 h-3" />
            Authorized
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-400 border border-blue-800/60">
            <Activity className="w-3 h-3" />
            System Audit
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white font-['Outfit']">
              Activity &amp; Cybersecurity Sentinel
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Defense Active
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time audit log tracking login timestamps, administrator operations, and automated hack attempt interceptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSecurityData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-orange-400' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleClearLogs}
            disabled={loading || logs.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-red-950/60 hover:text-red-300 text-zinc-400 text-xs font-semibold border border-zinc-700 hover:border-red-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : 'bg-red-950/40 border-red-800 text-red-300'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-zinc-400 hover:text-white text-xs font-bold ml-4"
          >
            &times;
          </button>
        </div>
      )}

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Threat Level */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Threat Level</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-xl font-bold font-['Outfit'] uppercase ${
                stats?.threatLevel === 'high'
                  ? 'text-red-400'
                  : stats?.threatLevel === 'elevated'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {stats?.threatLevel || 'Normal'}
            </span>
            <span className="text-[11px] text-zinc-400">Zero-Trust Active</span>
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-orange-400" />
            <span>18 active WAF &amp; Rate-Limiting rules</span>
          </div>
        </div>

        {/* Last Login */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Last Authorized Login</span>
            <UserCheck className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-sm font-bold text-white truncate font-['Outfit']">
            {stats?.lastLoginTime ? new Date(stats.lastLoginTime).toLocaleString('en-KE', { dateStyle: 'short', timeStyle: 'short' }) : 'None yet'}
          </div>
          <div className="text-[11px] text-zinc-400 truncate flex items-center gap-1">
            <Radio className="w-3 h-3 text-zinc-500" />
            <span>IP: {stats?.lastLoginIp || '127.0.0.1'}</span>
          </div>
        </div>

        {/* Blocked Attacks */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Intercepted Hack Probes</span>
            <Ban className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 font-['Outfit']">
            {stats?.blockedAttacksCount ?? 0}
          </div>
          <div className="text-[11px] text-zinc-400">
            Automated firewall drops &amp; signature blocks
          </div>
        </div>

        {/* Failed Logins */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Failed Login Attempts</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-['Outfit']">
            {stats?.failedLoginsCount ?? 0}
          </div>
          <div className="text-[11px] text-zinc-400">
            5-attempt brute force IP lockout enforced
          </div>
        </div>
      </div>

      {/* Interactive Intrusion Diagnostic Simulator */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-900/90 border border-zinc-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold text-white">
                Intrusion Detection Diagnostic &amp; Security Validation
              </h3>
            </div>
            <p className="text-xs text-zinc-400">
              Trigger simulated attack payloads to verify that the firewall and audit sentinel immediately detect and log hack attempts in real-time.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            onClick={() => handleSimulateProbe('sql_injection_probe')}
            disabled={isSimulating}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>Test SQL Injection Probe</span>
          </button>
          <button
            onClick={() => handleSimulateProbe('path_traversal_probe')}
            disabled={isSimulating}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Test Path Traversal Probe</span>
          </button>
          <button
            onClick={() => handleSimulateProbe('scanner_probe')}
            disabled={isSimulating}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
            <span>Test Exploit Bot Scanner</span>
          </button>
        </div>
      </div>

      {/* Activity Log Controls & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-orange-600 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Logs ({logs.length})
          </button>
          <button
            onClick={() => setFilterType('attacks')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'attacks'
                ? 'bg-red-600 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-red-400'
            }`}
          >
            Threats &amp; Hack Attempts ({logs.filter((l) => l.type === 'hack_attempt' || l.type === 'security_alert').length})
          </button>
          <button
            onClick={() => setFilterType('logins')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'logins'
                ? 'bg-orange-600 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Logins ({logs.filter((l) => l.type === 'login_success' || l.type === 'login_failed').length})
          </button>
          <button
            onClick={() => setFilterType('admin')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filterType === 'admin'
                ? 'bg-orange-600 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Admin Changes
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search IP, endpoint, signature..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Activity Logs Timeline / Table */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Security Audit Stream ({filteredLogs.length} events)
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">
            Encrypted Audit Protocol
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 space-y-2">
            <ShieldCheck className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-sm font-medium text-zinc-400">No activity events found</p>
            <p className="text-xs">Any logins or blocked intrusions will appear in this log stream.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/80">
            {filteredLogs.map((log) => {
              const eventDate = new Date(log.timestamp);
              const formattedTime = eventDate.toLocaleTimeString('en-KE', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });
              const formattedDate = eventDate.toLocaleDateString('en-KE', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={log.id}
                  className={`p-4 hover:bg-zinc-800/40 transition-colors space-y-2 ${
                    log.severity === 'danger' ? 'bg-red-950/15' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {getSeverityBadge(log.severity)}
                      <span className="text-xs font-bold text-white">
                        {log.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        {formattedDate} at {formattedTime}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {log.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-400 font-mono pt-1">
                    <div className="flex items-center gap-1 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800">
                      <span className="text-zinc-500">IP:</span>
                      <span className="text-zinc-200 font-semibold">{log.ip}</span>
                    </div>

                    {log.path && (
                      <div className="flex items-center gap-1 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800 truncate max-w-xs sm:max-w-md">
                        <span className="text-zinc-500">URI:</span>
                        <span className="text-zinc-300 truncate">{log.path}</span>
                      </div>
                    )}

                    {log.userAgent && (
                      <div className="hidden md:flex items-center gap-1 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800 truncate max-w-sm">
                        <span className="text-zinc-500">Agent:</span>
                        <span className="text-zinc-400 truncate">{log.userAgent}</span>
                      </div>
                    )}

                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="text-[10px] text-zinc-400">
                        {log.metadata.vector && (
                          <span className="text-red-400 font-semibold mr-2">
                            Vector: {log.metadata.vector}
                          </span>
                        )}
                        {log.metadata.blockedRule && (
                          <span className="text-amber-400 font-semibold">
                            Rule: {log.metadata.blockedRule}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

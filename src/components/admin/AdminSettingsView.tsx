import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import {
  User,
  Lock,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertCircle,
  Shield,
  Loader2,
  HardDrive,
} from 'lucide-react';

interface AdminSettingsViewProps {
  onRefreshAll: () => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ onRefreshAll }) => {
  const { admin, updateUser } = useAuth();
  const [name, setName] = useState(admin?.name || '');
  const [email, setEmail] = useState(admin?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setFeedback(null);

    try {
      const res = await api.updateProfile({ name, email });
      if (res.user) {
        updateUser(res.user);
        setFeedback({ type: 'success', message: 'Admin profile updated successfully!' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update profile.' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setFeedback({ type: 'error', message: 'New password must be at least 8 characters long.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await api.changePassword({ currentPassword, newPassword });
      setFeedback({ type: 'success', message: res.message || 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to change password.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleExportBackup = async () => {
    setIsExporting(true);
    setFeedback(null);
    try {
      const data = await api.exportBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `josam-technologies-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setFeedback({ type: 'success', message: 'Backup file exported and downloaded successfully!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to export backup.' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const res = await api.restoreBackup(json);
        setFeedback({ type: 'success', message: res.message });
        onRefreshAll();
      } catch (err: any) {
        setFeedback({ type: 'error', message: 'Invalid backup file format.' });
      }
    };
    reader.readAsText(file);
  };

  const handleResetSeed = async () => {
    if (!window.confirm('Reset all website content back to original Josam Technologies showcase seed?')) return;
    setIsResetting(true);
    try {
      const res = await api.resetSeed();
      setFeedback({ type: 'success', message: res.message });
      onRefreshAll();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to reset seed.' });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-stone-900 dark:text-white">
          System Administration &amp; Backup
        </h1>
        <p className="text-xs text-stone-500 dark:text-zinc-400">
          Manage administrator credentials, export JSON database snapshots, and maintain system integrity.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}
        >
          {feedback.type === 'success' ? <Check className="w-4 h-4 text-emerald-500 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Admin Profile */}
      <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
        <h3 className="text-sm font-bold text-stone-900 dark:text-white font-['Outfit'] flex items-center gap-2 border-b border-stone-200 dark:border-zinc-800 pb-2">
          <User className="w-4 h-4 text-orange-500" />
          <span>Admin Profile</span>
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-sm transition-colors"
            >
              {isUpdatingProfile ? 'Saving...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
        <h3 className="text-sm font-bold text-stone-900 dark:text-white font-['Outfit'] flex items-center gap-2 border-b border-stone-200 dark:border-zinc-800 pb-2">
          <Lock className="w-4 h-4 text-orange-500" />
          <span>Change Password</span>
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-300 dark:border-zinc-700 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold shadow-sm transition-colors"
            >
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Database Backup & Restore */}
      <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
        <h3 className="text-sm font-bold text-stone-900 dark:text-white font-['Outfit'] flex items-center gap-2 border-b border-stone-200 dark:border-zinc-800 pb-2">
          <HardDrive className="w-4 h-4 text-orange-500" />
          <span>Data Snapshot &amp; Migration</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={handleExportBackup}
            className="p-4 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 hover:border-orange-500 transition-colors flex flex-col items-center text-center space-y-2 group"
          >
            <Download className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-stone-900 dark:text-white">Export Database JSON</span>
            <span className="text-[10px] text-stone-500">Download full site data snapshot</span>
          </button>

          <label className="p-4 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 hover:border-amber-500 transition-colors flex flex-col items-center text-center space-y-2 cursor-pointer group">
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            <Upload className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-stone-900 dark:text-white">Restore JSON Backup</span>
            <span className="text-[10px] text-stone-500">Upload JSON snapshot</span>
          </label>

          <button
            onClick={handleResetSeed}
            disabled={isResetting}
            className="p-4 rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 hover:border-red-500 transition-colors flex flex-col items-center text-center space-y-2 group"
          >
            <RotateCcw className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-stone-900 dark:text-white">Reset Demo Showcase</span>
            <span className="text-[10px] text-stone-500">Restore factory seed records</span>
          </button>
        </div>
      </div>

    </div>
  );
};

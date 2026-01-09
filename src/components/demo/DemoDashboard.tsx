'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  User,
  TestTube,
  FileText,
  Plus,
  Eye,
  ClipboardEdit,
  LogOut,
  Crown
} from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface DemoUsage {
  canCreatePatient: boolean;
  canCreateTest: boolean;
  patientsUsed: number;
  patientsMax: number;
  testsUsed: number;
  testsMax: number;
  testsRemaining: number;
  patientId: string | null;
}

interface DemoDashboardProps {
  usage: DemoUsage;
}

export default function DemoDashboard({ usage }: DemoDashboardProps) {
  const t = useTranslations('Demo.dashboard');
  const locale = useLocale() as Locale;
  const { data: session } = useSession();

  const hasPatient = usage.patientsUsed > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                LapManagerPro
              </span>
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                Demo
              </span>
            </Link>

            <div className="flex items-center gap-4">
              {session?.user && (
                <div className="flex items-center gap-3">
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:block">
                    {session.user.name}
                  </span>
                </div>
              )}
              <button
                onClick={() => signOut({ callbackUrl: `/${locale}` })}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {t('title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Usage stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 gap-4 mb-8"
        >
          {/* Patients usage */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">
                  {t('usage.patients')}
                </span>
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {usage.patientsUsed}/{usage.patientsMax}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                style={{ width: `${(usage.patientsUsed / usage.patientsMax) * 100}%` }}
              />
            </div>
          </div>

          {/* Tests usage */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <TestTube className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">
                  {t('usage.tests')}
                </span>
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {usage.testsUsed}/{usage.testsMax}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                style={{ width: `${(usage.testsUsed / usage.testsMax) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {usage.testsRemaining} {t('usage.remaining')}
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        {!hasPatient ? (
          /* Empty state - no patient yet */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-200 dark:border-slate-700 text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {t('emptyState.title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              {t('emptyState.message')}
            </p>
            <Link
              href={`/${locale}/demo/patient/new`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-5 h-5" />
              {t('emptyState.cta')}
            </Link>
          </motion.div>
        ) : (
          /* Has patient - show action cards */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* View Patient */}
            <Link
              href={`/${locale}/demo/patient/${usage.patientId}`}
              className="group bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all hover:shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                {t('actions.viewPatient')}
              </h3>
              <p className="text-sm text-slate-500">View patient details</p>
            </Link>

            {/* Add Tests */}
            {usage.canCreateTest ? (
              <Link
                href={`/${locale}/demo/tests/select`}
                className="group bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TestTube className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {t('actions.addTests')}
                </h3>
                <p className="text-sm text-slate-500">{usage.testsRemaining} slots remaining</p>
              </Link>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 opacity-60">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                  <TestTube className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t('limits.testLimitReached')}
                </h3>
                <p className="text-sm text-slate-500">{t('limits.testLimitMessage')}</p>
              </div>
            )}

            {/* Enter Results */}
            <Link
              href={`/${locale}/demo/patient/${usage.patientId}`}
              className="group bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-green-500 transition-all hover:shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ClipboardEdit className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                {t('actions.enterResults')}
              </h3>
              <p className="text-sm text-slate-500">Input test results</p>
            </Link>

            {/* Generate Report */}
            <Link
              href={`/${locale}/demo/reports`}
              className="group bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-orange-500 transition-all hover:shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                {t('actions.generateReport')}
              </h3>
              <p className="text-sm text-slate-500">Create PDF report</p>
            </Link>
          </motion.div>
        )}

        {/* Upgrade CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 sm:p-8 text-white"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Want more?</h3>
                <p className="text-blue-100 text-sm">Upgrade to unlock unlimited patients and tests</p>
              </div>
            </div>
            <Link
              href={`/${locale}#pricing`}
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              {t('limits.upgradeNow')}
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

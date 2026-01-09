'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TestTube,
  Plus,
  ClipboardEdit,
  FileText,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { DemoUsage } from '@/lib/demo-limits';

interface DemoTest {
  id: string;
  test_type: string;
  test_code: string | null;
  status: 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';
  results: any;
  created_at: Date;
}

interface DemoPatient {
  id: string;
  name: string;
  gender: string | null;
  age_value: number | null;
  age_unit: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  created_at: Date;
  tests: DemoTest[];
}

interface PatientDetailsClientProps {
  patient: DemoPatient;
  usage: DemoUsage;
  locale: Locale;
}

export default function PatientDetailsClient({ patient, usage, locale }: PatientDetailsClientProps) {
  const t = useTranslations('Demo.patient');
  const router = useRouter();
  const [savingTestId, setSavingTestId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, string>>({});

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'InProgress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Cancelled':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'InProgress':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'Cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const handleSaveResult = async (testId: string, value: string) => {
    setSavingTestId(testId);
    try {
      const response = await fetch(`/api/demo/tests/${testId}/results`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          results: { value },
          status: 'Completed',
        }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to save result:', error);
    } finally {
      setSavingTestId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href={`/${locale}/demo`}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('back')}</span>
            </Link>
            <div className="flex items-center gap-3">
              {usage.canCreateTest && (
                <Link
                  href={`/${locale}/demo/tests/select`}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-600 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  {t('view.addTests')}
                </Link>
              )}
              <Link
                href={`/${locale}/demo/reports`}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-cyan-600 transition-all"
              >
                <FileText className="w-4 h-4" />
                {t('view.generateReport')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {patient.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                {patient.gender && (
                  <span>{patient.gender}</span>
                )}
                {patient.age_value && (
                  <span>
                    {patient.age_value} {patient.age_unit}
                  </span>
                )}
                {patient.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {patient.phone}
                  </span>
                )}
                {patient.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {patient.email}
                  </span>
                )}
              </div>
              {patient.address && (
                <p className="flex items-center gap-1 mt-2 text-sm text-slate-500">
                  <MapPin className="w-4 h-4" />
                  {patient.address}
                </p>
              )}
              <p className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                <Calendar className="w-3 h-3" />
                {t('view.createdAt')}: {new Date(patient.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <TestTube className="w-5 h-5 text-purple-500" />
              {t('view.tests')} ({patient.tests.length}/{usage.testsMax})
            </h2>
          </div>

          {patient.tests.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                <TestTube className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                {t('view.noTests')}
              </h3>
              <p className="text-slate-500 mb-6">
                {t('view.noTestsMessage')}
              </p>
              {usage.canCreateTest && (
                <Link
                  href={`/${locale}/demo/tests/select`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-600 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  {t('view.addFirstTest')}
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {patient.tests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-slate-900 dark:text-white">
                          {test.test_type}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(test.status)}
                            {test.status}
                          </span>
                        </span>
                      </div>
                      {test.test_code && (
                        <p className="text-sm text-slate-500">{t('view.code')}: {test.test_code}</p>
                      )}
                    </div>

                    {test.status !== 'Completed' && (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={t('view.enterResult')}
                          value={testResults[test.id] || ''}
                          onChange={(e) => setTestResults(prev => ({ ...prev, [test.id]: e.target.value }))}
                          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleSaveResult(test.id, testResults[test.id] || '')}
                          disabled={savingTestId === test.id || !testResults[test.id]}
                          className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {savingTestId === test.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ClipboardEdit className="w-4 h-4" />
                          )}
                          {t('view.save')}
                        </button>
                      </div>
                    )}

                    {test.status === 'Completed' && test.results && (
                      <div className="text-right">
                        <span className="text-sm text-slate-500">{t('view.result')}:</span>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {typeof test.results === 'object' && 'value' in test.results
                            ? String(test.results.value)
                            : JSON.stringify(test.results)}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

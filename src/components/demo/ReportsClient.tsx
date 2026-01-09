'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  FileText,
  Download,
  Printer,
  Eye,
  CheckCircle2,
  Clock,
  TestTube,
} from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface DemoTest {
  id: string;
  test_type: string;
  test_code: string | null;
  status: 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';
  results: Record<string, unknown> | null;
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
  created_at: Date;
  tests: DemoTest[];
}

interface ReportsClientProps {
  patient: DemoPatient;
  locale: Locale;
}

export default function ReportsClient({ patient, locale }: ReportsClientProps) {
  const t = useTranslations('Demo.reports');
  const reportRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  const completedTests = patient.tests.filter(test => test.status === 'Completed');
  const pendingTests = patient.tests.filter(test => test.status !== 'Completed');

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    // For demo purposes, we'll trigger print which can save as PDF
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href={`/${locale}/demo/patient/${patient.id}`}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('back')}</span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? t('hidePreview') : t('preview')}
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Printer className="w-4 h-4" />
                {t('print')}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-lg text-sm font-medium hover:from-orange-700 hover:to-red-600 transition-all"
              >
                <Download className="w-4 h-4" />
                {t('download')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 print:hidden"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-400 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('title')}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 gap-4 mb-8 print:hidden"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">{t('completedTests')}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {completedTests.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">{t('pendingTests')}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {pendingTests.length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {completedTests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center print:hidden"
          >
            <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-4">
              <TestTube className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              {t('noCompletedTests')}
            </h3>
            <p className="text-slate-500 mb-6">
              {t('noCompletedTestsMessage')}
            </p>
            <Link
              href={`/${locale}/demo/patient/${patient.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-600 transition-all"
            >
              {t('enterResults')}
            </Link>
          </motion.div>
        ) : (
          /* Report Preview */
          <motion.div
            ref={reportRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-white rounded-2xl border border-slate-200 shadow-lg print:shadow-none print:border-0 print:rounded-none ${showPreview ? 'block' : 'hidden print:block'
              }`}
          >
            {/* Report Header */}
            <div className="border-b border-slate-200 p-8 print:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-blue-600">LapManagerPro</h2>
                  <p className="text-sm text-slate-500">Laboratory Report</p>
                </div>
                <div className="text-right text-sm text-slate-600">
                  <p>Report Date: {new Date().toLocaleDateString()}</p>
                  <p>Report ID: DEMO-{patient.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Patient Info */}
            <div className="border-b border-slate-200 p-8 print:p-6 bg-slate-50 print:bg-gray-50">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                Patient Information
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Name:</span>
                  <p className="font-medium text-slate-900">{patient.name}</p>
                </div>
                {patient.gender && (
                  <div>
                    <span className="text-slate-500">Gender:</span>
                    <p className="font-medium text-slate-900">{patient.gender}</p>
                  </div>
                )}
                {patient.age_value && (
                  <div>
                    <span className="text-slate-500">Age:</span>
                    <p className="font-medium text-slate-900">
                      {patient.age_value} {patient.age_unit}
                    </p>
                  </div>
                )}
                {patient.phone && (
                  <div>
                    <span className="text-slate-500">Phone:</span>
                    <p className="font-medium text-slate-900">{patient.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Test Results */}
            <div className="p-8 print:p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">
                Test Results
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Test Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Code</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Result</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {completedTests.map((test) => (
                    <tr key={test.id} className="border-b border-slate-100">
                      <td className="py-3 px-4 text-slate-900">{test.test_type}</td>
                      <td className="py-3 px-4 text-slate-600">{test.test_code || '-'}</td>
                      <td className="py-3 px-4 text-slate-900 font-medium">
                        {test.results && typeof test.results === 'object' && 'value' in test.results
                          ? String(test.results.value)
                          : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3 h-3" />
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 p-8 print:p-6 bg-slate-50 print:bg-gray-50">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <p>This is a demo report generated by LapManagerPro Demo</p>
                <p>Page 1 of 1</p>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

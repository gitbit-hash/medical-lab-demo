'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  TestTube,
  Search,
  Check,
  Plus,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { Locale } from '@/i18n/config';

// Demo test types
const DEMO_TEST_TYPES = [
  { id: 'cbc', name: 'Complete Blood Count (CBC)', code: 'CBC' },
  { id: 'bmp', name: 'Basic Metabolic Panel', code: 'BMP' },
  { id: 'lipid', name: 'Lipid Panel', code: 'LIPID' },
  { id: 'thyroid', name: 'Thyroid Function Tests', code: 'TFT' },
  { id: 'liver', name: 'Liver Function Tests', code: 'LFT' },
  { id: 'kidney', name: 'Kidney Function Tests', code: 'KFT' },
  { id: 'glucose', name: 'Fasting Blood Glucose', code: 'FBG' },
  { id: 'hba1c', name: 'HbA1c (Glycated Hemoglobin)', code: 'HBA1C' },
  { id: 'urinalysis', name: 'Urinalysis', code: 'UA' },
  { id: 'vitd', name: 'Vitamin D', code: 'VITD' },
  { id: 'iron', name: 'Iron Studies', code: 'IRON' },
  { id: 'crp', name: 'C-Reactive Protein', code: 'CRP' },
];

interface SelectTestsClientProps {
  patientId: string;
  testsRemaining: number;
  locale: Locale;
}

export default function SelectTestsClient({ patientId, testsRemaining, locale }: SelectTestsClientProps) {
  const t = useTranslations('Demo.tests');
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredTests = DEMO_TEST_TYPES.filter(
    test =>
      test.name.toLowerCase().includes(search.toLowerCase()) ||
      test.code.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTest = (testId: string) => {
    if (selectedTests.includes(testId)) {
      setSelectedTests(prev => prev.filter(id => id !== testId));
    } else if (selectedTests.length < testsRemaining) {
      setSelectedTests(prev => [...prev, testId]);
    }
  };

  const handleSubmit = async () => {
    if (selectedTests.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const testsToCreate = selectedTests.map(testId => {
        const test = DEMO_TEST_TYPES.find(t => t.id === testId);
        return {
          test_type: test?.name || testId,
          test_code: test?.code,
        };
      });

      const response = await fetch('/api/demo/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId,
          tests: testsToCreate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add tests');
      }

      // Redirect to patient page
      router.push(`/${locale}/demo/patient/${patientId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href={`/${locale}/demo/patient/${patientId}`}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('back')}</span>
            </Link>
            <div className="text-sm text-slate-500">
              {selectedTests.length} / {testsRemaining} {t('selected')}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
              <TestTube className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('select.title')}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {t('select.subtitle', { remaining: testsRemaining })}
              </p>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('select.searchPlaceholder')}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </motion.div>

        {/* Test list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid sm:grid-cols-2 gap-3 mb-8"
        >
          {filteredTests.map((test, index) => {
            const isSelected = selectedTests.includes(test.id);
            const isDisabled = !isSelected && selectedTests.length >= testsRemaining;

            return (
              <motion.button
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.03 }}
                onClick={() => !isDisabled && toggleTest(test.id)}
                disabled={isDisabled}
                className={`p-4 rounded-xl border text-left transition-all ${isSelected
                    ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500 ring-2 ring-purple-500/20'
                    : isDisabled
                      ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-medium ${isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-slate-900 dark:text-white'}`}>
                      {test.name}
                    </h3>
                    <p className="text-sm text-slate-500">{test.code}</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                        ? 'bg-purple-500 border-purple-500'
                        : 'border-slate-300 dark:border-slate-600'
                      }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Submit button */}
        {selectedTests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800"
          >
            <div className="max-w-4xl mx-auto">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('select.adding')}
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    {t('select.addTests', { count: selectedTests.length })}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

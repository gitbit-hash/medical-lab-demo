'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import type { Locale } from '@/i18n/config';

const plans = ['starter', 'professional', 'enterprise'] as const;

export default function Pricing() {
  const t = useTranslations('Landing.pricing');
  const locale = useLocale() as Locale;
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('title')}</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="text-lg text-slate-600 dark:text-slate-400">{t('subtitle')}</motion.p>
        </div>

        {/* <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="flex items-center justify-center gap-4 mb-12">
          <span className={`font-medium ${!isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{t('monthly')}</span>
          <button onClick={() => setIsYearly(!isYearly)} className={`relative w-14 h-7 rounded-full transition-colors ${isYearly ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${isYearly ? 'left-8' : 'left-1'}`} />
          </button>
          <span className={`font-medium ${isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{t('yearly')}</span>
          {isYearly && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium"><Sparkles className="w-3 h-3" />{t('save')}</span>}
        </motion.div> */}

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const isProfessional = plan === 'professional';
            const features = t.raw(`${plan}.features`) as string[];
            return (
              <motion.div key={plan} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className={`relative rounded-2xl p-8 ${isProfessional ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/25 scale-105' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
                {isProfessional && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 text-sm font-semibold rounded-full">{t(`${plan}.popular`)}</div>}
                <h3 className={`text-xl font-semibold mb-2 ${isProfessional ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{t(`${plan}.name`)}</h3>
                <p className={`text-sm mb-4 ${isProfessional ? 'text-blue-100' : 'text-slate-600 dark:text-slate-400'}`}>{t(`${plan}.description`)}</p>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${isProfessional ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{t(`${plan}.price`)}</span>
                  <span className={`text-sm ${isProfessional ? 'text-blue-100' : 'text-slate-500'}`}>{t(`${plan}.period`)}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 ${isProfessional ? 'text-blue-200' : 'text-green-500'}`} />
                      <span className={`text-sm ${isProfessional ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan === 'enterprise' ? `/${locale}#contact` : `/${locale}/signup`} className={`block w-full py-3 rounded-xl font-semibold text-center transition-all ${isProfessional ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'}`}>{t(`${plan}.cta`)}</Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import PageHeader from '@/components/PageHeader';
import SaveButton from '@/components/SaveButton';
import Toast from '@/components/Toast';
import type { PricingPackage, FaqItem } from '@/types';
import { usePreviewSync } from '@/lib/usePreviewSync';

interface PricingData {
  hero: { tag: string; title: string; titleEm: string; subtitle: string };
  packages: PricingPackage[];
  faq: FaqItem[];
}

export default function PricingPage() {
  const [data, setData] = useState<PricingData | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  usePreviewSync('pricing', data);

  useEffect(() => {
    fetch('/api/content?file=pricing.json')
      .then((r) => r.json())
      .then((res: { data: PricingData }) => setData(res.data));
  }, []);

  const save = useCallback(async () => {
    if (!data) return;
    setSaving(true);
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: 'pricing.json', content: data, section: 'Pricing' }),
    });
    const result = await res.json() as { ok?: boolean; error?: string };
    setSaving(false);
    setToast(result.ok
      ? { message: 'Pricing saved! Publishing now...', type: 'success' }
      : { message: result.error ?? 'Failed to save', type: 'error' }
    );
  }, [data]);

  function updatePackage(index: number, field: keyof PricingPackage, value: string | string[]) {
    if (!data) return;
    const updated = [...data.packages];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, packages: updated });
  }

  function updateFeature(pkgIndex: number, featIndex: number, value: string) {
    if (!data) return;
    const updated = [...data.packages];
    const features = [...updated[pkgIndex].features];
    features[featIndex] = value;
    updated[pkgIndex] = { ...updated[pkgIndex], features };
    setData({ ...data, packages: updated });
  }

  function addFeature(pkgIndex: number) {
    if (!data) return;
    const updated = [...data.packages];
    updated[pkgIndex] = { ...updated[pkgIndex], features: [...updated[pkgIndex].features, ''] };
    setData({ ...data, packages: updated });
  }

  function removeFeature(pkgIndex: number, featIndex: number) {
    if (!data) return;
    const updated = [...data.packages];
    updated[pkgIndex] = { ...updated[pkgIndex], features: updated[pkgIndex].features.filter((_, i) => i !== featIndex) };
    setData({ ...data, packages: updated });
  }

  function updateFaq(index: number, field: keyof FaqItem, value: string) {
    if (!data) return;
    const updated = [...data.faq];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, faq: updated });
  }

  function addFaq() {
    if (!data) return;
    setData({ ...data, faq: [...data.faq, { question: '', answer: '' }] });
  }

  function removeFaq(index: number) {
    if (!data) return;
    setData({ ...data, faq: data.faq.filter((_, i) => i !== index) });
  }

  if (!data) return <div className="text-muted text-sm">Loading...</div>;

  return (
    <div>
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-border">
        <PageHeader title="Pricing" description="Edit packages, prices, features and FAQ" />
        <SaveButton saving={saving} onClick={save} />
      </div>

      <div className="space-y-8">

        {/* Hero */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Hero</h2>
          <div className="space-y-3">
            <div><label>Tag</label><input value={data.hero.tag} onChange={(e) => setData({ ...data, hero: { ...data.hero, tag: e.target.value } })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label>Title</label><input value={data.hero.title} onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })} /></div>
              <div><label>Title (italic / gold)</label><input value={data.hero.titleEm} onChange={(e) => setData({ ...data, hero: { ...data.hero, titleEm: e.target.value } })} /></div>
            </div>
            <div><label>Subtitle</label><textarea rows={2} value={data.hero.subtitle} onChange={(e) => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })} /></div>
          </div>
        </section>

        {/* Packages */}
        {data.packages.map((pkg, i) => (
          <section key={pkg.id} className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-sm font-semibold text-text mb-5">{pkg.tag}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>Title</label>
                  <input value={pkg.title} onChange={(e) => updatePackage(i, 'title', e.target.value)} />
                </div>
                <div>
                  <label>Starting Price</label>
                  <input value={pkg.startingFrom} onChange={(e) => updatePackage(i, 'startingFrom', e.target.value)} />
                </div>
              </div>
              <div>
                <label>Description</label>
                <textarea rows={2} value={pkg.description} onChange={(e) => updatePackage(i, 'description', e.target.value)} />
              </div>
              <div>
                <label>Included Features</label>
                <div className="space-y-2 mt-1.5">
                  {pkg.features.map((feat, fi) => (
                    <div key={fi} className="flex gap-2">
                      <input value={feat} onChange={(e) => updateFeature(i, fi, e.target.value)} />
                      <button onClick={() => removeFeature(i, fi)} className="shrink-0 text-danger hover:text-danger/80 px-2 text-sm">✕</button>
                    </div>
                  ))}
                  <button onClick={() => addFeature(i)} className="text-accent text-sm hover:underline mt-1">+ Add feature</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>CTA Button Label</label>
                  <input value={pkg.ctaLabel} onChange={(e) => updatePackage(i, 'ctaLabel', e.target.value)} />
                </div>
                <div>
                  <label>CTA Link (e.g. /contact)</label>
                  <input value={pkg.ctaLink} onChange={(e) => updatePackage(i, 'ctaLink', e.target.value)} />
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* FAQ */}
        <section className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-text">Frequently Asked Questions</h2>
            <button onClick={addFaq} className="text-accent text-sm hover:underline">+ Add question</button>
          </div>
          <div className="space-y-5">
            {data.faq.map((item, i) => (
              <div key={i} className="border border-border rounded-md p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted text-xs">Question {i + 1}</span>
                  <button onClick={() => removeFaq(i)} className="text-danger text-xs hover:underline">Remove</button>
                </div>
                <div>
                  <label>Question</label>
                  <input value={item.question} onChange={(e) => updateFaq(i, 'question', e.target.value)} />
                </div>
                <div>
                  <label>Answer</label>
                  <textarea rows={3} value={item.answer} onChange={(e) => updateFaq(i, 'answer', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

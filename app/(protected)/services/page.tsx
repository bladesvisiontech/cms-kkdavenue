'use client';

import { useState, useEffect, useCallback } from 'react';
import PageHeader from '@/components/PageHeader';
import SaveButton from '@/components/SaveButton';
import Toast from '@/components/Toast';
import type { ServiceItem } from '@/types';
import { usePreviewSync } from '@/lib/usePreviewSync';
import ImagePicker from '@/components/ImagePicker';

interface HeroData { tag: string; title: string; titleEm: string; titleSuffix: string; subtitle: string }
interface ServicesData {
  hero: HeroData;
  items: ServiceItem[];
}

export default function ServicesPage() {
  const [data, setData] = useState<ServicesData | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  usePreviewSync('services', data);

  useEffect(() => {
    fetch('/api/content?file=services.json')
      .then((r) => r.json())
      .then((res: { data: ServicesData }) => setData(res.data));
  }, []);

  const save = useCallback(async () => {
    if (!data) return;
    setSaving(true);
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: 'services.json', content: data, section: 'Services' }),
    });
    const result = await res.json() as { ok?: boolean; error?: string };
    setSaving(false);
    setToast(result.ok
      ? { message: 'Services saved! Publishing now...', type: 'success' }
      : { message: result.error ?? 'Failed to save', type: 'error' }
    );
  }, [data]);

  function updateItem(index: number, field: keyof ServiceItem, value: string) {
    if (!data) return;
    const updated = [...data.items];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, items: updated });
  }

  if (!data) return <div className="text-muted text-sm">Loading...</div>;

  return (
    <div>
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-border">
        <PageHeader title="Services" description="Edit service titles, descriptions and CTAs" />
        <SaveButton saving={saving} onClick={save} />
      </div>

      <div className="space-y-6">

        {/* Hero */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Hero</h2>
          <div className="space-y-3">
            <div><label>Tag</label><input value={data.hero.tag} onChange={(e) => setData({ ...data, hero: { ...data.hero, tag: e.target.value } })} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><label>Title</label><input value={data.hero.title} onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })} /></div>
              <div><label>Title (italic / gold)</label><input value={data.hero.titleEm} onChange={(e) => setData({ ...data, hero: { ...data.hero, titleEm: e.target.value } })} /></div>
              <div><label>Title Suffix</label><input value={data.hero.titleSuffix} onChange={(e) => setData({ ...data, hero: { ...data.hero, titleSuffix: e.target.value } })} /></div>
            </div>
            <div><label>Subtitle</label><textarea rows={2} value={data.hero.subtitle} onChange={(e) => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })} /></div>
          </div>
        </section>

        {data.items.map((item, i) => (
          <section key={item.id} className="bg-card border border-border rounded-lg p-6">
            <div className="text-xs text-muted uppercase tracking-wider mb-4">Service {i + 1}</div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>Title</label>
                  <input value={item.title} onChange={(e) => updateItem(i, 'title', e.target.value)} />
                </div>
                <div>
                  <label>Title (italic / gold)</label>
                  <input value={item.titleEm} onChange={(e) => updateItem(i, 'titleEm', e.target.value)} />
                </div>
              </div>
              <div>
                <label>Subtitle</label>
                <input value={item.subtitle} onChange={(e) => updateItem(i, 'subtitle', e.target.value)} />
              </div>
              <div>
                <label>Description</label>
                <textarea rows={3} value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>CTA Label</label>
                  <input value={item.cta} onChange={(e) => updateItem(i, 'cta', e.target.value)} />
                </div>
                <div>
                  <label>CTA Link</label>
                  <input value={item.link} onChange={(e) => updateItem(i, 'link', e.target.value)} />
                </div>
              </div>
              <ImagePicker
                label="Service Photo"
                value={item.image}
                onChange={(url) => updateItem(i, 'image', url)}
              />
            </div>
          </section>
        ))}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import PageHeader from '@/components/PageHeader';
import SaveButton from '@/components/SaveButton';
import Toast from '@/components/Toast';
import { usePreviewSync } from '@/lib/usePreviewSync';
import ImagePicker from '@/components/ImagePicker';

interface ValueItem { id: string; title: string; desc: string }
interface AboutData {
  hero: { tag: string; title: string; titleEm: string; subtitle: string };
  founder: { tag: string; name: string; image: string; title: string; titleEm: string; titleSuffix: string; paragraphs: string[] };
  values: { tag: string; title: string; items: ValueItem[] };
  space: { tag: string; title: string; titleEm: string; image: string; desc: string };
}

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  usePreviewSync('about', data);

  useEffect(() => {
    fetch('/api/content?file=about.json')
      .then((r) => r.json())
      .then((res: { data: AboutData }) => setData(res.data));
  }, []);

  const save = useCallback(async () => {
    if (!data) return;
    setSaving(true);
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: 'about.json', content: data, section: 'About' }),
    });
    const result = await res.json() as { ok?: boolean; error?: string };
    setSaving(false);
    setToast(result.ok
      ? { message: 'About saved! Publishing now...', type: 'success' }
      : { message: result.error ?? 'Failed to save', type: 'error' }
    );
  }, [data]);

  if (!data) return <div className="text-muted text-sm">Loading...</div>;

  const { hero, founder, values, space } = data;

  return (
    <div>
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-border">
        <PageHeader title="About" description="Edit hero, founder story, values and venue section" />
        <SaveButton saving={saving} onClick={save} />
      </div>

      <div className="space-y-6">

        {/* Hero */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Hero</h2>
          <div className="space-y-3">
            <div><label>Tag</label><input value={hero.tag} onChange={(e) => setData({ ...data, hero: { ...hero, tag: e.target.value } })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label>Title</label><input value={hero.title} onChange={(e) => setData({ ...data, hero: { ...hero, title: e.target.value } })} /></div>
              <div><label>Title (italic / gold)</label><input value={hero.titleEm} onChange={(e) => setData({ ...data, hero: { ...hero, titleEm: e.target.value } })} /></div>
            </div>
            <div><label>Subtitle</label><textarea rows={2} value={hero.subtitle} onChange={(e) => setData({ ...data, hero: { ...hero, subtitle: e.target.value } })} /></div>
          </div>
        </section>

        {/* Founder */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Founder Story</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label>Badge Label</label><input value={founder.tag} onChange={(e) => setData({ ...data, founder: { ...founder, tag: e.target.value } })} /></div>
              <div><label>Name</label><input value={founder.name} onChange={(e) => setData({ ...data, founder: { ...founder, name: e.target.value } })} /></div>
            </div>
            <ImagePicker
              label="Founder Photo"
              value={founder.image ?? ''}
              onChange={(url) => setData({ ...data, founder: { ...founder, image: url } })}
            />
            <div className="grid grid-cols-3 gap-3">
              <div><label>Title</label><input value={founder.title} onChange={(e) => setData({ ...data, founder: { ...founder, title: e.target.value } })} /></div>
              <div><label>Title (italic / gold)</label><input value={founder.titleEm} onChange={(e) => setData({ ...data, founder: { ...founder, titleEm: e.target.value } })} /></div>
              <div><label>Title Suffix</label><input value={founder.titleSuffix} onChange={(e) => setData({ ...data, founder: { ...founder, titleSuffix: e.target.value } })} /></div>
            </div>
            <div>
              <label>Story Paragraphs</label>
              <div className="space-y-2 mt-1.5">
                {founder.paragraphs.map((p, i) => (
                  <textarea
                    key={i}
                    rows={3}
                    value={p}
                    onChange={(e) => {
                      const paragraphs = [...founder.paragraphs];
                      paragraphs[i] = e.target.value;
                      setData({ ...data, founder: { ...founder, paragraphs } });
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Values</h2>
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label>Tag</label><input value={values.tag} onChange={(e) => setData({ ...data, values: { ...values, tag: e.target.value } })} /></div>
              <div><label>Title</label><input value={values.title} onChange={(e) => setData({ ...data, values: { ...values, title: e.target.value } })} /></div>
            </div>
          </div>
          <div className="space-y-3">
            {values.items.map((item, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 border border-border rounded p-3">
                <div><label>Title</label><input value={item.title} onChange={(e) => { const items = [...values.items]; items[i] = { ...items[i], title: e.target.value }; setData({ ...data, values: { ...values, items } }); }} /></div>
                <div><label>Description</label><input value={item.desc} onChange={(e) => { const items = [...values.items]; items[i] = { ...items[i], desc: e.target.value }; setData({ ...data, values: { ...values, items } }); }} /></div>
              </div>
            ))}
          </div>
        </section>

        {/* Space */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Venue Section</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div><label>Tag</label><input value={space.tag} onChange={(e) => setData({ ...data, space: { ...space, tag: e.target.value } })} /></div>
              <div><label>Title</label><input value={space.title} onChange={(e) => setData({ ...data, space: { ...space, title: e.target.value } })} /></div>
              <div><label>Title (italic / gold)</label><input value={space.titleEm} onChange={(e) => setData({ ...data, space: { ...space, titleEm: e.target.value } })} /></div>
            </div>
            <div><label>Description</label><textarea rows={3} value={space.desc} onChange={(e) => setData({ ...data, space: { ...space, desc: e.target.value } })} /></div>
            <ImagePicker label="Venue Photo" value={space.image ?? ''} onChange={(url) => setData({ ...data, space: { ...space, image: url } })} />
          </div>
        </section>

      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

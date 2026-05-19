'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import PageHeader from '@/components/PageHeader';
import SaveButton from '@/components/SaveButton';
import Toast from '@/components/Toast';
import type { GalleryItem } from '@/types';
import { usePreviewSync } from '@/lib/usePreviewSync';
import ImagePicker from '@/components/ImagePicker';

interface GalleryData {
  hero: { tag: string; title: string; titleEm: string; subtitle: string; image: string };
  items: GalleryItem[];
}

export default function GalleryPage() {
  const [data, setData] = useState<GalleryData | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  usePreviewSync('gallery', data);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/content?file=gallery.json')
      .then((r) => r.json())
      .then((res: { data: GalleryData }) => setData(res.data));
  }, []);

  const save = useCallback(async () => {
    if (!data) return;
    setSaving(true);
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: 'gallery.json', content: data, section: 'Gallery' }),
    });
    const result = await res.json() as { ok?: boolean; error?: string };
    setSaving(false);
    setToast(result.ok
      ? { message: 'Gallery saved! Publishing now...', type: 'success' }
      : { message: result.error ?? 'Failed to save', type: 'error' }
    );
  }, [data]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !data) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const result = await res.json() as { ok?: boolean; url?: string; error?: string };
    setUploading(false);

    if (result.ok && result.url) {
      const newItem: GalleryItem = {
        id: Date.now(),
        img: result.url,
        title: file.name.replace(/\.[^.]+$/, ''),
        type: 'Food',
      };
      setData({ ...data, items: [...data.items, newItem] });
      setToast({ message: 'Image uploaded. Click Save & Publish to make it live.', type: 'success' });
    } else {
      setToast({ message: result.error ?? 'Upload failed', type: 'error' });
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function updateItem(index: number, field: keyof GalleryItem, value: string) {
    if (!data) return;
    const updated = [...data.items];
    updated[index] = { ...updated[index], [field]: value } as GalleryItem;
    setData({ ...data, items: updated });
  }

  function removeItem(index: number) {
    if (!data) return;
    if (!confirm('Remove this image from the gallery?')) return;
    setData({ ...data, items: data.items.filter((_, i) => i !== index) });
  }

  if (!data) return <div className="text-muted text-sm">Loading...</div>;

  return (
    <div>
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-border">
        <PageHeader title="Gallery" description="Add, remove or edit gallery photos" />
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 bg-card border border-border text-text text-sm font-medium px-4 py-2.5 rounded-md cursor-pointer hover:border-accent/50 transition-colors">
            {uploading ? (
              <><span className="w-4 h-4 border-2 border-muted border-t-text rounded-full animate-spin" /> Uploading...</>
            ) : (
              <>↑ Upload Photo</>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
          <SaveButton saving={saving} onClick={save} />
        </div>
      </div>

      {/* Hero */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="text-sm font-semibold text-text mb-4">Hero</h2>
        <div className="space-y-3">
          <div><label>Tag</label><input value={data.hero.tag} onChange={(e) => setData({ ...data, hero: { ...data.hero, tag: e.target.value } })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label>Title</label><input value={data.hero.title} onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })} /></div>
            <div><label>Title (italic / gold)</label><input value={data.hero.titleEm} onChange={(e) => setData({ ...data, hero: { ...data.hero, titleEm: e.target.value } })} /></div>
          </div>
          <div><label>Subtitle</label><textarea rows={2} value={data.hero.subtitle} onChange={(e) => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })} /></div>
          <ImagePicker label="Hero Background Photo" value={data.hero.image ?? ''} onChange={(url) => setData({ ...data, hero: { ...data.hero, image: url } })} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {data.items.map((item, i) => (
          <div key={item.id} className="bg-card border border-border rounded-lg overflow-hidden group">
            <div className="aspect-[4/5] bg-border relative overflow-hidden">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <button
                onClick={() => removeItem(i)}
                className="absolute top-2 right-2 w-7 h-7 bg-danger text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="p-3 space-y-2">
              <div>
                <label>Title</label>
                <input
                  value={item.title}
                  onChange={(e) => updateItem(i, 'title', e.target.value)}
                  className="text-xs py-1"
                />
              </div>
              <div>
                <label>Type</label>
                <select
                  value={item.type}
                  onChange={(e) => updateItem(i, 'type', e.target.value)}
                  className="text-xs py-1"
                >
                  <option value="Food">Food</option>
                  <option value="Venue">Venue</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.items.length === 0 && (
        <div className="text-center py-16 text-muted">
          No photos yet. Upload your first image above.
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

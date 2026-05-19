'use client';

import { useState, useEffect, useCallback } from 'react';
import PageHeader from '@/components/PageHeader';
import SaveButton from '@/components/SaveButton';
import Toast from '@/components/Toast';
import { usePreviewSync } from '@/lib/usePreviewSync';

interface NavItem { label: string; path: string }
interface SiteData {
  nav: NavItem[];
  navCta: { label: string; path: string };
  hero: { tag: string; title: string; titleEm: string; titleSuffix: string; subtitle: string };
  contact: {
    address: string;
    city: string;
    addressUrl: string;
    phone: string;
    phoneUrl: string;
    email: string;
  };
  hours: { label: string; value: string; note?: string; highlight: boolean }[];
  social: {
    instagram: string;
    instagramHandle: string;
    tiktok: string;
  };
  testimonial: {
    quote: string;
    emphasis: string;
    author: string;
    context: string;
  };
}

export default function SitePage() {
  const [data, setData] = useState<SiteData | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  usePreviewSync('site', data);

  useEffect(() => {
    fetch('/api/content?file=site.json')
      .then((r) => r.json())
      .then((res: { data: SiteData }) => setData(res.data));
  }, []);

  const save = useCallback(async () => {
    if (!data) return;
    setSaving(true);
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: 'site.json', content: data, section: 'Site Info' }),
    });
    const result = await res.json() as { ok?: boolean; error?: string };
    setSaving(false);
    setToast(result.ok
      ? { message: 'Site info saved! Publishing now...', type: 'success' }
      : { message: result.error ?? 'Failed to save', type: 'error' }
    );
  }, [data]);

  if (!data) return <div className="text-muted text-sm">Loading...</div>;

  return (
    <div>
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-border">
        <PageHeader title="Site Info" description="Contact details, hours of operation and social links" />
        <SaveButton saving={saving} onClick={save} />
      </div>

      <div className="space-y-8">

        {/* Nav */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Navigation Labels</h2>
          <div className="space-y-2">
            {data.nav.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-muted font-mono w-24 shrink-0">{item.path}</span>
                <input value={item.label} onChange={(e) => { const nav = [...data.nav]; nav[i] = { ...nav[i], label: e.target.value }; setData({ ...data, nav }); }} />
              </div>
            ))}
            <div className="flex items-center gap-3 pt-2 border-t border-border mt-2">
              <span className="text-xs text-muted font-mono w-24 shrink-0">CTA Button</span>
              <input value={data.navCta.label} onChange={(e) => setData({ ...data, navCta: { ...data.navCta, label: e.target.value } })} />
            </div>
          </div>
        </section>

        {/* Contact Hero */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Contact Page Hero</h2>
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

        {/* Contact */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-5">Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label>Street Address</label>
              <input value={data.contact.address} onChange={(e) => setData({ ...data, contact: { ...data.contact, address: e.target.value } })} />
            </div>
            <div>
              <label>City & ZIP</label>
              <input value={data.contact.city} onChange={(e) => setData({ ...data, contact: { ...data.contact, city: e.target.value } })} />
            </div>
            <div>
              <label>Phone (display)</label>
              <input value={data.contact.phone} onChange={(e) => setData({ ...data, contact: { ...data.contact, phone: e.target.value } })} />
            </div>
            <div>
              <label>Phone (URL e.g. tel:+1...)</label>
              <input value={data.contact.phoneUrl} onChange={(e) => setData({ ...data, contact: { ...data.contact, phoneUrl: e.target.value } })} />
            </div>
            <div className="sm:col-span-2">
              <label>Email</label>
              <input type="email" value={data.contact.email} onChange={(e) => setData({ ...data, contact: { ...data.contact, email: e.target.value } })} />
            </div>
            <div className="sm:col-span-2">
              <label>Google Maps URL</label>
              <input value={data.contact.addressUrl} onChange={(e) => setData({ ...data, contact: { ...data.contact, addressUrl: e.target.value } })} />
            </div>
          </div>
        </section>

        {/* Hours */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-5">Hours of Operation</h2>
          <div className="space-y-3">
            {data.hours.map((hour, i) => (
              <div key={i} className="grid grid-cols-3 gap-3 items-end">
                <div>
                  <label>Day(s)</label>
                  <input value={hour.label} onChange={(e) => {
                    const updated = [...data.hours];
                    updated[i] = { ...updated[i], label: e.target.value };
                    setData({ ...data, hours: updated });
                  }} />
                </div>
                <div>
                  <label>Hours</label>
                  <input value={hour.value} onChange={(e) => {
                    const updated = [...data.hours];
                    updated[i] = { ...updated[i], value: e.target.value };
                    setData({ ...data, hours: updated });
                  }} />
                </div>
                <div>
                  <label>Note (optional)</label>
                  <input value={hour.note ?? ''} onChange={(e) => {
                    const updated = [...data.hours];
                    updated[i] = { ...updated[i], note: e.target.value };
                    setData({ ...data, hours: updated });
                  }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Social */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-5">Social Media</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Instagram URL</label>
                <input value={data.social.instagram} onChange={(e) => setData({ ...data, social: { ...data.social, instagram: e.target.value } })} />
              </div>
              <div>
                <label>Instagram Handle (@...)</label>
                <input value={data.social.instagramHandle} onChange={(e) => setData({ ...data, social: { ...data.social, instagramHandle: e.target.value } })} />
              </div>
            </div>
            <div>
              <label>TikTok URL</label>
              <input value={data.social.tiktok} onChange={(e) => setData({ ...data, social: { ...data.social, tiktok: e.target.value } })} />
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-5">Homepage Testimonial</h2>
          <div className="space-y-4">
            <div>
              <label>Quote</label>
              <textarea rows={3} value={data.testimonial.quote} onChange={(e) => setData({ ...data, testimonial: { ...data.testimonial, quote: e.target.value } })} />
            </div>
            <div>
              <label>Emphasized phrase (shown in gold)</label>
              <input value={data.testimonial.emphasis} onChange={(e) => setData({ ...data, testimonial: { ...data.testimonial, emphasis: e.target.value } })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Author</label>
                <input value={data.testimonial.author} onChange={(e) => setData({ ...data, testimonial: { ...data.testimonial, author: e.target.value } })} />
              </div>
              <div>
                <label>Context (e.g. "Private Event")</label>
                <input value={data.testimonial.context} onChange={(e) => setData({ ...data, testimonial: { ...data.testimonial, context: e.target.value } })} />
              </div>
            </div>
          </div>
        </section>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

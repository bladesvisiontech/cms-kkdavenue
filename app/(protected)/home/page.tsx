'use client';

import { useState, useEffect, useCallback } from 'react';
import PageHeader from '@/components/PageHeader';
import SaveButton from '@/components/SaveButton';
import Toast from '@/components/Toast';
import { usePreviewSync } from '@/lib/usePreviewSync';
import ImagePicker from '@/components/ImagePicker';

interface PillarItem { id: string; title: string; desc: string }
interface AudienceCard { tag: string; title: string; titleEm: string; desc: string; cta: string; link: string }
interface HomeData {
  hero: {
    tag: string; headline: string; headlineEm: string; subtext: string;
    cta1Label: string; cta1Link: string; cta2Label: string; cta2Link: string;
    focusLabel: string; focusText: string;
  };
  audience: { card1: AudienceCard; card2: AudienceCard };
  audienceImages: string[];
  pillars: { tag: string; title: string; titleEm: string; subtitle: string; items: PillarItem[] };
  portfolio: { tag: string; title: string; titleEm: string; ctaLabel: string; ctaLink: string };
  portfolioImages: string[];
  testimonial: { quote: string; emphasis: string; author: string; context: string };
}

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  usePreviewSync('home', data);

  useEffect(() => {
    fetch('/api/content?file=home.json')
      .then((r) => r.json())
      .then((res: { data: HomeData }) => setData(res.data));
  }, []);

  const save = useCallback(async () => {
    if (!data) return;
    setSaving(true);
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: 'home.json', content: data, section: 'Home' }),
    });
    const result = await res.json() as { ok?: boolean; error?: string };
    setSaving(false);
    setToast(result.ok
      ? { message: 'Home saved! Publishing now...', type: 'success' }
      : { message: result.error ?? 'Failed to save', type: 'error' }
    );
  }, [data]);

  if (!data) return <div className="text-muted text-sm">Loading...</div>;

  const { hero, audience, audienceImages, pillars, portfolio, portfolioImages, testimonial } = data;

  return (
    <div>
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-border">
        <PageHeader title="Home" description="Edit hero, audience cards, pillars and portfolio section" />
        <SaveButton saving={saving} onClick={save} />
      </div>

      <div className="space-y-6">

        {/* Hero */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Hero</h2>
          <div className="space-y-3">
            <div><label>Tag line</label><input value={hero.tag} onChange={(e) => setData({ ...data, hero: { ...hero, tag: e.target.value } })} /></div>
            <div><label>Headline</label><input value={hero.headline} onChange={(e) => setData({ ...data, hero: { ...hero, headline: e.target.value } })} /></div>
            <div><label>Headline (italic / gold)</label><input value={hero.headlineEm} onChange={(e) => setData({ ...data, hero: { ...hero, headlineEm: e.target.value } })} /></div>
            <div><label>Subtext</label><textarea rows={2} value={hero.subtext} onChange={(e) => setData({ ...data, hero: { ...hero, subtext: e.target.value } })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label>CTA 1 Label</label><input value={hero.cta1Label} onChange={(e) => setData({ ...data, hero: { ...hero, cta1Label: e.target.value } })} /></div>
              <div><label>CTA 1 Link</label><input value={hero.cta1Link} onChange={(e) => setData({ ...data, hero: { ...hero, cta1Link: e.target.value } })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label>CTA 2 Label</label><input value={hero.cta2Label} onChange={(e) => setData({ ...data, hero: { ...hero, cta2Label: e.target.value } })} /></div>
              <div><label>CTA 2 Link</label><input value={hero.cta2Link} onChange={(e) => setData({ ...data, hero: { ...hero, cta2Link: e.target.value } })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label>Focus Label</label><input value={hero.focusLabel} onChange={(e) => setData({ ...data, hero: { ...hero, focusLabel: e.target.value } })} /></div>
              <div><label>Focus Text</label><input value={hero.focusText} onChange={(e) => setData({ ...data, hero: { ...hero, focusText: e.target.value } })} /></div>
            </div>
          </div>
        </section>

        {/* Audience Cards */}
        {(['card1', 'card2'] as const).map((key) => (
          <section key={key} className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-sm font-semibold text-text mb-4">Audience Card {key === 'card1' ? '1' : '2'}</h2>
            <div className="space-y-3">
              <div><label>Tag</label><input value={audience[key].tag} onChange={(e) => setData({ ...data, audience: { ...audience, [key]: { ...audience[key], tag: e.target.value } } })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label>Title</label><input value={audience[key].title} onChange={(e) => setData({ ...data, audience: { ...audience, [key]: { ...audience[key], title: e.target.value } } })} /></div>
                <div><label>Title (italic / gold)</label><input value={audience[key].titleEm} onChange={(e) => setData({ ...data, audience: { ...audience, [key]: { ...audience[key], titleEm: e.target.value } } })} /></div>
              </div>
              <div><label>Description</label><textarea rows={2} value={audience[key].desc} onChange={(e) => setData({ ...data, audience: { ...audience, [key]: { ...audience[key], desc: e.target.value } } })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label>Button Label</label><input value={audience[key].cta} onChange={(e) => setData({ ...data, audience: { ...audience, [key]: { ...audience[key], cta: e.target.value } } })} /></div>
                <div><label>Button Link</label><input value={audience[key].link} onChange={(e) => setData({ ...data, audience: { ...audience, [key]: { ...audience[key], link: e.target.value } } })} /></div>
              </div>
            </div>
          </section>
        ))}

        {/* Pillars */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Pillars Section</h2>
          <div className="space-y-3 mb-5">
            <div className="grid grid-cols-3 gap-3">
              <div><label>Tag</label><input value={pillars.tag} onChange={(e) => setData({ ...data, pillars: { ...pillars, tag: e.target.value } })} /></div>
              <div><label>Title</label><input value={pillars.title} onChange={(e) => setData({ ...data, pillars: { ...pillars, title: e.target.value } })} /></div>
              <div><label>Title (italic / gold)</label><input value={pillars.titleEm} onChange={(e) => setData({ ...data, pillars: { ...pillars, titleEm: e.target.value } })} /></div>
            </div>
            <div><label>Subtitle</label><textarea rows={2} value={pillars.subtitle} onChange={(e) => setData({ ...data, pillars: { ...pillars, subtitle: e.target.value } })} /></div>
          </div>
          <div className="space-y-3">
            {pillars.items.map((item, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 border border-border rounded p-3">
                <div><label>Title</label><input value={item.title} onChange={(e) => { const items = [...pillars.items]; items[i] = { ...items[i], title: e.target.value }; setData({ ...data, pillars: { ...pillars, items } }); }} /></div>
                <div><label>Description</label><input value={item.desc} onChange={(e) => { const items = [...pillars.items]; items[i] = { ...items[i], desc: e.target.value }; setData({ ...data, pillars: { ...pillars, items } }); }} /></div>
              </div>
            ))}
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Portfolio Teaser</h2>
          <div className="grid grid-cols-2 gap-3">
            <div><label>Tag</label><input value={portfolio.tag} onChange={(e) => setData({ ...data, portfolio: { ...portfolio, tag: e.target.value } })} /></div>
            <div><label>Title</label><input value={portfolio.title} onChange={(e) => setData({ ...data, portfolio: { ...portfolio, title: e.target.value } })} /></div>
            <div><label>Title (italic / gold)</label><input value={portfolio.titleEm} onChange={(e) => setData({ ...data, portfolio: { ...portfolio, titleEm: e.target.value } })} /></div>
            <div><label>CTA Label</label><input value={portfolio.ctaLabel} onChange={(e) => setData({ ...data, portfolio: { ...portfolio, ctaLabel: e.target.value } })} /></div>
          </div>
        </section>


        {/* Audience Card Images */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Audience Card Photos</h2>
          <div className="grid grid-cols-2 gap-6">
            <ImagePicker label="Card 1 Photo" value={audienceImages?.[0] ?? ''} onChange={(url) => { const updated = [...(audienceImages ?? [])]; updated[0] = url; setData({ ...data, audienceImages: updated }); }} />
            <ImagePicker label="Card 2 Photo" value={audienceImages?.[1] ?? ''} onChange={(url) => { const updated = [...(audienceImages ?? [])]; updated[1] = url; setData({ ...data, audienceImages: updated }); }} />
          </div>
        </section>

        {/* Portfolio Images */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Portfolio Grid Photos</h2>
          <div className="grid grid-cols-2 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <ImagePicker
                key={i}
                label={`Photo ${i + 1}`}
                value={portfolioImages?.[i] ?? ''}
                onChange={(url) => {
                  const updated = [...(portfolioImages ?? [])];
                  updated[i] = url;
                  setData({ ...data, portfolioImages: updated });
                }}
              />
            ))}
          </div>
        </section>

        {/* Testimonial */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Homepage Testimonial</h2>
          <div className="space-y-4">
            <div>
              <label>Quote</label>
              <textarea rows={3} value={testimonial.quote} onChange={(e) => setData({ ...data, testimonial: { ...testimonial, quote: e.target.value } })} />
            </div>
            <div>
              <label>Emphasized phrase (shown in gold)</label>
              <input value={testimonial.emphasis} onChange={(e) => setData({ ...data, testimonial: { ...testimonial, emphasis: e.target.value } })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Author</label>
                <input value={testimonial.author} onChange={(e) => setData({ ...data, testimonial: { ...testimonial, author: e.target.value } })} />
              </div>
              <div>
                <label>Context (e.g. "Private Event")</label>
                <input value={testimonial.context} onChange={(e) => setData({ ...data, testimonial: { ...testimonial, context: e.target.value } })} />
              </div>
            </div>
          </div>
        </section>

      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import PageHeader from '@/components/PageHeader';
import SaveButton from '@/components/SaveButton';
import Toast from '@/components/Toast';
import { usePreviewSync } from '@/lib/usePreviewSync';
import ImagePicker from '@/components/ImagePicker';

interface WednesdayItem { name: string; price: string }
interface FridayItem { name: string; price: string }

interface MenuData {
  images: { hero: string; everydayPlate: string; soulFood1: string; soulFood2: string };
  hero: { tag: string; title: string; titleEm: string; subtitle: string };
  specials: {
    sundayMonday: { day: string; description: string; price: string };
    tuesday: { day: string; items: string[]; note: string; price: string };
    wednesday: { day: string; items: WednesdayItem[] };
    thursday: { day: string; description: string; price: string };
    friday: { day: string; items: FridayItem[]; extras: FridayItem[] };
  };
  everyday: { subtitle: string; meats: string[]; pairs: string[] };
  soulFood: { subtitle: string; entrees: string[]; sides: string[] };
  brunch: { subtitle: string; mains: string[]; pairs: string[] };
  desserts: string[];
}

function ListEditor({ label, items, onChange }: {
  label: string;
  items: string[];
  onChange: (updated: string[]) => void;
}) {
  return (
    <div>
      <label>{label}</label>
      <div className="space-y-2 mt-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input value={item} onChange={(e) => {
              const updated = [...items];
              updated[i] = e.target.value;
              onChange(updated);
            }} />
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="shrink-0 text-danger px-2 text-sm">✕</button>
          </div>
        ))}
        <button onClick={() => onChange([...items, ''])} className="text-accent text-sm hover:underline">+ Add item</button>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [data, setData] = useState<MenuData | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  usePreviewSync('menu', data);

  useEffect(() => {
    fetch('/api/content?file=menu.json')
      .then((r) => r.json())
      .then((res: { data: MenuData }) => setData(res.data));
  }, []);

  const save = useCallback(async () => {
    if (!data) return;
    setSaving(true);
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: 'menu.json', content: data, section: 'Menu' }),
    });
    const result = await res.json() as { ok?: boolean; error?: string };
    setSaving(false);
    setToast(result.ok
      ? { message: 'Menu saved! Publishing now...', type: 'success' }
      : { message: result.error ?? 'Failed to save', type: 'error' }
    );
  }, [data]);

  if (!data) return <div className="text-muted text-sm">Loading...</div>;

  const { specials } = data;

  return (
    <div>
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-border">
        <PageHeader title="Menu" description="Edit weekly specials, daily menu, brunch and desserts" />
        <SaveButton saving={saving} onClick={save} />
      </div>

      <div className="space-y-6">

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

        {/* Sunday / Monday */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">{specials.sundayMonday.day}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Description</label>
              <input value={specials.sundayMonday.description} onChange={(e) => setData({ ...data, specials: { ...specials, sundayMonday: { ...specials.sundayMonday, description: e.target.value } } })} />
            </div>
            <div>
              <label>Price</label>
              <input value={specials.sundayMonday.price} onChange={(e) => setData({ ...data, specials: { ...specials, sundayMonday: { ...specials.sundayMonday, price: e.target.value } } })} />
            </div>
          </div>
        </section>

        {/* Tuesday */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">{specials.tuesday.day}</h2>
          <div className="space-y-4">
            <ListEditor label="Items" items={specials.tuesday.items} onChange={(updated) => setData({ ...data, specials: { ...specials, tuesday: { ...specials.tuesday, items: updated } } })} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Note</label>
                <input value={specials.tuesday.note} onChange={(e) => setData({ ...data, specials: { ...specials, tuesday: { ...specials.tuesday, note: e.target.value } } })} />
              </div>
              <div>
                <label>Price</label>
                <input value={specials.tuesday.price} onChange={(e) => setData({ ...data, specials: { ...specials, tuesday: { ...specials.tuesday, price: e.target.value } } })} />
              </div>
            </div>
          </div>
        </section>

        {/* Wednesday */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">{specials.wednesday.day}</h2>
          <div className="space-y-2">
            {specials.wednesday.items.map((item, i) => (
              <div key={i} className="grid grid-cols-2 gap-3">
                <div>
                  <label>Item name</label>
                  <input value={item.name} onChange={(e) => {
                    const items = [...specials.wednesday.items];
                    items[i] = { ...items[i], name: e.target.value };
                    setData({ ...data, specials: { ...specials, wednesday: { ...specials.wednesday, items } } });
                  }} />
                </div>
                <div>
                  <label>Price</label>
                  <input value={item.price} onChange={(e) => {
                    const items = [...specials.wednesday.items];
                    items[i] = { ...items[i], price: e.target.value };
                    setData({ ...data, specials: { ...specials, wednesday: { ...specials.wednesday, items } } });
                  }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Thursday */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">{specials.thursday.day}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Description</label>
              <input value={specials.thursday.description} onChange={(e) => setData({ ...data, specials: { ...specials, thursday: { ...specials.thursday, description: e.target.value } } })} />
            </div>
            <div>
              <label>Price</label>
              <input value={specials.thursday.price} onChange={(e) => setData({ ...data, specials: { ...specials, thursday: { ...specials.thursday, price: e.target.value } } })} />
            </div>
          </div>
        </section>

        {/* Friday */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">{specials.friday.day}</h2>
          <div className="space-y-4">
            <div>
              <label>Menu items</label>
              <div className="space-y-2 mt-1.5">
                {specials.friday.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-2 gap-3">
                    <input placeholder="Name" value={item.name} onChange={(e) => {
                      const items = [...specials.friday.items];
                      items[i] = { ...items[i], name: e.target.value };
                      setData({ ...data, specials: { ...specials, friday: { ...specials.friday, items } } });
                    }} />
                    <input placeholder="Price" value={item.price} onChange={(e) => {
                      const items = [...specials.friday.items];
                      items[i] = { ...items[i], price: e.target.value };
                      setData({ ...data, specials: { ...specials, friday: { ...specials.friday, items } } });
                    }} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label>Extras / Add-ons</label>
              <div className="space-y-2 mt-1.5">
                {specials.friday.extras.map((extra, i) => (
                  <div key={i} className="grid grid-cols-2 gap-3">
                    <input placeholder="Name" value={extra.name} onChange={(e) => {
                      const extras = [...specials.friday.extras];
                      extras[i] = { ...extras[i], name: e.target.value };
                      setData({ ...data, specials: { ...specials, friday: { ...specials.friday, extras } } });
                    }} />
                    <input placeholder="Price" value={extra.price} onChange={(e) => {
                      const extras = [...specials.friday.extras];
                      extras[i] = { ...extras[i], price: e.target.value };
                      setData({ ...data, specials: { ...specials, friday: { ...specials.friday, extras } } });
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Food Photos */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Food Photos</h2>
          <div className="grid grid-cols-2 gap-6">
            <ImagePicker label="Hero Background" value={data.images?.hero ?? ''} onChange={(url) => setData({ ...data, images: { ...data.images, hero: url } })} />
            <ImagePicker label="Everyday Menu Plate" value={data.images?.everydayPlate ?? ''} onChange={(url) => setData({ ...data, images: { ...data.images, everydayPlate: url } })} />
            <ImagePicker label="Soul Food Photo 1" value={data.images?.soulFood1 ?? ''} onChange={(url) => setData({ ...data, images: { ...data.images, soulFood1: url } })} />
            <ImagePicker label="Soul Food Photo 2" value={data.images?.soulFood2 ?? ''} onChange={(url) => setData({ ...data, images: { ...data.images, soulFood2: url } })} />
          </div>
        </section>

        {/* Everyday Menu */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Everyday Menu</h2>
          <div className="grid grid-cols-2 gap-6">
            <ListEditor label="Meats" items={data.everyday.meats} onChange={(updated) => setData({ ...data, everyday: { ...data.everyday, meats: updated } })} />
            <ListEditor label="Pairs" items={data.everyday.pairs} onChange={(updated) => setData({ ...data, everyday: { ...data.everyday, pairs: updated } })} />
          </div>
        </section>

        {/* Soul Food */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Soul Food</h2>
          <div className="grid grid-cols-2 gap-6">
            <ListEditor label="Entrées" items={data.soulFood.entrees} onChange={(updated) => setData({ ...data, soulFood: { ...data.soulFood, entrees: updated } })} />
            <ListEditor label="Sides" items={data.soulFood.sides} onChange={(updated) => setData({ ...data, soulFood: { ...data.soulFood, sides: updated } })} />
          </div>
        </section>

        {/* Brunch */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Brunch</h2>
          <div className="grid grid-cols-2 gap-6">
            <ListEditor label="Mains" items={data.brunch.mains} onChange={(updated) => setData({ ...data, brunch: { ...data.brunch, mains: updated } })} />
            <ListEditor label="Pairs" items={data.brunch.pairs} onChange={(updated) => setData({ ...data, brunch: { ...data.brunch, pairs: updated } })} />
          </div>
        </section>

        {/* Desserts */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold text-text mb-4">Desserts</h2>
          <ListEditor label="Items" items={data.desserts} onChange={(updated) => setData({ ...data, desserts: updated })} />
        </section>

      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

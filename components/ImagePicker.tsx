'use client';

import { useRef, useState } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_PREVIEW_URL ?? 'https://www.kkdavenuehtx.com';

function resolveUrl(value: string) {
  if (!value) return '';
  if (value.startsWith('http')) return value;
  return `${SITE_URL}${value}`;
}

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImagePicker({ value, onChange, label }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const result = await res.json() as { ok?: boolean; url?: string; error?: string };
    setUploading(false);
    if (result.ok && result.url) onChange(result.url);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div>
      {label && <label>{label}</label>}
      <div className="flex items-center gap-3 mt-1.5">
        <div className="w-20 h-20 bg-border rounded overflow-hidden shrink-0 border border-border">
          {value && (
            <img
              src={resolveUrl(value)}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
            />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="inline-flex items-center gap-2 bg-card border border-border text-text text-sm font-medium px-3 py-2 rounded cursor-pointer hover:border-accent/50 transition-colors w-fit">
            {uploading ? (
              <><span className="w-3 h-3 border-2 border-muted border-t-text rounded-full animate-spin" />Uploading...</>
            ) : (
              <>↑ Change Image</>
            )}
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
          </label>
          <span className="text-xs text-muted truncate max-w-[220px]">{value}</span>
        </div>
      </div>
    </div>
  );
}

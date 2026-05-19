'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '⊞', previewPath: '/' },
  { href: '/home', label: 'Home', icon: '⌂', previewPath: '/' },
  { href: '/about', label: 'About', icon: '◑', previewPath: '/about' },
  { href: '/services', label: 'Services', icon: '◉', previewPath: '/services' },
  { href: '/menu', label: 'Menu', icon: '◈', previewPath: '/menu' },
  { href: '/pricing', label: 'Pricing', icon: '◇', previewPath: '/pricing' },
  { href: '/gallery', label: 'Gallery', icon: '⊡', previewPath: '/portfolio' },
  { href: '/site', label: 'Site Info', icon: '◎', previewPath: '/contact' },
];

function navigatePreview(path: string) {
  const iframe = document.getElementById('cms-preview-frame') as HTMLIFrameElement | null;
  if (!iframe?.contentWindow) return;
  iframe.contentWindow.postMessage({ type: 'cms-navigate', path }, '*');
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/login');
  }

  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 flex flex-col border-r border-border bg-card">
      {/* Studio brand */}
      <div className="px-5 py-5 border-b border-border">
        <div className="text-xs text-muted uppercase tracking-widest mb-0.5">Blades Vision Tech</div>
        <div className="text-sm font-semibold text-text">Content Manager</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => navigatePreview(item.previewPath)}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-accent/10 text-accent border-r-2 border-accent'
                  : 'text-muted hover:text-text hover:bg-border/50'
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-5 py-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-muted hover:text-danger transition-colors"
        >
          ← Sign out
        </button>
      </div>
    </aside>
  );
}

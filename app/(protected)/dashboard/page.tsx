import Link from 'next/link';
import { getSession } from '@/lib/auth';

const SECTIONS = [
  { href: '/menu', label: 'Menu', description: 'Edit daily specials, weekly menu, brunch & desserts', icon: '◈' },
  { href: '/pricing', label: 'Pricing', description: 'Update packages, prices and FAQ', icon: '◇' },
  { href: '/gallery', label: 'Gallery', description: 'Add, remove or reorder gallery photos', icon: '⊡' },
  { href: '/services', label: 'Services', description: 'Edit service descriptions and details', icon: '◉' },
  { href: '/site', label: 'Site Info', description: 'Update contact info, hours and social links', icon: '◎' },
];

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div>
      <div className="mb-8 pb-6 border-b border-border">
        <h1 className="text-xl font-semibold text-text mb-1">Dashboard</h1>
        <p className="text-muted text-sm">Welcome back, {session?.email}. What would you like to update today?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors group"
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl text-muted group-hover:text-accent transition-colors mt-0.5">{section.icon}</span>
              <div>
                <div className="font-medium text-text mb-1">{section.label}</div>
                <div className="text-muted text-sm leading-relaxed">{section.description}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 bg-card border border-border rounded-lg">
        <p className="text-muted text-xs">
          Changes are published automatically. After saving, your website will update in approximately 30–60 seconds.
        </p>
      </div>
    </div>
  );
}

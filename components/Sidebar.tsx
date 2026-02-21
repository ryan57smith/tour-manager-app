import Link from 'next/link'
import { useRouter } from 'next/router'

const navItems = [
  { href: '/', label: 'Dashboard', icon: '⬡' },
  { href: '/tour', label: 'Tour Stops', icon: '◎' },
  { href: '/map', label: 'Map', icon: '◈' },
  { href: '/hotels', label: 'Hotels', icon: '▣' },
  { href: '/travel', label: 'Travel', icon: '▷' },
  { href: '/tasks', label: 'Tasks', icon: '◻' },
  { href: '/guestlist', label: 'Guest List', icon: '◇' },
]

export default function Sidebar() {
  const router = useRouter()

  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      background: 'var(--stage)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '26px',
          letterSpacing: '0.05em',
          color: 'var(--amber)',
          lineHeight: 1,
        }}>TOURSTACK</div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', letterSpacing: '0.1em' }}>
          TOUR MANAGEMENT
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map((item) => {
          const active = router.pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                marginBottom: '2px',
                background: active ? 'rgba(245,158,11,0.12)' : 'transparent',
                borderLeft: active ? '2px solid var(--amber)' : '2px solid transparent',
                color: active ? 'var(--amber)' : 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: active ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                  ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                }
              }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                {item.label}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border)',
        fontSize: '11px',
        color: 'var(--text-secondary)',
      }}>
        <div style={{ marginBottom: '4px' }}>Spring 2026 West Coast Tour</div>
        <div style={{ color: 'var(--amber)', fontWeight: '600' }}>The Electric Dreams</div>
      </div>
    </aside>
  )
}

import Sidebar from './Sidebar'
import { ReactNode } from 'react'

export default function Layout({ children, title }: { children: ReactNode, title?: string }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--night)' }}>
      <Sidebar />
      <main style={{ marginLeft: '220px', flex: 1, padding: '32px', maxWidth: 'calc(100vw - 220px)' }}>
        {title && (
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '42px',
              letterSpacing: '0.04em',
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: 1,
            }}>{title}</h1>
          </div>
        )}
        {children}
      </main>
    </div>
  )
}

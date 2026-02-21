import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase, Tour, TourStop, Task } from '../lib/supabase'
import Link from 'next/link'

const TOUR_ID = 'a1111111-1111-1111-1111-111111111111'

export default function Dashboard() {
  const [tour, setTour] = useState<Tour | null>(null)
  const [stops, setStops] = useState<TourStop[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [tourRes, stopsRes, tasksRes] = await Promise.all([
        supabase.from('tours').select('*').eq('id', TOUR_ID).single(),
        supabase.from('tour_stops').select('*').eq('tour_id', TOUR_ID).order('show_date'),
        supabase.from('tasks').select('*').eq('tour_id', TOUR_ID).order('due_date'),
      ])
      if (tourRes.data) setTour(tourRes.data)
      if (stopsRes.data) setStops(stopsRes.data)
      if (tasksRes.data) setTasks(tasksRes.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const urgentTasks = tasks.filter(t => t.priority === 'urgent' || t.priority === 'high').filter(t => t.status !== 'completed')
  const upcomingStop = stops[0]

  const daysUntilTour = tour ? Math.ceil((new Date(tour.start_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null

  if (loading) return (
    <Layout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
        Loading tour data...
      </div>
    </Layout>
  )

  return (
    <Layout>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.03) 60%, transparent 100%)',
        border: '1px solid rgba(245,158,11,0.25)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden',
      }} className="fade-up fade-up-1">
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '300px', height: '100%',
          background: 'radial-gradient(circle at right, rgba(245,158,11,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ fontSize: '12px', color: 'var(--amber)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Active Tour
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', margin: '0 0 4px', letterSpacing: '0.03em' }}>
          {tour?.name}
        </h1>
        <div style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {tour?.artist_name}
        </div>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          <Stat label="Days Until Tour" value={daysUntilTour !== null ? `${daysUntilTour}` : '—'} accent />
          <Stat label="Total Shows" value={`${stops.length}`} />
          <Stat label="Crew Size" value={`${tour?.total_crew || 0}`} />
          <Stat label="Budget" value={tour?.budget ? `$${(tour.budget / 1000).toFixed(0)}K` : '—'} />
          <Stat label="Status" value={tour?.status?.toUpperCase() || '—'} />
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Next Show */}
        <div className="card fade-up fade-up-2">
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>
            First Show
          </div>
          {upcomingStop ? (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '0.02em', marginBottom: '4px' }}>
                {upcomingStop.venue_name}
              </div>
              <div style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                {upcomingStop.city}, {upcomingStop.state}
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                <span>📅 {new Date(upcomingStop.show_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span>🎤 Show: {upcomingStop.show_time}</span>
                <span>🔊 Load-in: {upcomingStop.load_in_time}</span>
              </div>
              <div style={{ marginTop: '12px' }}>
                <span className={`badge badge-${upcomingStop.status}`}>{upcomingStop.status}</span>
              </div>
            </>
          ) : <div style={{ color: 'var(--text-secondary)' }}>No upcoming shows</div>}
        </div>

        {/* Tour Route */}
        <div className="card fade-up fade-up-2">
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>
            Tour Route
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stops.map((stop, i) => (
              <div key={stop.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: 'rgba(245,158,11,0.15)', border: '1px solid var(--amber)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', color: 'var(--amber)', fontWeight: '700', flexShrink: 0,
                }}>{i + 1}</div>
                <span style={{ fontWeight: '500' }}>{stop.city}, {stop.state}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '12px', marginLeft: 'auto' }}>
                  {new Date(stop.show_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className={`badge badge-${stop.status}`}>{stop.status}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px' }}>
            <Link href="/map">
              <button className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                View on Map →
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="card fade-up fade-up-3">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Urgent Tasks ({urgentTasks.length})
          </div>
          <Link href="/tasks">
            <span style={{ fontSize: '13px', color: 'var(--amber)', cursor: 'pointer' }}>View all →</span>
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {urgentTasks.slice(0, 4).map(task => (
            <div key={task.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px', background: 'var(--rail)', borderRadius: '8px',
              border: '1px solid var(--border)',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', marginBottom: '2px' }}>{task.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Due: {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                </div>
              </div>
              <span className={`badge badge-${task.priority}`}>{task.priority}</span>
              <span className={`badge badge-${task.status}`}>{task.status.replace('_', ' ')}</span>
            </div>
          ))}
          {urgentTasks.length === 0 && (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
              ✓ All caught up!
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: accent ? '36px' : '24px',
        color: accent ? 'var(--amber)' : 'var(--text-primary)',
        letterSpacing: '0.02em',
        lineHeight: 1,
      }}>
        {value}
      </div>
    </div>
  )
}

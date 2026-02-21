import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase, TourStop } from '../lib/supabase'

const TOUR_ID = 'a1111111-1111-1111-1111-111111111111'

type GuestEntry = {
  id: string
  tour_stop_id: string
  guest_name: string
  guest_email: string
  pass_type: string
  number_of_guests: number
  approved: boolean
  notes: string
}

export default function GuestListPage() {
  const [guests, setGuests] = useState<GuestEntry[]>([])
  const [stops, setStops] = useState<TourStop[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStop, setFilterStop] = useState<string>('all')

  useEffect(() => {
    async function fetchData() {
      const stopsRes = await supabase.from('tour_stops').select('*').eq('tour_id', TOUR_ID)
      if (stopsRes.data) {
        setStops(stopsRes.data)
        const stopIds = stopsRes.data.map(s => s.id)
        const guestsRes = await supabase.from('guest_lists').select('*').in('tour_stop_id', stopIds)
        if (guestsRes.data) setGuests(guestsRes.data)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const getStop = (id: string) => stops.find(s => s.id === id)
  const filtered = filterStop === 'all' ? guests : guests.filter(g => g.tour_stop_id === filterStop)

  const passColor = (type: string) => ({
    backstage: '#f59e0b',
    vip: '#8b5cf6',
    photo_pass: '#3b82f6',
    general: '#6b7280',
    plus_one: '#22c55e',
  }[type] || '#6b7280')

  return (
    <Layout title="GUEST LIST">
      {/* Filter by show */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button onClick={() => setFilterStop('all')} style={{
          padding: '8px 16px', borderRadius: '20px', border: filterStop === 'all' ? 'none' : '1px solid var(--border)',
          background: filterStop === 'all' ? 'var(--amber)' : 'var(--stage)',
          color: filterStop === 'all' ? '#000' : 'var(--text-secondary)',
          fontSize: '13px', fontWeight: filterStop === 'all' ? '600' : '400',
          fontFamily: 'var(--font-body)', cursor: 'pointer',
        }}>All Shows ({guests.length})</button>
        {stops.map(stop => (
          <button key={stop.id} onClick={() => setFilterStop(stop.id)} style={{
            padding: '8px 16px', borderRadius: '20px',
            border: filterStop === stop.id ? 'none' : '1px solid var(--border)',
            background: filterStop === stop.id ? 'var(--amber)' : 'var(--stage)',
            color: filterStop === stop.id ? '#000' : 'var(--text-secondary)',
            fontSize: '13px', fontWeight: filterStop === stop.id ? '600' : '400',
            fontFamily: 'var(--font-body)', cursor: 'pointer',
          }}>{stop.venue_name} ({guests.filter(g => g.tour_stop_id === stop.id).length})</button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px 120px 80px 100px', gap: '12px', padding: '8px 16px', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <span>Guest</span>
            <span>Show</span>
            <span>Pass Type</span>
            <span>+Guests</span>
            <span>Status</span>
          </div>

          {filtered.map((guest, i) => {
            const stop = getStop(guest.tour_stop_id)
            return (
              <div key={guest.id} className="card fade-up" style={{ animationDelay: `${i * 0.04}s`, opacity: 0, padding: '14px 16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px 120px 80px 100px', gap: '12px', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '2px' }}>{guest.guest_name}</div>
                    {guest.guest_email && <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{guest.guest_email}</div>}
                    {guest.notes && <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', fontStyle: 'italic' }}>{guest.notes}</div>}
                  </div>
                  <div style={{ fontSize: '13px' }}>{stop?.venue_name || '—'}</div>
                  <div>
                    <span style={{
                      background: `${passColor(guest.pass_type)}22`,
                      color: passColor(guest.pass_type),
                      border: `1px solid ${passColor(guest.pass_type)}44`,
                      padding: '2px 10px', borderRadius: '20px',
                      fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase',
                    }}>{guest.pass_type?.replace('_', ' ')}</span>
                  </div>
                  <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '20px' }}>
                    {guest.number_of_guests}
                  </div>
                  <div>
                    <span style={{
                      background: guest.approved ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: guest.approved ? '#22c55e' : '#ef4444',
                      border: `1px solid ${guest.approved ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                      padding: '2px 10px', borderRadius: '20px',
                      fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase',
                    }}>{guest.approved ? 'Approved' : 'Pending'}</span>
                  </div>
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
              No guests on this list yet
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}

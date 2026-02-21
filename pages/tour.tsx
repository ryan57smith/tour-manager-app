import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase, TourStop, Hotel } from '../lib/supabase'

const TOUR_ID = 'a1111111-1111-1111-1111-111111111111'

export default function TourPage() {
  const [stops, setStops] = useState<TourStop[]>([])
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      const [stopsRes, hotelsRes] = await Promise.all([
        supabase.from('tour_stops').select('*').eq('tour_id', TOUR_ID).order('show_date'),
        supabase.from('hotels').select('*'),
      ])
      if (stopsRes.data) setStops(stopsRes.data)
      if (hotelsRes.data) setHotels(hotelsRes.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const getHotelForStop = (stopId: string) => hotels.find(h => h.tour_stop_id === stopId)

  return (
    <Layout title="TOUR STOPS">
      {loading ? (
        <div style={{ color: 'var(--text-secondary)', padding: '40px 0' }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {stops.map((stop, i) => {
            const hotel = getHotelForStop(stop.id)
            const isOpen = selected === stop.id
            return (
              <div key={stop.id} className="card fade-up" style={{ animationDelay: `${i * 0.06}s`, opacity: 0, cursor: 'pointer' }}
                onClick={() => setSelected(isOpen ? null : stop.id)}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'rgba(245,158,11,0.15)', border: '1px solid var(--amber)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--amber)', flexShrink: 0,
                  }}>{i + 1}</div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '0.02em', lineHeight: 1 }}>
                      {stop.venue_name}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
                      {stop.venue_address} · {stop.city}, {stop.state}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--amber)' }}>
                      {new Date(stop.show_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {new Date(stop.show_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })}
                    </div>
                  </div>

                  <span className={`badge badge-${stop.status}`}>{stop.status}</span>
                  <span style={{ color: 'var(--text-secondary)', marginLeft: '4px' }}>{isOpen ? '▲' : '▼'}</span>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
                      <InfoBox label="Show Time" value={stop.show_time} />
                      <InfoBox label="Load In" value={stop.load_in_time || '—'} />
                      <InfoBox label="Sound Check" value={stop.sound_check_time || '—'} />
                      <InfoBox label="Capacity" value={stop.capacity ? stop.capacity.toLocaleString() : '—'} />
                    </div>

                    {stop.notes && (
                      <div style={{ background: 'var(--rail)', borderRadius: '8px', padding: '12px', marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        📝 {stop.notes}
                      </div>
                    )}

                    {hotel && (
                      <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', padding: '14px' }}>
                        <div style={{ fontSize: '11px', color: '#3b82f6', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Hotel</div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{hotel.hotel_name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {hotel.hotel_address} · {hotel.total_rooms} rooms · Conf: {hotel.confirmation_number}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          Check-in: {hotel.check_in_date} → Check-out: {hotel.check_out_date}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'var(--rail)', borderRadius: '8px', padding: '10px 12px' }}>
      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.02em' }}>{value}</div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase, Hotel, TourStop } from '../lib/supabase'

const TOUR_ID = 'a1111111-1111-1111-1111-111111111111'

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [stops, setStops] = useState<TourStop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const stopsRes = await supabase.from('tour_stops').select('*').eq('tour_id', TOUR_ID)
      if (stopsRes.data) {
        setStops(stopsRes.data)
        const stopIds = stopsRes.data.map(s => s.id)
        const hotelsRes = await supabase.from('hotels').select('*').in('tour_stop_id', stopIds)
        if (hotelsRes.data) setHotels(hotelsRes.data)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const getStop = (stopId: string) => stops.find(s => s.id === stopId)

  return (
    <Layout title="HOTELS">
      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {hotels.map((hotel, i) => {
            const stop = getStop(hotel.tour_stop_id)
            return (
              <div key={hotel.id} className="card fade-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                <div style={{ fontSize: '11px', color: '#3b82f6', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {stop ? `${stop.city}, ${stop.state}` : 'Hotel'}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', letterSpacing: '0.02em', marginBottom: '4px' }}>
                  {hotel.hotel_name}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  {hotel.hotel_address}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ background: 'var(--rail)', borderRadius: '8px', padding: '10px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '2px' }}>Check In</div>
                    <div style={{ fontWeight: '600' }}>{hotel.check_in_date}</div>
                  </div>
                  <div style={{ background: 'var(--rail)', borderRadius: '8px', padding: '10px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '2px' }}>Check Out</div>
                    <div style={{ fontWeight: '600' }}>{hotel.check_out_date}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  <span>🛏 {hotel.total_rooms} rooms</span>
                  {hotel.contact_phone && <span>📞 {hotel.contact_phone}</span>}
                </div>

                {hotel.confirmation_number && (
                  <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Confirmation: </span>
                    <span style={{ color: 'var(--amber)', fontWeight: '600', fontFamily: 'monospace' }}>{hotel.confirmation_number}</span>
                  </div>
                )}

                {hotel.notes && (
                  <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    📝 {hotel.notes}
                  </div>
                )}
              </div>
            )
          })}
          {hotels.length === 0 && (
            <div style={{ color: 'var(--text-secondary)', padding: '40px' }}>No hotels added yet.</div>
          )}
        </div>
      )}
    </Layout>
  )
}

import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase, Travel } from '../lib/supabase'

const TOUR_ID = 'a1111111-1111-1111-1111-111111111111'

const transportIcon = (type: string) => ({
  bus: '🚌', flight: '✈️', train: '🚂', van: '🚐', other: '🚗'
}[type] || '🚗')

export default function TravelPage() {
  const [travel, setTravel] = useState<Travel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('travel').select('*').eq('tour_id', TOUR_ID).order('departure_date')
      .then(({ data }) => {
        if (data) setTravel(data)
        setLoading(false)
      })
  }, [])

  const totalCost = travel.reduce((sum, t) => sum + (t.cost || 0), 0)

  return (
    <Layout title="TRAVEL">
      {/* Summary bar */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, minWidth: '160px', padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Total Legs</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--amber)' }}>{travel.length}</div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: '160px', padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Total Cost</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px' }}>${totalCost.toLocaleString()}</div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: '160px', padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Flights</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px' }}>{travel.filter(t => t.transport_type === 'flight').length}</div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: '160px', padding: '16px 20px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Bus Legs</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px' }}>{travel.filter(t => t.transport_type === 'bus').length}</div>
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {travel.map((leg, i) => (
            <div key={leg.id} className="card fade-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* Icon */}
                <div style={{ fontSize: '32px', flexShrink: 0 }}>{transportIcon(leg.transport_type)}</div>

                {/* Route */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>{leg.from_location}</span>
                    <span style={{ color: 'var(--amber)', fontSize: '18px' }}>→</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>{leg.to_location}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '16px' }}>
                    <span>Departs: {new Date(leg.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    {leg.arrival_date && (
                      <span>Arrives: {new Date(leg.arrival_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {leg.confirmation_number && (
                    <div style={{ fontFamily: 'monospace', color: 'var(--amber)', fontWeight: '600', marginBottom: '4px' }}>
                      {leg.confirmation_number}
                    </div>
                  )}
                  {leg.cost && (
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>
                      ${leg.cost.toLocaleString()}
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'capitalize', marginTop: '4px' }}>
                    {leg.transport_type}
                  </div>
                </div>
              </div>

              {leg.notes && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  📝 {leg.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}

import { useEffect, useState, useRef } from 'react'
import Layout from '../components/Layout'
import { supabase, TourStop } from '../lib/supabase'

const TOUR_ID = 'a1111111-1111-1111-1111-111111111111'

export default function MapPage() {
  const [stops, setStops] = useState<TourStop[]>([])
  const [selected, setSelected] = useState<TourStop | null>(null)
  const [loading, setLoading] = useState(true)
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    supabase.from('tour_stops').select('*').eq('tour_id', TOUR_ID).order('show_date')
      .then(({ data }) => {
        if (data) setStops(data)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (stops.length === 0 || !mapRef.current) return

    function initMap() {
      const center = { lat: 36.5, lng: -110 }
      const map = new (window as any).google.maps.Map(mapRef.current, {
        zoom: 5,
        center,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#0a0a0f' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0a0f' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#888899' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a1a24' }] },
          { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#111118' }] },
          { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2a2a38' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#050510' }] },
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', stylers: [{ visibility: 'off' }] },
          { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#2a2a38' }] },
          { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#1a1a24' }] },
        ],
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      })
      googleMapRef.current = map

      // Draw route line
      const path = stops.map(s => ({ lat: Number(s.latitude), lng: Number(s.longitude) }))
      new (window as any).google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#f59e0b',
        strokeOpacity: 0.5,
        strokeWeight: 2,
        map,
      })

      // Add markers
      stops.forEach((stop, i) => {
        const marker = new (window as any).google.maps.Marker({
          position: { lat: Number(stop.latitude), lng: Number(stop.longitude) },
          map,
          title: stop.venue_name,
          label: {
            text: `${i + 1}`,
            color: '#000000',
            fontWeight: 'bold',
            fontSize: '12px',
          },
          icon: {
            path: (window as any).google.maps.SymbolPath.CIRCLE,
            fillColor: '#f59e0b',
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 1,
            scale: 16,
          },
        })

        marker.addListener('click', () => setSelected(stop))
        markersRef.current.push(marker)
      })

      // Fit bounds
      const bounds = new (window as any).google.maps.LatLngBounds()
      stops.forEach(s => bounds.extend({ lat: Number(s.latitude), lng: Number(s.longitude) }))
      map.fitBounds(bounds, { padding: 80 })
    }

    if ((window as any).google) {
      initMap()
    } else {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD-placeholder`
      script.async = true
      script.onload = initMap
      document.head.appendChild(script)
    }
  }, [stops])

  return (
    <Layout title="TOUR MAP">
      <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 160px)' }}>
        {/* Map */}
        <div style={{
          flex: 1,
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          position: 'relative',
          minHeight: '500px',
        }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
              Loading map...
            </div>
          ) : (
            <>
              <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
              {/* Google Maps API notice */}
              <div style={{
                position: 'absolute', bottom: '12px', left: '12px',
                background: 'rgba(10,10,15,0.9)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: 'var(--amber)',
              }}>
                ⚠️ Add your Google Maps API key in pages/map.tsx to enable the live map
              </div>
            </>
          )}
        </div>

        {/* Stop list */}
        <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
          {stops.map((stop, i) => (
            <div key={stop.id}
              onClick={() => setSelected(stop)}
              style={{
                background: selected?.id === stop.id ? 'rgba(245,158,11,0.12)' : 'var(--stage)',
                border: `1px solid ${selected?.id === stop.id ? 'var(--amber)' : 'var(--border)'}`,
                borderRadius: '10px',
                padding: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(245,158,11,0.15)', border: '1px solid var(--amber)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', color: 'var(--amber)', fontWeight: '700',
                }}>{i + 1}</div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>{stop.venue_name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{stop.city}, {stop.state}</div>
                  <div style={{ fontSize: '12px', color: 'var(--amber)', marginTop: '4px' }}>
                    {new Date(stop.show_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected stop detail */}
      {selected && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--stage)', border: '1px solid var(--amber)',
          borderRadius: '12px', padding: '16px 24px',
          display: 'flex', gap: '24px', alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          zIndex: 200,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>{selected.venue_name}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selected.venue_address}</div>
          </div>
          <div style={{ fontSize: '13px' }}>🎤 {selected.show_time}</div>
          <div style={{ fontSize: '13px' }}>👥 {selected.capacity?.toLocaleString()} cap</div>
          <span className={`badge badge-${selected.status}`}>{selected.status}</span>
          <button onClick={() => setSelected(null)} style={{
            background: 'transparent', border: 'none', color: 'var(--text-secondary)',
            cursor: 'pointer', fontSize: '18px', padding: '0',
          }}>✕</button>
        </div>
      )}
    </Layout>
  )
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Tour = {
  id: string
  name: string
  artist_name: string
  start_date: string
  end_date: string
  status: 'planning' | 'active' | 'completed' | 'cancelled'
  total_crew: number
  budget: number
  notes: string
}

export type TourStop = {
  id: string
  tour_id: string
  venue_name: string
  venue_address: string
  city: string
  state: string
  country: string
  latitude: number
  longitude: number
  show_date: string
  show_time: string
  load_in_time: string
  sound_check_time: string
  capacity: number
  notes: string
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed'
}

export type Hotel = {
  id: string
  tour_stop_id: string
  hotel_name: string
  hotel_address: string
  city: string
  state: string
  check_in_date: string
  check_out_date: string
  confirmation_number: string
  contact_phone: string
  total_rooms: number
  notes: string
}

export type Task = {
  id: string
  tour_id: string
  title: string
  description: string
  due_date: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled'
}

export type Travel = {
  id: string
  tour_id: string
  from_location: string
  to_location: string
  departure_date: string
  arrival_date: string
  transport_type: 'bus' | 'flight' | 'train' | 'van' | 'other'
  confirmation_number: string
  cost: number
  notes: string
}

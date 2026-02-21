-- Sample Data for Tour Management App
-- Run this AFTER the schema.sql file
-- This creates a sample tour with venues and crew

-- Note: You'll need to replace USER_ID_HERE with your actual user ID from Supabase Auth
-- To get your user ID: Go to Supabase Dashboard > Authentication > Users > Copy your User UUID

-- ============================================
-- SAMPLE TOUR DATA
-- ============================================

-- Insert a sample tour
INSERT INTO tours (id, name, artist_name, start_date, end_date, status, tour_manager_id, total_crew, budget, notes)
VALUES (
  'a1111111-1111-1111-1111-111111111111',
  'Spring 2026 West Coast Tour',
  'The Electric Dreams',
  '2026-03-15',
  '2026-04-05',
  'planning',
  auth.uid(), -- This will use the logged-in user's ID
  12,
  150000.00,
  'First major tour. Focus on building fanbase in key markets.'
);

-- Insert sample tour stops
INSERT INTO tour_stops (tour_id, venue_name, venue_address, city, state, country, latitude, longitude, show_date, show_time, load_in_time, sound_check_time, capacity, notes, status)
VALUES 
  (
    'a1111111-1111-1111-1111-111111111111',
    'The Fillmore',
    '1805 Geary Blvd',
    'San Francisco',
    'CA',
    'USA',
    37.7842,
    -122.4331,
    '2026-03-15',
    '20:00',
    '14:00',
    '17:00',
    1200,
    'Historic venue. Load in through rear entrance on Fillmore St.',
    'confirmed'
  ),
  (
    'a1111111-1111-1111-1111-111111111111',
    'The Troubadour',
    '9081 Santa Monica Blvd',
    'West Hollywood',
    'CA',
    'USA',
    34.0902,
    -118.3856,
    '2026-03-17',
    '21:00',
    '16:00',
    '18:30',
    500,
    'Intimate club. Minimal equipment needed. Great for fan interaction.',
    'confirmed'
  ),
  (
    'a1111111-1111-1111-1111-111111111111',
    'Red Rocks Amphitheatre',
    '18300 W Alameda Pkwy',
    'Morrison',
    'CO',
    'USA',
    39.6654,
    -105.2057,
    '2026-03-20',
    '19:30',
    '10:00',
    '15:00',
    9525,
    'Outdoor venue. Weather contingency plan needed. Bring extra layers for crew.',
    'scheduled'
  ),
  (
    'a1111111-1111-1111-1111-111111111111',
    'Stubbs BBQ',
    '801 Red River St',
    'Austin',
    'TX',
    'USA',
    30.2655,
    -97.7348,
    '2026-03-23',
    '20:00',
    '15:00',
    '17:30',
    2000,
    'SXSW showcase. High energy crowd. BBQ for crew at sound check.',
    'scheduled'
  ),
  (
    'a1111111-1111-1111-1111-111111111111',
    'House of Blues',
    '308 Euclid Ave',
    'San Diego',
    'CA',
    'USA',
    32.7065,
    -117.1605,
    '2026-03-26',
    '20:00',
    '14:00',
    '17:00',
    1100,
    'Great venue for festival-style setup. Beach day-off planned for crew.',
    'scheduled'
  );

-- Insert sample hotels
INSERT INTO hotels (tour_stop_id, hotel_name, hotel_address, city, state, check_in_date, check_out_date, confirmation_number, contact_phone, total_rooms, notes)
SELECT 
  id,
  'Hotel Zephyr',
  '250 Beach St, Fisherman''s Wharf',
  'San Francisco',
  'CA',
  '2026-03-15',
  '2026-03-17',
  'CONF-SF-2026',
  '(415) 617-6565',
  8,
  'Waterfront location. Easy load-in access to venue.'
FROM tour_stops 
WHERE venue_name = 'The Fillmore';

INSERT INTO hotels (tour_stop_id, hotel_name, hotel_address, city, state, check_in_date, check_out_date, confirmation_number, contact_phone, total_rooms, notes)
SELECT 
  id,
  'Sunset Marquis',
  '1200 Alta Loma Rd',
  'West Hollywood',
  'CA',
  '2026-03-17',
  '2026-03-19',
  'CONF-LA-2026',
  '(310) 657-1333',
  8,
  'Rock n roll hotel. Pool area reserved for crew on off day.'
FROM tour_stops 
WHERE venue_name = 'The Troubadour';

INSERT INTO hotels (tour_stop_id, hotel_name, hotel_address, city, state, check_in_date, check_out_date, confirmation_number, contact_phone, total_rooms, notes)
SELECT 
  id,
  'The ART Hotel',
  '1201 Broadway',
  'Denver',
  'CO',
  '2026-03-19',
  '2026-03-21',
  'CONF-DEN-2026',
  '(303) 572-8000',
  10,
  '45 min drive to Red Rocks. Shuttle arranged for load-in day.'
FROM tour_stops 
WHERE venue_name = 'Red Rocks Amphitheatre';

-- Insert sample crew assignment
INSERT INTO crew_assignments (tour_id, user_id, position, joined_date, is_active)
VALUES (
  'a1111111-1111-1111-1111-111111111111',
  auth.uid(),
  'Tour Manager',
  '2026-02-01',
  true
);

-- Insert sample tasks
INSERT INTO tasks (tour_id, title, description, due_date, priority, status, created_by)
VALUES 
  (
    'a1111111-1111-1111-1111-111111111111',
    'Book hotel in San Diego',
    'Need 8 rooms for March 26-27. Budget: $150/night per room',
    '2026-02-25',
    'high',
    'todo',
    auth.uid()
  ),
  (
    'a1111111-1111-1111-1111-111111111111',
    'Confirm ground transport SF to LA',
    'Need tour bus confirmation from San Francisco to Los Angeles. Departs March 17 after show.',
    '2026-02-28',
    'high',
    'in_progress',
    auth.uid()
  ),
  (
    'a1111111-1111-1111-1111-111111111111',
    'Create set list for Red Rocks',
    'Special outdoor show - plan extended set with acoustic segment',
    '2026-03-10',
    'medium',
    'todo',
    auth.uid()
  ),
  (
    'a1111111-1111-1111-1111-111111111111',
    'Order merch inventory',
    'Need 500 t-shirts, 200 hoodies, 100 posters delivered to SF venue by March 14',
    '2026-02-22',
    'urgent',
    'todo',
    auth.uid()
  );

-- Insert sample set list for The Fillmore show
INSERT INTO set_lists (tour_stop_id, song_order, song_title, duration_minutes)
SELECT 
  id,
  1,
  'Electric Sunrise',
  4
FROM tour_stops 
WHERE venue_name = 'The Fillmore'
UNION ALL
SELECT 
  id,
  2,
  'Neon Dreams',
  5
FROM tour_stops 
WHERE venue_name = 'The Fillmore'
UNION ALL
SELECT 
  id,
  3,
  'Highway Soul',
  6
FROM tour_stops 
WHERE venue_name = 'The Fillmore'
UNION ALL
SELECT 
  id,
  4,
  'Desert Lights',
  4
FROM tour_stops 
WHERE venue_name = 'The Fillmore'
UNION ALL
SELECT 
  id,
  5,
  'Cosmic Radio',
  7
FROM tour_stops 
WHERE venue_name = 'The Fillmore';

-- Insert sample guest list entries
INSERT INTO guest_lists (tour_stop_id, guest_name, guest_email, pass_type, number_of_guests, approved, notes)
SELECT 
  id,
  'Sarah Mitchell',
  'sarah.m@email.com',
  'backstage',
  2,
  true,
  'Record label A&R - VIP treatment'
FROM tour_stops 
WHERE venue_name = 'The Fillmore'
UNION ALL
SELECT 
  id,
  'Mike Chen',
  'mike.chen@musicblog.com',
  'photo_pass',
  1,
  true,
  'Music journalist - approved for first 3 songs'
FROM tour_stops 
WHERE venue_name = 'The Fillmore'
UNION ALL
SELECT 
  id,
  'Jessica Rodriguez',
  'jess.r@gmail.com',
  'vip',
  4,
  false,
  'Pending approval from band'
FROM tour_stops 
WHERE venue_name = 'The Troubadour';

-- Insert sample travel
INSERT INTO travel (tour_id, from_location, to_location, departure_date, arrival_date, transport_type, confirmation_number, cost, notes)
VALUES 
  (
    'a1111111-1111-1111-1111-111111111111',
    'San Francisco, CA',
    'Los Angeles, CA',
    '2026-03-17 23:00:00',
    '2026-03-18 05:30:00',
    'bus',
    'BUS-SF-LA-001',
    3500.00,
    'Overnight bus - sleeper coach. Departs after SF show, arrives early morning LA.'
  ),
  (
    'a1111111-1111-1111-1111-111111111111',
    'Los Angeles, CA',
    'Denver, CO',
    '2026-03-19 08:00:00',
    '2026-03-19 11:15:00',
    'flight',
    'UA1234',
    4800.00,
    'United Airlines - 12 crew members. Equipment shipped separately via freight.'
  ),
  (
    'a1111111-1111-1111-1111-111111111111',
    'Denver, CO',
    'Austin, TX',
    '2026-03-21 14:00:00',
    '2026-03-21 17:45:00',
    'flight',
    'SW5678',
    3600.00,
    'Southwest Airlines - direct flight. Instruments as checked baggage.'
  );

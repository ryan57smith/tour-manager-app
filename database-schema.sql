-- Tour Management App Database Schema
-- Copy and paste this entire file into Supabase SQL Editor

-- ============================================
-- TABLES
-- ============================================

-- Users/Crew Members Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('tour_manager', 'crew', 'artist', 'admin')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tours Table
CREATE TABLE tours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT CHECK (status IN ('planning', 'active', 'completed', 'cancelled')) DEFAULT 'planning',
  tour_manager_id UUID REFERENCES profiles(id),
  total_crew INTEGER DEFAULT 0,
  budget DECIMAL(12, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tour Stops/Shows Table
CREATE TABLE tour_stops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE NOT NULL,
  venue_name TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT DEFAULT 'USA',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  load_in_time TIME,
  sound_check_time TIME,
  capacity INTEGER,
  ticket_sales INTEGER DEFAULT 0,
  notes TEXT,
  status TEXT CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')) DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hotels Table
CREATE TABLE hotels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_stop_id UUID REFERENCES tour_stops(id) ON DELETE CASCADE NOT NULL,
  hotel_name TEXT NOT NULL,
  hotel_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  confirmation_number TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  total_rooms INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crew Assignments Table
CREATE TABLE crew_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  position TEXT NOT NULL, -- e.g., 'sound engineer', 'stage manager', 'lighting tech'
  joined_date DATE NOT NULL,
  left_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tour_id, user_id, position)
);

-- Travel/Transportation Table
CREATE TABLE travel (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE NOT NULL,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  departure_date TIMESTAMP WITH TIME ZONE NOT NULL,
  arrival_date TIMESTAMP WITH TIME ZONE,
  transport_type TEXT CHECK (transport_type IN ('bus', 'flight', 'train', 'van', 'other')),
  confirmation_number TEXT,
  cost DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set Lists Table
CREATE TABLE set_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_stop_id UUID REFERENCES tour_stops(id) ON DELETE CASCADE NOT NULL,
  song_order INTEGER NOT NULL,
  song_title TEXT NOT NULL,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guest List Table
CREATE TABLE guest_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_stop_id UUID REFERENCES tour_stops(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  pass_type TEXT CHECK (pass_type IN ('backstage', 'vip', 'general', 'photo_pass', 'plus_one')),
  number_of_guests INTEGER DEFAULT 1,
  approved BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks/To-Do Items Table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
  tour_stop_id UUID REFERENCES tour_stops(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES profiles(id),
  due_date TIMESTAMP WITH TIME ZONE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('todo', 'in_progress', 'completed', 'cancelled')) DEFAULT 'todo',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES (for faster queries)
-- ============================================

CREATE INDEX idx_tour_stops_tour_id ON tour_stops(tour_id);
CREATE INDEX idx_tour_stops_date ON tour_stops(show_date);
CREATE INDEX idx_hotels_tour_stop_id ON hotels(tour_stop_id);
CREATE INDEX idx_crew_assignments_tour_id ON crew_assignments(tour_id);
CREATE INDEX idx_crew_assignments_user_id ON crew_assignments(user_id);
CREATE INDEX idx_travel_tour_id ON travel(tour_id);
CREATE INDEX idx_tasks_tour_id ON tasks(tour_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel ENABLE ROW LEVEL SECURITY;
ALTER TABLE set_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Tours: Users can see tours they're assigned to
CREATE POLICY "Users can view tours they're part of" 
  ON tours FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT user_id FROM crew_assignments WHERE tour_id = tours.id
    ) OR tour_manager_id = auth.uid()
  );

CREATE POLICY "Tour managers can manage their tours" 
  ON tours FOR ALL 
  USING (tour_manager_id = auth.uid());

-- Tour Stops: Users can see stops for tours they're part of
CREATE POLICY "Users can view tour stops for their tours" 
  ON tour_stops FOR SELECT 
  USING (
    tour_id IN (
      SELECT tour_id FROM crew_assignments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Tour managers can manage tour stops" 
  ON tour_stops FOR ALL 
  USING (
    tour_id IN (
      SELECT id FROM tours WHERE tour_manager_id = auth.uid()
    )
  );

-- Hotels: Same as tour stops
CREATE POLICY "Users can view hotels for their tours" 
  ON hotels FOR SELECT 
  USING (
    tour_stop_id IN (
      SELECT id FROM tour_stops WHERE tour_id IN (
        SELECT tour_id FROM crew_assignments WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Tour managers can manage hotels" 
  ON hotels FOR ALL 
  USING (
    tour_stop_id IN (
      SELECT ts.id FROM tour_stops ts
      JOIN tours t ON ts.tour_id = t.id
      WHERE t.tour_manager_id = auth.uid()
    )
  );

-- Crew Assignments: Users can see crew for tours they're on
CREATE POLICY "Users can view crew assignments for their tours" 
  ON crew_assignments FOR SELECT 
  USING (
    tour_id IN (
      SELECT tour_id FROM crew_assignments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Tour managers can manage crew assignments" 
  ON crew_assignments FOR ALL 
  USING (
    tour_id IN (
      SELECT id FROM tours WHERE tour_manager_id = auth.uid()
    )
  );

-- Travel: Users can see travel for their tours
CREATE POLICY "Users can view travel for their tours" 
  ON travel FOR SELECT 
  USING (
    tour_id IN (
      SELECT tour_id FROM crew_assignments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Tour managers can manage travel" 
  ON travel FOR ALL 
  USING (
    tour_id IN (
      SELECT id FROM tours WHERE tour_manager_id = auth.uid()
    )
  );

-- Set Lists: Users can view set lists
CREATE POLICY "Users can view set lists for their tours" 
  ON set_lists FOR SELECT 
  USING (
    tour_stop_id IN (
      SELECT id FROM tour_stops WHERE tour_id IN (
        SELECT tour_id FROM crew_assignments WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Tour managers can manage set lists" 
  ON set_lists FOR ALL 
  USING (
    tour_stop_id IN (
      SELECT ts.id FROM tour_stops ts
      JOIN tours t ON ts.tour_id = t.id
      WHERE t.tour_manager_id = auth.uid()
    )
  );

-- Guest Lists: Users can view guest lists
CREATE POLICY "Users can view guest lists for their tours" 
  ON guest_lists FOR SELECT 
  USING (
    tour_stop_id IN (
      SELECT id FROM tour_stops WHERE tour_id IN (
        SELECT tour_id FROM crew_assignments WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Tour managers can manage guest lists" 
  ON guest_lists FOR ALL 
  USING (
    tour_stop_id IN (
      SELECT ts.id FROM tour_stops ts
      JOIN tours t ON ts.tour_id = t.id
      WHERE t.tour_manager_id = auth.uid()
    )
  );

-- Tasks: Users can see tasks assigned to them or for their tours
CREATE POLICY "Users can view their tasks" 
  ON tasks FOR SELECT 
  USING (
    assigned_to = auth.uid() OR
    tour_id IN (
      SELECT tour_id FROM crew_assignments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Tour managers can manage tasks" 
  ON tasks FOR ALL 
  USING (
    tour_id IN (
      SELECT id FROM tours WHERE tour_manager_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON tours
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tour_stops_updated_at BEFORE UPDATE ON tour_stops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON hotels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crew_assignments_updated_at BEFORE UPDATE ON crew_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_travel_updated_at BEFORE UPDATE ON travel
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

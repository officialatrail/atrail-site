import { createClient } from '@supabase/supabase-js';

// The anon key is safe to expose in frontend code - Supabase access control
// is enforced by Row Level Security policies on the database side, not by
// hiding this key.
const SUPABASE_URL = 'https://bmyjwttuqlwddiffdlkw.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJteWp3dHR1cWx3ZGRpZmZkbGt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MzExMjAsImV4cCI6MjA5NzMwNzEyMH0.7q_xIQAeshGYsjR177UEoVOsW7gZw-K0zRqxsv4Adv8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

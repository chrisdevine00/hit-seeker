// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kuutnqehwiyhdkipoevg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dXRucWVod2l5aGRraXBvZXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjk0NDksImV4cCI6MjA4MTY0NTQ0OX0.3e5cMpUA2hmNC436sn8ygy1fl9b59UneHByjtFb1Rek';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

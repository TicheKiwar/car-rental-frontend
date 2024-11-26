import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rrakbrzjofjsrrdzkxtt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyYWticnpqb2Zqc3JyZHpreHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1Nzc4MjMsImV4cCI6MjA0NjE1MzgyM30.4ost6UauvY6WaKTXgQ1JwmMmu0q_dbhAY-hvpV-fPJ4'
export const supabase = createClient(supabaseUrl, supabaseKey);

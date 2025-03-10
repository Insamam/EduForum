import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vmqgropcjokjxhasoadn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtcWdyb3Bjam9ranhoYXNvYWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMjc5MzMsImV4cCI6MjA1NjkwMzkzM30.Nm6eARngA9rr6HBfaFwZHPbBoF9kwcMLqOIVSHSU61E";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
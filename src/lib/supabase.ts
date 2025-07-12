import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nqcnwmjquqtflebaisxy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xY253bWpxdXF0ZmxlYmFpc3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMjY1NjQsImV4cCI6MjA2NzgwMjU2NH0.eGqEDMwP87g24F-pOOkHjVOWtb709bXFI6fRoZPCa04';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          is_main_subject: boolean;
          final_grade: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          is_main_subject: boolean;
          final_grade?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          is_main_subject?: boolean;
          final_grade?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      grades: {
        Row: {
          id: string;
          subject_id: string;
          user_id: string;
          type: 'SA' | 'Ex' | 'MÜ' | 'M' | 'E';
          value: number;
          weight: number;
          description: string | null;
          date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          user_id: string;
          type: 'SA' | 'Ex' | 'MÜ' | 'M' | 'E';
          value: number;
          weight: number;
          description?: string | null;
          date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          subject_id?: string;
          user_id?: string;
          type?: 'SA' | 'Ex' | 'MÜ' | 'M' | 'E';
          value?: number;
          weight?: number;
          description?: string | null;
          date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
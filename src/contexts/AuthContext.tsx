import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Subject, Grade } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  syncSubjects: (subjects: Subject[]) => Promise<void>;
  loadSubjects: () => Promise<Subject[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log('🔄 Auth initialization started');
        
        // Get current session - this should not throw errors for unauthenticated users
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Session error (expected for unauthenticated users):', error.message);
        }
        
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          
          if (session?.user) {
            console.log('✅ User authenticated:', session.user.email);
          } else {
            console.log('🔓 No active session - user needs to log in');
          }
        }
      } catch (error) {
        console.log('⚠️ Auth initialization error (handled gracefully):', error);
        if (isMounted) {
          // Even if there's an error, we should set loading to false and continue
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event);
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          console.log('✅ User authenticated:', session.user.email);
        } else {
          console.log('🧹 User logged out');
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Sign out error:', error);
    }
  };

  const syncSubjects = async (subjects: Subject[]) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // First, delete all existing subjects for this user
      await supabase.from('subjects').delete().eq('user_id', user.id);

      // Insert new subjects - let database generate UUIDs
      for (const subject of subjects) {
        const { data: insertedSubject, error: subjectError } = await supabase
          .from('subjects')
          .insert({
            user_id: user.id,
            name: subject.name,
            is_main_subject: subject.isMainSubject,
            final_grade: subject.finalGrade || null,
          })
          .select()
          .single();

        if (subjectError) throw subjectError;

        // Insert grades for this subject using the database-generated subject ID
        if (subject.grades.length > 0) {
          const gradeInserts = subject.grades.map(grade => ({
            subject_id: insertedSubject.id,
            user_id: user.id,
            type: grade.type,
            value: grade.value,
            weight: grade.weight,
            description: grade.description || null,
            date: grade.date.toISOString().split('T')[0],
          }));

          const { error: gradesError } = await supabase
            .from('grades')
            .insert(gradeInserts);

          if (gradesError) throw gradesError;
        }
      }
    } catch (error) {
      console.error('Error syncing subjects:', error);
      throw error;
    }
  };

  const loadSubjects = async (): Promise<Subject[]> => {
    if (!user) {
      return [];
    }

    try {
      // Load subjects
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (subjectsError) throw subjectsError;

      // Load grades for all subjects
      const { data: gradesData, error: gradesError } = await supabase
        .from('grades')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (gradesError) throw gradesError;

      // Combine subjects with their grades
      const subjects: Subject[] = (subjectsData || []).map(subject => ({
        id: subject.id,
        name: subject.name,
        isMainSubject: subject.is_main_subject,
        finalGrade: subject.final_grade || undefined,
        grades: (gradesData || [])
          .filter(grade => grade.subject_id === subject.id)
          .map(grade => ({
            id: grade.id,
            type: grade.type as Grade['type'],
            value: Number(grade.value),
            weight: Number(grade.weight),
            description: grade.description || undefined,
            date: new Date(grade.date + 'T00:00:00'),
          })),
      }));

      return subjects;
    } catch (error) {
      console.error('Error loading subjects:', error);
      return [];
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    syncSubjects,
    loadSubjects,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
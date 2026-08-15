export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          target_company: string | null
          interview_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          target_company?: string | null
          interview_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          target_company?: string | null
          interview_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      problems: {
        Row: {
          id: string
          slug: string
          title: string
          difficulty: 'Easy' | 'Medium' | 'Hard'
          category: string
          description_md: string
          total_duration_minutes: number
          phases: Json
          files: Json
          test_cases: Json
          canonical_solution: string | null
          ai_bug_instructions: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          title: string
          difficulty: 'Easy' | 'Medium' | 'Hard'
          category: string
          description_md: string
          total_duration_minutes?: number
          phases?: Json
          files?: Json
          test_cases?: Json
          canonical_solution?: string | null
          ai_bug_instructions?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          difficulty?: 'Easy' | 'Medium' | 'Hard'
          category?: string
          description_md?: string
          total_duration_minutes?: number
          phases?: Json
          files?: Json
          test_cases?: Json
          canonical_solution?: string | null
          ai_bug_instructions?: string | null
          created_at?: string | null
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          problem_id: string
          started_at: string | null
          ended_at: string | null
          help_mode: boolean | null
          current_phase: number | null
          phases_completed: number | null
          phases_skipped: number | null
          total_ai_messages: number | null
          ai_edits_accepted: number | null
          ai_edits_rejected: number | null
          test_runs: number | null
          lines_written: number | null
          lines_ai_accepted: number | null
          phase1_answers: Json | null
          chat_transcript: Json | null
          editor_state: Json | null
          score_approach: number | null
          score_control: number | null
          score_verification: number | null
          score_communication: number | null
          score_rationale: Json | null
          status: 'in_progress' | 'completed' | 'abandoned' | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          problem_id: string
          started_at?: string | null
          ended_at?: string | null
          help_mode?: boolean | null
          current_phase?: number | null
          phases_completed?: number | null
          phases_skipped?: number | null
          total_ai_messages?: number | null
          ai_edits_accepted?: number | null
          ai_edits_rejected?: number | null
          test_runs?: number | null
          lines_written?: number | null
          lines_ai_accepted?: number | null
          phase1_answers?: Json | null
          chat_transcript?: Json | null
          editor_state?: Json | null
          score_approach?: number | null
          score_control?: number | null
          score_verification?: number | null
          score_communication?: number | null
          score_rationale?: Json | null
          status?: 'in_progress' | 'completed' | 'abandoned' | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          problem_id?: string
          started_at?: string | null
          ended_at?: string | null
          help_mode?: boolean | null
          current_phase?: number | null
          phases_completed?: number | null
          phases_skipped?: number | null
          total_ai_messages?: number | null
          ai_edits_accepted?: number | null
          ai_edits_rejected?: number | null
          test_runs?: number | null
          lines_written?: number | null
          lines_ai_accepted?: number | null
          phase1_answers?: Json | null
          chat_transcript?: Json | null
          editor_state?: Json | null
          score_approach?: number | null
          score_control?: number | null
          score_verification?: number | null
          score_communication?: number | null
          score_rationale?: Json | null
          status?: 'in_progress' | 'completed' | 'abandoned' | null
          created_at?: string | null
        }
      }
      bug_reports: {
        Row: {
          id: string
          user_id: string | null
          problem_id: string | null
          session_id: string | null
          bug_type: 'ai_wrong' | 'code_wont_run' | 'problem_text' | 'ui_bug' | 'other'
          description: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          problem_id?: string | null
          session_id?: string | null
          bug_type: 'ai_wrong' | 'code_wont_run' | 'problem_text' | 'ui_bug' | 'other'
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          problem_id?: string | null
          session_id?: string | null
          bug_type?: 'ai_wrong' | 'code_wont_run' | 'problem_text' | 'ui_bug' | 'other'
          description?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

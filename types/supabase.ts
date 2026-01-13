export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          domain: string | null
          verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          domain?: string | null
          verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string | null
          verified?: boolean
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string | null
          phone: string | null
          url: string | null
          email: string | null
          hours: string | null
          fees: string | null
          eligibility: string | null
          application_process: string | null
          languages: string[] | null
          bus_routes: string[] | null
          accessibility: Json | null
          last_verified: string | null
          verification_status: string | null
          name_fr: string | null
          description_fr: string | null
          address_fr: string | null
          org_id: string | null
          category: string | null
          tags: Json | null
          embedding: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          address?: string | null
          phone?: string | null
          url?: string | null
          email?: string | null
          hours?: string | null
          fees?: string | null
          eligibility?: string | null
          application_process?: string | null
          languages?: string[] | null
          bus_routes?: string[] | null
          accessibility?: Json | null
          last_verified?: string | null
          verification_status?: string | null
          name_fr?: string | null
          description_fr?: string | null
          address_fr?: string | null
          org_id?: string | null
          category?: string | null
          tags?: Json | null
          embedding?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string | null
          phone?: string | null
          url?: string | null
          email?: string | null
          hours?: string | null
          fees?: string | null
          eligibility?: string | null
          application_process?: string | null
          languages?: string[] | null
          bus_routes?: string[] | null
          accessibility?: Json | null
          last_verified?: string | null
          verification_status?: string | null
          name_fr?: string | null
          description_fr?: string | null
          address_fr?: string | null
          org_id?: string | null
          category?: string | null
          tags?: Json | null
          embedding?: string | null
          created_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          service_id: string | null
          feedback_type: "helpful_yes" | "helpful_no" | "issue" | "not_found"
          message: string | null
          category_searched: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          service_id?: string | null
          feedback_type: "helpful_yes" | "helpful_no" | "issue" | "not_found"
          message?: string | null
          category_searched?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          service_id?: string | null
          feedback_type?: "helpful_yes" | "helpful_no" | "issue" | "not_found"
          message?: string | null
          category_searched?: string | null
          status?: string
          created_at?: string
        }
      }
      service_update_requests: {
        Row: {
          id: string
          service_id: string
          requested_by: string
          updates: Json
          justification: string
          status: "pending" | "approved" | "rejected"
          created_at: string
        }
        Insert: {
          id?: string
          service_id: string
          requested_by: string
          updates: Json
          justification: string
          status?: "pending" | "approved" | "rejected"
          created_at?: string
        }
        Update: {
          id?: string
          service_id?: string
          requested_by?: string
          updates?: Json
          justification?: string
          status?: "pending" | "approved" | "rejected"
          created_at?: string
        }
      }
      plain_language_summaries: {
        Row: {
          service_id: string
          summary: string
          generated_at: string
          model_used: string
        }
        Insert: {
          service_id: string
          summary: string
          generated_at?: string
          model_used: string
        }
        Update: {
          service_id?: string
          summary?: string
          generated_at?: string
          model_used?: string
        }
      }
    }
    Views: {
      unmet_needs_summary: {
        Row: {
          category_searched: string
          request_count: number
          last_requested_at: string
        }
      }
      feedback_aggregations: {
        Row: {
          service_id: string
          total_feedback: number
          helpful_count: number
          not_helpful_count: number
          open_issues_count: number
          last_feedback_at: string | null
        }
      }
    }
  }
}

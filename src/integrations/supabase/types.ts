export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      pagine: {
        Row: {
          id: string
          slug: string
          titolo: string
          meta_descrizione: string | null
          aggiornato_il: string
        }
        Insert: {
          id?: string
          slug: string
          titolo: string
          meta_descrizione?: string | null
          aggiornato_il?: string
        }
        Update: {
          id?: string
          slug?: string
          titolo?: string
          meta_descrizione?: string | null
          aggiornato_il?: string
        }
        Relationships: []
      }
      sezioni: {
        Row: {
          id: string
          pagina_slug: string | null
          tipo: string
          ordine: number
          contenuto: any
          contenuto_bozza: any
          visibile: boolean
          creato_il: string
        }
        Insert: {
          id?: string
          pagina_slug?: string | null
          tipo: string
          ordine: number
          contenuto?: any
          contenuto_bozza?: any
          visibile?: boolean
          creato_il?: string
        }
        Update: {
          id?: string
          pagina_slug?: string | null
          tipo?: string
          ordine?: number
          contenuto?: any
          contenuto_bozza?: any
          visibile?: boolean
          creato_il?: string
        }
        Relationships: [
          {
            foreignKeyName: "sezioni_pagina_slug_fkey"
            columns: ["pagina_slug"]
            isOneToOne: false
            referencedRelation: "pagine"
            referencedColumns: ["slug"]
          }
        ]
      }
      media: {
        Row: {
          id: string
          nome: string
          url: string
          tipo: string | null
          caricato_il: string
        }
        Insert: {
          id?: string
          nome: string
          url: string
          tipo?: string | null
          caricato_il?: string
        }
        Update: {
          id?: string
          nome?: string
          url?: string
          tipo?: string | null
          caricato_il?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          id: string
          created_at: string
          url: string
          caption: string
          category: string
        }
        Insert: {
          id?: string
          created_at?: string
          url: string
          caption: string
          category: string
        }
        Update: {
          id?: string
          created_at?: string
          url?: string
          caption?: string
          category?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          url: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          url: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          url?: string
        }
        Relationships: []
      }
      online_articles: {
        Row: {
          id: string
          created_at: string
          source: string
          date: string
          title: string
          description: string
          tags: string[]
          url: string
        }
        Insert: {
          id?: string
          created_at?: string
          source: string
          date: string
          title: string
          description: string
          tags?: string[]
          url: string
        }
        Update: {
          id?: string
          created_at?: string
          source?: string
          date?: string
          title?: string
          description?: string
          tags?: string[]
          url?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          date: string | null
          attachment_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          date?: string | null
          attachment_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          date?: string | null
          attachment_url?: string | null
        }
        Relationships: []
      }
      collaborations: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          url: string
          image_url: string | null
          attachment_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          url: string
          image_url?: string | null
          attachment_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          url?: string
          image_url?: string | null
          attachment_url?: string | null
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

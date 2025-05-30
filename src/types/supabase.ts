export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assets: {
        Row: {
          asset_type: string
          blockchain: string | null
          collateral_ratio: number | null
          collateralization_status: string
          created_at: string | null
          current_value: number
          description: string | null
          documents: Json | null
          id: string
          location: string | null
          name: string
          original_value: number
          token_address: string | null
          updated_at: string | null
          user_id: string | null
          verification_status: string
        }
        Insert: {
          asset_type: string
          blockchain?: string | null
          collateral_ratio?: number | null
          collateralization_status?: string
          created_at?: string | null
          current_value?: number
          description?: string | null
          documents?: Json | null
          id?: string
          location?: string | null
          name: string
          original_value?: number
          token_address?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string
        }
        Update: {
          asset_type?: string
          blockchain?: string | null
          collateral_ratio?: number | null
          collateralization_status?: string
          created_at?: string | null
          current_value?: number
          description?: string | null
          documents?: Json | null
          id?: string
          location?: string | null
          name?: string
          original_value?: number
          token_address?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string
        }
        Relationships: []
      }
      cross_chain_positions: {
        Row: {
          asset_address: string
          asset_symbol: string
          balance: number
          blockchain: string
          created_at: string | null
          id: string
          position_type: string
          updated_at: string | null
          usd_value: number
          user_id: string | null
        }
        Insert: {
          asset_address: string
          asset_symbol: string
          balance?: number
          blockchain: string
          created_at?: string | null
          id?: string
          position_type?: string
          updated_at?: string | null
          usd_value?: number
          user_id?: string | null
        }
        Update: {
          asset_address?: string
          asset_symbol?: string
          balance?: number
          blockchain?: string
          created_at?: string | null
          id?: string
          position_type?: string
          updated_at?: string | null
          usd_value?: number
          user_id?: string | null
        }
        Relationships: []
      }
      loans: {
        Row: {
          asset_id: string | null
          blockchain: string | null
          created_at: string | null
          id: string
          interest_rate: number
          loan_amount: number
          loan_status: string
          loan_term_months: number
          monthly_payment: number
          next_payment_date: string
          outstanding_balance: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          asset_id?: string | null
          blockchain?: string | null
          created_at?: string | null
          id?: string
          interest_rate: number
          loan_amount: number
          loan_status?: string
          loan_term_months: number
          monthly_payment: number
          next_payment_date: string
          outstanding_balance: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          asset_id?: string | null
          blockchain?: string | null
          created_at?: string | null
          id?: string
          interest_rate?: number
          loan_amount?: number
          loan_status?: string
          loan_term_months?: number
          monthly_payment?: number
          next_payment_date?: string
          outstanding_balance?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loans_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          blockchain: string | null
          created_at: string | null
          crypto_currency: string | null
          currency: string
          exchange_rate: number | null
          id: string
          loan_id: string | null
          payment_date: string | null
          payment_status: string
          transaction_hash: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          blockchain?: string | null
          created_at?: string | null
          crypto_currency?: string | null
          currency?: string
          exchange_rate?: number | null
          id?: string
          loan_id?: string | null
          payment_date?: string | null
          payment_status?: string
          transaction_hash?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          blockchain?: string | null
          created_at?: string | null
          crypto_currency?: string | null
          currency?: string
          exchange_rate?: number | null
          id?: string
          loan_id?: string | null
          payment_date?: string | null
          payment_status?: string
          transaction_hash?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          image: string | null
          name: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          name?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          name?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
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
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

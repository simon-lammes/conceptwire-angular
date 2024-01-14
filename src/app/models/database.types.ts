export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      books: {
        Row: {
          author: string
          ibsn_13: string
          id: string
          image_id: string | null
          owner_id: string | null
          published: string
          publisher: string
          title: string
        }
        Insert: {
          author: string
          ibsn_13: string
          id?: string
          image_id?: string | null
          owner_id?: string | null
          published: string
          publisher: string
          title: string
        }
        Update: {
          author?: string
          ibsn_13?: string
          id?: string
          image_id?: string | null
          owner_id?: string | null
          published?: string
          publisher?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "image_resource_descriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      exercise_reviews: {
        Row: {
          approving: boolean
          comment: string
          exercise_id: string
          reviewer_id: string
        }
        Insert: {
          approving: boolean
          comment: string
          exercise_id: string
          reviewer_id: string
        }
        Update: {
          approving?: boolean
          comment?: string
          exercise_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_reviews_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      exercise_tag_links: {
        Row: {
          exercise_id: string
          tag_id: string
        }
        Insert: {
          exercise_id: string
          tag_id: string
        }
        Update: {
          exercise_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_tag_links_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_tag_links_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      exercises: {
        Row: {
          content: string
          created_at: string
          id: string
          is_added_to_review: boolean
          owner_id: string | null
          publisher_id: string | null
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          is_added_to_review?: boolean
          owner_id?: string | null
          publisher_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_added_to_review?: boolean
          owner_id?: string | null
          publisher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercises_publisher_id_fkey"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      experiences: {
        Row: {
          exercise_id: string
          interest_level: number
          last_seen: string | null
          status: Database["public"]["Enums"]["experience_status"]
          streak: number
          user_id: string
        }
        Insert: {
          exercise_id: string
          interest_level?: number
          last_seen?: string | null
          status?: Database["public"]["Enums"]["experience_status"]
          streak?: number
          user_id: string
        }
        Update: {
          exercise_id?: string
          interest_level?: number
          last_seen?: string | null
          status?: Database["public"]["Enums"]["experience_status"]
          streak?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiences_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experiences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      image_resource_descriptions: {
        Row: {
          author: string
          description: string
          id: string
          license_id: string | null
          owner_id: string | null
          path: string
          source: string
        }
        Insert: {
          author?: string
          description?: string
          id?: string
          license_id?: string | null
          owner_id?: string | null
          path: string
          source?: string
        }
        Update: {
          author?: string
          description?: string
          id?: string
          license_id?: string | null
          owner_id?: string | null
          path?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_resource_descriptions_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "image_resource_descriptions_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      interests: {
        Row: {
          interest_level: number
          tag_id: string
          user_id: string
        }
        Insert: {
          interest_level: number
          tag_id: string
          user_id: string
        }
        Update: {
          interest_level?: number
          tag_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interests_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      licenses: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      paths: {
        Row: {
          array_agg: string[] | null
        }
        Insert: {
          array_agg?: string[] | null
        }
        Update: {
          array_agg?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          display_name: string
          id: string
        }
        Insert: {
          display_name?: string
          id?: string
        }
        Update: {
          display_name?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reviewer_privileges: {
        Row: {
          can_publish: boolean
          profile_id: string
        }
        Insert: {
          can_publish?: boolean
          profile_id: string
        }
        Update: {
          can_publish?: boolean
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviewer_privileges_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      tag_experiences: {
        Row: {
          created_missing_experiences_at: string | null
          profile_id: string
          tag_id: string
        }
        Insert: {
          created_missing_experiences_at?: string | null
          profile_id?: string
          tag_id: string
        }
        Update: {
          created_missing_experiences_at?: string | null
          profile_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tag_experiences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tag_experiences_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      tag_relations: {
        Row: {
          child_tag_id: string
          parent_tag_id: string
        }
        Insert: {
          child_tag_id: string
          parent_tag_id: string
        }
        Update: {
          child_tag_id?: string
          parent_tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tag_relations_child_tag_id_fkey"
            columns: ["child_tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tag_relations_parent_tag_id_fkey"
            columns: ["parent_tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      tags: {
        Row: {
          id: string
          image_id: string | null
          name: string
          owner_id: string | null
        }
        Insert: {
          id?: string
          image_id?: string | null
          name: string
          owner_id?: string | null
        }
        Update: {
          id?: string
          image_id?: string | null
          name?: string
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "image_resource_descriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tags_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_missing_experiences: {
        Args: {
          input_tag_id: string
        }
        Returns: {
          missing_exercise_id: string
        }[]
      }
    }
    Enums: {
      experience_status: "too_advanced" | "default" | "easy" | "veryEasy"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

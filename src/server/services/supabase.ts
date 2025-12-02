// src/server/services/supabase.ts

import { createClient } from '@supabase/supabase-js';

// Define the Supabase client type for better type inference
// This should match the client initiated in your Supabase setup
type SupabaseClient = ReturnType<typeof createClient>;

export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseAnonKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  /**
   * Generates a presigned URL for uploading a file to Supabase Storage.
   * This is a placeholder and needs to be fully implemented.
   * @param bucket The name of the storage bucket.
   * @param path The full path including the filename in the bucket where the file will be stored.
   * @param options Additional options for generating the signed URL.
   * @returns A promise that resolves to an object containing the signed URL and the full file path.
   */
  async createSignedUploadUrl(
    bucket: string,
    path: string,
    options?: {
      /** The number of seconds the signed URL is valid for. Defaults to 60 seconds. */
      expiresIn?: number;
      /** The content-type header of the file. */
      contentType?: string;
      /** The maximum size of the file in bytes. */
      maxSize?: number;
    }
  ): Promise<{ signedUrl: string; filePath: string } | null> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path, {
        upsert: true, // Allow overwriting existing files
        ...options,
      });

    if (error) {
      console.error("Error generating signed upload URL:", error);
      throw new Error(`Failed to create signed upload URL: ${error.message}`);
    }

    if (data && data.signedUrl) {
      return {
        signedUrl: data.signedUrl,
        filePath: data.path, // Supabase returns the path, not the full file path.
      };
    }
    return null;
  }

  // Add other Supabase related methods here as needed, e.g., for downloading, deleting, listing files.
}

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
      })
    : null;

export const STORAGE_BUCKETS = {
  covers: "covers",
  avatars: "avatars",
  resumes: "resumes",
} as const;

export async function uploadFile(
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string,
  file: Buffer | ArrayBuffer,
  contentType: string,
): Promise<string | null> {
  if (!supabaseAdmin) {
    console.warn("Supabase not configured — file upload skipped");
    return null;
  }

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKETS[bucket])
    .upload(path, file, { contentType, upsert: true });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const { data } = supabaseAdmin.storage
    .from(STORAGE_BUCKETS[bucket])
    .getPublicUrl(path);

  return data.publicUrl;
}

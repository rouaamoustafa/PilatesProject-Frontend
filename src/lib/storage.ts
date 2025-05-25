const BUCKET = 'gym-owners';

// export const imageUrl = (path: string | null | undefined) => {
//   if (!path) return '/placeholder.svg';
//   return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
// };
export function imageUrl(image?: string): string | undefined {
  return image; // image is already a full URL
}
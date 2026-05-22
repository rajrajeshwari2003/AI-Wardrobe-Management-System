import { supabase } from './supabaseClient';

export async function uploadImage(file: File) {
  if (!file) throw new Error('No file provided');
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `wardrobe/${fileName}`;

  const { data, error } = await supabase.storage
    .from('wardrobe-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (error) throw error;

  const { data: urlData } = supabase.storage.from('wardrobe-images').getPublicUrl(filePath);
  return urlData.publicUrl;
}

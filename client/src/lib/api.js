import { supabase } from './supabase';

/**
 * Data layer — talks directly to Supabase (no backend needed).
 * RLS policies handle authorization:
 *   - Anonymous users can only read published content
 *   - Authenticated users (admin) have full CRUD access
 */

function throwIfError(result) {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}

export const api = {
  // ── Workshops ─────────────────────────────────────────
  getWorkshops: async () =>
    throwIfError(
      await supabase
        .from('workshops')
        .select('*')
        .eq('status', 'published')
        .order('date', { ascending: true })
    ),

  getWorkshopsAll: async () =>
    throwIfError(
      await supabase
        .from('workshops')
        .select('*')
        .order('created_at', { ascending: false })
    ),

  getWorkshop: async (id) =>
    throwIfError(
      await supabase.from('workshops').select('*').eq('id', id).single()
    ),

  createWorkshop: async (body) =>
    throwIfError(
      await supabase.from('workshops').insert(body).select().single()
    ),

  updateWorkshop: async (id, body) =>
    throwIfError(
      await supabase.from('workshops').update(body).eq('id', id).select().single()
    ),

  deleteWorkshop: async (id) =>
    throwIfError(await supabase.from('workshops').delete().eq('id', id)),

  // ── Products ──────────────────────────────────────────
  getProducts: async () =>
    throwIfError(
      await supabase
        .from('products')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
    ),

  getProductsAll: async () =>
    throwIfError(
      await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
    ),

  getProduct: async (id) =>
    throwIfError(
      await supabase.from('products').select('*').eq('id', id).single()
    ),

  createProduct: async (body) =>
    throwIfError(
      await supabase.from('products').insert(body).select().single()
    ),

  updateProduct: async (id, body) =>
    throwIfError(
      await supabase.from('products').update(body).eq('id', id).select().single()
    ),

  deleteProduct: async (id) =>
    throwIfError(await supabase.from('products').delete().eq('id', id)),

  // ── Image Upload (direct to Supabase Storage) ────────
  uploadImage: async (file) => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
      .from('media')
      .upload(filePath, file, { contentType: file.type, upsert: false });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from('media').getPublicUrl(filePath);
    return { url: data.publicUrl };
  },

  // ── Contact ───────────────────────────────────────────
  sendContact: async ({ name, email, subject, message }) =>
    throwIfError(
      await supabase
        .from('contact_messages')
        .insert({ name, email, subject, message })
    ),

  getMessages: async () =>
    throwIfError(
      await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
    ),

  markRead: async (id) =>
    throwIfError(
      await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', id)
    ),

  deleteMessage: async (id) =>
    throwIfError(
      await supabase.from('contact_messages').delete().eq('id', id)
    ),
};

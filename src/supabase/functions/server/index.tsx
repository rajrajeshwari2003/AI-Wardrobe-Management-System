import { Hono } from 'npm:hono@4.6.14';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import * as auth from './auth.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Initialize storage bucket on startup
const BUCKET_NAME = 'make-6ffccf69-wardrobe-images';

async function initializeStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 5242880 // 5MB
      });
      console.log('Storage bucket created');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

initializeStorage();

// Auth middleware helper
async function requireAuth(c: any) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  const result = await auth.verifyToken(accessToken);
  
  if (!result.success) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  return result.user;
}

// Auth Routes
app.post('/make-server-6ffccf69/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const result = await auth.signup(email, password, name);
    
    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ success: true, user: result.user });
  } catch (error) {
    console.error('Signup route error:', error);
    return c.json({ error: 'Failed to create account' }, 500);
  }
});

// Get all wardrobe items (protected)
app.get('/make-server-6ffccf69/wardrobe', async (c) => {
  const user = await requireAuth(c);
  if (!user.id) return user; // Return error response
  
  try {
    const items = await kv.getByPrefix(`user:${user.id}:wardrobe:`);
    return c.json({ items });
  } catch (error) {
    console.error('Error fetching wardrobe items:', error);
    return c.json({ error: 'Failed to fetch wardrobe items' }, 500);
  }
});

// Add wardrobe item (protected)
app.post('/make-server-6ffccf69/wardrobe', async (c) => {
  const user = await requireAuth(c);
  if (!user.id) return user; // Return error response
  
  try {
    const body = await c.req.json();
    const { item } = body;
    
    if (!item || !item.id) {
      return c.json({ error: 'Invalid item data' }, 400);
    }

    // If item has a base64 image, upload to storage
    if (item.image && item.image.startsWith('data:')) {
      try {
        // Extract base64 data
        const matches = item.image.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          const extension = mimeType.split('/')[1];
          
          // Convert base64 to blob
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          const fileName = `${user.id}/${item.id}.${extension}`;
          
          // Upload to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, bytes, {
              contentType: mimeType,
              upsert: true
            });

          if (uploadError) {
            console.error('Storage upload error:', uploadError);
          } else {
            // Get signed URL for the image
            const { data: urlData } = await supabase.storage
              .from(BUCKET_NAME)
              .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year
            
            if (urlData?.signedUrl) {
              item.image = urlData.signedUrl;
              item.imageFileName = fileName;
            }
          }
        }
      } catch (imgError) {
        console.error('Error processing image:', imgError);
      }
    }

    await kv.set(`user:${user.id}:wardrobe:${item.id}`, item);
    return c.json({ success: true, item });
  } catch (error) {
    console.error('Error adding wardrobe item:', error);
    return c.json({ error: 'Failed to add wardrobe item' }, 500);
  }
});

// Delete wardrobe item (protected)
app.delete('/make-server-6ffccf69/wardrobe/:id', async (c) => {
  const user = await requireAuth(c);
  if (!user.id) return user; // Return error response
  
  try {
    const id = c.req.param('id');
    
    // Get item to check if it has an image in storage
    const item = await kv.get(`user:${user.id}:wardrobe:${id}`);
    
    if (item?.imageFileName) {
      // Delete from storage
      await supabase.storage
        .from(BUCKET_NAME)
        .remove([item.imageFileName]);
    }
    
    await kv.del(`user:${user.id}:wardrobe:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting wardrobe item:', error);
    return c.json({ error: 'Failed to delete wardrobe item' }, 500);
  }
});

// Get all events (protected)
app.get('/make-server-6ffccf69/events', async (c) => {
  const user = await requireAuth(c);
  if (!user.id) return user; // Return error response
  
  try {
    const events = await kv.getByPrefix(`user:${user.id}:event:`);
    // Convert date strings back to Date objects
    const parsedEvents = events.map(event => ({
      ...event,
      date: new Date(event.date)
    }));
    return c.json({ events: parsedEvents });
  } catch (error) {
    console.error('Error fetching events:', error);
    return c.json({ error: 'Failed to fetch events' }, 500);
  }
});

// Add event (protected)
app.post('/make-server-6ffccf69/events', async (c) => {
  const user = await requireAuth(c);
  if (!user.id) return user; // Return error response
  
  try {
    const body = await c.req.json();
    const { event } = body;
    
    if (!event || !event.id) {
      return c.json({ error: 'Invalid event data' }, 400);
    }

    await kv.set(`user:${user.id}:event:${event.id}`, event);
    return c.json({ success: true, event });
  } catch (error) {
    console.error('Error adding event:', error);
    return c.json({ error: 'Failed to add event' }, 500);
  }
});

// Delete event (protected)
app.delete('/make-server-6ffccf69/events/:id', async (c) => {
  const user = await requireAuth(c);
  if (!user.id) return user; // Return error response
  
  try {
    const id = c.req.param('id');
    await kv.del(`user:${user.id}:event:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return c.json({ error: 'Failed to delete event' }, 500);
  }
});

// Refresh image URL (for items with expired signed URLs)
app.post('/make-server-6ffccf69/wardrobe/:id/refresh-image', async (c) => {
  try {
    const id = c.req.param('id');
    const item = await kv.get(`wardrobe:${id}`);
    
    if (!item || !item.imageFileName) {
      return c.json({ error: 'Item or image not found' }, 404);
    }

    // Generate new signed URL
    const { data: urlData, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(item.imageFileName, 60 * 60 * 24 * 365); // 1 year
    
    if (error || !urlData?.signedUrl) {
      console.error('Error refreshing image URL:', error);
      return c.json({ error: 'Failed to refresh image URL' }, 500);
    }

    item.image = urlData.signedUrl;
    await kv.set(`wardrobe:${id}`, item);
    
    return c.json({ success: true, imageUrl: urlData.signedUrl });
  } catch (error) {
    console.error('Error refreshing image:', error);
    return c.json({ error: 'Failed to refresh image' }, 500);
  }
});

// Health check
app.get('/make-server-6ffccf69/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);

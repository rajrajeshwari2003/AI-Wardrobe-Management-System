import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

export async function signup(email: string, password: string, name: string) {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Signup exception:', error);
    return { success: false, error: 'Failed to create account' };
  }
}

export async function verifyToken(accessToken: string | null) {
  if (!accessToken) {
    return { success: false, error: 'No token provided' };
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.error('Token verification error:', error);
      return { success: false, error: 'Invalid token' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Token verification exception:', error);
    return { success: false, error: 'Failed to verify token' };
  }
}

'use server';

import { getSupabaseAdmin } from '@/lib/supabase';

export async function subscribeToNewsletterAction(email: string) {
  try {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return {
        success: false,
        error: 'Podaj poprawny adres email',
      };
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Check if already subscribed
    const { data: existing } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      return {
        success: false,
        error: 'Ten email jest już zapisany do newslettera',
      };
    }

    // Add subscriber
    const { error } = await supabaseAdmin.from('newsletter_subscribers').insert([
      {
        email: email.toLowerCase(),
        subscribed_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Newsletter subscription error:', error);
      return {
        success: false,
        error: 'Coś poszło nie tak. Spróbuj ponownie.',
      };
    }

    return {
      success: true,
      message: 'Dziękujemy za subskrypcję!',
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      error: 'Coś poszło nie tak. Spróbuj ponownie.',
    };
  }
}

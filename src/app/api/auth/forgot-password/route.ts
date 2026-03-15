import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });

    // We return success even if user not found to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: 'If an account exists with that email, a reset link has been sent.' });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Set expiration (1 hour)
    const expires = new Date(Date.now() + 3600000);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expires;
    await user.save();

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    // Send email
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Home Library <noreply@homelibrary.fun>',
        to: email,
        subject: 'Reset your Home Library password',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded-xl">
            <h2 style="color: #333;">Reset Password Request</h2>
            <p>You requested to reset your password for your Home Library account.</p>
            <p>This link will expire in 1 hour.</p>
            <div style="margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Reset Password</a>
            </div>
            <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #999; font-size: 12px;">Home Library App</p>
          </div>
        `,
      });
    } else {
      console.warn('RESEND_API_KEY missing. Reset link (local testing):', resetUrl);
    }

    return NextResponse.json({ 
      message: 'If an account exists with that email, a reset link has been sent.',
      debugLink: process.env.NODE_ENV === 'development' ? resetUrl : undefined 
    });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Generate token for password setup
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Set expiration (24 hours for registration)
    const expires = new Date(Date.now() + 86400000);

    const user = await User.create({
      name,
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: expires,
    });

    const setupUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&setup=true`;

    // Send verification email
    if (process.env.RESEND_API_KEY) {
      const { error: emailError } = await resend.emails.send({
        from: 'Home Library <noreply@homelibrary.fun>',
        to: email,
        subject: 'Complete your Home Library registration',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #333;">Welcome to Home Library!</h2>
            <p>Hi ${name},</p>
            <p>Thanks for joining! To complete your registration and secure your account, please click the button below to set your password.</p>
            <div style="margin: 30px 0;">
              <a href="${setupUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Set My Password</a>
            </div>
            <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #999; font-size: 12px;">Home Library App</p>
          </div>
        `,
      });
      if (emailError) {
        console.warn('Email sending failed:', emailError);
      }
    } else {
      console.warn('RESEND_API_KEY missing. Registration link (local testing):', setupUrl);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Registration setup link:', setupUrl);
    }

    return NextResponse.json({ 
      message: 'Registration initiated. Please check your email to complete your account setup.',
      debugLink: process.env.NODE_ENV === 'development' ? setupUrl : undefined 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Error creating user' }, { status: 500 });
  }
}

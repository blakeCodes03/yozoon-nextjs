// src/utils/email.ts

import nodemailer from 'nodemailer';

/**
 * Sends a verification email to the user.
 * @param email - The user's email address.
 * @param verificationToken - The verification token.
 */
export const sendVerificationEmail = async (email: string, verificationToken: string) => {
  try {
    let transporter;

    console.log('sendVerificationEmail called with email:', email, 'verificationToken:', verificationToken);
    console.log('process.env.NODE_ENV:', process.env.NODE_ENV);

    if (process.env.NODE_ENV === 'production') {
      // Production SMTP configuration
      console.log('Using production SMTP configuration.');
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
        port: Number(process.env.EMAIL_PORT), // e.g., 465
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      // Development SMTP configuration using Ethereal
      console.log('Using Ethereal SMTP configuration.');
      const testAccount = await nodemailer.createTestAccount();
      console.log('Ethereal test account created:', testAccount);

      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
    }

    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;
    console.log('Verification URL:', verificationUrl);

    const mailOptions = {
      from: '"Meme Launchpad" <no-reply@memelaunchpad.com>',
      to: email,
      subject: 'Verify Your Email - Welcome to Meme Launchpad!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f9f9f9; border-radius: 10px;">
          <!-- Logo Section -->
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://www.memelaunchpad.com/assets/icons/logo.png" alt="Meme Launchpad Logo" style="width: 100px; height: auto;">
          </div>
          
          <!-- Welcome Message -->
          <h2 style="color: #1F6FEB; text-align: center;">Welcome to Meme Launchpad!</h2>
          <p>Thank you for signing up. We're excited to have you on board.</p>
          
          <!-- Verification Section -->
          <p>Please verify your email address by clicking the button below. This link is valid for <strong>30 minutes</strong> and can only be used once.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #1F6FEB; color: #ffffff; text-decoration: none; border-radius: 5px;">
              Verify Email
            </a>
          </div>
          <p>If the button doesn't work, please copy and paste the following link into your browser:</p>
          <p><a href="${verificationUrl}" style="color: #1F6FEB;">${verificationUrl}</a></p>
          
          <!-- Referral Program Promotion -->
          <hr style="margin: 30px 0;">
          <h3 style="color: #1F6FEB;">Join Our Referral Program!</h3>
          <p>Invite your friends to Meme Launchpad and earn exclusive rewards.</p>
          <a href="https://www.memelaunchpad.com/referral" style="display: inline-block; padding: 10px 20px; background-color: #F0B90B; color: #ffffff; text-decoration: none; border-radius: 5px;">
            Learn More
          </a>
          
          <!-- Footer -->
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #777777; text-align: center;">
            If you did not sign up for this account, please ignore this email.
          </p>
        </div>
      `,
    };

    console.log('Sending email with options:', mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent, info:', info);

    if (process.env.NODE_ENV !== 'production') {
      console.log('Verification Email sent: %s', nodemailer.getTestMessageUrl(info));
    } else {
      console.log(`Verification email sent to ${email}`);
    }
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email.');
  }
};

/**
 * Sends a password reset email to the user.
 * @param email - The user's email address.
 * @param resetToken - The password reset token.
 */
export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  try {
    let transporter;

    console.log('sendPasswordResetEmail called with email:', email, 'resetToken:', resetToken);
    console.log('process.env.NODE_ENV:', process.env.NODE_ENV);

    if (process.env.NODE_ENV === 'production') {
      // Production SMTP configuration
      console.log('Using production SMTP configuration.');
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
        port: Number(process.env.EMAIL_PORT), // e.g., 465
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      // Development SMTP configuration using Ethereal
      console.log('Using Ethereal SMTP configuration.');
      const testAccount = await nodemailer.createTestAccount();
      console.log('Ethereal test account created:', testAccount);

      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
    }

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    console.log('Reset URL:', resetUrl);

    const mailOptions = {
      from: '"Meme Launchpad" <no-reply@memelaunchpad.com>',
      to: email,
      subject: 'Reset Your Password - Meme Launchpad',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f9f9f9; border-radius: 10px;">
          <!-- Logo Section -->
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://www.memelaunchpad.com/assets/icons/logo.png" alt="Meme Launchpad Logo" style="width: 100px; height: auto;">
          </div>
          
          <!-- Password Reset Message -->
          <h2 style="color: #1F6FEB; text-align: center;">Reset Your Password</h2>
          <p>You requested a password reset. Click the button below to set a new password. This link is valid for <strong>1 hour</strong> and can only be used once.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #1F6FEB; color: #ffffff; text-decoration: none; border-radius: 5px;">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, please copy and paste the following link into your browser:</p>
          <p><a href="${resetUrl}" style="color: #1F6FEB;">${resetUrl}</a></p>
          
          <!-- Footer -->
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #777777; text-align: center;">
            If you did not request a password reset, please ignore this email.
          </p>
        </div>
      `,
    };

    console.log('Sending password reset email with options:', mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent, info:', info);

    if (process.env.NODE_ENV !== 'production') {
      console.log('Password Reset Email sent: %s', nodemailer.getTestMessageUrl(info));
    } else {
      console.log(`Password reset email sent to ${email}`);
    }
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email.');
  }
};

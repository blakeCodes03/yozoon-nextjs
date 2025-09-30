// src/pages/api/auth/[...nextauth].ts

import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import TwitterProvider from 'next-auth/providers/twitter';
// import GoogleProvider from 'next-auth/providers/google';
// import AppleProvider from 'next-auth/providers/apple';
import { PrismaClient } from "@/generated/prisma";

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';
import { Adapter } from "next-auth/adapters";

import jwt from 'jsonwebtoken'; // Import jsonwebtoken

const prisma = new PrismaClient();

const prismaAdapter = PrismaAdapter(prisma);

const customPrismaAdapter: Adapter = {
  ...prismaAdapter,
  createUser: async (data: any) => {
    try {
      // Ensure the email field is populated
      if (!data.email) {
        data.email = `${data.id?.replace(/\s+/g, "").toLowerCase()}@twitter.com`;
      }
      console.log("Creating user with data:", data);
      // Call the original createUser method
      return prisma.user.create({
        data: {
          ...data,
          email: data.email,
          isVerified: true, // Assume social logins are verified
          passwordHash: "", // Social logins do not have a password
        },
      });
    } catch (error) {
      console.error('Error in custom createUser:', error);
      throw new Error('Failed to create user.');
    }
  },
};

export const authOptions: NextAuthOptions = {
  adapter: customPrismaAdapter,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'your-email@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error('No user found with this email.');
        }

        if (!user.isVerified) {
          throw new Error('Please verify your email before logging in.');
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) {
          throw new Error('Invalid password.');
        }

        return { id: user.id, email: user.email, role: user.role };
      },
    }),
    TwitterProvider({
      clientId: 'NHhQQ0tlTXhiZ1JTaC1BSVZKODg6MTpjaQ',
      clientSecret: 'qaaLGwLCW0gtgpWbKjtcKcT22hLtHgTTGAHxDJ2IwHgjI95wMM',
      version: '2.0', // Use Twitter API v2
      profile({ data }) {
    return {
      id: data.id,
      name: data.name,
      email: null, // X often does not return email
      image: data.profile_image_url,
      role: 'user',
    };
  },
    }),
    // Uncomment the following providers when you decide to use social logins again
    /*
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
    */
    // Add other providers like Facebook here if needed
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  callbacks: {
    async session({ session, token }) {
    if (token) {
      session.user = {
        ...session.user,
        id: token.id, // Add the user ID to the session
        image: token.picture,
      };
    }
    return session;
  },
  async jwt({ token, user, account, profile }) {
    if (user) {
      token.id = user.id;
      token.role = user.role;
    }

    // Handle first-time social login
    if (account && profile) {
      try {
        // Fallback email if not provided by Twitter
        const email = profile.email || `${account.providerAccountId}@twitter.com`;
        const name = (profile as any).data.username || 'Twitter User';

        console.log('Social login detected. Processing user:', email);
        console.log('Social login detected. Processing usernakme:', name);
        

        // Check if the user already exists
        let existingUser = await prisma.user.findUnique({
          where: { email },
        });

        // If the user does not exist, create a new one
        if (!existingUser) {
          console.log("creating new twitter user")
          existingUser = await prisma.user.create({
            data: {
              email,
              username: name,
              pictureUrl: (profile as any).data.profile_image_url  || null,
              isVerified: true, // Assume social logins are verified
              passwordHash: "", // Social logins do not have a password
              socialAccounts: {
                create: {
                  platform: account.provider,
                  handle: account.providerAccountId,
                },
              },
            },
          });
        }

        // Update the token with the user's ID and role
        if (existingUser) {
          console.log("existing user found")
          token.id = existingUser.id;
          token.role = existingUser.role;
          token.picture = existingUser.pictureUrl;
        }
      } catch(error) {
    if (error instanceof Error){
        console.log("Error: ", error.stack)
    }
}
    }

    return token;
  },
},
  pages: {
    signIn: '/login',    
    error: '/login', 
    // You can add other custom pages like signOut, error, verifyRequest, etc.
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production', // Set to false in development
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    pkceCodeVerifier: {
      name: `next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);

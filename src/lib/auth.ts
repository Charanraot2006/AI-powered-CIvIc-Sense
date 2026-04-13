import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Civic Account",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // Password check (plain text for prototype)
        // Also verify the role matches what was requested in the UI
        if (user && user.password === credentials.password) {
          if (credentials.role && user.role !== credentials.role) {
            // Role mismatch - we could throw an error but NextAuth handles null better for standard "invalid credentials"
            // We can handle specific error messages on the client by checking the error query param or result.error
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = user.role;
        // @ts-ignore
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.role = token.role;
        // @ts-ignore
        session.user.id = token.id;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  },
  secret: "civicsense-prototype-secret-key-12345"
};

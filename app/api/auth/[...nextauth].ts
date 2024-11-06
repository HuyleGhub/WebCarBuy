import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { verifyUser } from "@/app/lib/verifyUser";


interface CustomUser extends User {
  id: string;  // Chuyển thành string
  name: string | null;
  email: string | null;
  role: number | null;
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const user = await verifyUser(credentials.email, credentials.password);
        if (user) {
          return {
            id: user.idUsers.toString(),  // Chuyển thành string
            name: user.Hoten,
            email: user.Email,
            role: user.idRole,
          } as CustomUser;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as CustomUser;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user as unknown as CustomUser;  // Chuyển thành unknown trước khi gán
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
    newUser: undefined,
  },
  secret: process.env.NEXTAUTH_SECRET,
});

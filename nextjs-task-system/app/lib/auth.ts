import NextAuth, { NextAuthConfig } from "next-auth";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "../db";
import { NextResponse } from "next/server";
import { config } from "./utils";
import { getUserForSignin } from "@/db/queries/user";
import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";

const adapter = DrizzleAdapter(db);
export const authOptions = {
  providers: [
    Github({
      authorization: {
        params: {
          redirect_uri: config.redirectURI,
        },
      },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        let user = await getUserForSignin(
          credentials.email as string,
          credentials.password as string,
        );
        if (!user) {
          throw new Error("Invalid credentials");
        }
        console.log(user);
        return user;
      },
    }),
  ],
  adapter,

  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      console.log(params);
      if (params.token?.credentials) {
        const sessionToken = uuid();
        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }
        const createdSession = await adapter?.createSession?.({
          sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        if (!createdSession) {
          throw new Error("Session creation failed");
        }
        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
} as NextAuthConfig;
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

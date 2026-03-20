import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    role: string;
    accessToken?: string;
  }

  interface Session {
    user: User;
    accessToken: string;
  }
}

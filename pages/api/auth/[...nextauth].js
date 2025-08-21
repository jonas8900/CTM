import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/db/connect";

export const authOptions = {
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, 
    },
    providers: [
        CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: process.env.NEXTAUTH_EMAIL || { label: "Email", type: "text" },
            password: process.env.NEXTAUTH_PASSWORD || { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) return null;

            const ok =
            credentials.email === process.env.NEXTAUTH_EMAIL &&
            credentials.password === process.env.NEXTAUTH_PASSWORD;

            if (!ok) return null;
        
            return {
                id: "1",
                email: "jonas.dally@mail.de",
                role: "admin",
                lastname: "Jonas",
                firstname: "Dally",
            };
    
        },
        }),
    ],
    pages: {
        signIn: "/admin",
    },
    callbacks: {
        async jwt({ token, user }) {
        if (user) {
            token.id = user.id;
            token.email = user.email;
            token.role = user.role;
            token.lastname = user.lastname;
            token.firstname = user.firstname;
        }
        return token;
        },
        async session({ session, token }) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.lastname = token.lastname;
        session.user.firstname = token.firstname;

        return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

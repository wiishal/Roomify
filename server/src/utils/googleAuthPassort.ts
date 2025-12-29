import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../lib/prisma";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:4000/api/v1/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        const email = profile.emails?.[0].value!;
        const username = profile.displayName;
        let user;

        user = await prisma.user.findUnique({ where: { email: email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              username: username,
              password: "",
              email: email,
              profile: profile.photos?.[0].value || "",
            },
          });
        }

        return done(null,user);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);


export default passport;


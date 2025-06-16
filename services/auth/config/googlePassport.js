const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const logger = require("../config/logger");
const axios = require("axios");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userServiceUrl = "http://user-service:5001/oauth/find-or-create";

        const response = await axios.post(userServiceUrl, {
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          profilePicture: profile.photos[0].value,
        });

        const userFromDb = response.data;

        if (!userFromDb) {
          throw new Error("User Service tidak mengembalikan data pengguna.");
        }

        return done(null, userFromDb);
      } catch (err) {
        console.log(err);
        logger.error(
          "Error saat berkomunikasi dengan User Service via OAuth:",
          err.message
        );
        return done(err, null);
      }
    }
  )
);

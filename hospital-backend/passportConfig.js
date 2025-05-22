// passport.js
const passport      = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy    = require('passport-jwt').Strategy;
const ExtractJwt     = require('passport-jwt').ExtractJwt;
const User           = require('./models/User');
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // 1️⃣  Look up by UNIQUE email first
        let user = await User.findOne({ email });

        if (user) {
          // Existing local user → just attach/refresh googleId
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
        } else {
          // 2️⃣  Brand-new Google-only account
          user = await User.create({
            googleId: profile.id,
            name:     profile.displayName,
            email,
            password: null,            // no local password
            provider: 'google'
          });
        }

        return done(null, user);
      } catch (err) {
        console.error('Google strategy error:', err);
        return done(err, null);
      }
    }
  )
);

// JWT STRATEGY                                                      
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey:    process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      return user ? done(null, user) : done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;

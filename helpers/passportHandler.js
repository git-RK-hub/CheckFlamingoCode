require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LinkedInStrategy = require("@sokratis/passport-linkedin-oauth2").Strategy;
const User = require("../models/user");
const Instructor = require("../models/instructor");
const Admin = require("../models/admin");
const backendUrl = "https://www.flamingocourses.com/api";
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
passport.use(
  new GoogleStrategy(
    {
      callbackURL: `${backendUrl}/google/redirect`,
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("google call back passport fired");
      console.log(profile.emails[0].value);
      console.log(profile);
      try {
        let ins = await Instructor.findOne({ email: profile.emails[0].value });
        if (ins) {
          if (!ins.googleId) ins.googleId = profile.id;
          console.log("Ins is: ", ins);
          ins.roleType = "instructor";
          done(null, ins);
        } else {
          let admin = await Admin.findOne({ email: profile.emails[0].value });
          if (admin) {
            if (!admin.googleId) admin.googleId = profile.id;
            console.log("Admin is: ", admin);
            admin.roleType = "admin";
            done(null, admin);
          } else {
            let user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              if (!user.googleId) user.googleId = profile.id;
              console.log("User is: ", user);
              user.roleType = "user";
              done(null, user);
            } else {
              let newUser = new User({
                googleId: profile.id,
                username: profile.id,
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
              });
              await newUser.save();
              newUser.roleType = "user";
              done(null, newUser);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${backendUrl}/facebook/redirect`,
      profileFields: ["id", "displayName", "name", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log("facebook call back passport fired");
      console.log(profile.emails[0].value);
      console.log(profile);
      try {
        let ins = await Instructor.findOne({ email: profile.emails[0].value });
        if (ins) {
          if (!ins.facebookId) ins.facebookId = profile.id;
          console.log("Ins is: ", ins);
          ins.roleType = "instructor";
          done(null, ins);
        } else {
          let admin = await Admin.findOne({ email: profile.emails[0].value });
          if (admin) {
            if (!admin.facebookId) admin.facebookId = profile.id;
            console.log("Admin is: ", admin);
            admin.roleType = "admin";
            done(null, admin);
          } else {
            let user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              if (!user.facebookId) user.facebookId = profile.id;
              console.log("User is: ", user);
              user.roleType = "user";
              done(null, user);
            } else {
              let newUser = new User({
                facebookId: profile.id,
                username: profile.id,
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
              });
              await newUser.save();
              newUser.roleType = "user";
              done(null, newUser);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: `${backendUrl}/linkedin/redirect`,
      // profileFields: ["id", "displayName", "name", "email"],
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(async function () {
        console.log("linkedin call back passport fired");
        console.log(profile.emails[0].value);
        console.log(profile);
        try {
          let ins = await Instructor.findOne({
            email: profile.emails[0].value,
          });
          if (ins) {
            if (!ins.linkedinId) ins.linkedinId = profile.id;
            console.log("Ins is: ", ins);
            ins.roleType = "instructor";
            done(null, ins);
          } else {
            let admin = await Admin.findOne({ email: profile.emails[0].value });
            if (admin) {
              if (!admin.linkedinId) admin.linkedinId = profile.id;
              console.log("Admin is: ", admin);
              admin.roleType = "admin";
              done(null, admin);
            } else {
              let user = await User.findOne({ email: profile.emails[0].value });
              if (user) {
                if (!user.linkedinId) user.linkedinId = profile.id;
                console.log("User is: ", user);
                user.roleType = "user";
                done(null, user);
              } else {
                let newUser = new User({
                  linkedinId: profile.id,
                  username: profile.id,
                  email: profile.emails[0].value,
                  firstName: profile.name.givenName,
                  lastName: profile.name.familyName,
                });
                await newUser.save();
                newUser.roleType = "user";
                done(null, newUser);
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
  )
);
// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL: `${backendUrl}/github/redirect`,
//       scope: "user:email",
//     },
//     function (accessToken, refreshToken, profile, cb) {
//       console.log("google call back passport fired");
//       console.log(profile.emails[0].value);
//       console.log(profile);
//       User.findOne({ email: profile.emails[0].value })
//         .then((currentUser) => {
//           if (currentUser) {
//             if (!currentUser.githubId) currentUser.githubId = profile.id;
//             console.log("user is: ", currentUser);
//             cb(null, currentUser);
//           } else {
//             new User({
//               githubId: profile.id,
//               username: profile.id,
//               email: profile.emails[0].value,
//             })
//               .save()
//               .then((newUser) => {
//                 console.log("created new user: ", newUser);
//                 cb(null, newUser);
//               });
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   )
// );

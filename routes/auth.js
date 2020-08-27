const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  signIn,
  signUp,
  signOut,
  newRefreshtoken,
  isAuth,
  requiresSignin,
  handleErrorNext,
  socialSignin,
  changePassword,
  forgotPassword,
  resetPassword,
  resetPasswordInstructor,
  resetPasswordAdmin,
} = require("../controllers/auth");
const {
  instructorSignin,
  checkInstructor,
} = require("../controllers/instructor");
const { adminSignin, checkAdmin } = require("../controllers/admin");
const { userSignupValidator } = require("../validator/index");
const { userById } = require("../controllers/user");
const passportSetup = require("../helpers/passportHandler");
const {
  verify,
  verifyResetUser,
  verifyb2bUser,
} = require("../helpers/emailHandler");
router.post(
  "/signup",
  userSignupValidator,
  checkInstructor,
  checkAdmin,
  signUp
);
router.post("/signin", signIn, instructorSignin, adminSignin);
router.get("/signout", signOut);
router.get(
  "/google",
  passport.authenticate(
    "google",
    {
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    },
    { session: false }
  )
);
router.get("/google/redirect", passport.authenticate("google"), socialSignin);

router.get("/github", passport.authenticate("github", { session: false }));
router.get("/github/redirect", passport.authenticate("github"), socialSignin);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: "email" }, { session: false })
);
router.get(
  "/facebook/redirect",
  passport.authenticate("facebook"),
  socialSignin
);

router.get(
  "/linkedin",
  passport.authenticate(
    "linkedin",
    { session: false },
    {
      state: "SOME STATE",
    }
  )
);
router.get(
  "/linkedin/redirect",
  passport.authenticate("linkedin"),
  socialSignin
);

router.post(
  "/refresh-token/:userId",

  newRefreshtoken
);
router.post("/forgotPassword", forgotPassword);
router.get("/verifyReset/:hashId", verifyResetUser);
router.post(
  "/resetPassword/:hashId",
  resetPassword,
  resetPasswordInstructor,
  resetPasswordAdmin
);
router.get("/verifyb2bUser/:hashId", verifyb2bUser);
router.get("/verify/:hashId", verify);
router.param("userId", userById);
module.exports = router;

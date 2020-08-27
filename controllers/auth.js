const User = require("../models/user");
const Instructor = require("../models/instructor");
const Admin = require("../models/admin");
const redis = require("redis");
const expressJwt = require("express-jwt");
const {
  sendEmail,
  resetEmail,
  resetEmailInstructor,
  resetEmailAdmin,
} = require("../helpers/emailHandler");
const { errorHandler } = require("../helpers/dbErrorHandler");
const {
  generateAccessToken,
  generateRefreshToken,
  generateNewTokens,
} = require("../helpers/tokensHandler");
const { frontendUrl, devFrontendUrl } = require("../config.json");
const client = redis.createClient({});
client.on("connect", function () {
  console.log("connected to redis");
});
exports.checkUserbyEmail = function (req, res, next) {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(400).json({ error: err });
    if (user)
      return res.status(400).json({
        error: "Hey already a user account exists please try another email id",
      });
    if (!user) next();
  });
};
exports.checkUser = function (req, res, next) {
  User.findOne({ username: req.body.username }, (err, doc) => {
    if (err) return res.status(400).json({ error: err });
    if (doc)
      return res
        .status(400)
        .json({ error: "Username already used please try other one" });
    User.findOne({ email: req.body.email }, (err, doc) => {
      if (err) return res.status(400).json({ error: err });
      if (doc)
        return res.status(400).json({
          error: "Email already used please try signingnup with a new one",
        });
      if (!doc) next();
    });
  });
};
exports.signUp = function (req, res) {
  const reqUser = { ...req.body, createdDate: new Date() };
  const user = new User(reqUser);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({ error: errorHandler(err) });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    const response = sendEmail(user.email, req.get("host"));
    if (response.error)
      return res.status(400).json({ error: "Something wrong with mailer" });
    else
      return res.status(200).json({
        user,
        message:
          "Verification link has been sent to the registered email Id.To continue please verify",
      });
  });
};

exports.signIn = function (req, res, next) {
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    if (!user) {
      return next();
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({ error: "Wrong password" });
    }
    if (!user.active) {
      if (new Date() - user.createdDate > oneday) {
        console.log("date expired");
        const response = sendEmail(user.email, req.get("host"));
        if (response.error)
          return res.status(400).json({ error: "Something wrong with mailer" });
        else
          return res.status(200).json({
            message:
              "A new Verification link has been sent to the registered email Id.To continue please verify",
          });
      } else {
        return res.status(200).json({
          message:
            "A Verification link has been already sent to the registered email Id.To continue please verify",
        });
      }
    }
    const token = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("t", token, refreshToken, { expire: new Date() + 9999 });
    const { _id, name, username } = user;
    client.get(JSON.stringify(user._id), function (err, reply) {
      if (err) {
        return res.status(400).json({ error: err });
      } else if (!reply) {
        //console.log("no login present");
        let refreshTokens = [];
        refreshTokens.push(refreshToken);
        client.setex(
          JSON.stringify(user._id),
          3600,
          JSON.stringify(refreshTokens)
        );
      } else {
        let refreshTokensrecieved = JSON.parse(reply);
        if (refreshTokensrecieved.length >= 3) refreshTokensrecieved = [];
        refreshTokensrecieved.push(refreshToken);
        client.setex(
          JSON.stringify(user._id),
          3600,
          JSON.stringify(refreshTokensrecieved)
        );
      }
      let role = "user";

      res.status(200).json({
        token,
        refreshToken,
        user: { _id, username, name, role },
      });
    });
  });
};
exports.signOut = function (req, res) {
  res.clearCookie("t");
  res.json({ message: "Succesfully Signed out" });
};
exports.sayHi = function (req, res) {
  res.json({ message: "Howdy" });
};
exports.requiresSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
});
exports.isAuth = (req, res, next) => {
  // console.log(req.auth.exp * 1000, Date.now());
  let user =
    req.profile &&
    req.auth &&
    Date.now() < req.auth.exp * 1000 &&
    req.profile._id == req.auth.id;
  if (!user) return res.status(403).json({ error: "Access Forbidden" });
  next();
};
exports.newRefreshtoken = function (req, res) {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(403).send("Access is forbidden");
  }
  generateNewTokens(refreshToken, req.profile._id, client).then((data) => {
    if (data.error) res.status(403).json({ error: data.error });
    else
      res
        .status(200)
        .json({ token: data.accessToken, refreshToken: data.refreshToken });
  });
};
exports.findRole = async (req, res, next) => {
  try {
    let user = await User.findById(req.auth.id);
    if (!user) {
      let admin = await Admin.findById(req.auth.id);
      if (!admin) {
        let instructor = await Instructor.findById(req.auth.id);
        if (!instructor)
          return res.status(403).json({ error: "Could not identify the user" });
        else {
          req.currentUser = instructor;
          req.currentUserRole = "instructor";
          console.log("came here ins");
          return next();
        }
      } else {
        req.currentUser = admin;
        req.currentUserRole = "admin";
        console.log("came here admin");
        return next();
      }
    } else {
      req.currentUser = user;
      req.currentUserRole = "user";
      console.log("came here user");
      return next();
    }
  } catch (error) {
    return res.status(403).json({ error: "Something went wrong" });
  }
};
exports.handleErrorNext = (err, req, res, next) => {
  console.log("i cam here");
  //return res.status(401).json(err);
  if (err.code === "invalid_token" && err.message === "jwt expired")
    return res.status(401).json({ error: "Access token expired" });
  else if (err.code === "invalid_token")
    return res.status(403).json({ error: " Invalid Access token " });
  else {
    return next();
  }
};
exports.socialSignin = (req, res) => {
  const user = req.user;
  const token = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie("t", token, refreshToken, { expire: new Date() + 9999 });
  const { _id, name, username } = user;
  client.get(JSON.stringify(user._id), function (err, reply) {
    if (err) {
      return res.status(400).json({ error: err });
    } else if (!reply) {
      let refreshTokens = [];
      refreshTokens.push(refreshToken);
      client.setex(
        JSON.stringify(user._id),
        3600,
        JSON.stringify(refreshTokens)
      );
    } else {
      let refreshTokensrecieved = JSON.parse(reply);
      if (refreshTokensrecieved.length >= 5) refreshTokensrecieved = [];
      refreshTokensrecieved.push(refreshToken);
      client.setex(
        JSON.stringify(user._id),
        3600,
        JSON.stringify(refreshTokensrecieved)
      );
    }
    let level;
    if (user.roleType === "admin") level = user.level;
    else level = 0;
    res.redirect(
      `${frontendUrl}/verifed/${token}/${refreshToken}/${user.roleType}/${level}`
    );
  });
};
exports.forgotPassword = async (req, res) => {
  try {
    let resp1, resp2, resp3;
    resp1 = await User.findOne({ email: req.body.email });
    if (!resp1) {
      resp2 = await Instructor.findOne({ email: req.body.email });
      if (!resp2) {
        resp3 = await Admin.findOne({ email: req.body.email });
        if (!resp3)
          return res.status(400).json({ error: "No account present" });
      }
    }
    console.log(resp1, resp2, resp3);
    if (resp1 || resp2 || resp3) {
      let response = await resetEmail(req.body.email);
      if (!response) response = await resetEmailInstructor(req.body.email);
      if (!response) response = await resetEmailAdmin(req.body.email);
      console.log(response, "I am response");
      if (response.error)
        return res.status(400).json({ error: "Something wrong with mailer" });
      else
        return res.status(200).json({
          message: "Reset link has been sent to the registered email Id.",
        });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Something went wrong please try again" });
  }
};
exports.resetPassword = async function (req, res, next) {
  try {
    let user = await User.findOne({ hash: req.params.hashId });
    if (!user) return next();
    user.hash = null;
    user.password = req.body.password;
    user.save((err, doc) => {
      if (err) return res.status(400).json({ error: errorHandler(err) });
      else
        return res.status(200).json({
          message:
            "Your password has been reset succesfully try logging in now",
        });
    });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
exports.resetPasswordInstructor = async function (req, res, next) {
  try {
    let user = await Instructor.findOne({ hash: req.params.hashId });
    if (!user) return next();
    user.hash = null;
    user.password = req.body.password;
    user.save((err, doc) => {
      if (err) return res.status(400).json({ error: errorHandler(err) });
      else
        return res.status(200).json({
          message:
            "Your password has been reset succesfully try logging in now",
        });
    });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
exports.resetPasswordAdmin = async function (req, res) {
  try {
    let user = await Admin.findOne({ hash: req.params.hashId });
    if (!user) return res.status(400).json({ error: "No user found" });
    user.hash = null;
    user.password = req.body.password;
    user.save((err, doc) => {
      if (err) return res.status(400).json({ error: errorHandler(err) });
      else
        return res.status(200).json({
          message:
            "Your password has been reset succesfully try logging in now",
        });
    });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const oneday = 60 * 1000 * 24 * 60;

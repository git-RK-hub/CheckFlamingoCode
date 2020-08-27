const crypto = require("crypto");
const uuidv1 = require("uuid/v1");
const util = require("util");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
function baseUserSchema() {
  Schema.apply(this, arguments);
  this.add({
    profilePhotoUrl: {
      type: String,
    },
    firstName: {
      type: String,
      trim: true,
      //required: true,
      maxlength: 32,
    },
    lastName: {
      type: String,
      trim: true,
      //required: true,
      maxlength: 32,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    hashed_password: {
      type: String,
      //required: true,
    },
    about: {
      type: String,
    },
    googleId: {
      type: String,
      default: null,
    },
    linkedinId: {
      type: String,
      default: null,
    },
    facebookId: {
      type: String,
      default: null,
    },
    githubId: {
      type: String,
      default: null,
    },
    salt: String,
  });
  this.virtual("password")
    .set(function (password) {
      this._password = password;
      this.salt = uuidv1();
      this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
      return this._password;
    });

  this.methods.encryptPassword = function (password) {
    if (!password) return;
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return;
    }
  };
  this.methods.authenticate = function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  };
}
util.inherits(baseUserSchema, Schema);
exports.baseUserSchema = baseUserSchema;

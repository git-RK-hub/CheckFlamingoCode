const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const fs = require("fs");
var accessKeyId = "RG2UNX64AP5C2APRLP3N";
var secretAccessKey = "+nDdyVNVuVI6yQu5a2J09vUueFRCRerCAC48ZSFahwM";
var region = "sgp1";

var spacesEndpoint = new AWS.Endpoint(region + ".digitaloceanspaces.com");
var s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

exports.upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "flamingospaces",
    acl: "public-read",
    key: function (request, file, cb) {
      let fileName = file.originalname;
      fileName.replace(/ /g, "_");
      cb(null, `${Date.now()}_${file.fileName}`);
    },
  }),
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (
      ext !== ".png" &&
      ext !== ".jpg" &&
      ext !== ".gif" &&
      ext !== ".jpeg" &&
      ext !== ".PNG" &&
      ext !== ".JPG" &&
      ext !== ".GIF" &&
      ext !== ".JPEG"
    ) {
      return cb(new Error("Only images and GIFs are allowed"), false);
    }
    cb(null, true);
  },
}).single("file");

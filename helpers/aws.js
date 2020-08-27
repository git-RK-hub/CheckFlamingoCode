const AWS = require("aws-sdk");
let accessKeyId = "2PYVAXKIWFFLQGUKYUN4";
let secretAccessKey = "any1tFJvkSKWX6TM55krbw931YCo1HOwlIeQiufhNGc";
let region = "sgp1";
let spacesEndpoint = new AWS.Endpoint(region + ".digitaloceanspaces.com");
let s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});
module.exports = s3;
const thisConfig = {
  AllowedMethods: ["GET", "POST", "PUT", "HEAD"],
  AllowedOrigins: ["*"],
  ExposeHeaders: [],
  MaxAgeSeconds: 3000,
};

const corsRules = new Array(thisConfig);
const corsParams = {
  Bucket: "flamingospaces",
  CORSConfiguration: { CORSRules: corsRules },
};
s3.putBucketCors(corsParams, (err, data) => {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success from aws", data);
  }
});
module.exports = {
  s3,
};

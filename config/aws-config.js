// const AWS = require("aws-sdk");

// const s3 = new AWS.S3({
//     region: "ap-southeast-2",
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// });

// const S3_BUCKET = "chetanbucket2711";

// module.exports = {
//     s3,
//     S3_BUCKET
// };
require("dotenv").config();
const AWS = require("aws-sdk");

const S3_BUCKET = process.env.AWS_BUCKET_NAME;
const REGION = process.env.AWS_REGION;

if (!S3_BUCKET || !REGION) {
  console.warn(
    "AWS_BUCKET_NAME or AWS_REGION is missing in .env. push/pull will fail."
  );
}

const s3 = new AWS.S3({
  region: REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

module.exports = {
  s3,
  S3_BUCKET,
};
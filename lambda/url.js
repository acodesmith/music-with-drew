const AWS = require("aws-sdk");

exports.handler = async (event) => {
  const s3 = new AWS.S3();
  // const params = JSON.parse(event.body);

  const s3Params = {
    Bucket: "music-with-you",
    Key: "test",
    ContentType: "text/csv",
    ACL: "public-read",
  };

  const uploadURL = s3.getSignedUrl("putObject", s3Params);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:8000",
    },
    body: JSON.stringify({ uploadURL: uploadURL }),
  };
};

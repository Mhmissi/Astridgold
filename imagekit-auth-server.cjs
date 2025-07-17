const express = require("express");
const ImageKit = require("imagekit");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors());

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

app.get("/auth", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.listen(3001, () => console.log("ImageKit Auth server running on port 3001")); 
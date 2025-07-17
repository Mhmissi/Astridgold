const express = require("express");
const ImageKit = require("imagekit");
const cors = require("cors");

const app = express();
app.use(cors());

const imagekit = new ImageKit({
  publicKey: "public_PF4kBZPZJOt47sW1awGDOmh3Pw8=",
  privateKey: "private_+zVqFV/+GgLLfIPUXmomBtKfOes=",
  urlEndpoint: "https://ik.imagekit.io/ilrj0knoeh"
});

app.get("/auth", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.listen(3001, () => console.log("ImageKit Auth server running on port 3001")); 
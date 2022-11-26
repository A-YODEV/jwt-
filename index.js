const express = require("express");
const app = express();
const port = 1211;
const jwt = require("jsonwebtoken");

app.use(express.json());

const secret = "thEseCRet";

//Create a token and send back to client
app.post("/create-token", (req, res) => {
  //payload
  const payload = {
    username: req.body.username,
    id: req.body.id,
  };
  //secret

  //expiry time
  const expiry = 36000;
  //create token
  jwt.sign(payload, secret, { expiresIn: expiry }, (err, token) => {
    if (err) {
      return res.status(500).json({ err });
    } else {
      return res.status(200).json({ token });
    }
  });
});

//Recieve a token from client and decode
app.get("/decode-token", (req, res) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .json({ message: "Authentication token is required" });
  }
  //pick auth header
  const authHeader = req.headers.authorization;
  //extract token
  const splittedStr = authHeader.split(" ");
  const token = splittedStr[1];
  //decode token
  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return res.status(500).json({ err });
    } else {
      return res.status(200).json({ user: decodedToken });
    }
  });
});

app.listen(port, () => console.log("App started"));

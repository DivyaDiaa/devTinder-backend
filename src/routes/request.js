const express = require("express");

const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

//making API call in secured way by checking if its logged in user or not by using userAuth middleware
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    //reading user data
    const user = req.user; //from userAuth middleware we are storing user data in req object and here we are getting that data
    console.log("Logged in user data is ", user);

    res.send("Connection request sent");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = requestRouter;
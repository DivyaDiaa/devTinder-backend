const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const userModel = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

const authRouter = express.Router();

authRouter.use(express.json()); //will change json to js object
authRouter.use(cookieParser());

authRouter.post("/signup", async (req, res) => {
  //const user = new userModel(req.body);
  try {
    const { firstName, lastName, emailId, password, age } = req.body;
    validateSignUpData(req);
    const passwordEncryption = await bcrypt.hash(req.body.password, 5);

    const user = new userModel({
      firstName,
      lastName,
      emailId,
      password: passwordEncryption,
      age,
    });
    const saveUser = await user.save();
    const token = await saveUser.getJWT(); //calling getJWT method which is defined in user model and it will return the token
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000),
    }); //setting cookie with token and expiry time of 1 hour
    res.send(saveUser);
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const alreadyUserPresent = await userModel.findOne({
      emailId: req.body.emailId,
    });
    if (!alreadyUserPresent) {
      throw new Error("Invalid credentials");
    }
    // const isPasswordValid = await bcrypt.compare(
    //   req.body.password,
    //   alreadyUserPresent.password,
    // );
    const isPasswordValid = await alreadyUserPresent.validatePassword(
      req.body.password,
    );

    if (isPasswordValid) {
      //create a JWT token

      const token = await alreadyUserPresent.getJWT(); //calling getJWT method which is defined in user model and it will return the token
      // console.log(token);

      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000),
      }); //setting cookie with token and expiry time of 1 hour
      res.json(alreadyUserPresent);
    } else {
      throw new Error("Please check again");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    // res.clearCookie("token"); //clearing the cookie with name token
    if (!req.cookies.token) {
      throw new Error("User is not logged in");
    }
    res.cookie("token", "", { expires: new Date(0) }); //setting the cookie with empty value and expiry time in past to delete the cookie
    res.send("User logged out successfully");
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = authRouter;

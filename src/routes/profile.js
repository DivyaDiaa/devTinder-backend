const express = require("express");
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");
const { validateUpdateFields } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; //getting user data from req object which is stored in userAuth middleware
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateUpdateFields(req)) {
      throw new Error("Invalid update");
    }
    const user = req.user; //getting user data from req object which is stored in userAuth middleware
    console.log("Logged in user data is ", user);

    Object.keys(req.body).forEach((k) => {
      user[k] = req.body[k]; //updating user data with new data which is coming from req body
    });
    console.log("Updated user data is ", user);
    await user.save(); //saving the updated user data in db
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user; //getting user data from req object which is stored in userAuth middleware

    user.password = req.body.password; //updating password with new password which is coming from req body

    const passwordEncryption = await bcrypt.hash(user.password, 5); //encrypting the new password
    user.password = passwordEncryption; //updating user's password with the encrypted one
    await user.save();
    res.send("Password updated");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter;

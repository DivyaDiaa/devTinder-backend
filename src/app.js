const express = require("express");
const connectDB = require("./config/database");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const userModel = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json()); //will change json to js object
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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
    await user.save();
    res.send("Database connected ");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

app.post("/login", async (req, res) => {
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
      console.log(token);

      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000),
      }); //setting cookie with token and expiry time of 1 hour
      res.send("User logged In");
    } else {
      throw new Error("Please check again");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//making API call in secured way by checking if its logged in user or not by using userAuth middleware
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    //reading user data
    const user = req.user; //from userAuth middleware we are storing user data in req object and here we are getting that data
    console.log("Logged in user data is ", user);

    res.send("Connection request sent");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user; //getting user data from req object which is stored in userAuth middleware
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection is established");
    app.listen(4000, () => {
      console.log("Server is successfully listening on port 4200");
    });
  })
  .catch((err) => {
    console.log("Database is not connected due to ", err);
  });

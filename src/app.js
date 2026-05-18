const express = require("express");
const connectDB = require("./config/database");
const userModel = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Divya",
    lastName: "Palanivel",
    emailId: "divyadreams2002@gmail.com",
    password: "SreeSiva@1904",
  };

  try {
    const user = new userModel(userObj);
    await user.save();
    res.send("Database connected ");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
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

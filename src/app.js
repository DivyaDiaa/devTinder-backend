const express = require("express");
const connectDB = require("./config/database");

const app = express();

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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

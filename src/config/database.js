const mongoose = require("mongoose");

const mongoDBURL =
  "mongodb+srv://divyapalanivelust_db_user:gpOAndJKoCfOX9Bb@cluster0.fi95wjj.mongodb.net/devTinder";

const connectDB = async () => {
  await mongoose.connect(mongoDBURL);
};

module.exports = connectDB;
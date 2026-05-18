const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Provide correct mail id");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please provide strong password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("User is not valid human");
        }
      }, //validate fucntion will onky work for new documents adding
      //for making it to wrk in patch update u need to call runValidators in patch as options argumnet
    },
    location: {
      type: String,
      default: "India",
    },
  },
  {
    timestamps: true, //updatedAt
  },
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;

const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const userAuth =  [
  async (req, res, next) => {
    try {
      const { token } = req.cookies;
      if (!token) {
        throw new Error("Token is not present");
      }
      const getIdFromToken = jwt.verify(token, "DEVtinder@2026");
      console.log(getIdFromToken); //decoded id from token

      const { _id } = getIdFromToken;
      console.log("Logged in user id is ", _id);

      const userData = await userModel.findById(_id);
      if (!userData) {
        throw new Error("No user found");
      }

      req.user = userData; //storing user data in req object for further use
      next();
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
]


module.exports = {
    userAuth
}
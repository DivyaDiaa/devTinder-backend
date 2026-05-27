const express = require("express");

//extracting because it is exported in object form in auth.js
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userModel = require("../models/user");

const userRouter = express.Router();

//Get all pending connection requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    //getting user data from req object which is stored in userAuth middleware
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName age emailId"); //here we need to display the name of the user who sent the request instead of just showing the id of that user

    //here we need to display the name of the user who sent the request instead of just showing the id of that user
    //and to make connection between 2 tables we need to use ref
    res.json({
      message: "Connection requests fetched successfully",
      connectionRequests,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//Get all connections of logged in user (connected with each other)
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user; //getting user data from req object which is stored in userAuth middleware

    const connections = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName age")
      .populate("toUserId", "firstName lastName age");

    const data = connections.map((connection) => {
      if (connection.fromUserId._id.equals(loggedInUser._id)) {
        return connection.toUserId; //if logged in user is the sender of the request then we need to show the receiver's data
      } else {
        return connection.fromUserId; //if logged in user is the receiver of the request then we need to show the sender's data
      }
    });
    res.json({
      message: "Connections fetched successfully",
      connections: data,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    //should not be able to see --> own profile, already connected, ignored, already interested
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit; //setting maximum limit to 50
    const skip = (page - 1) * limit;

    const connections = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })
      .select("fromUserId toUserId status -_id")
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName");

    const hideUsersFromFeed = new Set();
    connections.forEach((connection) => {
      hideUsersFromFeed.add(connection.fromUserId._id.toString());
      hideUsersFromFeed.add(connection.toUserId._id.toString());
    });

    const feed = await userModel
      .find({
        $and: [
          { _id: { $nin: Array.from(hideUsersFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select("firstName lastName age location")
      .skip(skip)
      .limit(limit);

    res.json({
      message: "Feed fetched successfully",
      feed,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = userRouter;

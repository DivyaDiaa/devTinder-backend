const express = require("express");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userModel = require("../models/user");

const requestRouter = express.Router();

//making API call in secured way by checking if its logged in user or not by using userAuth middleware
requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id; //getting logged in user's id from req object which is stored in userAuth middleware
      const toUserId = req.params.userId;
      const status = req.params.status; //getting status from params which is coming from URL

      if (!["interested", "ignored"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      //If existing request is there then update the status of that request instead of creating new one and
      //receiver user should not be able to send request again
      const existingRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res.status(400).json({
          message: "No existing request found",
        });
      }
      console.log("Existing request", existingRequest);

      const toUser = await userModel.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      //   if(toUserId == fromUserId) {
      //     return res.status(400).json({
      //       message: "You cannot send request to yourself",
      //     });
      //   }

      //logic to save the request in db
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: `${req.user.firstName} ${status} ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
);

module.exports = requestRouter;

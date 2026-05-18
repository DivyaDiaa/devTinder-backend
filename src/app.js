const express = require("express");
const connectDB = require("./config/database");
const userModel = require("./models/user");

const app = express();

app.use(express.json()); //will change json to js object

// app.post("/signup", async (req, res) => {
//   console.log(req.body);
//   //here it will come undefined as you need middleware becuase data will be coming in Json format
//   // const userObj = {
//   //   firstName: "Siva",
//   //   lastName: "Chandran",
//   //   emailId: "siva2000@gmail.com",
//   //   password: "Siva@1904",
//   // };
//   const user = new userModel(req.body);

//   try {
//     // const user = new userModel(userObj);
//     await user.save();
//     res.send("Database connected ");
//   } catch (err) {
//     res.status(400).send("Error saving the user: " + err.message);
//   }
// });

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const userData = await userModel.find({ emailId: userEmail });
    if (userData !== 1) {
      res.status(400).send("user not found");
    }
    res.send(userData);
  } catch (err) {
    res.status(400).send("Soemthing went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const allData = await userModel.find({});
    console.log(allData);
    res.send(allData);
  } catch (err) {
    res.status(400).send("Soemthing went wrong");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const deleteUser = await userModel.findByIdAndDelete({ _id: req.body._id });
    res.send("User deleted");
  } catch (err) {
    res.status(400).send("Soemthing went wrong");
  }
});

app.patch("/user", async (req, res) => {
  console.log(req.body);
  try {
    const updateUser = await userModel.findByIdAndUpdate(
      req.body._id,
      req.body,
      { returnDocument: "after" }, //options argumnet
    );
    console.log(updateUser); //will give before update data if u need current updateed data
    //please add 3rd argument
    res.send("User updated");
  } catch (err) {
    res.status(400).send("Soemthing went wrong");
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

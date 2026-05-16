const express = require("express");

const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();

// app.use("/test/1",(req, res) => {
//     res.send('Hello, World from test-1!');
// })

// app.use("/", (req, res) => {
//     res.send('Hello, World from main!');
// })

//Handles Auth middleware for all
// app.use("/admin", adminAuth);

app.post("/user/login", (req, res) => {
  res.send("Logged In");
});

app.get("/user/data", userAuth, (req, res) => {
  throw new Error("Failed");
  //   res.send("User data");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("Got all data");
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }
});

// app.get("/test/:testId/:testDesc", (req, res) => {
//   console.log(req.params); //can get params from URL
//   res.send("Response sent");
// });

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

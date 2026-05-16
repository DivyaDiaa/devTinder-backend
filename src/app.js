const express = require("express");

const app = express();

// app.use("/test/1",(req, res) => {
//     res.send('Hello, World from test-1!');
// })

// app.use("/", (req, res) => {
//     res.send('Hello, World from main!');
// })

// app.use("/test",(req, res) => {
//     res.send('Hello, World from test!');
// })

app.get("/test", (req, res) => {
  console.log(req.query); //can get query params from URL
  res.send("Response sent");
});

app.get("/test/:testId", (req, res) => {
  console.log(req.params); //can get params from URL
  res.send("Response sent");
});

app.get("/test/:testId/:testDesc", (req, res) => {
  console.log(req.params); //can get params from URL
  res.send("Response sent");
});

app.post("/test", (req, res) => {
  res.send("Data saveed to DB");
});

app.delete("/test", (req, res) => {
  res.send("Deleted ");
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

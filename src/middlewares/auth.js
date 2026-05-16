const adminAuth =  [
  (req, res, next) => {
    const token = "xyz";
    const isAuthenticated = token === "xyz";
    if (!isAuthenticated) {
      res.status(401).send("Unauthorized User");
    } else {
      next();
    }
  },
]

const userAuth =  [
  (req, res, next) => {
    const token = "abc";
    const isAuthenticated = token === "abc";
    if (!isAuthenticated) {
      res.status(401).send("Unauthorized User");
    } else {
      next();
    }
  },
]


module.exports = {
    adminAuth,
    userAuth
}
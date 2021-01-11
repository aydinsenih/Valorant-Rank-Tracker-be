const router = require("express").Router();

const userInfo = require("../models/userinfo");

router.post("/", (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    next({ error: { message: "username and password required" } });
  }
  const username = req.body.username;
  const password = req.body.password;
  userInfo
    .findUserInfo(username, password, next)
    .then((infos) => {
      res.status(200).json(infos);
    })
    .catch((err) => {
      res
        .status(400)
        .json({ error: { message: "username or password incorrect" } });
    });
});

module.exports = router;

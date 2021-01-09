const router = require("express").Router();

const userInfo = require("../models/userinfo");

router.get("/", (req, res, next) => {
  if (!req.username || !req.password) {
    res
      .status(400)
      .json({ error: { message: "username and password required" } });
  }
  const username = req.username;
  const password = req.password;
  userInfo
    .get(username, password)
    .then((infos) => {
      if (infos.error !== undefined) {
        res.status(500).json(infos);
      }
      res.status(200).json(infos);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;

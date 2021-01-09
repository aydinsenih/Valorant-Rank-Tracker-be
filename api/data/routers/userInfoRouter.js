const router = require("express").Router();

const userInfo = require("../models/userinfo");

router.post("/", (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res
      .status(400)
      .json({ error: { message: "username and password required" } });
  } else {
    const username = req.body.username;
    const password = req.body.password;
    userInfo
      .findUserInfo(username, password)
      .then((infos) => {
        if (infos.error !== undefined) {
          res.status(500).json(infos);
        }
        res.status(200).json(infos);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
});

module.exports = router;

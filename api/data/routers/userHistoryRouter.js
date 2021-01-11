const router = require("express").Router();

const userHistory = require("../models/userHistory");

router.post("/", (req, res, next) => {
  if (!req.body.user_token || !req.body.entitlements_token || !req.body.sub) {
    next({ error: { message: "required fields not provided." } });
  }
  const user_token = req.body.user_token;
  const entitlements_token = req.body.entitlements_token;
  const sub = req.body.sub;

  userHistory
    .findUserHistory(user_token, entitlements_token, sub)
    .then((infos) => {
      res.status(200).json(infos);
    })
    .catch((err) => {
      res.status(400).json({ error: { message: "token expired." } });
    });
});

module.exports = router;

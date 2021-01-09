const express = require("express");
const server = express();
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");

const userInfoRouter = require("./data/routers/userInfoRouter");
const errorHandler = require("../middlewares/errorHandler");

//server.use(cors());
server.use(helmet());
server.use(express.json());

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use("/getuserinfo", userInfoRouter);

server.get("/", (req, res) => res.json(req.headers));

module.exports = server;

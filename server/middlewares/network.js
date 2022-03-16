const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");

module.exports = (app) => {
  app.use(compression());

  // set security HTTP headers
  app.use(helmet());

  // parse json request body
  app.use(express.json());

  // parse urlencoded request body
  app.use(express.urlencoded({ extended: true }));

  const whitelist = [/localhost/];
  const corsOptions = {
    credentials: true,
    origin: whitelist,
  };

  // enable cors
  app.use(cors(corsOptions));
};

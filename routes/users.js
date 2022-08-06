"use strict";

const express = require("express");
const router = express.Router();
const User = require("../models").User;
const bcrypt = require("bcrypt");
const auth = require("basic-auth");

// The User Routes
// Route that returns a list course.

// Handler function to wrap each rout
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

// Authentication

const authenticateUser = async (req, res, next) => {
  let message = null;
  const credentials = auth(req);
  if (credentials) {
    const user = await User.findAll({
      raw: true,
      where: { emailAddress: credentials.name },
    });
  
    if (user[0]) {
       const authenticated = await bcrypt.compare(
        credentials.pass,
        user[0].password
      );
    
      // If the passwords match
      if (authenticated) {
        console.log(
          `Authentication successful for username: ${user[0].emailAddress}`
        );
        req.currentUser = user[0];
      } else {
        message = `Authentication failure for username: ${user[0].emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = "Auth header not found";
  }

  // If User Authentication failed
  if (message) {
    console.warn(message);
    res.status(401).json({ message: "Access Denied" });
  } else {
    next();
  }
};

// The User Routes
// Route that returns a list course.

router.get(
  "/",
   authenticateUser,
  asyncHandler(async (req, res) => {
    res.status(200).json(req.currentUser);
  })
);

// Route that creates a new user.

router.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.setHeader("Location", "/");
      res.status(201).json();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;

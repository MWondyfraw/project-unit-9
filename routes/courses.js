"use strict";

const express = require("express");
const router = express.Router();
const User = require("../models").User;
const Course = require("../models").Course;
const bcrypt = require("bcrypt");
const auth = require("basic-auth");

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

// The Course Routes
// Get All Courses

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: "User",
        },
      ],
    });
    res.status(200).json(courses);
  })
);

// Get A Course

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    let course = await Course.findAll({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: User,
          as: "User",
        },
      ],
    });
    res.status(200).json(course);
  })
);

// Create A New Course

router.post(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.create(req.body);
      res.setHeader("Location", "/courses/" + course.id);
      res.status(201).json().end();
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

// Update A Course

router.put(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const user = req.currentUser;
      const course = await Course.findByPk(req.params.id);
      if (course) {
        await course.update(req.body);
        res.status(204).json();
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// Delete A Course

router.delete(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      await course.destroy();
      res.status(204).json();
    } else {
      res.sendStatus(404);
    }
  })
);

module.exports = router;

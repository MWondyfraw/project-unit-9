"use strict";

const express = require("express");
const router = express.Router();
const { User, Course } = require("./models");
const { authenticateUser } = require("./middleware/auth-user");
const { asyncHandler } = require("./middleware/async-handler");

// The User Routes
// Route that returns a list course.

router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    });
  })
);

// Route that creates a new user.

router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).json({ message: "Account successfully created!" });
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

// The Course Routes
// Get All Courses

router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: "User",
          attributes: ["firstName", "lastName", "email"],
        },
      ],
    });
    res.status(200).end();
    res.json(courses);
  })
);

// Get A Course

router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "User",
          attributes: ["firstName", "lastName", "email"],
        },
      ],
    });
    if (course) {
      res.json(course);
      res.status(200).end();
    } else {
      res.status(404).json({ message: "Sorry Course Not Found" });
    }
  })
);

// Create A New Course

router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      await Course.create(req.body);
      res.status(201).location(`/courses/${course.id}`).end();
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
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const user = req.currentUser;
      const course = await Course.findByPk(req.params.id);
      if (course) {
        await course.updateCourse(req.body);
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Course Not Found" });
      }
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

// Delete A Course

router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      await course.destroy();
      res.status(204).end();
    } catch (error) {
      res.status(404).json({ message: "Course Not Found" });
    }
  })
);

module.exports = router;

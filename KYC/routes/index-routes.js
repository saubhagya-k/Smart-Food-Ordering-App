const express = require("express");
const router = express.Router();
const userModel = require("../models/models");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

router.post(
  "/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  body("username").isLength({ min: 3 }),
  body("confirmpassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Invalid data",
          errors: errors.array(),
        });
      }

      const { email, password, username } = req.body;

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await userModel.create({
        email,
        username,
        password: hashedPassword,
      });

      // ✅ ALWAYS RETURN JSON
      return res.status(201).json({
        message: "Signup successful",
      });
    } catch (err) {
      console.error("SIGNUP ERROR:", err);
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
);

module.exports = router;

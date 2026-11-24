const express = require("express");
const router = express.Router();
const userModel = require("../models/models");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const EMAIL_TAKEN = "This email is already registered. Please log in or use a different email.";
const USERNAME_TAKEN = "This username is already taken. Please choose a different one.";

router.post(
  "/signup",
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters."),
  body("email").trim().isEmail().withMessage("Please enter a valid email address."),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters."),
  body("confirmpassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match.");
    }
    return true;
  }),

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array()[0].msg,
          errors: errors.array(),
        });
      }

      // The database stores these in lowercase, so compare in lowercase too.
      // Otherwise "Name@Gmail.com" slips past this check and the database's
      // unique rule rejects it later as a 500 "Server error".
      const email = req.body.email.trim().toLowerCase();
      const username = req.body.username.trim().toLowerCase();
      const { password } = req.body;

      if (await userModel.exists({ email })) {
        return res.status(409).json({ field: "email", message: EMAIL_TAKEN });
      }
      if (await userModel.exists({ username })) {
        return res.status(409).json({ field: "username", message: USERNAME_TAKEN });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await userModel.create({ email, username, password: hashedPassword });

      return res.status(201).json({ message: "Signup successful" });
    } catch (err) {
      // Two people signing up with the same email/username at the same moment
      if (err?.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0] || "email";
        return res.status(409).json({
          field,
          message: field === "username" ? USERNAME_TAKEN : EMAIL_TAKEN,
        });
      }
      console.error("SIGNUP ERROR:", err);
      return res.status(500).json({
        message: "Something went wrong on our side. Please try again.",
      });
    }
  }
);

module.exports = router;

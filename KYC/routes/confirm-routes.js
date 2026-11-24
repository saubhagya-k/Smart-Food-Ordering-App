const express = require("express");
const router = express.Router();

const userModel = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/auth");

// Login cookie settings. On the deployed https server the frontend lives on
// another site (vercel.app -> onrender.com), and the browser only sends the
// cookie back if it is SameSite=None and Secure. Locally (plain http) use Lax.
function cookieOptions(req) {
  const https = req.secure;
  return {
    httpOnly: true,
    secure: https,
    sameSite: https ? "none" : "lax",
  };
}

/* ================= LOGIN ================= */
router.post("/confirm",body("email").isEmail(),
body("password").isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Please enter a valid email and a password of at least 5 characters.",
        errors: errors.array(),
      });
    }

    const email = req.body.email.trim().toLowerCase(); // stored in lowercase
    const { password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id ,
      email: user.email,
      username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      ...cookieOptions(req),
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, same as the JWT
    });

    res.json({ message: "Login success" });
  }
);

/* ================= LOGOUT ================= */
router.post("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions(req));
  res.json({ message: "Logged out" });
});

/* ================= AUTH CHECK ================= */
router.get("/auth/me", authMiddleware, (req, res) => {
  res.status(200).json({ loggedIn: true,
     user: {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
     },
   });
});

module.exports = router;

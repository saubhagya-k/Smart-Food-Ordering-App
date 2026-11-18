const express = require("express");
const router = express.Router();

const userModel = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/auth");

// When the frontend is on another site over https (Vercel -> Render), the
// browser only sends the login cookie if it is SameSite=None and Secure.
// Locally (http://localhost) keep the simpler Lax cookie.
const crossSite = (process.env.CLIENT_URL || "").startsWith("https://");
const cookieOptions = {
  httpOnly: true,
  secure: crossSite,
  sameSite: crossSite ? "none" : "lax",
};

/* ================= LOGIN ================= */
router.post("/confirm",body("email").isEmail(),
body("password").isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

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
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, same as the JWT
    });

    res.json({ message: "Login success" });
  }
);

/* ================= LOGOUT ================= */
router.post("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions);
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

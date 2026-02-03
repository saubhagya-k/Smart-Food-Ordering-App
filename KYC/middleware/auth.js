// const jwt = require("jsonwebtoken");

// function verifyToken(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // attach user info
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// }

// module.exports = verifyToken;



const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("AUTH MIDDLEWARE HIT");
  console.log("COOKIES:", req.cookies);

  const token = req.cookies?.token;

  if (!token) {
    console.log("NO TOKEN → 401");
    return res.status(401).json({ loggedIn: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("TOKEN VALID");
    next();
  } catch (err) {
    console.log("TOKEN INVALID → 401");
    return res.status(401).json({ loggedIn: false });
  }
};


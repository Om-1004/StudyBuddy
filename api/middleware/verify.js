// api/middleware/verify.js
import jwt from "jsonwebtoken";
import User from "../models/user.js"; // <-- ensure this model exports username/fullname/email fields

export const verifyToken = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization?.split(" ")[1];
    const cookieToken = req.cookies?.accessToken;
    const token = bearer || cookieToken;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      // Hydrate the full user from DB so we always have consistent fields
      const user = await User.findById(decoded.id)
        .select("_id email username fullname")
        .lean();

      if (!user) return res.status(401).json({ message: "User not found" });

      req.user = {
        id: String(user._id),
        email: user.email,
        username: user.username,
        fullname: user.fullname,
      };

      // Debug log
      console.log("🔐 verifyToken user:", req.user);

      next();
    });
  } catch (e) {
    console.error("verifyToken error:", e);
    res.status(500).json({ message: "Auth middleware failed" });
  }
};

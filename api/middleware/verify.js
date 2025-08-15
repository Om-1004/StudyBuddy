import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log('creating token ')
  const token = req.cookies?.accessToken; // ✅ read from cookies

  if (!token) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  console.log('verifying token')
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid" });
    }

    req.user = decoded; // { id: <userId> }
    console.log('token decoded')
    next();
  });
};

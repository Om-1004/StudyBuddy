import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "accessToken";
const WEEK_MS = 1000 * 60 * 60 * 24 * 7;

function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: isProd ? "None" : "Lax",
    secure: isProd,
    maxAge: WEEK_MS,
  };
}

function signJwt(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function toSafeUser(u) {
  const { password, __v, ...rest } = u.toObject ? u.toObject() : u;
  return rest;
}

export const signup = async (req, res) => {
  try {
    const {
      fullname,
      username,
      email,
      password,
      role,
      bio,
      courses,
      university,
      major,
      year,
      location,
    } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hashedPassword = bcryptjs.hashSync(password, 12);

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
      role,
      bio: bio || undefined,
      university: university || undefined,
      courses: Array.isArray(courses) && courses.length ? courses : undefined,
      major,
      year,
      location,
    });

    const savedUser = await newUser.save();
    const token = signJwt({ id: savedUser._id });

    res
      .cookie(COOKIE_NAME, token, cookieOptions())
      .status(201)
      .json({
        message: "User created successfully",
        user: toSafeUser(savedUser),
      });
  } catch (error) {
    console.error("Sign Up Failed:", error);
    return res.status(500).json({
      message: "Sign Up Failed",
      error:
        error?.code === 11000
          ? "Username or email already exists"
          : error?.message || "Internal server error",
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const ok = bcryptjs.compareSync(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = signJwt({ id: user._id });

    res
      .cookie(COOKIE_NAME, token, cookieOptions())
      .status(200)
      .json(toSafeUser(user));
  } catch (error) {
    console.error("Login Failed:", error);
    return res.status(500).json({ message: "Login Failed" });
  }
};

export const signout = async (_req, res) => {
  try {
    const opts = cookieOptions();
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      sameSite: opts.sameSite,
      secure: opts.secure,
    });
    return res.status(200).json({ message: "Successfully Signed Out" });
  } catch (error) {
    console.error("Signout Failed:", error);
    return res.status(500).json({ message: "Signout Failed" });
  }
};

export const me = async (req, res) => {
  try {
    const token =
      req.cookies?.[COOKIE_NAME] ||
      (req.headers?.cookie || "")
        .split(";")
        .map((s) => s.trim())
        .find((s) => s.startsWith(`${COOKIE_NAME}=`))
        ?.split("=")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    return res.status(200).json({ user: toSafeUser(user) });
  } catch (error) {
    console.error("ME Failed:", error);
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};

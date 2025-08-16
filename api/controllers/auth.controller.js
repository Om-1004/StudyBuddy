import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
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
    location
  } = req.body;

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
    location
  });

  try {
    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24
    });

    res.status(201).json({
      message: "User created successfully",
      userId: savedUser._id,
      role: savedUser.role
    });
  } catch (error) {
    console.error("Sign Up Failed:", error);
    res.status(500).json({
      message: "Sign Up Failed",
      error: error.code === 11000
        ? "Username or email already exists"
        : error.message
    });
  }
};


export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({email})
        if (!validUser) {return res.status(400).json({ message: "User not found" });}
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!bcryptjs.compareSync(password, validUser.password)) {return res.status(400).json({ message: "Invalid credentials" });}
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        const { password: pass, ...rest } = validUser._doc;
        res.cookie("accessToken", token, {httpOnly: true}).status(200).json(rest)

    } catch (error) {
       res.status(500).json({message: "Login Failed"});
    }
}


export const signout = async (req, res) => {
    try {
      res.clearCookie("accessToken")
      res.clearLocalStorage()
      res.status(200).json("Sucessfully Signed Out")
    } catch (error) {
        res.status(500).json({message: "Signout Failed"});
    }
}
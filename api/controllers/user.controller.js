import User from "../models/user.js";

export const LookUp = async (req, res)  => {
    const { username } = req.query;
    if (!username) return res.status(400).json({ message: "username is required" });
    const user = await User.findOne({ username }).select("_id username email fullname");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: { id: String(user._id), username: user.username, email: user.email, fullname: user.fullname } });
}
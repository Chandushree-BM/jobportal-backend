import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
try {
const { name, email, password } = req.body;
if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });


const exists = await User.findOne({ email });
if (exists) return res.status(409).json({ message: "Email already in use" });


const hash = bcrypt.hashSync(password, 10);
const user = await User.create({ name, email, password: hash });


return res.status(201).json({ id: user._id, name: user.name, email: user.email });
} catch (err) {
console.error("[register]", err);
return res.status(500).json({ message: "Server error" });
}
};


export const login = async (req, res) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(401).json({ message: "Invalid credentials" });


const ok = bcrypt.compareSync(password, user.password);
if (!ok) return res.status(401).json({ message: "Invalid credentials" });


const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
} catch (err) {
console.error("[login]", err);
return res.status(500).json({ message: "Server error" });
}
};
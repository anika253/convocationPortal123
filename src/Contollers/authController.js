const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: "User Already Exists" });
    }
    const hashPass = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashPass });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User Not Found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
    const token = jwt.sign({ id: user._id }, "SECRET_KEY");
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

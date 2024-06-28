const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');

const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).send('User already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      email,
      username,
      password: hashedPassword,
      otp,
    });

    await user.save();

    await sendEmail(user.email, 'Verify your email', `Your OTP is ${otp}`);

    res.status(201).send('User registered. Please check your email to verify your account.');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid email');

    if (user.otp !== otp) return res.status(400).send('Invalid OTP');

    user.isVerified = true;
    user.otp = undefined;

    await user.save();

    res.status(200).send('User verified successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.header('Authorization', token).send(token);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { register, verifyUser, login };

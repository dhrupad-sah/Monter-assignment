const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const adminRegister = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const existingAdmin = await User.findOne({ $or: [{ email }, { username }], isAdmin: true });
    if (existingAdmin) return res.status(400).send('Admin already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new User({
      email,
      username,
      password: hashedPassword,
      isAdmin: true,
    });

    await admin.save();

    res.status(201).send('Admin registered successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, isAdmin: true });
    if (!admin) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    const token = jwt.sign({ _id: admin._id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.header('Authorization', token).send(token);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select('username');
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username, isAdmin: false }).select('-password -otp');
    if (!user) return res.status(404).send('User not found');

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ username: req.params.username, isAdmin: false });
    if (!user) return res.status(404).send('User not found');

    res.status(200).send('User deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { adminRegister, adminLogin, getAllUsers, getUserDetails, deleteUser };

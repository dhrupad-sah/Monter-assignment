const User = require('../models/user');

const addExtraInfo = async (req, res) => {
  try {
    const { location, age, work, dob, description } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send('User not found');

    user.location = location;
    user.age = age;
    user.work = work;
    user.dob = dob;
    user.description = description;

    await user.save();

    res.status(200).send('User information updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp');
    if (!user) return res.status(404).send('User not found');

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['location', 'age', 'work', 'dob', 'description'];
    const isValidOperation = Object.keys(updates).every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) return res.status(400).send('Invalid updates');

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send('User not found');

    Object.keys(updates).forEach((update) => {
      user[update] = updates[update];
    });

    await user.save();

    res.status(200).send('User information updated successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { addExtraInfo, getUserInfo, updateUserInfo };

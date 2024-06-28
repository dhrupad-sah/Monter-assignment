const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { adminRegister, adminLogin, getAllUsers, getUserDetails, deleteUser } = require('../controllers/adminController');

router.post('/register', adminRegister);
router.post('/login', adminLogin);
router.get('/users', auth, getAllUsers);
router.get('/users/:username', auth, getUserDetails);
router.delete('/users/:username', auth, deleteUser);

module.exports = router;

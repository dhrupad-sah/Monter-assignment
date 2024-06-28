const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { addExtraInfo, getUserInfo, updateUserInfo } = require('../controllers/userController');

router.post('/add-info', auth, addExtraInfo);
router.get('/info', auth, getUserInfo);
router.patch('/update-info', auth, updateUserInfo);

module.exports = router;

const express = require('express');
const userController = require('../controllers/users');
const { check } = require('express-validator');


const router = express.Router();

router.get('/', userController.getUsers);
router.post('/signup', [check('name').not().isEmpty(), check('email').isEmail(), check('password').isLength({min: 6})], userController.signup);
router.post('/login', [check('email').isEmail(), check('password').isLength({min: 6})],userController.login);

module.exports = router;
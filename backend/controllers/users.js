const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUsers = async(req, res, next) => {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json({users: users.map(user => user.toObject({getters: true}))})
    }
    catch(error) {
        let newErr = new Error("Something went wrong. Please try again");
        newErr.code = 500;
        return next(newErr);
    }
}
const signup = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const  {name, email, password } = req.body;
        const user = await User.findOne({email: email});
        if(user) {
            const err = new Error("could not signup user email already exists")
            err.code = 422
            return next(err);
        }
        const newUser = new User({
            name: name,
            email: email,
            password:  await bcrypt.hash(password, 12),
            image: 'https://google.com',
            places: []
        })
        await newUser.save()
        const token = jwt.sign({id: newUser.id,  email: newUser.email}, 'secretkey')
        res.status(201).json({user: {id: newUser.id, name: newUser.name, email: newUser.email, places: newUser.places, image: newUser.image, token: token}})
    }
    catch(error) {
        let newError  = new Error("something went wrong. Please try again");
        newError.code = 500;
        return next(newError);
    }
}

const login = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        if(!user) {
            const err = new Error("Email or password is incorrect")
            err.code = 401
            return next(err);
        }
        let isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword) {
            const err = new Error("Email or password is incorrect")
            err.code = 401
            return next(err);      
        }
        token = jwt.sign({id: user.id,  email: user.email}, 'secretkey');
        res.status(200).json({user: {id: user.id, name: user.name, places: user.places, image: user.image, token: token}})
    }
    catch(error) {
        let newErr = new Error("Something went wrong. Please try again.")
        newErr.code = 500;
        return next(error);
    }
}

module.exports.signup = signup;
module.exports.login = login;
module.exports.getUsers = getUsers;
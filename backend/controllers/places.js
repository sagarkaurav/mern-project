const { validationResult } = require('express-validator');
const Place = require('../models/place');
const User = require('../models/user');
const mongoose = require('mongoose');

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    try {
        const place = await Place.findById(placeId);
        if(!place) {
            let newErr = new Error("unable to find place by the id");
            newErr.code = 404
            return next(newErr);
        }
        return res.json({place: place.toObject({getters: true})});
    }
    catch(error) {
        let newErr = new Error("something went wrong. Please try again.");
        newErr.code = 500
        next(newErr);
    }

};

const getPlaceByUserId = async(req, res, next) => {
    const userId = req.params.userId;
    try {
        const userWithPlaces = await User.findById(userId).populate('places');
        if(!userWithPlaces || userWithPlaces.length === 0) {
            const error = new Error("Could not find places for the provided user id")
            error.code = 404
            return next(error);
        }
        res.status(200).json({places: userWithPlaces.places});
    }
    catch(error) {
        console.log(error);
        let newErr = new Error("something went wrong. Please try again.");
        newErr.code = 500;
        next(newErr);
    }
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const userId = req.userId;
        const  user = await User.findById(userId);
        if(!user) {
            let newErr = new Error("unable to find user with given userId");
            newErr.code = 422;
            return next(newErr);
        }
        const newPlace = new Place({
            title: req.body.title,
            description: req.body.description,
            creator: user,
            address: req.body.address,
            location: {
                lat: 100.0000,
                lng: 200.000
            },
            image: 'https://google.com'
        });
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newPlace.save({session: sess});
        user.places.push(newPlace);
        await user.save({session: sess});
        await sess.commitTransaction();
        res.status(201).json({place: newPlace});    
    }
    catch(err) {
        console.log(err);
        let newErr = new Error("something went wrong. Please try again later");
        newErr.code = 500;
        return next(newErr);
    }
}

const updatePlace = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const placeId = req.params.pid;
        const {title, description} = req.body;
        let place = await Place.findById(placeId);
        if(!place) {
            let newErr = new Error("unable to find the place with belongs to users")
            newErr.code = 422;
            return next(newErr)
        }
        if(!place.creator.toString() === req.userId) {
            let newErr = new Error("unable to find the place with belongs to users")
            newErr.code = 422;
            return next(newErr)      
        }
        place.title = title;
        place.description = description;
        await place.save();
        res.status(200).json({place: place.toObject({getters: true})})
    }
    catch(err) {
        let newErr = new Error("something went wrong. Please try again later");
        newErr.code = 500;
        return next(newErr);
    }
}

const deletePlace = async(req, res, next) => {
    const placeId = req.params.pid;
    try {
        let place = await Place.findById(placeId).populate('creator');
        if(!place) {
            let newErr = new Error("unable to find the place with belongs to users")
            newErr.code = 422;
            return next(newErr)
        }
        if(!place.creator.toString() === req.userId) {
            let newErr = new Error("unable to find the place with belongs to users")
            newErr.code = 422;
            return next(newErr)      
        }
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session: sess});
        place.creator.places.pull(place);
        await place.creator.save({session: sess})
        await sess.commitTransaction();
        res.json({place})
    }
    catch(err) {
        console.log(err);
        let newErr = new Error("something went wrong. Please try again later");
        newErr.code = 500;
        return next(newErr);
    }
}


module.exports.createPlace = createPlace;
module.exports.getPlaceById = getPlaceById;
module.exports.getPlaceByUserId = getPlaceByUserId;
module.exports.updatePlace = updatePlace;
module.exports.deletePlace = deletePlace;
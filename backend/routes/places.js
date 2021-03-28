const express = require('express');
const placesController = require('../controllers/places');
const { check } = require('express-validator');
const auth  = require('../middleware/auth');

const router = express.Router();

router.get('/user/:userId', placesController.getPlaceByUserId);
router.get('/:pid', placesController.getPlaceById);

router.use(auth);
router.post('/', [check('title').not().isEmpty(), check('description').isLength({min: 5, max: 1000}), check('address').not().isEmpty()], placesController.createPlace);
router.delete('/:pid', placesController.deletePlace);
router.patch('/:pid',[check('title').not().isEmpty(), check('description').isLength({min: 5, max: 1000})], placesController.updatePlace);
module.exports = router;
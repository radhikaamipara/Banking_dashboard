const express = require('express');
const Offer = require('../models/Offer');
const { getOffers, createOffer } = require('../controllers/offersController');

const router = express.Router();

router.get('/', getOffers);
router.post('/', createOffer); // Assuming you have a createOffer function in your controller 

module.exports = router;
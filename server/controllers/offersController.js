const Offer = require('../models/Offer');

exports.getOffers = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'SecureBank Offers API is working',
      offers: [
        {
          id: 1,
          title: 'Zero Balance Savings Account',
          description: 'Open a savings account with zero minimum balance.'
        },
        {
          id: 2,
          title: 'Personal Loan Offer',
          description: 'Get attractive interest rates on personal loans.'
        }
      ]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//post
exports.createOffer = async (req, res) => {
  try {
    const { title, description } = req.body;

    const offer = await Offer.create({
      title,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      offer: {
        id: 3,
        title,
        description
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
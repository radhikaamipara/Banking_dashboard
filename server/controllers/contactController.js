const ContactInquiry = require('../models/ContactInquiry');

// @desc    Submit a contact inquiry from public Contact Us page
// @route   POST /api/contact
// @access  Public
exports.submitInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all contact inquiry fields.' });
    }

    const inquiry = await ContactInquiry.create({
      name,
      email,
      phone,
      subject,
      message,
      status: 'new',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your inquiry has been logged. Our branch officer will connect shortly.',
      inquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all inquiries (Admin)
// @route   GET /api/contact/all
// @access  Private / Admin
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update inquiry status (Admin)
// @route   PUT /api/contact/:id
// @access  Private / Admin
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status, replyNotes } = req.body;
    const inquiry = await ContactInquiry.findById(req.params.id);

    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });

    if (status) inquiry.status = status;
    if (replyNotes) inquiry.replyNotes = replyNotes;
    await inquiry.save();

    res.json({ success: true, message: 'Inquiry updated.', inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

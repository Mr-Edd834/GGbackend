const Partner = require('../models/Partner');

// Submit partnership application
exports.submitApplication = async (req, res) => {
  try {
    const { companyName, directorName, email, phoneNumber } = req.body;

    // Validate input
    if (!companyName || !directorName || !email || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if email already exists
    const existingPartner = await Partner.findOne({ email: email.toLowerCase() });
    if (existingPartner) {
      return res.status(409).json({
        success: false,
        message: 'A partnership application with this email already exists'
      });
    }

    // Create new partnership application
    const partner = new Partner({
      companyName: companyName.trim(),
      directorName: directorName.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber: phoneNumber.trim()
    });

    await partner.save();

    res.status(201).json({
      success: true,
      message: 'Partnership application submitted successfully',
      data: {
        id: partner._id,
        companyName: partner.companyName,
        email: partner.email,
        status: partner.status,
        submittedAt: partner.submittedAt
      }
    });
  } catch (error) {
    console.error('Partnership submission error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while submitting partnership application'
    });
  }
};

// Get all partnership applications (for admin)
exports.getAllApplications = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const partners = await Partner.find(filter)
      .sort({ submittedAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: partners.length,
      data: partners
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
};

// Get single partnership application by ID
exports.getApplication = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partnership application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: partner
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching application'
    });
  }
};

// Update partnership application status (for admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, approved, or rejected'
      });
    }

    const partner = await Partner.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partnership application not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: partner
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating application'
    });
  }
};

// Delete partnership application
exports.deleteApplication = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partnership application not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Partnership application deleted successfully'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting application'
    });
  }
};


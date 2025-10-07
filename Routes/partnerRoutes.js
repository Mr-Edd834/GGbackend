const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
// If you want to protect admin routes with authentication, uncomment this:
// const authMiddleware = require('../middleware/authMiddleware');

// Public route - Submit partnership application
router.post('/', partnerController.submitApplication);

// Admin routes (add authMiddleware if you want to protect these)
router.get('/', partnerController.getAllApplications);
router.get('/:id', partnerController.getApplication);
router.put('/:id/status', partnerController.updateApplicationStatus);
router.delete('/:id', partnerController.deleteApplication);

module.exports = router;


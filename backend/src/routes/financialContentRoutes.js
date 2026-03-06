const express = require('express');
const router = express.Router();
const financialContentController = require('../controllers/financialContentController');
const { authenticate } = require('../middleware/auth');

router.get('/', financialContentController.getAllContent);
router.get('/:id', financialContentController.getContentById);
router.post('/', authenticate, financialContentController.createContent);

module.exports = router;

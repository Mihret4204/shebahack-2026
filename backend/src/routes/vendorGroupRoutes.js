const express = require('express');
const router = express.Router();
const vendorGroupController = require('../controllers/vendorGroupController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, vendorGroupController.createGroup);
router.get('/', vendorGroupController.getAllGroups);
router.post('/:id/join', authenticate, vendorGroupController.joinGroup);

module.exports = router;

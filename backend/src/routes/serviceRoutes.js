const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, serviceController.createService);
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.put('/:id', authenticate, serviceController.updateService);
router.delete('/:id', authenticate, serviceController.deleteService);

module.exports = router;

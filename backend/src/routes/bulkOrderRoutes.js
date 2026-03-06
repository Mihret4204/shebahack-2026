const express = require('express');
const router = express.Router();
const bulkOrderController = require('../controllers/bulkOrderController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, bulkOrderController.createBulkOrder);
router.get('/', authenticate, bulkOrderController.getAllBulkOrders);
router.put('/:id', authenticate, bulkOrderController.updateBulkOrder);

module.exports = router;

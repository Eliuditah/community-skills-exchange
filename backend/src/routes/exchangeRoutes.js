const express = require('express');
const router = express.Router();
const {
  createExchange,
  getExchanges,
  getExchangeById,
  updateExchangeStatus,
  acceptExchange,
  completeExchange,
  cancelExchange,
  getUserExchanges,
} = require('../controllers/exchangeController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.route('/')
  .get(protect, getExchanges)
  .post(protect, createExchange);

router.get('/user', protect, getUserExchanges);
router.get('/:id', protect, getExchangeById);

// Status update routes
router.put('/:id/accept', protect, acceptExchange);
router.put('/:id/complete', protect, completeExchange);
router.put('/:id/cancel', protect, cancelExchange);
router.put('/:id/status', protect, updateExchangeStatus);

module.exports = router;
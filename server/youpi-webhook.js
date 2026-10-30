// YOUPI PG Webhook Handler for CareerShelf
// This runs as a separate server - NOT copied into the frontend project

require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const app = express();

// Middleware
app.use(express.json());
app.use(express.text({ type: 'application/json' }));
app.use(express.urlencoded({ extended: true }));

// YOUPI Configuration (from environment variables)
const YOUPI_WEBHOOK_SECRET = process.env.YOUPI_WEBHOOK_SECRET || 'your_webhook_secret_here';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'admin@careershelf.com';

// In-memory storage for demo - replace with Supabase/Database in production
const processedDeliveries = new Set();
const orders = new Map();

// Helper: Verify Youpi webhook signature
function verifySignature(rawBody, signature) {
  const expectedSig = 'sha256=' + crypto
    .createHmac('sha256', YOUPI_WEBHOOK_SECRET)
    .update(rawBody, 'utf8')
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(signature));
}

// POST /api/youpi-webhook
app.post('/api/youpi-webhook', (req, res) => {
  try {
    const rawBody = req.rawBody || JSON.stringify(req.body);
    const signature = req.headers['x-gateway-signature'];
    const deliveryId = req.headers['x-gateway-delivery-id'];

    // 1. Verify signature
    if (!signature || !verifySignature(rawBody, signature)) {
      console.error('Invalid Youpi webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // 2. Deduplicate using delivery ID
    if (deliveryId && processedDeliveries.has(deliveryId)) {
      console.log('Duplicate webhook delivery ID ignored:', deliveryId);
      return res.status(200).json({ received: true, duplicate: true });
    }
    if (deliveryId) {
      processedDeliveries.add(deliveryId);
    }

    const event = req.body;
    console.log('Youpi webhook event received:', event);

    // 3. Handle SUCCESS event
    if (event.type === 'SUCCESS' || event.status === 'SUCCESS') {
      const { orderId, amount, utr, paymentId, payerEmail } = event.data || {};

      if (!orderId) {
        return res.status(400).json({ error: 'Missing orderId' });
      }

      // Find pending order
      const order = orders.get(orderId);
      if (!order) {
        console.error('Order not found:', orderId);
        return res.status(404).json({ error: 'Order not found' });
      }

      // Verify amount matches
      if (order.amountPaise !== amount) {
        console.error('Amount mismatch for order', orderId);
        return res.status(400).json({ error: 'Amount mismatch' });
      }

      // Mark as paid
      order.status = 'paid';
      order.utr = utr;
      order.paymentId = paymentId;
      order.paidAt = new Date().toISOString();

      // Save to database would go here
      console.log('Order marked as paid:', orderId, 'UTR:', utr, 'Amount:', amount);

      // Send notification
      sendNotification(order, 'paid');

      return res.status(200).json({ received: true, status: 'paid' });
    }

    // Handle other events (FAILURE, EXPIRED, etc.)
    console.log('Unhandled event type:', event.type);
    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Youpi webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper: Send notification (email + WhatsApp/Telegram)
async function sendNotification(order, status) {
  const time = new Date().toLocaleString();
  const msg = `
💳 YOUPI Payment Notification
Website: CareerShelf
Order ID: ${order.orderId}
Amount: ₹${order.amount / 100} (${order.amount} paise)
UTR: ${order.utr || 'Pending'}
Status: ${status}
Time: ${time}
  `.trim();

  // Email notification (using SendGrid or similar)
  // TODO: Implement actual email sending
  console.log('Email notification would be sent to:', NOTIFY_EMAIL);
  console.log('Message:', msg);

  // WhatsApp/Telegram would go here
}

// Sample order creation endpoint (for frontend to save pending orders)
app.post('/api/orders/pending', (req, res) => {
  const { orderId, amount, productId, userId } = req.body;
  const amountPaise = Math.round(amount * 100);

  orders.set(orderId, {
    id: orderId,
    orderId, // duplicate field but kept for compatibility
    amountPaise,
    amount,
    productId,
    userId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });

  console.log('Pending order created:', orderId, amountPaise);
  res.status(201).json({ success: true, orderId });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`YOUPI Webhook server running on port ${PORT}`);
  console.log('Setup instructions:');
  console.log('1. Set YOURPI_WEBHOOK_SECRET in .env');
  console.log('2. Set NOTIFY_EMAIL in .env');
  console.log('3. Expose this server at pay.mydomain.com (using ngrok or your own domain)');
  console.log('4. Configure webhook URL in YOUPI Merchant Admin to: https://pay.mydomain.com/api/youpi-webhook');
});

module.exports = app;
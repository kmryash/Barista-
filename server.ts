import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'BrewBook', timestamp: new Date().toISOString() });
});

// API: Server-side Payment Verification
app.post('/api/payments/verify', (req, res) => {
  const { provider, orderId, amountUsd } = req.body;
  if (!amountUsd || amountUsd < 2) {
    return res.status(400).json({ error: 'Server rejection: Minimum payment is $2.' });
  }

  // Simulated server signature verification
  return res.json({
    verified: true,
    transactionId: `txn_srv_${Date.now()}`,
    amountUsd,
    provider,
  });
});

// API: Webhook receivers (idempotent processing)
const processedEvents = new Set<string>();

app.post('/api/webhooks/stripe', (req, res) => {
  const eventId = req.headers['stripe-event-id'] as string || req.body?.id;
  if (eventId && processedEvents.has(eventId)) {
    return res.status(200).json({ received: true, note: 'duplicate idempotent ignored' });
  }
  if (eventId) processedEvents.add(eventId);
  return res.status(200).json({ received: true });
});

app.post('/api/webhooks/razorpay', (req, res) => {
  const eventId = req.headers['x-razorpay-event-id'] as string || req.body?.event_id;
  if (eventId && processedEvents.has(eventId)) {
    return res.status(200).json({ received: true, note: 'duplicate idempotent ignored' });
  }
  if (eventId) processedEvents.add(eventId);
  return res.status(200).json({ received: true });
});

// API: Safe Browsing URL Verification
app.post('/api/safe-browsing/check', (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ safe: false, error: 'URL required' });
  }

  // Reject invalid protocols
  if (!url.startsWith('https://')) {
    return res.status(400).json({ safe: false, reason: 'Must be HTTPS' });
  }

  // Reject local IP addresses and dangerous schemes
  const ipOnly = /^https:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
  if (ipOnly.test(url)) {
    return res.status(400).json({ safe: false, reason: 'IP addresses disallowed' });
  }

  return res.json({ safe: true });
});

// Mount Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`☕ BrewBook server running on port ${PORT}`);
  });
}

startServer();

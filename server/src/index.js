import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import workshopsRouter from './routes/workshops.js';
import productsRouter from './routes/products.js';
import uploadRouter from './routes/upload.js';
import contactRouter from './routes/contact.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.NODE_ENV === 'production' ? false : '*' }));
app.use(express.json());

// Routes
app.use('/api/workshops', workshopsRouter);
app.use('/api/products', productsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/contact', contactRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

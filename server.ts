
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import bookingRoutes from './server/routes/bookingRoutes';
import adminRoutes from './server/routes/adminRoutes';
import partnerRoutes from './server/routes/partnerRoutes';
import { connectMongoDB } from './server/db/mongo';
import otpRoutes from './server/routes/otpRoutes.js';
import cookieParser from 'cookie-parser';
import adminAuthRoutes from './server/routes/adminAuthRoutes';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Connect to MongoDB before starting the server
  await connectMongoDB();

 const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Middleware must run before API routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use('/api/admin/auth', adminAuthRoutes);

app.use('/api', bookingRoutes);
app.use('/api', adminRoutes);
app.use('/api', partnerRoutes);
app.use('/api', otpRoutes);

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      app: 'HomeHelp Admin Web Backend',
      timestamp: new Date().toISOString(),
      voiceHiringEnabled: true,
      database: 'connected',
    });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');

    app.use(express.static(distPath));

    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `HomeHelp Admin Server running at http://localhost:${PORT}`
    );
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

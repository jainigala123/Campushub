import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import registerRoutes from './common/routeRegistry.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'CampusHub backend is running' });
});

await registerRoutes(app);

const PORT = parseInt(process.env.PORT, 10) || 5000;
const server = app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Use a different port by setting PORT or stop the process currently listening on ${PORT}.`);
    process.exit(1);
  }
  throw err;
});

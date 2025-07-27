
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db';
import authRoutes from './routes/auth';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// ES Module-safe way to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Database
initDb().catch(console.error);

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    const clientDistPath = path.join(__dirname, '../../dist');
    app.use(express.static(clientDistPath));

    app.get('*', (req, res) => {
        res.sendFile(path.join(clientDistPath, 'index.html'));
    });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

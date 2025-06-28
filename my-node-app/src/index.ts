import express,{ Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './db/db';
import authRoutes from './routes/userRoutes';
import transactionRoutes from './routes/transactionRoutes';
import { verifyToken } from './middlewares/verifyToken';
import path from 'path';




dotenv.config();
const app = express();
app.use(cors())
app.use(express.json())
const PORT = process.env.PORT || 3000;
connectDB();



app.use('/api/auth', authRoutes); 
app.use('/api/transaction', verifyToken, transactionRoutes);


// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../../project/dist')));

// Fallback for SPA routing
// Instead of using "*", match paths that do not start with /api, like so:
app.get(/^\/(?!api).*/, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../project/dist/index.html'));
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

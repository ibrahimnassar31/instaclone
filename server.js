// server.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';
import { errorMiddleware } from './middlewares/errorMidllerware.js';
import connectDB from './utils/db.js';
import setupSocket from './socket/socket.js';
import userRoutes from './routes/user.routes.js';

// تحميل متغيرات البيئة
dotenv.config();

// إنشاء تطبيق Express
const app = express();


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});


// ميدل وير
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));


app.use(errorMiddleware);


// مسارات API
app.use('/api/v1/users', userRoutes);

// إنشاء HTTP Server مع دعم Socket.io
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

// تشغيل Socket.io
setupSocket(io);

// الاتصال بقاعدة البيانات
connectDB();

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

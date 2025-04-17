// server.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import http from 'http';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';

import connectDB from './utils/db.js';
import setupSocket from './socket/socket.js';

// تحميل متغيرات البيئة
dotenv.config();

// إنشاء تطبيق Express
const app = express();

// ميدل وير
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// إذا كنت ستضيف راوتات
// import userRoutes from './routes/user.routes.js';
// app.use('/api/users', userRoutes);

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

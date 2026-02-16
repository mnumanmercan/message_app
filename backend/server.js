import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

// Environment variables yükle
dotenv.config();

// Express app oluştur
const app = express();

// HTTP server oluştur (Socket.io için gerekli)
const httpServer = createServer(app);

// Socket.io server oluştur
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // URL-encoded parser

// Test route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});

// Server başlat
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`
    🚀 Server is running!
    📡 HTTP: http://localhost:${PORT}
    🔌 Socket.io: ws://localhost:${PORT}
    📝 Environment: ${process.env.NODE_ENV}
  `);
});
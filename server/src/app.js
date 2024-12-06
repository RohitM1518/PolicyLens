import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes.js'
import geminiRoutes from './routes/geminiRoutes.js'
// import { httpError } from './utils/httpError.js'
// import { configGemini } from './controllers/geminiController.js'
import dotenv from 'dotenv'
import insuranceRoutes from './routes/insuranceRoutes.js';
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import regionalLanguageRoutes from './routes/regionalLanguageRoutes.js'
import summaryRoutes from './routes/summaryRoutes.js'

dotenv.config({
    path:'./.env'
});

const app=express();

// app.use(cors())

const corsOptions = {
    origin:process.env.CORS_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true,
}
app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files from public directory
app.use(express.static("public"));

// Parse cookies
app.use(cookieParser());

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/gemini', geminiRoutes);
app.use('/api/v1/insurance', insuranceRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/chat/message', messageRoutes);
app.use('/api/v1/regional/language', regionalLanguageRoutes);
app.use('/api/v1/summary', summaryRoutes);

// 404 Error handler
app.use((req, _, next) => {
    try {
        throw new Error();
    } catch (err) {
        httpError(next, err, req, 404)
    }
})
export {app}
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app=express();

const corsOptions = {
    origin:process.env.CORS_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true
}
app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files from public directory
app.use(express.static("public"));

// Parse cookies
app.use(cookieParser());

export {app}
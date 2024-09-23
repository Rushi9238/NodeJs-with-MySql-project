import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';


export const app=express();

app.use(cors({
    origin: ['http://localhost:8000'],
    credentials: true
}))

app.use(express.json({
    limit:'16kb',
    extended: true
}))

app.use(express.urlencoded({
    limit:'16kb',
    extended:true,
}))

app.use(express.static("public"))

app.use(cookieParser())

// Calling Routes

import { userRoute } from './routes/user.route.js';

app.use("/api/v1/user",userRoute)


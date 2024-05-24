import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./src/routes/user.route.js";
import authRoutes from "./src/routes/auth.route.js";
import postRoutes from './src/routes/post.route.js';
import commentRoutes from './src/routes/comment.route.js';
import cookieParser from "cookie-parser";
import cors from 'cors';

dotenv.config();

mongoose
   .connect(process.env.MONGODB)
   .then(() => {
      console.log("MongoDb is connected"); 
   })
   .catch((err) => {
      console.log(err);
   });

const app = express();

app.use(express.json());
app.use(cookieParser());

// Настройки CORS
const allowedOrigins = ['http://localhost:5173', 'https://inputstudios.vercel.app'];
app.use(cors({
   origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
         callback(null, true);
      } else {
         callback(new Error('Not allowed by CORS'));
      }
   },
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization'],
   credentials: true
}));

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.get('/', async (req, res) => {
   try {
      res.status(200).json({ msg: 'I am in home route' });
   } catch (error) {
      res.status(500).json({ msg: 'Error in home route' });
   }
});

app.use((err, req, res, next) => {
   const statusCode = err.statusCode || 500;
   const message = err.message || "Internal Server Error";
   res.status(statusCode).json({
      success: false,
      statusCode,
      message,
   });
});

app.use((req, res, next) => {
   res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
   next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}!`);
});

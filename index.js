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

app.use(cors({ origin: 'https://inputstudios.vercel.app' }));

app.listen(3000, () => {
   console.log("Server is running on port 3000!");
});

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
   const message = err.message || " InternalServer Error";
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

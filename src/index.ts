import express from 'express'                   
import cors from 'cors'     
import authRoutes from './routes/auth.routes'  
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import postRoutes from './routes/post.routes'
dotenv.config()

const SERVER_PORT = process.env.SERVER_PORT
const MONGO_URI = process.env.MONGO_URI as string
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME as string
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY as string
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET as string

const app = express()

// JSON parsing middleware
app.use(express.json())                         

// CORS middleware configuration
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://smart-blog-fe-nine.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
)

// Mount auth routes, mekath middleware ekak
app.use('/api/v1/auth', authRoutes)     
app.use('/api/v1/post', postRoutes)
app.get("/", (req, res) => {
  res.send("Backend is running...")
})

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((err) => {
    console.error(`DB connection fail: ${err}`)
    process.exit(1)
  })

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on ${SERVER_PORT}`)
})

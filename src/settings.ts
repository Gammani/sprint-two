import dotenv from "dotenv"
dotenv.config()

export const settings = {
    MONGO_URI: process.env.MONGODB_URL || "mongodb://0.0.0.0:27017",
    JWT_SECRET: process.env.MONGODB_URL || "123"
}
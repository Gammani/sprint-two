import {MongoClient} from 'mongodb'
import mongoose from 'mongoose'
//import * as dotenv from 'dotenv'
import dotenv from 'dotenv'
import {
    BloggersType,
    CommentsType,
    DevicesType,
    ExpiredTokenType,
    PostsType,
    RequestForApiType,
    UserType
} from "../utils/types";
import {settings} from "../settings";

dotenv.config()

const dbName = "friendlyWorld"

const mongoURI = settings.MONGO_URI || `mongodb://0.0.0.0:27017/${dbName}`
// const mongoURI = "mongodb://0.0.0.0:27017"
if (!mongoURI) {
    throw new Error(`! Url doesn't found`)
}

export const client = new MongoClient(mongoURI)
// const db = client.db("world_around")
// export const bloggersCollection = db.collection<BloggersType>("bloggers")
// export const postsCollection = db.collection<PostsType>("posts")

const db = client.db("friendlyWorld")
export const bloggersCollection = db.collection<BloggersType>("bloggers")
export const postsCollection = db.collection<PostsType>("posts")
export const usersCollection = db.collection<UserType>("users")
export const commentsCollection = db.collection<CommentsType>("comments")
export const expiredTokensCollection = db.collection<ExpiredTokenType>("expiredTokens")
export const requestForApiCollection = db.collection<RequestForApiType>("requestForApi")
export const devicesCollection = db.collection<DevicesType>("devices")


export async function runDb() {
    try {
        // Connect the client to the server
        // await client.connect();
        // Establish and verify connection
        await mongoose.connect(mongoURI)

        await client.db("bloggers").command({ping: 1})
        await client.db("posts").command({ping: 1})
        await client.db("users").command({ping: 1})
        await client.db("comments").command({ping: 1})
        await client.db("expiredTokens").command({ping: 1})
        await client.db("requestForApi").command({ping: 1})
        await client.db("devices").command({ping: 1})
        console.log("Connected successfully to mongoose server")


    } catch(e) {
        console.log("Can't connect to db");
        // Ensures that the client will close when you finish/error
        // await client.close();
        await mongoose.disconnect()
    }
}
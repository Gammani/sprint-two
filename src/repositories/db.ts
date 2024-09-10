import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
// import dotenv from 'dotenv'
import {settings} from "../settings";

dotenv.config()

// export const dbName = process.env.MONGODB_URL || "friendlyWorlds"
export const mongoURI = settings.MONGO_URI

// const mongoURI = "mongodb://0.0.0.0:27017"
//export const client = new MongoClient(mongoURI + "/" + dbName)
//const db = client.db("friendlyWorlds")
// export const blogsCollection = db.collection<BlogType>("bloggers")
// export const postsCollection = db.collection<PostType>("posts")
// export const usersCollection = db.collection<UserTypeDbModel>("users")
// export const commentsCollection = db.collection<CommentType>("comments")
// export const expiredTokensCollection = db.collection<ExpiredTokenType>("expiredTokens")
// export const requestForApiCollection = db.collection<RequestForApiType>("requestForApi")
// export const devicesCollection = db.collection<DevicesType>("devices")


export async function runDb() {
    try {
        // Connect the client to the server
        // await client.connect();
        // Establish and verify connection
        console.log(mongoURI, " mongoURI")
        await mongoose.connect(mongoURI)

        // await client.db("blogs").command({ping: 1})
        // await client.db("posts").command({ping: 1})
        // await client.db("users").command({ping: 1})
        // await client.db("comments").command({ping: 1})
        // await client.db("expiredTokens").command({ping: 1})
        // await client.db("requestForApi").command({ping: 1})
        // await client.db("devices").command({ping: 1})
        console.log("Connected successfully to mongoose server")


    } catch(e) {
        console.log("Can't connect to db");
        console.log(e, " error")
        // Ensures that the client will close when you finish/error
        // await client.close();
        await mongoose.disconnect()
    }
}
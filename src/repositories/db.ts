import {MongoClient} from 'mongodb'
import * as dotenv from 'dotenv'
import {BloggersType, PostsType, UserType} from "../utils/types";

dotenv.config()


const url = process.env.MONGODB_URL || "mongodb://0.0.0.0:27017"
// const url = "mongodb://0.0.0.0:27017"
if (!url) {
    throw new Error(`! Url doesn't found`)
}

export const client = new MongoClient(url)
// const db = client.db("world_around")
// export const bloggersCollection = db.collection<BloggersType>("bloggers")
// export const postsCollection = db.collection<PostsType>("posts")

const db = client.db("friendlyWorld")
export const bloggersCollection = db.collection<BloggersType>("bloggers")
export const postsCollection = db.collection<PostsType>("posts")
export const usersCollection = db.collection<UserType>("users")


export async function runDb() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("bloggers").command({ping: 1});
        await client.db("posts").command({ping: 1});
        await client.db("users").command({ping: 1});
        console.log("Connected successfully to mongo server");


    } catch {
        console.log("Can't connect to db");
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
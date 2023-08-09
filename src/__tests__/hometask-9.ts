import request from 'supertest'
import mongoose from 'mongoose'
import { app } from './../app-settings'

describe('Mongoose integration', () => {
    const mongoURI = 'mongodb://0.0.0.0:27017/home_works'

    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })

    describe('GET blogs', () => {
        it('+ GET blogs', async () => {
            const res_ = await request(app)
                .get('/blogs')
                .expect(200)
            expect(res_.body.items.length).toBe(0)
        })
    })
})
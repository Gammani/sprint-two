import request from 'supertest'
import mongoose from 'mongoose'
import {app} from './../app-settings'
import {HTTP_STATUSES} from "../utils/utils";
import {mongoURI} from "../repositories/db";



describe('Mongoose integration', () => {

    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI + "/" + 'friendlyWorldsForTests')
        // await request(app)
        //     .delete('/testing/all-data')
        //     .expect(HTTP_STATUSES.NO_CONTENT_204)
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

    describe('/auth', () => {
        it(`should\'nt create user with incorrect's input data`, async () => {
            await request(app)
                .post('/auth/registration')
                .send({
                    "logi": "leha",
                    "passord": "string",
                    "emal": "shtucer33@gmail.com"
                })
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
                .expect({
                    "errorsMessages": [
                        {
                            "message": "не валидное поле login",
                            "field": "login"
                        },
                        {
                            "message": "не валидное поле password",
                            "field": "password"
                        },
                        {
                            "message": "не валидное поле email",
                            "field": "email"
                        }
                    ]
                })
        })

        it(`should\'nt create user with incorrect input data`, async () => {
            await request(app)
                .post('/auth/registration')
                .send({
                    "login": "leha",
                    "password": "string",
                    "email": "123"
                })
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
                .expect({
                    "errorsMessages": [
                        {
                            "message": "не валидное поле email",
                            "field": "email"
                        }
                    ]
                })
        })

        it('should create new user', async () => {
            await request(app)
                .post('/auth/registration')
                .send({
                    "login": "Leha",
                    "password": "string",
                    "email": "shtucer31@gmail.com"
                })
                .expect(HTTP_STATUSES.NO_CONTENT_204)
        })

        it('should return all users', async () => {
            await request(app)
                .get('/users')
                .auth('admin', 'qwerty')
                .expect(HTTP_STATUSES.OK_200)
                .expect("hello world")
        })
    })
})
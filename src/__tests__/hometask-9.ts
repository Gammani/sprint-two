import request from 'supertest'
import mongoose from 'mongoose'
import {app} from './../app-settings'
import {HTTP_STATUSES} from "../utils/utils";
import {mongoURI} from "../repositories/db";
import {usersRepository} from "../repositories/users-mongoose-repository";
import {jwtServices} from "../application/jwt-service";


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


    describe('CLEAR ALL DATE', () => {
        it('should clear all date', async () => {
            await request(app)
                .delete('/testing/all-data')
                .expect(HTTP_STATUSES.NO_CONTENT_204)
        })
    })

    describe('GET blogs', () => {
        it('+ GET blogs', async () => {
            const res_ = await request(app)
                .get('/blogs')
                .expect(HTTP_STATUSES.OK_200)
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
            // .expect("hello world")
        })


        it('should check code from email and confirm user', async () => {
            const foundUser = await usersRepository.findUserByLogin('Leha')
            console.log(foundUser);
            console.log("found = ", foundUser?.emailConfirmation.confirmationCode)

            await request(app)
                .post('/auth/registration-confirmation')
                .send({
                    "code": foundUser?.emailConfirmation.confirmationCode
                })
                .expect(HTTP_STATUSES.NO_CONTENT_204)
        })

        it('should login and return accessToken from correct input date', async () => {
            const user = await usersRepository.findUserByLoginOrEmail("Leha")
            const accessTokenByUserId = await jwtServices.createAccessJWT(user!._id.toString())

            await request(app)
                .post('/auth/login')
                .send({
                    "loginOrEmail": "Leha",
                    "password": "string"
                })
                .expect(HTTP_STATUSES.OK_200)
                .expect({"accessToken": `${accessTokenByUserId}`})

        })

        it('should return my date from accessToken info', async () => {
            // await setTimeout(async function() {
            //     const user = await usersRepository.findUserByLoginOrEmail("Leha")
            //     const accessTokenByUserId = await jwtServices.createAccessJWT(user!._id.toString())
            //
            //     await request(app)
            //         .get('/auth/me')
            //         .set('Authorization', `Bearer ${accessTokenByUserId}`)
            //
            //         .expect(HTTP_STATUSES.OK_200)
            //         .expect({
            //             "email": "shtucer31@gmail.com",
            //             "login": "Lehaa",
            //             "userId": `${user?._id.toString()}`
            //         })
            // }, 10000);

            const user = await usersRepository.findUserByLoginOrEmail("Leha")
            const accessTokenByUserId = await jwtServices.createAccessJWT(user!._id.toString())

            await request(app)
                .get('/auth/me')
                .set('Authorization', `Bearer ${accessTokenByUserId}`)

                .expect(HTTP_STATUSES.OK_200)
                .expect({
                    "email": "shtucer31@gmail.com",
                    "login": "Leha",
                    "userId": `${user?._id.toString()}`
                })
        })

    })


    describe('/blogs', () => {
        it('should create new blog', async () => {
            await request(app)
                .post('/blogs')
                .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64'))
                .send({
                    "name": "new blog",
                    "description": "description for new blog",
                    "websiteUrl": "https://www.youtube.com/"
                })
                .expect(HTTP_STATUSES.CREATED_201)

        })

        it('should return created blog', async () => {
            const res_ = await request(app)
                .get('/blogs')
                .expect(HTTP_STATUSES.OK_200)
            expect(res_.body.items.length).toBe(1)
        })
    })
})
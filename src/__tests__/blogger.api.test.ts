import request from 'supertest'

import {HTTP_STATUSES} from "../utils/utils";
import {BloggerViewModel} from "../models/BloggerViewModel";
import {client} from "../repositories/db";
import {createApp} from "../app-config";


const app = createApp()
let createdBlogger1: BloggerViewModel | null = null
let createdBlogger2: BloggerViewModel | null = null

describe('jestTests', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
        expect(HTTP_STATUSES.NO_CONTENT_204)
    })
    afterAll(async () => {
        await client.close()
    })

    // describe('clean before testing', () => {
    //     it('should remove all collections and return statusCode: 204', async () => {
    //         await request(app).delete('/testing/all-data')
    //         expect(HTTP_STATUSES.NO_CONTENT_204)
    //     })
    // })

    // describe('blog_02', () => {
    //     it('should return 200 and empty array', async () => {
    //         await request(app)
    //             .get('/blogs')
    //             .expect(HTTP_STATUSES.OK_200, [])
    //     })
    //     it('should return 404 for not existing course', async () => {
    //         await request(app)
    //             .get('/blogs/1')
    //             .expect(HTTP_STATUSES.NOT_FOUND_404)
    //     })
    //     it(`should'nt create blogger with incorrect input data`, async () => {
    //
    //         await request(app)
    //             .post('/blogs')
    //             .send({
    //                 "nam": "string",
    //                 "youtubeUrl": "https://www.youtube.com"
    //             })
    //             .set('Authorization', 'Basic ' + 'YWRtaW46cXdlcnR5')
    //             .expect(HTTP_STATUSES.BAD_REQUEST_400)
    //             .expect({errorsMessages: [{message: 'не валидное поле name', field: 'name'}]})
    //     })
    //     let createdBlogger1: BloggerViewModel | null = null
    //     let createdBlogger2: BloggerViewModel | null = null
    //     it(`create one more blogger`, async () => {
    //         const createdResponse = await request(app)
    //             .post(`/blogs/`)
    //             .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
    //             .send({name: "new Blogger", youtubeUrl: "https://www.youtube.com"})
    //             .expect(HTTP_STATUSES.CREATED_201)
    //
    //         createdBlogger2 = createdResponse.body
    //
    //         expect(createdBlogger2).toEqual({
    //             id: expect.any(String),
    //             name: "new Blogger",
    //             youtubeUrl: "https://www.youtube.com"
    //         })
    //     })
    //     it(`should create blogger with incorrect input data`, async () => {
    //
    //         const createResponse = await request(app)
    //             .post('/blogs')
    //             // .set('Authorization', 'Basic ' + 'YWRtaW46cXdlcnR5')
    //             .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
    //             .send({name: "some name", youtubeUrl: "https://www.youtube.com"})
    //             .expect(HTTP_STATUSES.CREATED_201)
    //
    //         createdBlogger1 = createResponse.body
    //
    //         expect(createdBlogger1).toEqual({
    //             id: expect.any(String),
    //             name: "some name",
    //             youtubeUrl: "https://www.youtube.com"
    //         })
    //
    //         await request(app)
    //             .get('/blogs')
    //             .expect(HTTP_STATUSES.OK_200, [createdBlogger2, createdBlogger1])
    //     })
    //     it(`should'nt update blogger tarn not exist`, async () => {
    //         await request(app)
    //             .put(`/blogs/` + -100)
    //             .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
    //             .send({name: "string", youtubeUrl: "https://www.youtube.com"})
    //             .expect(HTTP_STATUSES.NOT_FOUND_404)
    //
    //
    //         await request(app)
    //             .get(`/blogs/` + createdBlogger1?.id)
    //             .expect(HTTP_STATUSES.OK_200, createdBlogger1)
    //     })
    //     it(`should update blogger with correct input data`, async () => {
    //         await request(app)
    //             .put(`/blogs/${createdBlogger1?.id}`)
    //             .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
    //             .send({name: "string", youtubeUrl: "https://www.youtube.com"})
    //             .expect(HTTP_STATUSES.NO_CONTENT_204)
    //
    //         await request(app)
    //             .get(`/blogs/` + createdBlogger1?.id)
    //             .expect(HTTP_STATUSES.OK_200, {
    //                 ...createdBlogger1,
    //                 name: "string"
    //             })
    //         await request(app)
    //             .get(`/blogs/${createdBlogger2?.id}`)
    //             .expect(HTTP_STATUSES.OK_200, createdBlogger2)
    //     })
    //     it(`should delete both courses`, async () => {
    //         await request(app)
    //             .delete(`/blogs/${createdBlogger1?.id}`)
    //             .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
    //             .expect(HTTP_STATUSES.NO_CONTENT_204)
    //
    //         await request(app)
    //             .get(`/blogs/${createdBlogger1?.id}`)
    //             .expect(HTTP_STATUSES.NOT_FOUND_404)
    //
    //         await request(app)
    //             .delete(`/blogs/${createdBlogger2?.id}`)
    //             .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
    //             .expect(HTTP_STATUSES.NO_CONTENT_204)
    //
    //         await request(app)
    //             .get(`/blogs/`)
    //             .expect(HTTP_STATUSES.OK_200, [])
    //     })
    // })

    describe('blog_03', () => {
        it('should return 200 and empty array', async () => {
            await request(app)
                .get('/blogs')
                .expect(HTTP_STATUSES.OK_200, [])
        })
        it('should return 404 for not existing course', async () => {
            await request(app)
                .get('/blogs/1')
                .expect(HTTP_STATUSES.NOT_FOUND_404)
        })
        it(`should'nt create blogger with incorrect input data`, async () => {

            await request(app)
                .post('/blogs')
                .send({
                    nam: "string",
                    websiteUrl: "https://www.youtube.com"
                })
                .set('Authorization', 'Basic ' + 'YWRtaW46cXdlcnR5')
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
                .expect({errorsMessages: [{message: 'не валидное поле name', field: 'name'}, {message:  'не валидное поле description', field: 'description'}]})
        })

        it(`create one more blogger`, async () => {
            const createdResponse = await request(app)
                .post(`/blogs/`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({name: "new Blogger", description: "string", websiteUrl: "https://www.youtube.com"})
                .expect(HTTP_STATUSES.CREATED_201)
            createdBlogger1 = createdResponse.body
        })
        it(`should return created blogger`, async () => {
            await request(app)
                .get(`/blogs/1668803615929`)
                .expect(HTTP_STATUSES.OK_200, [createdBlogger1])
        })
        it(`should create blogger with correct input data`, async () => {

            const createResponse = await request(app)
                .post('/blogs')
                // .set('Authorization', 'Basic ' + 'YWRtaW46cXdlcnR5')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({name: "some name", description: "string", websiteUrl: "https://www.youtube.com"})
                .expect(HTTP_STATUSES.CREATED_201)

            createdBlogger1 = createResponse.body

            expect(createdBlogger1).toEqual({
                id: expect.any(String),
                name: "some name",
                description: "string",
                websiteUrl: "https://www.youtube.com",
                createdAt: createdBlogger1?.createdAt
            })

            await request(app)
                .get('/blogs')
                .expect(HTTP_STATUSES.OK_200, [createdBlogger2, createdBlogger1])
        })
        it(`should'nt update blogger tarn not exist`, async () => {
            await request(app)
                .put(`/blogs/` + -100)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({name: "string", description: "hey hey", websiteUrl: "https://www.youtube.com"})
                .expect(HTTP_STATUSES.NOT_FOUND_404)


            await request(app)
                .get(`/blogs/` + createdBlogger1?.id)
                .expect(HTTP_STATUSES.OK_200, createdBlogger1)
        })
        it(`should update blogger with correct input data`, async () => {
            await request(app)
                .put(`/blogs/${createdBlogger1?.id}`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({name: "string", description: "yo yo", websiteUrl: "https://www.youtube.com"})
                .expect(HTTP_STATUSES.NO_CONTENT_204)

            await request(app)
                .get(`/blogs/` + createdBlogger1?.id)
                .expect(HTTP_STATUSES.OK_200, {
                    ...createdBlogger1,
                    name: "string"
                })
            await request(app)
                .get(`/blogs/${createdBlogger2?.id}`)
                .expect(HTTP_STATUSES.OK_200, createdBlogger2)
        })
        it(`should delete both courses`, async () => {
            await request(app)
                .delete(`/blogs/${createdBlogger1?.id}`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .expect(HTTP_STATUSES.NO_CONTENT_204)

            await request(app)
                .get(`/blogs/${createdBlogger1?.id}`)
                .expect(HTTP_STATUSES.NOT_FOUND_404)

            await request(app)
                .delete(`/blogs/${createdBlogger2?.id}`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .expect(HTTP_STATUSES.NO_CONTENT_204)

            await request(app)
                .get(`/blogs/`)
                .expect(HTTP_STATUSES.OK_200, [])
        })
    })


})


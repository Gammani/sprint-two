import request from 'supertest'

import {HTTP_STATUSES} from "../utils/utils";
import {BloggerViewModel} from "../models/BloggerViewModel";
import {client} from "../repositories/db";
import {createApp} from "../app-config";
import {PostViewModel} from "../models/PostViewModel";


const app = createApp()

describe('jestTests', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
        expect(HTTP_STATUSES.NO_CONTENT_204)
    })
    afterAll(async () => {
        await client.close()
    })

    let createdBlogger1: BloggerViewModel | null = null
    let createdBlogger2: BloggerViewModel | null = null
    let post1: PostViewModel | null = null
    let post2: PostViewModel | null = null
    let post3: PostViewModel | null = null

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
        it('should return 404 for not existing blogger', async () => {
            await request(app)
                .get('/blogs/1')
                .expect(HTTP_STATUSES.NOT_FOUND_404)
        })
        it('should return no unauthorized and 401', async () => {
            await request(app)
                .post('/blogs')
                .send({
                    name: "string",
                    websiteUrl: "https://www.youtube.com"
                })
                // .set('Authorization', 'Basic ' + 'YWRtaW46cXdlcnR5')
                .expect(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        })
        it(`shouldn't create blogger with incorrect input data and return 400`, async () => {

            await request(app)
                .post('/blogs')
                .send({
                    nam: "string",
                    websiteUrl: "https://www.youtube.com"
                })
                // .set('Authorization', 'Basic ' + 'YWRtaW46cXdlcnR5')
                .auth('admin', 'qwerty')
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
                .expect({errorsMessages: [{message: 'не валидное поле name', field: 'name'}, {message:  'не валидное поле description', field: 'description'}]})
        })
        it(`should create blogger and 201`, async () => {
            const createdResponse = await request(app)
                .post(`/blogs/`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({name: "new Blogger", description: "string", websiteUrl: "https://www.youtube.com"})
                .expect(HTTP_STATUSES.CREATED_201)
            createdBlogger1 = createdResponse.body
            expect(createdBlogger1).toEqual({
                id: createdBlogger1?.id,
                name: "new Blogger",
                description: "string",
                websiteUrl: "https://www.youtube.com",
                createdAt: expect.any(String)
            })
        })
        it(`should return created blogger and 200`, async () => {
            await request(app)
                .get(`/blogs/${createdBlogger1?.id}`)
                .expect(HTTP_STATUSES.OK_200, createdBlogger1)
        })
        it(`should create more one blogger and 201`, async () => {

            const createResponse = await request(app)
                .post('/blogs')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({name: "some name", description: "string", websiteUrl: "https://www.youtube.com"})
                .expect(HTTP_STATUSES.CREATED_201)

            createdBlogger2 = createResponse.body

            expect(createdBlogger2).toEqual({
                id: createdBlogger2?.id,
                name: "some name",
                description: "string",
                websiteUrl: "https://www.youtube.com",
                createdAt: expect.any(String)
            })

            await request(app)
                .get('/blogs')
                .expect(HTTP_STATUSES.OK_200, [createdBlogger1, createdBlogger2])
        })
        it(`shouldn't update blogger and return 404, bloggerId not exist`, async () => {
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
                    name: "string",
                    description: "yo yo"
                })
            await request(app)
                .get(`/blogs/${createdBlogger2?.id}`)
                .expect(HTTP_STATUSES.OK_200, createdBlogger2)
        })
        it(`should delete first blogger`, async () => {
            await request(app)
                .delete(`/blogs/${createdBlogger1?.id}`)
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .expect(HTTP_STATUSES.NO_CONTENT_204)

            await request(app)
                .get(`/blogs/`)
                .expect(HTTP_STATUSES.OK_200, [createdBlogger2])
        })
    })
    describe('post_03', () => {
        it('should return empty array of posts and 200', async () => {
            await request(app)
                .get('/posts')
                .expect(HTTP_STATUSES.OK_200, [])
        })
        it('should return 404', async () => {
            await request(app)
                .get('/posts/1')
                .expect(HTTP_STATUSES.NOT_FOUND_404)
        })
        it('should return 401 no unauthorized', async () => {
            await request(app)
                .post('/blogs')
                .send({
                    title: "Hello World",
                    shortDescription: "string",
                    content: "true",
                    blogId: createdBlogger2?.id
                })
                .expect(HTTP_STATUSES.NO_UNAUTHORIZED_401)
        })
        it(`shouldn't create post with incorrect input data and return 400`, async () => {
            await request(app)
                .post('/posts')
                .auth('admin', 'qwerty')
                .send({
                    title: 12,
                    shortDescription: "string",
                    content: true,
                    blogId: createdBlogger2?.id
                })
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
                .expect({errorsMessages: [{message: 'не валидное поле title', field: 'title'}, {message:  'не валидное поле content', field: 'content'}]})
        })
        it(`shouldn't creat post and return 400 with incorrect bloggerId`, async () => {
            await request(app)
                .post('/posts')
                .auth('admin', 'qwerty')
                .send({
                    title: "Hello World",
                    shortDescription: "string",
                    content: true,
                    blogId: 12
                })
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
                .expect({errorsMessages: [{message: 'не валидное поле content', field: 'content'}, {message:  'не валидное поле blogId', field: 'blogId'}]})
        })
        it(`should creat three posts and return 200`, async () => {
            const createResponse1 = await request(app)
                .post('/posts')
                .auth('admin', 'qwerty')
                .send({
                    title: "Hello World",
                    shortDescription: "string",
                    content: "hey",
                    blogId: createdBlogger2?.id
                })
                .expect(HTTP_STATUSES.CREATED_201)
            post1 = createResponse1.body
            const createResponse2 = await request(app)
                .post('/posts')
                .auth('admin', 'qwerty')
                .send({
                    title: "Hello World",
                    shortDescription: "string",
                    content: "hey",
                    blogId: createdBlogger2?.id
                })
                .expect(HTTP_STATUSES.CREATED_201)
            post2 = createResponse2.body
            const createResponse3 = await request(app)
                .post('/posts')
                .auth('admin', 'qwerty')
                .send({
                    title: "Hello World",
                    shortDescription: "string",
                    content: "hey",
                    blogId: createdBlogger2?.id
                })
                .expect(HTTP_STATUSES.CREATED_201)
            post3 = createResponse3.body

            await request(app)
                .get('/posts')
                .expect(HTTP_STATUSES.OK_200, [post1, post2, post3])
        })
        it(`shouldn't update post and return 404, post not exist`, async () => {
            await request(app)
                .put(`/posts/post2`)
                .auth('admin', 'qwerty')
                .send({
                    title: "string",
                    shortDescription: "string",
                    content: "string",
                    blogId: createdBlogger2?.id
                })
                .expect(HTTP_STATUSES.NOT_FOUND_404)
        })
        it(`should update post and return 204 status and equal updated post`, async () => {
            await request(app)
                .put(`/posts/${post2?.id}`)
                .auth('admin', 'qwerty')
                .send({
                    title: "update title",
                    shortDescription: "update shortDescription",
                    content: "update content",
                    blogId: createdBlogger2?.id
                })
                .expect(HTTP_STATUSES.NO_CONTENT_204)
            await request(app)
                .get(`/posts/${post2?.id}`)
                .expect(HTTP_STATUSES.OK_200, {
                    ...post2,
                    title: "update title",
                    shortDescription: "update shortDescription",
                    content: "update content",
                    blogId: createdBlogger2?.id
                })
        })
        it(`should delete first and third post and return 204 status and check second post`, async () => {
            await request(app)
                .delete(`/posts/${post1?.id}`)
                .auth(`admin`, `qwerty`)
                .expect(HTTP_STATUSES.NO_CONTENT_204)
            await request(app)
                .delete(`/posts/${post3?.id}`)
                .auth(`admin`, `qwerty`)
                .expect(HTTP_STATUSES.NO_CONTENT_204)

            await request(app)
                .get(`/posts`)
                .expect(HTTP_STATUSES.OK_200, [{
                    ...post2,
                    title: "update title",
                    shortDescription: "update shortDescription",
                    content: "update content",
                    blogId: createdBlogger2?.id
                }])
        })
        it(`should remove all data and return empty array`, async () => {
            await request(app).delete('/testing/all-data')
            expect(HTTP_STATUSES.NO_CONTENT_204)

            await request(app)
                .get('/blogs')
                .expect(HTTP_STATUSES.OK_200, [])
            await request(app)
                .get('/posts')
                .expect(HTTP_STATUSES.OK_200, [])
        })
    })
})


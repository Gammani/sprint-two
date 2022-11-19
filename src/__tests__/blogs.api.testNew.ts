import request from "supertest";
import {createApp} from "../app-config";

const app = createApp()

describe('blogs', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })
    let createdBlog1: any = null
    let createdBlog2: any = null
    let createdPost1: any = null

    it('should return 200 and empty array GET', async () => {
        await request(app).get('/blogs').expect(200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })

    it('should`t return 404 for not existing blogs GET', async () => {
        await request(app).get('/blogs/1111').expect(404)
    })

    it('should`t blogs POST', async () => {
        await request(app).post('/blogs').auth('admin', 'qwerty').send({name: ''}).expect(400)
        await request(app).get('/blogs').expect(200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })

    it('should create blogs POST', async () => {
        const createResponse = await request(app).post('/blogs').auth('admin', 'qwerty').send({
            name: "blog1",
            youtubeUrl: 'https://vk.com/im?peers=609503101_c18'
        }).expect(201)

        createdBlog1 = createResponse.body

        expect(createdBlog1).toEqual({
            id: expect.any(String),
            name: "blog1",
            youtubeUrl: 'https://vk.com/im?peers=609503101_c18',
            createdAt: expect.any(String)
        })
        await request(app).get('/blogs').expect(200, {
            pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [{
                id: createdBlog1.id,
                name: "blog1",
                youtubeUrl: 'https://vk.com/im?peers=609503101_c18',
                createdAt: createdBlog1.createdAt
            }]
        })
    })

    it('should`t update correct model PUT', async () => {
        await request(app).put('/blogs/' + 2).auth('admin', 'qwerty').send({
            name: "good-blog1",
            youtubeUrl: 'https://vk.com/im?peers=609503101_c18'
        }).expect(404)
    })

    it('should update correct model PUT', async () => {
        const createResponse = await request(app).post('/blogs').auth('admin', 'qwerty').send({
            name: "blog2",
            youtubeUrl: 'https://vk.com/im?peers=609503101_c18'
        }).expect(201)

        createdBlog2 = createResponse.body

        await request(app).put('/blogs/' + createdBlog2.id).auth('admin', 'qwerty').send({
            name: "blog2-put",
            youtubeUrl: 'https://vk.com/im?peers=609503101_c18-put',
        }).expect(204)


        await request(app).get('/blogs').expect(200, {
            pagesCount: 1, page: 1, pageSize: 10, totalCount: 2, items: [{
                id: createdBlog2.id,
                name: "blog2-put",
                youtubeUrl: 'https://vk.com/im?peers=609503101_c18-put',
                createdAt: createdBlog2.createdAt
            }, {
                id: createdBlog1.id,
                name: "blog1",
                youtubeUrl: 'https://vk.com/im?peers=609503101_c18',
                createdAt: createdBlog1.createdAt
            }]
        })
    })

    it('should delete correct model DELETE', async () => {
        await request(app).delete("/blogs/" + createdBlog2.id).auth('admin', 'qwerty').expect(204)
    })

    it('should`t delete correct model DELETE', async () => {
        await request(app).delete('/blogs' + 2).auth('admin', 'qwerty').send({}).expect(404)
    })




})





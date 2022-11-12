import request from 'supertest'
import {app} from "../index";


describe('/blogs', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })


    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/blogs')
            .expect(200, [])
    })

    it('should return 404 for not existing course', async () => {
        await request(app)
            .get('/blogs/1')
            .expect(404)
    })

})


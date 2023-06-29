import request from 'supertest'

import {createApp} from "../app-config";
import {HTTP_STATUSES} from "../utils/utils";
import {client} from "../repositories/db";

const app = createApp()

describe('jestTests', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
        expect(HTTP_STATUSES.NO_CONTENT_204)
    })
    afterAll(async () => {
        await client.close()
    })
})

let createdDevice = null

describe('device', () => {
    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/security/devices')
            .expect(HTTP_STATUSES.OK_200, [])
    })
})
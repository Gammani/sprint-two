import request from 'supertest'
import mongoose from 'mongoose'
import {app} from './../app-settings'
import {HTTP_STATUSES} from "../utils/utils";
import {mongoURI} from "../repositories/db";
import {UsersRepository} from "../repositories/users-mongoose-repository";
import {BlogsRepository} from "../repositories/blogs-mongoose-repository";
import {PostsQueryRepository} from "../repositories/posts-query-mongoose-repository";
import {CommentsRepository} from "../repositories/comments-mongoose-repository";
import {DevicesRepository} from "../repositories/devices-mongoose-repository";
import {JwtService} from "../application/jwt-service";
import {ExpiredTokenRepository} from "../repositories/expiredToken-mongoose-repository";
// import {jwtService} from "../composition-root";

const usersRepository = new UsersRepository()
const blogsRepository = new BlogsRepository()
const postsQueryMongooseRepository = new PostsQueryRepository()
const commentsRepository = new CommentsRepository()
const devicesRepository = new DevicesRepository()
const expiredTokenRepository = new ExpiredTokenRepository()
const jwtService = new JwtService(expiredTokenRepository, devicesRepository)


const loginUser = async (): Promise<{ accessToken: string }> => {
    const response = await request(app)
        .post('/auth/login')
        .send({
            "loginOrEmail": "Leha",
            "password": "string"
        })

    return response.body
}

describe('Mongoose integration', () => {

    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI + "/" + 'friendlyWorldsForTests')
        // await request(app)
        //     .delete('/testing/all-data')
        //     .expect(HTTP_STATUSES.NO_CONTENT_204)
        //const tokens = createSeverUsers()

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
        let token
        beforeAll(async () => {
            token = await loginUser()
            //clear All data
        })
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

        it('should create new user by admin', async () => {
            await request(app)
                .post('/users')
                .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64'))
                .send({
                    "login": "admin",
                    "password": "qwerty",
                    "email": "shtucer34@gmail.com"
                })
            expect(HTTP_STATUSES.CREATED_201)
        })

        it('should return all users', async () => {
            const _res = await request(app)
                .get('/users')
                .auth('admin', 'qwerty')
                .expect(HTTP_STATUSES.OK_200)
            expect(_res.body.items.length).toBe(2)
            // .expect("hello world")
        })


        it('should check code from email and confirm user', async () => {
            const foundUser = await usersRepository.findUserByLogin('Leha')

            await request(app)
                .post('/auth/registration-confirmation')
                .send({
                    "code": foundUser!.emailConfirmation.confirmationCode
                })
                .expect(HTTP_STATUSES.NO_CONTENT_204)
        })

        it('should login and return accessToken from correct input date', async () => {
            const user = await usersRepository.findUserByLoginOrEmail("Leha")
            const accessTokenByUserId = await jwtService.createAccessJWT(user!._id.toString())
            // const userId = user!._id.toString()
            // const accessTokenByUserId = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '600000'})

            const response = await request(app)
                .post('/auth/login')
                .send({
                    "loginOrEmail": "Leha",
                    "password": "string"
                })
                .expect(HTTP_STATUSES.OK_200)
                .expect({"accessToken": `${accessTokenByUserId}`})

        })

        it('should generate new pair of access and refresh tokens, and return new access token', async () => {
            const foundUser = await usersRepository.findUserByLoginOrEmail("Leha")
            const device = await devicesRepository.findDeviceTestByUserId(foundUser!._id.toString())

            const refreshTokenByDeviceId = await jwtService.createRefreshJWT(device!._id.toString())
            // const deviceId = device!._id.toString()
            // const refreshTokenByDeviceId = await jwt.sign({deviceId}, settings.JWT_SECRET, {expiresIn: '1200000'})


            const accessTokenByUserId = await jwtService.createAccessJWT(foundUser!._id.toString())
            // const userId = foundUser!._id.toString()
            // const accessTokenByUserId = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '600000'})

            await request(app)
                .post('/auth/refresh-token')
                .set('Authorization', `Bearer ${accessTokenByUserId}`)
                .set('Cookie', `refreshToken=${refreshTokenByDeviceId}`)

                .expect(HTTP_STATUSES.OK_200)
        })

        it('should return my date from new accessToken info', async () => {
            const foundUser = await usersRepository.findUserByLoginOrEmail("Leha")
            const accessTokenByUserId = await jwtService.createAccessJWT(foundUser!._id.toString())
            // const userId = foundUser!._id.toString()
            // const accessTokenByUserId = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '600000'})

            await request(app)
                .get('/auth/me')
                .set('Authorization', `Bearer ${accessTokenByUserId}`)

                .expect(HTTP_STATUSES.OK_200)
                .expect({
                    "email": "shtucer31@gmail.com",
                    "login": "Leha",
                    "userId": `${foundUser?._id.toString()}`
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

        it('should update blog with input data', async () => {
            const foundBlog = await blogsRepository.findBlogByName("new blog")
            await request(app)
                .put(`/blogs/${foundBlog!._id}`)
                .auth('admin', 'qwerty')
                .send({
                    "name": "new blog",
                    "description": "description for new blog!",
                    "websiteUrl": "https://www.youtube.com/"
                })
                .expect(HTTP_STATUSES.NO_CONTENT_204)
        })

        it('should return updated blog', async () => {
            const foundBlog = await blogsRepository.findBlogByName("new blog")
            const _res = await request(app)
                .get(`/blogs/${foundBlog!._id}`)
                .expect(HTTP_STATUSES.OK_200)
            expect(_res.body.description).toBe("description for new blog!")

        })

        it('should delete test blog', async () => {
            await request(app)
                .post('/blogs')
                .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64'))
                .send({
                    "name": "test blog",
                    "description": "description for new blog",
                    "websiteUrl": "https://www.youtube.com/"
                })
                .expect(HTTP_STATUSES.CREATED_201)
            const foundBlog = await blogsRepository.findBlogByName("test blog")
            await request(app)
                .delete(`/blogs/${foundBlog!._id}`)
                .auth('admin', 'qwerty')
                .expect(HTTP_STATUSES.NO_CONTENT_204)
            const res_ = await request(app)
                .get('/blogs')
            expect(res_.body.items.length).toBe(1)
        })
    })


    describe('/posts', () => {
        it('should create new post', async () => {
            const foundBlog = await blogsRepository.findBlogByName("new blog")

            await request(app)
                .post('/posts')
                .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64'))
                .send({
                    "title": "new title post",
                    "shortDescription": "new description for post",
                    "content": "content for post",
                    "blogId": foundBlog!._id.toString()
                    // "blogId": "123"
                })
                .expect(HTTP_STATUSES.CREATED_201)
        })

        it('should return created post', async () => {
            const res_ = await request(app)
                .get('/posts')
                .expect(HTTP_STATUSES.OK_200)
            expect(res_.body.items.length).toBe(1)
        })

        it('should update post with input data', async () => {
            const foundPost = await postsQueryMongooseRepository.findPostByTitle("new title post")
            const foundBlog = await blogsRepository.findBlogByName("new blog")
            await request(app)
                .put(`/posts/${foundPost!._id}`)
                .auth('admin', 'qwerty')
                .send({
                    "title": "new title post",
                    "shortDescription": "this post was change!",
                    "content": "content for post",
                    "blogId": foundBlog!._id.toString()
                })
                .expect(HTTP_STATUSES.NO_CONTENT_204)
        })

        it('should return updated post', async () => {
            const foundPost = await postsQueryMongooseRepository.findPostByTitle("new title post")
            const _res = await request(app)
                .get(`/posts/${foundPost!._id}`)
                .expect(HTTP_STATUSES.OK_200)
            expect(_res.body.shortDescription).toBe("this post was change!")

        })

        it('should delete test post', async () => {
            const foundBlog = await blogsRepository.findBlogByName("new blog")
            await request(app)
                .post('/posts')
                .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64'))
                .send({
                    "title": "test post",
                    "shortDescription": "asd asd asd asd asd asd asd asd",
                    "content": "content for test post",
                    "blogId": foundBlog!._id.toString()
                })
                .expect(HTTP_STATUSES.CREATED_201)
            const foundPost = await postsQueryMongooseRepository.findPostByTitle("test post")
            await request(app)
                .delete(`/posts/${foundPost!._id}`)
                .auth('admin', 'qwerty')
                .expect(HTTP_STATUSES.NO_CONTENT_204)
            const res_ = await request(app)
                .get('/posts')
            expect(res_.body.items.length).toBe(1)
        })
    })


    describe('/comments', () => {
        it('should create new comment from correct input data', async () => {
            const foundUser = await usersRepository.findUserByLogin("Leha")
            const accessTokenByUserId = await jwtService.createAccessJWT(foundUser!._id.toString())
            // const userId = foundUser!._id.toString()
            // const accessTokenByUserId = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '600000'})
            const foundPost = await postsQueryMongooseRepository.findPostByTitle("new title post")
            const res_ = await request(app)
                .post(`/posts/${foundPost!._id}/comments`)
                .set('Authorization', `Bearer ${accessTokenByUserId}`)
                .send({
                    "content": "content for new comment"
                })
                .expect(HTTP_STATUSES.CREATED_201)
            expect({
                id: expect(res_.body.id).toEqual(expect.any(String)),
                content: expect(res_.body.content).toEqual("content for new comment"),
                commentatorInfo: {
                    userId: expect(res_.body.commentatorInfo.userId).toEqual(foundUser!._id.toString()),
                    userLogin: expect(res_.body.commentatorInfo.userLogin).toEqual("Leha")
                },
                createdAt: expect(res_.body.createdAt).toEqual(expect.any(String)),
                likesInfo: {
                    likesCount: expect(res_.body.likesInfo.likesCount).toEqual(0),
                    dislikesCount: expect(res_.body.likesInfo.dislikesCount).toEqual(0),
                    myStatus: expect(res_.body.likesInfo.myStatus).toEqual("None")
                }
            })
        })

        it('should update and check created comment', async () => {
            const foundUser = await usersRepository.findUserByLogin("Leha")
            const accessTokenByUserId = await jwtService.createAccessJWT(foundUser!._id.toString())
            // const userId = foundUser!._id.toString()
            // const accessTokenByUserId = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '600000'})
            const foundPost = await postsQueryMongooseRepository.findPostByTitle("new title post")
            const foundComment = await commentsRepository.findCommentByPostId(foundPost!._id.toString())

            await request(app)
                .put(`/comments/${foundComment!._id}`)
                .set('Authorization', `Bearer ${accessTokenByUserId}`)
                .send({"content": "this content was changed!"})
                .expect(HTTP_STATUSES.NO_CONTENT_204)
        })

        it('should delete test comment', async () => {
            const foundUser = await usersRepository.findUserByLogin("Leha")
            const accessTokenByUserId = await jwtService.createAccessJWT(foundUser!._id.toString())
            // const userId = foundUser!._id.toString()
            // const accessTokenByUserId = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '600000'})
            const foundPost = await postsQueryMongooseRepository.findPostByTitle("new title post")

            await request(app)
                .post(`/posts/${foundPost!._id}/comments`)
                .set('Authorization', `Bearer ${accessTokenByUserId}`)
                .send({
                    "content": "created comment for test"
                })
                .expect(HTTP_STATUSES.CREATED_201)

            const foundComment = await commentsRepository.findCommentByContent("created comment for test")
            await request(app)
                .delete(`/comments/${foundComment!._id}`)
                .set('Authorization', `Bearer ${accessTokenByUserId}`)
                .expect(HTTP_STATUSES.NO_CONTENT_204)

            const res_ = await request(app)
                .get(`/posts/${foundPost!._id}/comments`)
                .expect(HTTP_STATUSES.OK_200)
            expect(res_.body.items.length).toBe(1)
        })
    })


    it('should update like-status', async () => {
        const foundUser = await usersRepository.findUserByLogin("Leha")
        const accessTokenByUserId = await jwtService.createAccessJWT(foundUser!._id.toString())

        const foundPost = await postsQueryMongooseRepository.findPostByTitle("new title post")
        const foundComment = await commentsRepository.findCommentByPostId(foundPost!._id.toString())

        await request(app)
            .put(`/comments/${foundComment!._id}/like-status`)
            .set('Authorization', `Bearer ${accessTokenByUserId}`)
            .send({"likeStatus": "None"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

    it("should like to be 2", async () => {
        const Leha = await usersRepository.findUserByLogin("Leha")
        const accessTokenByLeha = await jwtService.createAccessJWT(Leha!._id.toString())
        const admin = await usersRepository.findUserByLogin("Leha")
        const accessTokenByAdmin = await jwtService.createAccessJWT(admin!._id.toString())

        const foundPost = await postsQueryMongooseRepository.findPostByTitle("new title post")
        const foundComment = await commentsRepository.findCommentByPostId(foundPost!._id.toString())

        await request(app)
            .put(`/comments/${foundComment!._id}/like-status`)
            .set('Authorization', `Bearer ${accessTokenByLeha}`)
            .send({"likeStatus": "Like"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        await request(app)
            .put(`/comments/${foundComment!._id}/like-status`)
            .set('Authorization', `Bearer ${accessTokenByAdmin}`)
            .send({"likeStatus": "Like"})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        const res_ = await request(app)
            .get(`/comments/${foundComment!._id}`)
            .expect(HTTP_STATUSES.OK_200)
        expect({
            id: expect(res_.body.id).toEqual(expect.any(String)),
            content: expect(res_.body.content).toEqual(expect.any(String)),
            commentatorInfo: {
                userId: expect(res_.body.commentatorInfo.userId).toEqual(Leha!._id.toString()),
                userLogin: expect(res_.body.commentatorInfo.userLogin).toEqual("Leha")
            },
            createdAt: expect(res_.body.createdAt).toEqual(expect.any(String)),
            likesInfo: {
                likesCount: expect(res_.body.likesInfo.likesCount).toEqual(1),
                dislikesCount: expect(res_.body.likesInfo.dislikesCount).toEqual(0),
                myStatus: expect(res_.body.likesInfo.myStatus).toEqual("None")
            }
        })
    })
})


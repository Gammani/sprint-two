import {PostModel} from "../mongo/post/post.model";
import {PostDbType} from "../utils/types";

class PostsQueryRepository {
    async findPostByTitle(title: string): Promise<PostDbType | null> {
        const post: PostDbType | null = await PostModel.findOne({title: title})
        if (post) {
            return post;
        } else {
            return null;
        }
    }
}

export const postsQueryMongooseRepository = new PostsQueryRepository()



// export const postsQueryMongooseRepository = {
//     async findPostByTitle(title: string): Promise<PostDbType | null> {
//         const post: PostDbType | null = await PostModel.findOne({title: title})
//         if (post) {
//             return post;
//         } else {
//             return null;
//         }
//     },
// }
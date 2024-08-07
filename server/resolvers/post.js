const { ObjectId } = require("mongodb")
const Post = require("../models/Post")
const { GraphQLError } = require('graphql')
const redis = require("../config/redis")
const resolvers = {
    Query: {
        findPosts: async (_, __,) => {

            // const user = contextValue.authentication()
            // const data = await Post.findAll()
            // return data
            //Redis cache
            try {
                const postCache = await redis.get("posts:all");
                if (postCache) {
                    const cachedPosts = JSON.parse(postCache);
                    console.log(cachedPosts)
                    return cachedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                } else {
                    const result = await Post.findAll();
                    const sortedResult = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    await redis.set('posts:all', JSON.stringify(sortedResult));
                    // console.log(sortedResult, "<<<<<<<<<<<")
                    return sortedResult;
                }


            } catch (error) {
                console.error("Error fetching data from database or saving to Redis:", error);
                throw new GraphQLError("Internal Server Error");

            }




        },
        findPostById: async (_, { postId }) => {
            const data = await Post.findById(postId)
            return data
        }
    },
    Mutation: {
        createPost: async (_, { inputPost }, contextValue) => {
            const user = contextValue.authentication()
            const post = {
                ...inputPost,
                authorId: new ObjectId(user._id),
            }
            const result = await Post.create(post)

            await redis.del("posts:all")
            // console.log(result)

            const newPost = await Post.findById(result.insertedId)
            return newPost
        },
        deletePost: async (_, { postId }, contextValue) => {
            try {
                const user = contextValue.authentication()
                const post = await Post.findById(postId);

                if (!post) {
                    throw new GraphQLError(`Post with ID ${postId} not found`, {
                        extensions: {
                            code: 'NOT_FOUND',
                        },
                    });
                }


                if (post.authorId.toString() !== user._id.toString()) {
                    throw new GraphQLError("Unauthorized user", {
                        extensions: {
                            code: 'UNAUTHORIZED',
                        },
                    });
                }

                await Post.delete(postId)
                await redis.del("posts:all")

                return `Post with ID ${postId} deleted`

            } catch (error) {
                console.log(error)
                if (error.extensions && error.extensions.code === 'NOT_FOUND') {
                    throw error;
                }
                if (error.extensions && error.extensions.code === 'UNAUTHORIZED') {
                    throw error;
                }
                throw new GraphQLError(`Error deleting post: ${error.message}`, {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                    },
                });
            }
        },

        updatePost: async (_, { postId, updateFields }, contextValue) => {
            const user = contextValue.authentication();

            const post = await Post.findById(postId);
            if (!post) {
                throw new GraphQLError(`Post with ID ${postId} not found`, {
                    extensions: {
                        code: 'NOT_FOUND',
                    },
                });
            }

            if (post.authorId.toString() !== user._id.toString()) {
                throw new GraphQLError("Unauthorized user", {
                    extensions: {
                        code: 'UNAUTHORIZED',
                    },
                });
            }

            await Post.update(postId, updateFields);
            await redis.del("posts:all")

            const updatedPost = await Post.findById(postId);
            return updatedPost;
        },
        addComment: async (_, { postId, content }, contextValue) => {
            const user = contextValue.authentication()

            const post = await Post.findById(postId)
            if (!post) {
                throw new GraphQLError("Post not found", {
                    extensions: {
                        code: "NOT_FOUND"
                    }
                });
            }

            const newComment = {
                content,
                username: user.username,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const updateResult = await Post.update(postId, {
                comments: [...post.comments, newComment]
            })
            await redis.del("posts:all")
            return await Post.findById(postId)
        },
        addLike: async (_, { postId }, contextValue) => {
            const user = contextValue.authentication()
            const post = await Post.findById(postId)

            if (post.likes.username === user.username) {
                throw new GraphQLError("User has already liked this post", {
                    extensions: {
                        code: "FORBIDDEN"
                    }
                })
            } // Belum jalan yang ini entah kenapa

            const newLike = {
                username: user.username,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const updateResult = await Post.update(postId, {
                likes: [...post.likes, newLike]
            })

            await redis.del("posts:all")

            return await Post.findById(postId)
        }
    }
}

module.exports = resolvers
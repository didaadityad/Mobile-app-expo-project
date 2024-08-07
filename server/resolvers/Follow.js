
const { ObjectId } = require("mongodb")
const Follow = require("../models/Follow")
const { GraphQLError } = require('graphql')

const resolvers = {
    Query: {
        findFollows: async () => {
            const data = await Follow.findAll()
            return data
        }
    },

    Mutation: {
        createFollow: async (_, { userId }, contextValue) => {
            const user = contextValue.authentication()

            if (userId === user._id) {
                throw new GraphQLError("Can't follow yourself")
            }

                const followerId = new ObjectId(user._id)
                const followingId = new ObjectId(userId)

                const existingFollow = await Follow.findAll({
                        followerId: followerId,
                        followingId: followingId
                })

                if (existingFollow.userId > 0) {
                    throw new GraphQLError("You are already following this user");
                }

                const inputFollow = {
                    followerId,
                    followingId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }

            

            if(inputFollow.followingId === userId){
                throw new GraphQLError("Can't follow yourself")
            }

            const result = await Follow.create(inputFollow)
            console.log(result)
            const newFollow = await Follow.findById(result.insertedId)
            return newFollow
        },
        deleteFollow: async (_, { followId }, contextValue) => {
            const user = contextValue.authentication()
            const follow = await Follow.findById(followId)
            if (!follow) {
                throw new GraphQLError("Follow not found", {
                    extensions: {
                        code: "NOT_FOUND"
                    }
                });
            }

            if (follow.followerId.toString() !== user._id) {
                throw new GraphQLError("Unauthorized", {
                    extensions: {
                        code: "UNAUTHORIZED"
                    }
                });
            }


            await Follow.delete(followId)
            return `follow with ID ${followId} deleted`

        }
    }
}

module.exports = resolvers
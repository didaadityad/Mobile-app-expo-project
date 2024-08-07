
const {GraphQLError} = require('graphql')
const User = require("../models/User")



const resolvers = {
    Query: {
        findUsers: async () => {
            const data = await User.findAll()
            return data
        },
        findUserById: async (_, {userId}) => {
            const data =  await User.findById(userId)
            return data
        },
        searchByUsername: async (_, { query }) => {
            const data = await User.findByUsername(query);
            return data
        },
        getUserLoggedIn: async (_, __, contextValue) => {
            const { _id } = contextValue.authentication();
            const result = await User.findById(_id);
            return {
                _id: result._id,
              name: result.name,
              username: result.username,
              followers: result.followers.map(f => ({
                name: f.name,
                username: f.username
              })),
              followings: result.followings.map(f => ({
                name: f.name,
                username: f.username
              }))
            };
          }
    },

    Mutation: {
        register: async (_, {inputUser}) => {
            const result = await User.create(inputUser)
            
            console.log(result)
            
            if(result.acknowledged){
                return {
                    message: "Success adding user"
                }
            } else {
                throw new GraphQLError ("Cannot add User" , {
                    extensions : {
                        code: "INTERNAL_SERVER_ERROR"
                    }
                })
            }
            // const newUser = await User.findById(result.insertedId)
            // return newUser
        },

        login: async (_, {inputLogin}) => {
            const result = await User.login(inputLogin)
            return result
        },

        deleteUser: async (_,{userId}) => {
            try {
                await User.delete(userId)
                return `User with ID ${userId} deleted`
            } catch (error) {
                return `User with ID ${userId} not found`
            }
        },
        updateUser: async (_, { userId, updateFields}) => {
            const updateResult = await User.update(userId, updateFields)
            // console.log(updateResult)

            const updatedUser = await User.findById(userId)
            return updatedUser
        }
    }
}


module.exports = resolvers
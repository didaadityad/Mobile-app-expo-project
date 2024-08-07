const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone")
const userTypeDefs = require(`./schema/user`)
const followTypeDefs = require(`./schema/follow`)
const userResolvers = require(`./resolvers/User`)
const followResolvers = require(`./resolvers/Follow`)
const postResolvers = require(`./resolvers/post`)
const postTypeDefs = require(`./schema/post`)
const {GraphQLError} = require('graphql')
const jwt = require(`jsonwebtoken`)


const server = new ApolloServer({
    typeDefs: [userTypeDefs, followTypeDefs, postTypeDefs],
    resolvers: [userResolvers, followResolvers, postResolvers],
    introspection: true //untuk deployment
})

startStandaloneServer(server, {
    listen: { port: process.env.PORT || 4000 },
    context: async ({req, res}) => {
        return {
            authentication: () => {
                // console.log(req.headers.authorization)
                const authorization = req.headers.authorization
                if(!authorization){
                    throw new GraphQLError ("Unauthenticated User")
                }
    
                const token = authorization.split(" ")[1]
                const user = jwt.verify(token, "rahasia")

                return user
            }
        }
    }

})
    .then(({url}) => {
        console.log(`running disini ${url}`)
    })
    .catch(err => console.log(err));
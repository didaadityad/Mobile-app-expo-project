const typeDefs = `#graphql
scalar Date

type Follow {
_id: String
followingId: String
followerId: String
createdAt: Date
updatedAt: Date
}


type Query {
findFollows: [Follow]
findFollowById(followId: String!): Follow
}


input NewFollow {
    followingId: String,
}

type Mutation {
createFollow(userId: String!): Follow
deleteFollow(followId: String!): String
}
`;

module.exports = typeDefs
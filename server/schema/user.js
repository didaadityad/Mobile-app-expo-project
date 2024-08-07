const typeDefs = `#graphql
scalar Date
scalar ObjectId

type User {
_id: String
name: String
username: String
email: String
password: String 
followers: [Followers]
followings: [Followings]
}

type Followers {
name: String
username: String
}

type Followings {
name: String
username: String
}

input NewUser {
    name: String,
    username: String!,
    email:String!,
    password:String!
}

input UpdateUser {
    name: String,
    username: String!,
    email:String!,
    password:String!
}

input UserCredentials {
username: String!,
password: String!
}

type UserSummary {
    _id: String
    name: String
    username: String
    followers: [Followers]
    followings: [Followings]
}

type LoginResponse {
access_token: String!
}

type RegisterResponse{
message: String
}

type Query {
findUsers: [User]
findUserById(userId: String!): User
searchByUsername(query: String!): [UserSummary]
getUserLoggedIn: UserSummary
}
type Mutation {
register(inputUser: NewUser): RegisterResponse
login(inputLogin: UserCredentials): LoginResponse
deleteUser(userId: String!): String
updateUser(userId: String!, updateFields: UpdateUser): User
}
`;

module.exports = typeDefs
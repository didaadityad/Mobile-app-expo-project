const typeDefs = `#graphql
scalar Date

type Post {
_id: String
content: String
tags: [String]
imgUrl: String
authorId: String
comments:[Comment]
likes: [Like]
author: Author
createdAt: Date
updatedAt: Date
}

type Comment {
content: String
username: String
createdAt: Date
updatedAt: Date
}

type Like {
username: String
createdAt: Date
updatedAt: Date
}

type Author{
name: String
username: String
}


input NewComment {
content: String
username: String
createdAt: Date
updatedAt: Date
}

input NewLike {
username: String
createdAt: Date
updatedAt: Date
}

input NewPost {
content: String
tags: [String]
imgUrl: String
authorId: String
comments:[NewComment]
likes: [NewLike]
createdAt: Date
updatedAt: Date
}

input UpdatePost {
content: String
tags: [String]
imgUrl: String
comments:[NewComment]
likes: [NewLike]
updatedAt: Date
}

type Query {
findPosts: [Post]
findPostById(postId: String!): Post
}

type Mutation {
createPost(inputPost: NewPost!): Post
deletePost(postId: String!): String
updatePost(postId: String!, updateFields: UpdatePost): Post
addComment(postId: String!, content: String): Post
addLike(postId: String!): Post
}
`;

module.exports = typeDefs
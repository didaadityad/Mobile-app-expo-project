import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query FindPosts {
    findPosts {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
      }
      author {
        name
        username
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query Query($postId: String!) {
  findPostById(postId: $postId) {
    author {
      username
    }
    comments {
      content
      username
    }
    content
    updatedAt
    imgUrl
    likes {
      username
    }
    tags
  }
}
`

export const GET_USER_LOGGEDIN = gql`
query GetUserLoggedIn {
  getUserLoggedIn {
    _id
    username
  }
}
`
export const GET_USER_WITH_FOLLOWING = gql`
query GetUserLoggedIn {
  getUserLoggedIn {
    _id
    username
    followings {
      name
      username
    }
  }
}
`

export const GET_USER_BY_USERNAME = gql`
  query ($query: String) {
    findByUsername(query: $query) {
      _id
      username
      name
      followers {
        name
        username
      }
      followings {
        name
        username
      }
    }
  }
`;

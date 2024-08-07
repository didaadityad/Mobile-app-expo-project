import { gql, useMutation, useQuery } from "@apollo/client";
import { useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { GET_POST_BY_ID, GET_USER_LOGGEDIN } from "../queries";
import { formatDistanceToNow } from "date-fns";
import Comment from "../components/comments";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from "react-native";
import { AntDesign, FontAwesome, Feather } from "@expo/vector-icons";

const ADD_COMMENT = gql`
  mutation AddComment($postId: String!, $content: String!) {
    addComment(postId: $postId, content: $content) {
      content
      username
      createdAt
      updatedAt
    }
  }
`;

const ADD_LIKE = gql`
  mutation AddLike($postId: String!) {
    addLike(postId: $postId) {
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
        updatedAt
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

export default function FeedsDetail() {
  const [hasLiked, setHasLiked] = useState(false);
  const [newComment, setNewComment] = useState(""); // Correctly initialize newComment and setNewComment
  const route = useRoute();
  const { id } = route.params;
  const commentInputRef = useRef(null);

  const { data, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: { postId: id },
  });

  const { data: UserLoggedIn } = useQuery(GET_USER_LOGGEDIN, {
    fetchPolicy: "no-cache",
  });

  const [addCommentMutation] = useMutation(ADD_COMMENT, {
    refetchQueries: [
      {
        query: GET_POST_BY_ID,
        variables: { postId: id },
      },
    ],
  });

  const [likePostMutation] = useMutation(ADD_LIKE, {
    refetchQueries: [
      {
        query: GET_POST_BY_ID,
        variables: { postId: id },
      },
    ],
  });

  const post = data?.findPostById;
  const comments = post?.comments || [];
  const likes = post?.likes || [];
  const { content, updatedAt, imgUrl, author, tags } = post || {};
  const userLoggedIn = UserLoggedIn?.getUserLoggedIn.username;
  const checkLiked = likes.some((like) => like.username === userLoggedIn);

  const formattedTime = updatedAt
    ? formatDistanceToNow(new Date(updatedAt), { addSuffix: true })
    : "";

  const submitComment = async () => {
    try {
      await addCommentMutation({
        variables: {
          postId: id, 
          content: newComment,
        },
      });
      setNewComment("");
    } catch (error) {
      console.log(error);
      Alert.alert(error.message);
    }
  };

  const focusCommentInput = () => {
    commentInputRef.current.focus();
  };

  const handleLike = async () => {
    try {
      const result = await likePostMutation({
        variables: {
          postId: id,
        },
      });
      if (result.data.addLike) {
        setHasLiked(true);
      } else {
        setHasLiked(false);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  useEffect(() => {
    if (checkLiked) {
      setHasLiked(true);
    }
  }, [checkLiked]);

  if (error) return Alert.alert(error.message);

  return (
    <SafeAreaView style={styles.container}>
      {post && (
        <>
          <View style={styles.contentContainer}>
            <FlatList
              ListHeaderComponent={
                <>
                  <View style={styles.postHeader}>
                    <Image
                      source={{
                        uri: "https://th.bing.com/th/id/OIP.Ze_F6AGBDQyYrlbNF7tCXAHaHa?rs=1&pid=ImgDetMain",
                      }}
                      style={styles.postProfileImage}
                    />
                    <View style={styles.postHeaderText}>
                      <Text style={styles.postName}>{author?.username}</Text>
                      <Text style={styles.postTime}>{formattedTime}</Text>
                    </View>
                  </View>
                  <View style={styles.postContentContainer}>
                    <Text style={styles.postText}>{content}</Text>
                    <Text style={styles.postTags}>Tags: {tags}</Text>
                    {imgUrl ? (
                      <Image
                        source={{ uri: imgUrl }}
                        style={styles.postImage}
                      />
                    ) : null}
                    <View style={styles.postStatus}>
                      <Text style={styles.postTime}>{likes.length} Likes</Text>
                      <Text style={styles.postTime}>
                        {comments.length} Comments
                      </Text>
                    </View>
                  </View>
                  <View style={styles.postFooter}>
                    {hasLiked ? (
                      <TouchableOpacity
                        style={styles.likeButton}
                        onPress={handleLike}
                      >
                        <AntDesign name="like1" size={25} color="#03A9F4" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.likeButton}
                        onPress={handleLike}
                      >
                        <AntDesign name="like1" size={25} color="black" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.likeButton}
                      onPress={focusCommentInput}
                    >
                      <FontAwesome name="comment" size={25} color="black" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.footerText}>Comments</Text>
                </>
              }
              data={comments}
              renderItem={({ item }) => (
                <Comment comment={item.content} username={item.username} />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <KeyboardAvoidingView
            style={styles.commentContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          >
            <TextInput
              style={styles.input}
              placeholder="Comment"
              placeholderTextColor="#888"
              onChangeText={setNewComment}
              value={newComment}
              ref={commentInputRef}
            />
            <TouchableOpacity
              style={styles.commentIcon}
              onPress={submitComment}
            >
              <Feather name="send" size={24} color="black" />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  postProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 5,
  },
  postHeaderText: {
    marginLeft: 10,
  },
  postName: {
    fontWeight: "bold",
    fontSize: 24,
  },
  postTime: {
    color: "#888",
  },
  postContentContainer: {
    marginHorizontal: 10,
  },
  postTags: {
    color: "#888",
  },
  postText: {
    marginTop: 10,
    padding: 5,
  },
  postImage: {
    marginTop: 10,
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  postStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingBottom: 5,
  },
  postFooter: {
    flexDirection: "row",
    margin: 10,
  },
  footerText: {
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 10,
    fontSize: 24,
  },
  likeButton: {
    width: 50,
    alignItems: "center",
    paddingVertical: 5,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  commentIcon: {
    backgroundColor: "#03A9F4",
    borderRadius: 50,
    padding: 10,
  },
});

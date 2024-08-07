import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { GET_POSTS, GET_USER_LOGGEDIN } from "../queries";
import {
    View,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    Text,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
} from "react-native";

const CREATE_POST = gql`
  mutation CreatePost($inputPost: NewPost!) {
    createPost(inputPost: $inputPost) {
      _id
    }
  }
`;

export default function NewPostScreen() {
    const navigation = useNavigation();
    const [imgUrl, setImgUrl] = useState("");
    const [tags, setTags] = useState("");
    const [content, setContent] = useState("");
    const { data, loading, error } = useQuery(GET_USER_LOGGEDIN, {
        fetchPolicy: "no-cache"
    });

    const [addPostMutation] = useMutation(CREATE_POST, {
        refetchQueries: [
            {
                query: GET_POSTS
            }
        ]
    });

    const handleAddPost = async () => {
        try {
            await addPostMutation({
                variables: {
                    inputPost: {
                        content,
                        imgUrl,
                        tags
                    }
                }
            });
            navigation.navigate("Home");
        } catch (error) {
            console.log(error.message);
            Alert.alert(error.message);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Image
                        source={{
                            uri: "https://path_to_your_astronaut_image.png",
                        }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.largeText}>{data?.getUserLoggedIn?.username}</Text>
                </View>
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add image URL here"
                        onChangeText={setImgUrl}
                        value={imgUrl}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Add tags here"
                        onChangeText={setTags}
                        value={tags}
                    />
                    <TextInput
                        style={styles.textArea}
                        placeholder="What's on your mind?"
                        textAlignVertical="top"
                        multiline={true}
                        onChangeText={setContent}
                        value={content}
                    />
                    <TouchableOpacity style={styles.submitButton} onPress={handleAddPost}>
                        <Text style={styles.mediumText}>Submit Post</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1C1C1C", 
        alignItems: "center",
        padding: 10
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        width: "100%",
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    largeText: {
        fontSize: 20,
        color: "#FFFFFF", 
        marginHorizontal: 10,
        fontWeight: "bold",
    },
    formContainer: {
        flex: 1,
        alignItems: "center",
        width: "90%",
    },
    submitButton: {
        marginVertical: 10,
        width: "100%",
        backgroundColor: "#0B3D91", 
        alignItems: "center",
        padding: 15,
        borderRadius: 20,
        position: "absolute",
        bottom: 20,
    },
    mediumText: {
        fontSize: 16,
        color: "#FFFFFF", 
        fontWeight: "bold",
    },
    input: {
        width: "100%",
        padding: 10,
        backgroundColor: "#0B3D91", 
        borderRadius: 15,
        marginTop: 12,
        color: "#FFFFFF", 
    },
    textArea: {
        width: "100%",
        padding: 10,
        backgroundColor: "#0B3D91", 
        borderRadius: 15,
        marginTop: 12,
        color: "#FFFFFF", 
        height: 150,
    },
});
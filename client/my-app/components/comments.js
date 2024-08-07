import { Image, StyleSheet, Text, View } from "react-native";

export default function Comment({ comment, username }) {
  return (
    <View  style={styles.commentContainer}>
      <Image
        source={{ uri: "https://th.bing.com/th/id/OIP.Ze_F6AGBDQyYrlbNF7tCXAHaHa?rs=1&pid=ImgDetMain" }}
        style={styles.profileImage}
      />
      <View  style={styles.commentBubble}>
        <Text style={styles.userText}>{username}</Text>
        <Text style={styles.comment}> {comment}</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
      },
      commentBubble: {
        backgroundColor: '#03AED2',
        maxWidth: '100%',
        borderRadius: 20,
        flexShrink: 1,
      },
      commentContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
       
      },
      userText: {
        fontSize: 15,
        fontWeight: 'bold',
        padding: 10,
        paddingBottom: 0
      },
      comment: {
        fontSize: 15,
        padding: 10,
        paddingTop: 3,
      }
})

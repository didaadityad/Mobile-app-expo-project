import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { formatDistanceToNow } from 'date-fns';

export default function PostCard({ content, imgUrl, _id, updatedAt, name }) {
    const nav = useNavigation();
    const formattedTime = formatDistanceToNow(new Date(updatedAt), { addSuffix: true });
    const defaultProfileImage = 'https://th.bing.com/th/id/OIP.Ze_F6AGBDQyYrlbNF7tCXAHaHa?rs=1&pid=ImgDetMain';

    const cardStyles = [styles.postContainer1, styles.postContainer2, styles.postContainer3];
    const currentStyleIndex = _id.charCodeAt(0) % cardStyles.length;
    const currentCardStyle = cardStyles[currentStyleIndex];

    return (
        <TouchableOpacity style={[styles.postContainer, currentCardStyle]}
            onPress={() => nav.navigate('FeedsDetail', { id: _id })}
        >
            <View style={styles.postHeader}>
                <Image
                    source={{ uri: defaultProfileImage }}
                    style={styles.postProfileImage}
                />
                <View style={styles.postHeaderText}>
                    <Text style={styles.postName}>{name}</Text>
                    <Text style={styles.postTime}>{formattedTime}</Text>
                </View>
            </View>
            <Text style={styles.postText}>{content}</Text>
            {imgUrl ? (
                <Image
                    source={{ uri: imgUrl }}
                    style={styles.postImage}
                />
            ) : null}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        padding: 20,
        borderRadius: 20,
        marginVertical: 15,
        marginHorizontal: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 10,
    },
    postContainer1: {
        backgroundColor: '#2e2e2e',
        borderColor: '#444',
        borderWidth: 1,
    },
    postContainer2: {
        backgroundColor: '#3a3a3a',
        borderColor: '#555',
        borderWidth: 1,
    },
    postContainer3: {
        backgroundColor: '#444',
        borderColor: '#666',
        borderWidth: 1,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postProfileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    postHeaderText: {
        marginLeft: 10,
    },
    postName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#fff',
    },
    postTime: {
        color: '#888',
        fontSize: 12,
    },
    postText: {
        marginTop: 10,
        fontSize: 14,
        color: '#ccc',
    },
    postImage: {
        marginTop: 10,
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
});

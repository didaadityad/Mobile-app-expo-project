import { View, StyleSheet, Image, Text, FlatList, TouchableOpacity } from 'react-native';
import PostCard from '../components/postCard'
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { GET_POSTS } from '../queries';

export default function FeedScreen() {
    const navigation = useNavigation();
    const { data, loading, error } = useQuery(GET_POSTS);

    if (error) return <Text>Error: {error.message}</Text>;

    console.log('Fetched Data:', data);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.headerInputContainer}
                onPress={() => navigation.navigate('NewPost')}
            >
                <Image
                    source={{ uri: 'https://th.bing.com/th/id/OIP.Ze_F6AGBDQyYrlbNF7tCXAHaHa?rs=1&pid=ImgDetMain' }}
                    style={styles.profileImage}
                />
                <View style={styles.addTextContainer}>
                    <Text style={styles.addText}>What's on your mind?</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.postCardContainer}>
                {data && (
                    <FlatList
                        data={data.findPosts}
                        renderItem={({ item }) => (
                            <PostCard
                                content={item.content}
                                imgUrl={item.imgUrl}
                                _id={item._id}
                                updatedAt={item.updatedAt}
                                name={item.author?.username}
                            />
                        )}
                        keyExtractor={item => item._id}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    headerInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#333',
        marginHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#555',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    addTextContainer: {
        flex: 1,
        marginLeft: 10,
    },
    addText: {
        padding: 15,
        color: '#ccc',
        backgroundColor: '#444',
        borderRadius: 10,
        fontSize: 16,
    },
    postCardContainer: {
        marginHorizontal: 10,
        marginTop: 10,
    }
});

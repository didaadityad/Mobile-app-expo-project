import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../context/Context"
import * as SecureStore from 'expo-secure-store'

const NavBar = () => {
    const {setIsSignedIn} = useContext(AuthContext)

    const handleLogout = async () => {
        try {
            await SecureStore.deleteItemAsync('access_token')
            setIsSignedIn(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.headerContainer}>
            <Text style={styles.logo}>FaceFace</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    };
    
    const styles = StyleSheet.create({
      safeArea: {
        paddingBottom: 5,
        backgroundColor: '#0B3D91',
      },
      headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 60,
        backgroundColor: '#0B3D91', 
      },
      logo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700', 
      },
      logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#FF4500', 
        borderRadius: 10,
      },
      logoutText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
      },
    });

  export default NavBar
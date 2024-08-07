import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { AuthContext } from "../context/Context";
import * as SecureStore from 'expo-secure-store';

const LOGIN = gql`
mutation Login($inputLogin: UserCredentials!) {
  login(inputLogin: $inputLogin) {
    access_token
  }
}
`

export default function Login() {
    const navigation = useNavigation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginMutation] = useMutation(LOGIN);
    const { setIsSignedIn } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            const result = await loginMutation({
                variables: {
                    inputLogin: {
                        username: username,
                        password: password
                    }
                }
            });
            console.log("Result:", result);
            if (result.data && result.data.login) {
                await SecureStore.setItemAsync('access_token', result.data.login.access_token);
                setIsSignedIn(true);
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            Alert.alert(error.message);
            console.log(error.message);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.textTitle}>Login</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Username"
                    placeholderTextColor="#999"
                    onChangeText={setUsername}
                    value={username}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    value={password}
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <Text style={styles.normalText}>or</Text>
                <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.buttonTextSecondary}>Register</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a1a1a",
        alignItems: "center",
        justifyContent: "center",
    },
    formContainer: {
        backgroundColor: "#2e2e2e",
        width: "90%",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    textTitle: {
        color: "#fff",
        fontSize: 32,
        textAlign: "center",
        marginBottom: 20,
        fontWeight: "bold",
    },
    textInput: {
        backgroundColor: "#444",
        borderRadius: 10,
        width: "100%",
        height: 50,
        marginBottom: 15,
        fontSize: 18,
        paddingLeft: 20,
        color: "#fff",
    },
    button: {
        backgroundColor: "#03A9F4",
        padding: 15,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    buttonSecondary: {
        backgroundColor: "#444",
        borderWidth: 2,
        borderColor: "#03A9F4",
        padding: 15,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    buttonTextSecondary: {
        color: "#03A9F4",
        fontSize: 18,
        fontWeight: "bold",
    },
    normalText: {
        color: "#ccc",
        fontSize: 18,
        marginVertical: 10,
    },
});

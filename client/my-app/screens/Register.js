import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { AuthContext } from "../context/Context";

const REGISTER = gql`
mutation Register($inputUser: NewUser!) {
  register(inputUser: $inputUser) {
    message
  }
}
`

export default function Register() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [registerMutation] = useMutation(REGISTER);

    const handleRegister = async () => {
        try {
            const result = await registerMutation({
                variables: {
                    inputUser: {
                        email: email,
                        password: password,
                        username: username,
                        name: name
                    }
                }
            });
            Alert.alert(result.data.register.message);
            navigation.navigate("Login");
        } catch (error) {
            Alert.alert(error.message);
            console.log(error.message);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.textTitle}>Register</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    value={email}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    value={password}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Username"
                    placeholderTextColor="#999"
                    onChangeText={setUsername}
                    value={username}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Full Name"
                    placeholderTextColor="#999"
                    onChangeText={setName}
                    value={name}
                />
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <Text style={styles.normalText}>or</Text>
                <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.buttonTextSecondary}>Click here to Login</Text>
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

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AuthContext } from "../context/Context";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Home from "../screens/FeedScreen.js";
import FeedScreen from "../screens/FeedScreen.js";
import HomeScreen from "../screens/HomeScreen.js";
// import NewPost from "../screens/NewPost.js";
import NewPostScreen from "../screens/NewPost.js";
import NavBar from "../components/NavBar.js";
import FeedsDetail from "../screens/FeedsDetail.js";




const Stack = createNativeStackNavigator()

export default function MainStack(){
    const {isSignedIn} = useContext(AuthContext)

    return(
        <Stack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: "white"
            },
            headerTintColor: "black"
        }}
        >
            {isSignedIn ? (
                <>
            <Stack.Screen name="Home" component={FeedScreen} options={{
                header: () => <NavBar/>,
            }}
            />
            <Stack.Screen name="NewPost" options={{title:"Add Post"}} component={NewPostScreen} />
            <Stack.Screen name="FeedsDetail" options={{title:"Feeds Detail"}} component={FeedsDetail} />
            </>

            ) : (
                <>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                </>
            )}
        </Stack.Navigator>
    )
}
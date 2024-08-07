import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import {setContext} from "@apollo/client/link/context"
import * as SecureStore from 'expo-secure-store'

const httpLink = createHttpLink({
    uri: 'https://dc57-2001-448a-5020-e1d-441e-27ff-63c1-5171.ngrok-free.app',
});

const authLink = setContext(async (_, {headers}) => {
    try {
        const access_token = await SecureStore.getItemAsync('access_token')
        return {
            headers: {
                ...headers,
                authorization: access_token ? `Bearer ${access_token}` : "",
            }
        }
    } catch (error) {
        console.log(error)
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})

export default client

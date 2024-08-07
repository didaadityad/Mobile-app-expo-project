import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View, Image, TextInput } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './screens/FeedScreen.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from './context/Context';
import * as SecureStore from 'expo-secure-store'
import { ApolloProvider } from '@apollo/client';
import client from './config/apollo';
import MainStack from './navigate/MainStack';

export default function App() {
const [isSignedIn, setIsSignedIn] = useState(false)
useEffect(() => {
  async function auth(){
    const access_token = await SecureStore.getItemAsync('access_token')
    if (access_token){
      setIsSignedIn(true)
    }
  }

  auth()
}, [])
  const Stack = createNativeStackNavigator()
  return (
    <AuthContext.Provider value = {{isSignedIn, setIsSignedIn}}>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <MainStack/>
        </NavigationContainer>
      </ApolloProvider>
    </AuthContext.Provider>
  );
}


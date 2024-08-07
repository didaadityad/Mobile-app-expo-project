import { View, FlatList, StyleSheet, TextInput, Alert, } from "react-native";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_USER_BY_USERNAME } from "../queries";
import { Alert } from "react-native";

export default function SearchScreen() {
    const [search, setSearch] = useState("")
    const [data, error] = useQuery(GET_USER_BY_USERNAME, {
        variables: { query: search },
        fetchPolicy: "no-cache"
    })


}
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, StyleSheet, View } from "react-native";
import { carModels } from "@/data/car-models";
import CarDetailsCard from "@/components/shared/car-details-card";
import { useState } from "react";
import CarCatalog from "@/components/shared/car-catalog";

export default function Home() {
    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.banner}>

            </View>
            <View style={styles.searchContainer}></View>
            <CarCatalog />
        </SafeAreaView>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    banner: {
        width: "90%",
        height: 200,
        marginHorizontal: "auto",
        borderRadius: 15,
        overflow: "hidden",
        backgroundColor: "#000",
    },
    searchContainer: {},

})
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, StyleSheet, View } from "react-native";
import { carModels } from "@/data/car-models";
import CarDetailsCard from "@/components/shared/car-details-card";
import { useState } from "react";
import CarCatalog from "@/components/shared/car-catalog";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme-types";

export default function Home() {
    const { colorScheme } = useTheme()
    const styles = getStyles(colorScheme)

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === "light" ? "#fff" : "#121212" }]}>
            <View style={styles.banner}>

            </View>
            <View style={styles.searchContainer}></View>
            <CarCatalog />
        </SafeAreaView>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "light" ? "#fff" : "#121212" 
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
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";

export default function Home() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.banner}>

            </View>
            <View style={styles.searchContainer}></View>
            <View style={styles.carListContainer}>
                {/* <FlatList
                    data={carModels}
                    renderItem={}
                /> */}
            </View>
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
    carListContainer: {},

})
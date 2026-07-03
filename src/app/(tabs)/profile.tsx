import Header from "@/components/shared/component-header"
import { useTheme } from "@/hooks/use-theme"
import { ThemeType } from "@/types/theme-types"
import { useRouter } from "expo-router"
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { layoutTheme } from "../../constants/theme"

export default function Profile() {
    const router = useRouter()
    const { colorScheme } = useTheme()
    const styles = getStyles(colorScheme)

    return (
        <SafeAreaView style={styles.container}>
            <Header>Profile</Header>

            <ScrollView contentContainerStyle={styles.content} >
                <TouchableOpacity style={styles.item} onPress={() => router.push("/profile/personal-information")}>
                    <Text style={styles.itemText}>Personal Information</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item}>
                    <Text style={styles.itemText}>Driver License</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item}>
                    <Text style={styles.itemText}>Card Information</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "light" ? "#fff" : "#121212"
    },
    
    content: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 8,
    },
    item: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: theme === "light" ? "#f2f2fa" : "#666666",
    },
    itemText: {
        fontFamily: layoutTheme.fonts.hind.bold,
        fontSize: 18,
        color: theme === "light" ? "#000" : "#fff"
    }
})
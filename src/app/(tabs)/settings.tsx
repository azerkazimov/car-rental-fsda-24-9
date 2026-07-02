import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme-types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Settings() {
    const { colorScheme, toggleTheme } = useTheme()
    const styles = getStyles(colorScheme)

    const handleThemeChange = () => {
        toggleTheme(colorScheme === "light" ? "dark" : "light")
    }
    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity style={styles.headerBackButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colorScheme === "light" ? "#000" : "#fff"} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <View style={styles.settings}>
                <Text style={styles.settingsTitle}>Theme</Text>
                <Switch
                    value={colorScheme === "light"}
                    onValueChange={handleThemeChange}
                    trackColor={{
                        false: colorScheme === "light" ? "#000" : "#fff",
                        true: colorScheme === "light" ? "#000" : "#fff"
                    }}
                    thumbColor={colorScheme === "light" ? "#fafafa" : "#fff"}
                />
            </View>
        </SafeAreaView>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "light" ? "#fff" : "#121212"
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerBackButton: {
        padding: 10,
        borderRadius: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: theme === "light" ? "#000" : "#fff"
    },
    settings: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    settingsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: theme === "light" ? "#000" : "#fff"
    }
})
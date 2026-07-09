import Header from "@/components/shared/component-header";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme-types";
import { StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Settings() {
    const { colorScheme, toggleTheme } = useTheme()
    const styles = getStyles(colorScheme)

    const handleThemeChange = () => {
        toggleTheme(colorScheme === "light" ? "dark" : "light")
    }
    return (
        <SafeAreaView style={styles.container}>

            <Header>Settings</Header>

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
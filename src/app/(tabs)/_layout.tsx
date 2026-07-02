import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme-types";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
    const { colorScheme } = useTheme()
    const styles = getStyles(colorScheme)
    return (
        <Tabs screenOptions={{
            tabBarStyle: styles.tabBar,
            sceneStyle: styles.sceneBackground,
        }}>
            <Tabs.Screen name="index" options={{
                title: "Home",
                headerShown: false,
                tabBarShowLabel: false, // Cleaner to put this here globally
                tabBarActiveTintColor: "#F9B401",   // Active icon color
                tabBarInactiveTintColor: "#95BCCC", // Inactive icon color
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" color={color} size={size} />
                )
            }} />
            <Tabs.Screen name="location" options={{
                title: "Location",
                headerShown: false,
                tabBarShowLabel: false, // Cleaner to put this here globally
                tabBarActiveTintColor: "#F9B401",   // Active icon color
                tabBarInactiveTintColor: "#95BCCC", // Inactive icon color
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="location" color={color} size={size} />
                )
            }} />
            <Tabs.Screen name="notification" options={{
                title: "Notification",
                headerShown: false,
                tabBarShowLabel: false, // Cleaner to put this here globally
                tabBarActiveTintColor: "#F9B401",   // Active icon color
                tabBarInactiveTintColor: "#95BCCC", // Inactive icon color
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="notifications" color={color} size={size} />
                )
            }} />
            <Tabs.Screen name="settings" options={{
                title: "Settings",
                headerShown: false,
                tabBarShowLabel: false, // Cleaner to put this here globally
                tabBarActiveTintColor: "#F9B401",   // Active icon color
                tabBarInactiveTintColor: "#95BCCC", // Inactive icon color
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="settings" color={color} size={size} />
                )
            }} />
        </Tabs>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    tabBar: {
        backgroundColor: theme === "light"? "#4d5e63" : "#27444e",
        borderTopWidth: 0,
        height: 70,
        paddingBottom: 10,
        paddingTop: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginHorizontal: 10,
        marginBottom: 20,
        marginTop: 0,
        position: "absolute",
    },
    sceneBackground: {
        // Цвет фона за таббаром и самих экранов
        backgroundColor: theme === "dark" ? "#121212" : "#fff", 
    }
})
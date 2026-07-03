import { useTheme } from '@/hooks/use-theme'
import { ThemeType } from '@/types/theme-types'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function Header({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { colorScheme } = useTheme()
    const styles = getStyles(colorScheme)
    
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.headerBackButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color={colorScheme === "light" ? "#000" : "#fff"} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{children}</Text>
        </View>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
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
    }
})
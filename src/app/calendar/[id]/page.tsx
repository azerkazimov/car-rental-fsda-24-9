import RangeCalendar from "@/components/screen/calendar/calendar";
import { layoutTheme } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useBookingStore } from "@/store/use-booking";
import { ThemeType } from "@/types/theme-types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalendarPage() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    const router = useRouter();
    const isLight = colorScheme === "light";

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons
                        name="chevron-back"
                        size={20}
                        color={
                            isLight
                                ? layoutTheme.colors.primary.colorPrimaryText
                                : layoutTheme.colors.secondary.colorSecondaryBg
                        }
                    />
                </TouchableOpacity>
            </View>
            <RangeCalendar  />
        </SafeAreaView>
    );
}

const getStyles = (theme: ThemeType) => {
    const isLight = theme === "light";
    const { primary } = layoutTheme.colors;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isLight ? "#F4F6F7" : primary.colorPrimaryActive,
        },
        header: {
            paddingHorizontal: 20,
            paddingTop: 4,
            paddingBottom: 4,
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isLight ? "#FFFFFF" : primary.colorPrimary,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        },
    });
};

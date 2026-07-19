import { layoutTheme } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useBookingStore } from "@/store/use-booking";
import { ThemeType } from "@/types/theme-types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function formatDisplayDate(dateString: string | null) {
    if (!dateString) return "—";
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

export default function BookingSuccess() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    const isLight = colorScheme === "light";
    const { primary, secondary } = layoutTheme.colors;

    const { bookingStartDate, bookingEndDate, bookingDays } = useBookingStore();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconWrap}>
                    <Ionicons
                        name="checkmark"
                        size={42}
                        color={isLight ? secondary.colorSecondaryBg : primary.colorPrimaryText}
                    />
                </View>

                <Text style={styles.title}>Booking Confirmed</Text>
                <Text style={styles.subtitle}>
                    Your reservation is all set. We sent a confirmation notification to your device.
                </Text>

                <View style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Pickup</Text>
                        <Text style={styles.value}>{formatDisplayDate(bookingStartDate)}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Return</Text>
                        <Text style={styles.value}>{formatDisplayDate(bookingEndDate)}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Duration</Text>
                        <Text style={styles.value}>
                            {bookingDays ? `${bookingDays} day${bookingDays === 1 ? "" : "s"}` : "—"}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.replace("/(tabs)")}
                    activeOpacity={0.85}
                >
                    <Text style={styles.primaryButtonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const getStyles = (theme: ThemeType) => {
    const isLight = theme === "light";
    const { primary, secondary } = layoutTheme.colors;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isLight ? secondary.colorSecondaryBgHover : primary.colorPrimaryActive,
            paddingHorizontal: 24,
            justifyContent: "space-between",
        },
        content: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        iconWrap: {
            width: 88,
            height: 88,
            borderRadius: 44,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isLight ? primary.colorPrimary : secondary.colorSecondaryBg,
            marginBottom: 28,
        },
        title: {
            fontSize: 28,
            fontFamily: layoutTheme.fonts.hind.bold,
            color: isLight ? primary.colorPrimaryText : secondary.colorSecondaryBg,
            textAlign: "center",
            marginBottom: 10,
        },
        subtitle: {
            fontSize: 15,
            lineHeight: 22,
            fontFamily: layoutTheme.fonts.hind.regular,
            color: isLight ? secondary.colorSecondary : primary.colorPrimaryBg,
            textAlign: "center",
            paddingHorizontal: 12,
            marginBottom: 32,
        },
        card: {
            width: "100%",
            backgroundColor: isLight ? secondary.colorSecondaryBg : primary.colorPrimary,
            borderRadius: 16,
            paddingHorizontal: 20,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: isLight ? secondary.colorSecondaryBorder : primary.colorPrimaryBorder,
        },
        row: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 14,
        },
        divider: {
            height: 1,
            backgroundColor: isLight ? secondary.colorSecondaryBorder : primary.colorPrimaryBorder,
        },
        label: {
            fontSize: 14,
            fontFamily: layoutTheme.fonts.hind.medium,
            color: isLight ? secondary.colorSecondary : primary.colorPrimaryBg,
        },
        value: {
            fontSize: 15,
            fontFamily: layoutTheme.fonts.hind.semiBold,
            color: isLight ? primary.colorPrimaryText : secondary.colorSecondaryBg,
        },
        footer: {
            paddingBottom: 16,
        },
        primaryButton: {
            backgroundColor: isLight ? primary.colorPrimary : secondary.colorSecondaryBg,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
        },
        primaryButtonText: {
            fontSize: 16,
            fontFamily: layoutTheme.fonts.hind.semiBold,
            color: isLight ? secondary.colorSecondaryBg : primary.colorPrimaryText,
        },
    });
};

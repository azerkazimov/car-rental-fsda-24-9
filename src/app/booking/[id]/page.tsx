import BookingForm from "@/components/screen/booking/booking-form";
import Header from "@/components/shared/component-header";
import { layoutTheme } from "@/constants/theme";
import { carModels } from "@/data/car-models";
import { useTheme } from "@/hooks/use-theme";
import { useBookingStore } from "@/store/use-booking";
import { ThemeType } from "@/types/theme-types";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Booking() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);

    const { bookingDays } = useBookingStore();
    console.log(bookingDays);

    const { id } = useLocalSearchParams();
    const car = carModels.find(item => item.id === id);

    if (!car) return null;

    const totalPrice = bookingDays ? bookingDays * car.pricePerDay : car.pricePerDay;

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <Header>Booking</Header>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.summaryCard}>
                    <Text style={styles.brand}>{car.brand}</Text>
                    <Text style={styles.model}>{car.model}</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.pricePeriod}>Total price for {bookingDays} days</Text>
                        <Text style={styles.price}>
                            ${totalPrice}
                        </Text>
                    </View>
                </View>

                <BookingForm />
            </ScrollView>
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
        },
        scrollContent: {
            paddingHorizontal: 20,
            paddingBottom: 32,
            gap: 20,
        },
        summaryCard: {
            backgroundColor: isLight ? secondary.colorSecondaryBg : primary.colorPrimary,
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: isLight ? secondary.colorSecondaryBorder : primary.colorPrimaryBorder,
        },
        brand: {
            fontSize: 14,
            fontFamily: layoutTheme.fonts.hind.medium,
            color: isLight ? secondary.colorSecondary : primary.colorPrimaryBg,
            textTransform: "uppercase",
            letterSpacing: 0.5,
        },
        model: {
            fontSize: 24,
            fontFamily: layoutTheme.fonts.hind.bold,
            color: isLight ? primary.colorPrimaryText : secondary.colorSecondaryBg,
            marginTop: 4,
        },
        price: {
            fontSize: 20,
            fontFamily: layoutTheme.fonts.hind.semiBold,
            color: isLight ? primary.colorPrimaryText : secondary.colorSecondaryBg,
        },
        pricePeriod: {
            fontSize: 14,
            fontFamily: layoutTheme.fonts.hind.regular,
            color: isLight ? secondary.colorSecondary : primary.colorPrimaryBg,
            paddingBottom: 4
        },
        priceRow: {
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 6,
        },
    });
};

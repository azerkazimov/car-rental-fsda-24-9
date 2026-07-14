import { carModels } from "@/data/car-models";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme-types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CarDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);

    // Ensure ID comparison matches your data type (string vs number)
    const car = carModels.find(item => item.id.toString() === id?.toString());

    if (!car) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Car not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={20} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Car Image */}
                <View style={styles.imageContainer}>
                    {/* Replace source with actual logic if car.image is a URL or require local asset */}
                    <Image
                        source={typeof car.image === 'string' ? { uri: car.image } : car.image}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                {/* Title & Brand */}
                <View style={styles.titleContainer}>
                    <Text style={styles.brandText}>{car.brand}</Text>
                    <Text style={styles.modelText}>{car.model}</Text>
                </View>

                {/* Specs Grid */}
                <Text style={styles.sectionTitle}>Specifications</Text>
                <View style={styles.grid}>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Transmission</Text>
                        <Text style={styles.gridValue}>{car.transmission}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Fuel Type</Text>
                        <Text style={styles.gridValue}>{car.fuelType}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Seats</Text>
                        <Text style={styles.gridValue}>{car.seats} Seats</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Features</Text>
                        <Text style={styles.gridValue} numberOfLines={1}>{car.features}</Text>
                    </View>
                </View>


            </ScrollView>

            {/* Bottom Booking Bar */}
            <View style={styles.bottomBar}>
                <View>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.priceValue}>${car.pricePerDay}<Text style={styles.pricePeriod}>/day</Text></Text>
                </View>
                <TouchableOpacity style={styles.bookButton} onPress={() => router.push(`/calendar/${car.id}/page`)}>
                    <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const getStyles = (theme: ThemeType) => {
    const isLight = theme === "light";
    const colors = {
        background: isLight ? "#F8F9FA" : "#121212",
        cardBg: isLight ? "#FFFFFF" : "#1E1E1E",
        textMain: isLight ? "#1A1A1A" : "#FFFFFF",
        textMuted: isLight ? "#7A7A7A" : "#A0A0A0",
        accent: "#2F80ED", // Premium blue accent tint
        border: isLight ? "#E5E5E5" : "#2C2C2C",
    };

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 15,
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.cardBg,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        },
        backButtonText: {
            fontSize: 20,
            color: colors.textMain,
            fontWeight: 'bold',
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.textMain,
        },
        scrollContent: {
            paddingHorizontal: 20,
            paddingBottom: 40,
        },
        imageContainer: {
            width: '100%',
            height: 220,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 10,
        },
        image: {
            width: '100%',
            height: '100%',
        },
        titleContainer: {
            marginVertical: 15,
        },
        brandText: {
            fontSize: 16,
            color: colors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontWeight: '500',
        },
        modelText: {
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.textMain,
            marginTop: 4,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.textMain,
            marginTop: 15,
            marginBottom: 12,
        },
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        gridItem: {
            width: '48%',
            backgroundColor: colors.cardBg,
            padding: 16,
            borderRadius: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
        },
        gridLabel: {
            fontSize: 12,
            color: colors.textMuted,
            marginBottom: 4,
        },
        gridValue: {
            fontSize: 15,
            fontWeight: '600',
            color: colors.textMain,
        },
        bottomBar: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.cardBg,
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 24,
            borderTopWidth: 1,
            borderColor: colors.border,
        },
        priceLabel: {
            fontSize: 12,
            color: colors.textMuted,
        },
        priceValue: {
            fontSize: 22,
            fontWeight: 'bold',
            color: colors.textMain,
        },
        pricePeriod: {
            fontSize: 14,
            fontWeight: 'normal',
            color: colors.textMuted,
        },
        bookButton: {
            backgroundColor: colors.accent,
            paddingVertical: 14,
            paddingHorizontal: 32,
            borderRadius: 14,
        },
        bookButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
        },
        errorText: {
            color: colors.textMain,
            textAlign: 'center',
            marginTop: 40,
            fontSize: 16,
        }
    });
};
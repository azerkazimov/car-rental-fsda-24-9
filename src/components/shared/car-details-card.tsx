import { useTheme } from "@/hooks/use-theme";
import { CarModel } from "@/types/car-model.types";
import { ThemeType } from "@/types/theme-types";
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { layoutTheme } from "../../constants/theme";
import { Link, router } from "expo-router";

interface CarDetailsCardProps {
    car: CarModel | null;
}

export default function CarDetailsCard({ car }: CarDetailsCardProps) {
    const { width } = useWindowDimensions()
    const { colorScheme } = useTheme()
    const styles = getStyles(colorScheme)

    if (!car) return (
        <View>
            <Text>No car found</Text>
        </View>
    );

    return (
        <TouchableOpacity onPress={()=>router.push(`/cars/${car.id}/page`)}>
            <View style={{ ...styles.carDetailsCard, width: width / 2 - 16 }} >
                <Image source={{ uri: car.image }} style={styles.carImage} />
                <View style={styles.carDetails}>
                    <View style={styles.carDetailsRow}>
                        <Text>{car.brand}</Text>
                        <Text>{car.model}</Text>
                    </View>

                    <View style={styles.carPrice}>
                        <Text style={styles.carPriceText}>{car.pricePerDay}</Text>
                        <Text style={styles.carPriceText}>/day</Text>

                    </View>

                </View>
            </View>
        </TouchableOpacity>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    carDetailsCard: {
        flex: 1,
        backgroundColor: theme === "light" ? "#fafafa" : "#666666",
        marginHorizontal: 8,
        borderRadius: 15,
        overflow: "hidden",
    },
    carImage: {
        width: "100%",
        height: 100,
        borderRadius: 15,
        overflow: "hidden",
    },
    carDetails: {
        padding: 8,
        gap: 4,
    },
    carDetailsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    carPrice: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    carPriceText: {
        fontFamily: layoutTheme.fonts.hind.bold,
        fontSize: 16,
        color: "#000",
    },
})
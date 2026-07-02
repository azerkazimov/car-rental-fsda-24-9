import { View, FlatList, StyleSheet, Text } from "react-native";
import { carModels } from "@/data/car-models";
import CarDetailsCard from "./car-details-card";
import { useState } from "react";
import { layoutTheme } from "../../../constants/theme";
import { CarModel } from "@/types/car-model.types";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme-types";



export default function CarCatalog() {
    const [reflesh, setReflesh] = useState(false)
    const { colorScheme } = useTheme()
    const styles = getStyles(colorScheme)
    
    const shuffleCarModels = (array: CarModel[]) => {
        const shuffled = [...array].sort(() => Math.random() - 0.5)
        return shuffled
    }

    const [cars, setCars]= useState(()=> shuffleCarModels(carModels))

    const onReflesh = ()=>{
        setReflesh(true)
        setCars(shuffleCarModels(carModels))
        setTimeout(()=>{
            setReflesh(false)
        }, 1000)
    }

    return (
        <View style={styles.carListContainer}>
            <Text style={styles.carListTitle}>Cars Available Near You</Text>
            <FlatList
                data={cars}
                renderItem={(item) => < CarDetailsCard car={item.item} />}
                refreshing={reflesh}
                onRefresh={onReflesh}
                contentContainerStyle={styles.carListContentContainer}
                numColumns={2}
            />
        </View>
    )
}

const getStyles = (theme:ThemeType) => StyleSheet.create({
    carListContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,

    },
    carListContentContainer: {
        gap: 8,
    },
    carListTitle: {
        fontFamily: layoutTheme.fonts.hind.regular,
        fontSize: 24,
        color: theme === "light" ? "#000" : "#fff",
        marginVertical: 16,
        marginLeft: 8,
    },
})
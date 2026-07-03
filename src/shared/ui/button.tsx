import { Pressable, StyleSheet, Text } from "react-native";
import { layoutTheme } from "../../constants/theme";

interface ButtonProps {
    children: React.ReactNode;
    onPress: () => void;
}

export default function Button({children, onPress}: ButtonProps) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{children}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        width: "100%",
        backgroundColor: layoutTheme.colors.primary.colorPrimary,
        paddingVertical: 18,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
})
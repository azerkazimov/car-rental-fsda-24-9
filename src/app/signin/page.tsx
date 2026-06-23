import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { layoutTheme } from "../../../constants/theme";
import { Label, Link } from "expo-router";

export default function SigninPage() {
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Sign In</Text>
                    <View style={styles.accentLine} />
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.formItem}>
                        <Text style={styles.label}>Email Or Phone Number</Text>
                        <TextInput style={styles.input} placeholder="Email" />
                    </View>
                    <View style={styles.formItem}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput style={styles.input} placeholder="********" />
                    </View>
                    <Pressable style={styles.button} onPress={() => {
                        alert("Log In");
                    }}>
                        <Text style={styles.buttonText}>Log In</Text>
                    </Pressable>
                </View>
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Don't have an account? </Text><Link href="/signup/page">Sign Up</Link>
                </View>
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {

        paddingHorizontal: 38,
    },
    titleContainer: {
        width: "100%",
    },
    title: {
        fontFamily: layoutTheme.fonts.imprima.regular,
        color: "black",
        fontSize: 54,
        marginBottom: 20,
    },
    accentLine: {
        width: 58,
        height: 4,
        backgroundColor: layoutTheme.colors.primary.colorPrimary,
        marginBottom: 20,
        borderRadius: 2,
    },
    formContainer: {
        width: "100%",
        gap: 24,
    },
    formItem: {
        gap: 4,
    },
    label: {
        color: "black",
        fontSize: 16,
        textTransform: "uppercase",
    },
    input: {
        width: "100%",
        height: 40,
        borderBottomWidth: 1,
        borderColor: "#3D4F58",
        paddingHorizontal: 10,
    },
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
    footerContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 24,
    },
    footerText: {
        color: "black",
        fontSize: 16,
        textAlign: "center",
    },
})
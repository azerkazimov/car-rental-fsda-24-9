import SigninForm from "@/components/screen/auth/signin/signin-form";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { layoutTheme } from "../../constants/theme";

export default function SigninPage() {
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Sign In</Text>
                    <View style={styles.accentLine} />
                </View>

                <SigninForm/>
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
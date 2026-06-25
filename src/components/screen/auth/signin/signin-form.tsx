import { StyleSheet, Text, TextInput, View } from "react-native";

import Button from "@/shared/ui/button";

export default function SigninForm() {
    const handleSignIn = () => {
        alert("Okay");
    }
    return (
        <View style={styles.formContainer}>
            
            <View style={styles.formItem}>
                <Text style={styles.label}>Email Or Phone Number</Text>
                <TextInput style={styles.input} placeholder="Email" />
            </View>
            <View style={styles.formItem}>
                <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input} placeholder="********" />
            </View>
            <Button onPress={handleSignIn}>Sign In</Button>
        </View>
    )
}

const styles = StyleSheet.create({
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
})
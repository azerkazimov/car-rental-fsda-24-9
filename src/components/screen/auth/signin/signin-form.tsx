import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import Button from "@/shared/ui/button";
import { Controller, useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { SigninFormType, signinSchema } from "@/components/screen/auth/signin/signin.schema";
import { zodResolver } from "@hookform/resolvers/zod";



export default function SigninForm() {

    const { control, handleSubmit, formState: { errors } } = useForm<SigninFormType>({
        resolver: zodResolver(signinSchema)
    });

    const onSubmit = async (data: any) => {
        try {
            const user = await AsyncStorage.getItem("user")

            if (!user) return

            const userData = JSON.parse(user)

            if (
                userData.email === data.email &&
                userData.password === data.password
            ) {
                AsyncStorage.setItem('isAuthenticated', 'true')
                router.replace("/catalog/page")
            } else {
                Alert.alert("Error", "Invalid email or password");
            }

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong");
        }
    }
    return (
        <View style={styles.formContainer}>

            <View style={styles.formItem}>
                <Text style={styles.label}>Email Or Phone Number</Text>
                {/* Email Controller */}
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                        />
                    )}
                />
            </View>
            <View style={styles.formItem}>
                <Text style={styles.label}>Password</Text>
                {/* Password Controller */}
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            secureTextEntry={true}
                            style={styles.input}
                            placeholder="Password"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                        />
                    )}
                />
            </View>

            
            <Button onPress={handleSubmit(onSubmit)}>Sign In</Button>
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
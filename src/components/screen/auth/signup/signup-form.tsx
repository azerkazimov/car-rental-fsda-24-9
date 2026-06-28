import Button from "@/shared/ui/button";
import { Controller, useForm } from 'react-hook-form'
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from "expo-router";
import { SignupFormType, signupSchema } from "./signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignupForm() {
    const { control, handleSubmit, formState: { errors } } = useForm<SignupFormType>({
        resolver: zodResolver(signupSchema),
        defaultValues:{
            username: "",
            email: "",
            password: "",
            address: ""
        }
    })

    const onSubmit = async (data: SignupFormType) => {
        try {
            await AsyncStorage.setItem("user", JSON.stringify(data))
            Alert.alert(`Sign up successful ${data.username} ${data.email} ${data.password}`)
            router.replace("/signin/page")
        } catch (error) {
            console.error(error)
            Alert.alert("Failed to sign up")
        }
    }

    return (
        <View style={styles.formContainer}>

            {/* Username Form Item */}
            <View style={styles.formItem}>
                <Text style={styles.label}>Username</Text>
                {/* Username Controller */}
                <Controller
                    control={control}
                    name="username"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                        />
                    )}
                />
                {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}
            </View>

            {/* Email Form Item */}
            <View style={styles.formItem}>
                <Text style={styles.label}>Email</Text>
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
                {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
            </View>

            {/* Password Form Item */}
            <View style={styles.formItem}>
                <Text style={styles.label}>Password</Text>
                {/* Password Controller */}
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="********"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            secureTextEntry={true}
                        />
                    )}
                />
                {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
            </View>

            <View style={styles.formItem}>
                <Text style={styles.label}>Address</Text>
                {/* Adress Controller */}
                <Controller
                    control={control}
                    name="address"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Adress"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                        />
                    )}
                />
            </View>

            
            <Button onPress={handleSubmit(onSubmit)}>Sign Up</Button>
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
    error: {
        color: "red",
        fontSize: 12,
    },
})
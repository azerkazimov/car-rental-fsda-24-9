import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { personalInformationSchema, PersonalInformationType } from "./personal-information.schema";
import { layoutTheme } from "@/constants/theme";
import Button from "@/shared/ui/button";
import { useUserAvatar } from "@/store/user-avatar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useCallback, useEffect } from "react";

export default function PersonalInformationForm() {
    const { colorScheme } = useTheme()
    const styles = getStyles(colorScheme)
    const { avatar, setAvatar } = useUserAvatar()

    const { control, setValue, handleSubmit, formState: { errors } } = useForm<PersonalInformationType>({
        resolver: zodResolver(personalInformationSchema),
        defaultValues: {
            avatar: avatar || "",
            fullName: "",
            email: "",
            phone: "",
            address: "",
        }
    })

    const onSubmit = async (data: PersonalInformationType) => {
        if (data.avatar) setAvatar(data.avatar)
        await AsyncStorage.setItem('personal-information', JSON.stringify(data))

        Alert.alert('Success', 'Personal information updated successfully',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        router.push('/profile')
                    }
                }
            ]
        )


    }

    const getPersonalInformationData = useCallback(async () => {

        const personalInformation = JSON.parse(await AsyncStorage.getItem('personal-information') || "{}")

        if (personalInformation) {
            setValue('fullName', personalInformation.fullName)
            setValue('email', personalInformation.email)
            setValue('phone', personalInformation.phone)
            setValue('address', personalInformation.address)
        }

        if (avatar){
            setAvatar(avatar)
        } else if (personalInformation.avatar){
            setValue('avatar', personalInformation.avatar)
            setAvatar(personalInformation.avatar)
        }
    }, [setValue, avatar, setAvatar])

    useEffect(() => {
        getPersonalInformationData()
    }, [getPersonalInformationData])

    useEffect(() => {
        if (avatar) {
            setValue('avatar', avatar);
        }
    }, [avatar, setValue]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                {/* full name */}
                <View style={styles.formGroup}>
                    <Text style={styles.formLabel}> Full Name</Text>
                    <Controller
                        control={control}
                        name="fullName"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.formInput}
                                placeholder="Enter your full name"
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={value}
                            />
                        )}
                    />
                    {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}
                </View>

                {/* email */}
                <View style={styles.formGroup}>
                    <Text style={styles.formLabel}> Email</Text>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.formInput}
                                placeholder="Enter your email"
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={value}
                            />
                        )}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                </View>

                {/* phone */}
                <View style={styles.formGroup}>
                    <Text style={styles.formLabel}> Phone</Text>
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.formInput}
                                placeholder="Enter your phone number"
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={value}
                            />
                        )}
                    />
                    {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
                </View>

                {/* address */}
                <View style={styles.formGroup}>
                    <Text style={styles.formLabel}> Address</Text>
                    <Controller
                        control={control}
                        name="address"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.formInput}
                                placeholder="Enter your address"
                                onChangeText={onChange}
                                onBlur={onBlur}
                                value={value}
                            />
                        )}
                    />
                    {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
                </View>

                {/* submit button */}
                <Button onPress={handleSubmit(onSubmit)}>Submit</Button>
            </View>
        </SafeAreaView>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "light" ? "#fff" : "#121212",
        paddingVertical: 32,
    },
    form: {
        flex: 1,
        paddingHorizontal: 12,
        gap: 8,
    },
    formGroup: {
        gap: 2,
    },
    formLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: theme === "light" ? "#000" : "#fff",
        fontFamily: layoutTheme.fonts.hind.regular,
    },
    formInput: {
        backgroundColor: theme === "light" ? "#f0f0f0" : "#202020",
        padding: 10,
        paddingVertical: 16,
        borderRadius: 8,
        fontSize: 16,
        color: theme === "light" ? "#000" : "#fff",
        fontWeight: "500",
    },
    errorText: {
        color: theme === "light" ? "#f00" : "#fff",
        fontSize: 10,
        marginTop: 4,
    },
})
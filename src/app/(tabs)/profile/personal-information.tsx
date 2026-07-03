import Header from "@/components/shared/component-header"
import { useTheme } from "@/hooks/use-theme"
import { ThemeType } from "@/types/theme-types"
import { Ionicons } from "@expo/vector-icons"
import { Image } from "expo-image"
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import * as ImagePicker from "expo-image-picker"
import { useState } from "react"
import PersonalInformationForm from "@/components/screen/profile/personal-information.tsx/personal-information-form"
import { useUserAvatar } from "@/store/user-avatar"


export default function PersonalInformation() {
    const { colorScheme } = useTheme()
    const styles = getStyles(colorScheme)
    const { avatar, setAvatar } = useUserAvatar()

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
        console.log(permission);

        if (permission.granted === false) {
            Alert.alert("Permission denied", "You need to grant permission to access the camera")
            return
        }

        Alert.alert('Upload image', 'Choose an option',
            [
                {
                    text: 'Take a photo', onPress: async () => {
                        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync()
                        if (cameraPermission.granted === true) {
                            const result = await ImagePicker.launchCameraAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                allowsEditing: true,
                                aspect: [3, 4],
                                quality: 1,
                            })
                            if (!result.canceled) {
                                setAvatar(result.assets[0].uri)
                            }
                        }
                    }
                },
                {
                    text: 'Choose from library', onPress: async () => {
                        const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync()
                        if (libraryPermission.granted === true) {
                            const result = await ImagePicker.launchImageLibraryAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                allowsEditing: true,
                                aspect: [3, 4],
                                quality: 1,
                            })
                            if (!result.canceled) {
                                setAvatar(result.assets[0].uri)
                            }
                        }
                    }
                },
                { text: 'Cancel' }
            ]
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header>Personal Information</Header>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <View style={styles.profileImageContainer}>
                        <View style={styles.profileImageOverlay}>
                            <Image source={avatar ? { uri: avatar } : require("@/assets/images/profile.png")} style={styles.profileImage} />
                            <TouchableOpacity style={styles.profileImageButton} onPress={pickImage}>
                                <Ionicons name="camera" size={18} color={colorScheme === "light" ? "#666666" : "#fff"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <PersonalInformationForm />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === "light" ? "#fff" : "#121212"
    },
    scrollView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    profileImageContainer: {
        width: "100%",
        alignItems: "center",
    },
    profileImageOverlay: {
        position: "relative",
    },
    profileImageButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: theme === "light" ? "#f2f2fa" : "#666666",
        borderWidth: 1,
        borderColor: theme === "light" ? "#666666" : "#fff",
        borderRadius: "100%",
        padding: 14,
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: "100%",
    },
})
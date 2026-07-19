import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler behavior
export function configureNotificationHandler() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
        }),
    });
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.warn('Push notification permission not granted');
            return null;
        }

        // Configure Android notification channels first so local notifications can use them
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('booking-updates', {
                name: 'Booking Updates',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#0066FF',
                sound: 'default',
                enableVibrate: true,
                showBadge: true,
            });

            await Notifications.setNotificationChannelAsync('default', {
                name: 'Default Notifications',
                importance: Notifications.AndroidImportance.HIGH,
                sound: 'default',
            });
        }

        let token: string | null = null;
        const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;

        if (projectId) {
            const tokenData = await Notifications.getExpoPushTokenAsync({
                projectId,
            });
            token = tokenData.data;
            console.log('Push notification token:', token);
            await AsyncStorage.setItem('pushToken', token);
        } else {
            console.warn('EXPO_PUBLIC_FIREBASE_PROJECT_ID is missing; skipping Expo push token');
        }

        return token;

    } catch (error) {
        console.error("Error registering for push notifications:", error);
        return null;
    }
}
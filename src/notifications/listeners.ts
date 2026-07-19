import * as Notifications from 'expo-notifications';
import { Subscription } from 'expo-notifications';
import { router } from 'expo-router';

// Store subscription references
let notificationListener: Subscription | undefined;
let responseListener: Subscription | undefined;

export function setupNotificationListeners() {
    notificationListener = Notifications.addNotificationReceivedListener(notification => {
        console.log("Notification received:", notification);

        const { data } = notification.request.content;

        if (data?.type === 'booking_confirmed') {
            console.log('Booking confirmation notification received');
        }

    })

    responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification response received:', response);
        const { data } = response.notification.request.content;

        if (data?.type === 'booking_confirmed') {
            // Navigate to bookings or home screen
            if (data?.bookingId) {
                router.push('/(tabs)');
            }
        } else if (data?.screen) {
            // Navigate to specific screen if provided
            router.push(data.screen as any);
        }
    })
}



// Remove notification listeners (call this on component unmount)
export function removeNotificationListeners() {
    if (notificationListener) {
      notificationListener.remove();
      notificationListener = undefined;
    }
    
    if (responseListener) {
      responseListener.remove();
      responseListener = undefined;
    }
  }
  
  // Get all scheduled notifications
  export async function getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
  
  export async function getAllScheduledNotificationsAsync() {
    return Notifications.getAllScheduledNotificationsAsync();
  }
  
  // Cancel a specific notification
  export async function cancelNotification(notificationId: string) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
  
  // Cancel all notifications
  export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
  
  // Clear all delivered notifications from notification tray
  export async function clearAllDeliveredNotifications() {
    await Notifications.dismissAllNotificationsAsync();
  }
  
  // Get notification badges (iOS)
  export async function getBadgeCount() {
    return await Notifications.getBadgeCountAsync();
  }
  
  // Set notification badge (iOS)
  export async function setBadgeCount(count: number) {
    await Notifications.setBadgeCountAsync(count);
  }
  
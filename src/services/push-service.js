import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const HISTORY_KEY = "notification_history";
const BOOKING_CHANNEL_ID = "booking-updates";

/**
 * Send a local push notification immediately
 * @param {Object} params - Notification parameters
 * @param {string} params.title - Notification title
 * @param {string} params.body - Notification body
 * @param {Object} params.data - Notification data
 * @returns {Promise<string>} - Notification identifier
 */
export async function sendLocalNotification({ title, body, data = {} }) {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        vibrate: [0, 250, 250, 250],
        badge: 1,
        ...(Platform.OS === "android" ? { channelId: BOOKING_CHANNEL_ID } : {}),
      },
      trigger: null, // send immediately
    });

    await saveNotificationToHistory({
      identifier: notificationId,
      title,
      body,
      data,
    });

    console.log("Notification scheduled:", notificationId);
    return notificationId;
  } catch (error) {
    console.error("Error sending local notification:", error);
    throw error;
  }
}

/**
 * Schedule a notification for later
 * @param {Object} params - Notification parameters
 * @param {string} params.title - Notification title
 * @param {string} params.body - Notification body
 * @param {Object} params.data - Additional data
 * @param {number} params.seconds - Seconds from now to trigger
 * @returns {Promise<string>} - Notification identifier
 */
export async function scheduleNotification({
  title,
  body,
  data = {},
  seconds = 60,
}) {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        vibrate: [0, 250, 250, 250],
        badge: 1,
        ...(Platform.OS === "android" ? { channelId: BOOKING_CHANNEL_ID } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
      },
    });

    await saveNotificationToHistory({
      identifier: notificationId,
      title,
      body,
      data,
      scheduledFor: new Date(Date.now() + seconds * 1000).toISOString(),
    });

    console.log("Notification scheduled:", notificationId);
    return notificationId;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    throw error;
  }
}

/**
 * Send booking confirmation notification
 * @param {Object} bookingDetails - Booking information
 * @param {string} bookingDetails.carBrand - Car brand name
 * @param {string} bookingDetails.carModel - Car model name
 * @param {number} bookingDetails.rentalDays - Number of rental days
 * @param {number} bookingDetails.totalPrice - Total booking price
 * @param {string} bookingDetails.bookingId - Unique booking ID
 * @returns {Promise<string>} - Notification identifier
 */
export async function sendBookingConfirmationNotification(bookingDetails) {
  try {
    const { carBrand, carModel, rentalDays, totalPrice, bookingId } =
      bookingDetails;

    const title = "Booking Confirmed";
    const body = `Your ${carBrand} ${carModel} is booked for ${rentalDays} ${
      rentalDays === 1 ? "day" : "days"
    }. Total: $${totalPrice.toFixed(2)}`;

    const data = {
      type: "booking_confirmed",
      bookingId,
      carBrand,
      carModel,
      rentalDays,
      totalPrice,
      timestamp: new Date().toISOString(),
    };

    return await sendLocalNotification({ title, body, data });
  } catch (error) {
    console.error("Error sending booking confirmation notification:", error);
    throw error;
  }
}

/**
 * Send booking reminder notification
 * @param {Object} reminderDetails - Reminder parameters
 * @param {string} reminderDetails.carBrand - Car brand name
 * @param {string} reminderDetails.carModel - Car model name
 * @param {number} reminderDetails.hoursUntilPickup - Hours until pickup time
 * @returns {Promise<string>} - Notification identifier
 */
export async function sendBookingReminderNotification(reminderDetails) {
  const { carBrand, carModel, hoursUntilPickup } = reminderDetails;

  const title = "Pickup Reminder";
  const body = `Your ${carBrand} ${carModel} pickup is in ${hoursUntilPickup} hours. Don't forget to bring your driving license!`;

  const data = {
    type: "booking_reminder",
    carBrand,
    carModel,
    hoursUntilPickup,
  };

  // Schedule for 2 hours before pickup when possible
  const seconds = Math.max(0, (hoursUntilPickup - 2) * 3600);

  return await scheduleNotification({ title, body, data, seconds });
}

/**
 * Save notification history to AsyncStorage
 * @param {Object} notification - Notification data to save
 */
export async function saveNotificationToHistory(notification) {
  try {
    const existingHistory = await AsyncStorage.getItem(HISTORY_KEY);
    const history = existingHistory ? JSON.parse(existingHistory) : [];

    history.unshift({
      ...notification,
      receivedAt: new Date().toISOString(),
    });

    const trimmedHistory = history.slice(0, 50);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error("Error saving notification to history:", error);
  }
}

/**
 * Get notification history
 * @returns {Promise<Array>} - Array of notifications
 */
export async function getNotificationHistory() {
  try {
    const history = await AsyncStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error getting notification history:", error);
    return [];
  }
}

/**
 * Clear notification history
 */
export async function clearNotificationHistory() {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing notification history:", error);
  }
}

/**
 * Build Expo push API payload for remote delivery
 * @param {Object} bookingDetails
 * @returns {Promise<Object>}
 */
export async function getServerNotificationPayload(bookingDetails) {
  try {
    const {
      carBrand,
      carModel,
      rentalDays,
      totalPrice,
      bookingId,
      pushToken,
    } = bookingDetails;

    return {
      to: pushToken,
      sound: "default",
      title: "Booking Confirmed",
      body: `Your ${carBrand} ${carModel} is booked for ${rentalDays} ${
        rentalDays === 1 ? "day" : "days"
      }. Total: $${totalPrice}`,
      data: {
        type: "booking_confirmed",
        bookingId,
        carBrand,
        carModel,
        rentalDays,
        totalPrice,
        timestamp: new Date().toISOString(),
      },
      priority: "high",
      channelId: BOOKING_CHANNEL_ID,
    };
  } catch (error) {
    console.error("Error getting server notification payload:", error);
    throw error;
  }
}

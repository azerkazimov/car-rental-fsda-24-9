import { layoutTheme } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import {
  clearNotificationHistory,
  getNotificationHistory,
} from "@/services/push-service";
import { ThemeType } from "@/types/theme-types";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface NotificationData {
  type?: string;
  bookingId?: string;
  carBrand?: string;
  carModel?: string;
  rentalDays?: number;
  totalPrice?: number;
  timestamp?: string;
}

interface NotificationItem {
  identifier: string;
  title: string;
  body: string;
  data: NotificationData;
  receivedAt?: string;
  scheduledFor?: string;
}

function formatRelativeTime(isoDate?: string) {
  if (!isoDate) return "";

  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getNotificationIcon(type?: string): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case "booking_confirmed":
      return "checkmark-circle";
    case "booking_reminder":
      return "alarm";
    default:
      return "notifications";
  }
}

export default function Notification() {
  const { colorScheme } = useTheme();
  const styles = getStyles(colorScheme);
  const isLight = colorScheme === "light";
  const { primary, secondary } = layoutTheme.colors;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (refreshing = false) => {
    try {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const history = await getNotificationHistory();
      const normalized: NotificationItem[] = (history ?? []).map(
        (item: NotificationItem & { id?: string }) => ({
          identifier: item.identifier ?? item.id ?? `${Date.now()}`,
          title: item.title ?? "Notification",
          body: item.body ?? "",
          data: item.data ?? {},
          receivedAt: item.receivedAt,
          scheduledFor: item.scheduledFor,
        }),
      );

      setNotifications(normalized);
    } catch (err) {
      console.error("Error fetching notification history:", err);
      setError("Couldn't load notifications.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications]),
  );

  const handleClear = async () => {
    await clearNotificationHistory();
    setNotifications([]);
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons
          name={getNotificationIcon(item.data?.type)}
          size={22}
          color={isLight ? secondary.colorSecondaryBg : primary.colorPrimaryText}
        />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.timestamp}>
            {formatRelativeTime(item.receivedAt)}
          </Text>
        </View>
        <Text style={styles.cardBody} numberOfLines={3}>
          {item.body}
        </Text>
        {item.data?.carBrand && item.data?.carModel ? (
          <Text style={styles.meta}>
            {item.data.carBrand} {item.data.carModel}
            {item.data.rentalDays
              ? ` · ${item.data.rentalDays} day${item.data.rentalDays === 1 ? "" : "s"}`
              : ""}
          </Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.length > 0 ? (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.clearButtonPlaceholder} />
        )}
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator
            size="large"
            color={isLight ? primary.colorPrimary : secondary.colorSecondaryBg}
          />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchNotifications()}
          >
            <Text style={styles.retryButtonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.identifier}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            notifications.length === 0 && styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchNotifications(true)}
              tintColor={isLight ? primary.colorPrimary : secondary.colorSecondaryBg}
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <View style={styles.emptyIconWrap}>
                <Ionicons
                  name="notifications-outline"
                  size={36}
                  color={isLight ? secondary.colorSecondary : primary.colorPrimaryBg}
                />
              </View>
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptySubtitle}>
                Booking confirmations will show up here after you confirm a rental.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const getStyles = (theme: ThemeType) => {
  const isLight = theme === "light";
  const { primary, secondary } = layoutTheme.colors;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isLight
        ? secondary.colorSecondaryBgHover
        : primary.colorPrimaryActive,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: layoutTheme.fonts.hind.bold,
      color: isLight ? primary.colorPrimaryText : secondary.colorSecondaryBg,
    },
    clearButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    clearButtonPlaceholder: {
      width: 48,
    },
    clearButtonText: {
      fontSize: 14,
      fontFamily: layoutTheme.fonts.hind.medium,
      color: isLight ? primary.colorPrimary : secondary.colorSecondaryBg,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 120,
      gap: 12,
    },
    emptyListContent: {
      flexGrow: 1,
    },
    card: {
      flexDirection: "row",
      gap: 14,
      backgroundColor: isLight ? secondary.colorSecondaryBg : primary.colorPrimary,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: isLight
        ? secondary.colorSecondaryBorder
        : primary.colorPrimaryBorder,
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isLight ? primary.colorPrimary : secondary.colorSecondaryBg,
    },
    cardContent: {
      flex: 1,
      gap: 4,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    },
    cardTitle: {
      flex: 1,
      fontSize: 16,
      fontFamily: layoutTheme.fonts.hind.semiBold,
      color: isLight ? primary.colorPrimaryText : secondary.colorSecondaryBg,
    },
    timestamp: {
      fontSize: 12,
      fontFamily: layoutTheme.fonts.hind.regular,
      color: isLight ? secondary.colorSecondary : primary.colorPrimaryBg,
    },
    cardBody: {
      fontSize: 14,
      lineHeight: 20,
      fontFamily: layoutTheme.fonts.hind.regular,
      color: isLight ? secondary.colorSecondary : primary.colorPrimaryBg,
    },
    meta: {
      marginTop: 4,
      fontSize: 12,
      fontFamily: layoutTheme.fonts.hind.medium,
      color: isLight ? primary.colorPrimary : secondary.colorSecondaryBg,
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      gap: 10,
    },
    emptyIconWrap: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isLight ? secondary.colorSecondaryBg : primary.colorPrimary,
      marginBottom: 8,
    },
    emptyTitle: {
      fontSize: 18,
      fontFamily: layoutTheme.fonts.hind.semiBold,
      color: isLight ? primary.colorPrimaryText : secondary.colorSecondaryBg,
      textAlign: "center",
    },
    emptySubtitle: {
      fontSize: 14,
      lineHeight: 20,
      fontFamily: layoutTheme.fonts.hind.regular,
      color: isLight ? secondary.colorSecondary : primary.colorPrimaryBg,
      textAlign: "center",
    },
    retryButton: {
      marginTop: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: isLight ? primary.colorPrimary : secondary.colorSecondaryBg,
    },
    retryButtonText: {
      fontSize: 14,
      fontFamily: layoutTheme.fonts.hind.semiBold,
      color: isLight ? secondary.colorSecondaryBg : primary.colorPrimaryText,
    },
  });
};

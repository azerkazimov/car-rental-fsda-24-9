import { layoutTheme } from "@/constants/theme";
import { carModels } from "@/data/car-models";
import { useTheme } from "@/hooks/use-theme";
import { useBookingStore } from "@/store/use-booking";
import { ThemeType } from "@/types/theme-types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";

type MarkedDates = Record<
    string,
    {
        startingDay?: boolean;
        endingDay?: boolean;
        color: string;
        textColor: string;
    }
>;

function formatDisplayDate(dateString: string | null) {
    if (!dateString) return "Select date";
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

function getDaysCount(startDate: string, endDate: string) {
    const start = new Date(`${startDate}T12:00:00`);
    const end = new Date(`${endDate}T12:00:00`);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
}

export default function RangeCalendar() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const isLight = colorScheme === "light";
    const { primary, secondary } = layoutTheme.colors;

    const today = new Date().toISOString().split("T")[0];

    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const { setBookingStartDate, setBookingEndDate, setBookingDays } = useBookingStore();

    const car = carModels.find((car) => car.id === id);

    const rangeColor = isLight ? primary.colorPrimary : primary.colorPrimaryHover;
    const rangeMidColor = isLight ? primary.colorPrimaryBg : primary.colorPrimaryBorder;
    const rangeTextColor = "#FFFFFF";
    const midTextColor = isLight ? primary.colorPrimaryText : secondary.colorSecondaryBg;

    const onDayPress = (day: DateData) => {
        const selectedDate = day.dateString;

        if (selectedDate < today) return;

        if (!startDate || (startDate && endDate)) {
            setStartDate(selectedDate);
            setBookingStartDate(selectedDate);
            setEndDate(null);
            setBookingEndDate(null);
            setBookingDays(null);
            return;
        }

        if (selectedDate < startDate) {
            setStartDate(selectedDate);
            setBookingStartDate(selectedDate);
            setEndDate(null);
            setBookingEndDate(null);
            setBookingDays(null);
            return;
        }

        setEndDate(selectedDate);
        setBookingEndDate(selectedDate);
        setBookingDays(getDaysCount(startDate, selectedDate));
    };

    const markedDates = useMemo(() => {
        if (!startDate) return {};

        const marked: MarkedDates = {};

        if (!endDate) {
            marked[startDate] = {
                startingDay: true,
                endingDay: true,
                color: rangeColor,
                textColor: rangeTextColor,
            };
            return marked;
        }

        let currentDate = new Date(`${startDate}T12:00:00`);
        const lastDate = new Date(`${endDate}T12:00:00`);

        while (currentDate <= lastDate) {
            const dateString = currentDate.toISOString().split("T")[0];
            const isStart = dateString === startDate;
            const isEnd = dateString === endDate;

            marked[dateString] = {
                startingDay: isStart,
                endingDay: isEnd,
                color: isStart || isEnd ? rangeColor : rangeMidColor,
                textColor: isStart || isEnd ? rangeTextColor : midTextColor,
            };

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return marked;
    }, [startDate, endDate, rangeColor, rangeMidColor, midTextColor, rangeTextColor]);

    const days = startDate && endDate ? getDaysCount(startDate, endDate) : 0;
    const canContinue = Boolean(startDate && endDate);
    const hintText = !startDate
        ? "Tap a date to set your pickup"
        : !endDate
            ? "Now choose your return date"
            : `${days} day${days === 1 ? "" : "s"} selected`;

    if (!car) {
        return <Text>Car not found</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.hero}>
                <Text style={styles.eyebrow}>Rental period</Text>
                <Text style={styles.title}>Select your dates for {car.brand} {car.model}</Text>
                <Text style={styles.subtitle}>{hintText}</Text>
            </View>

            <View style={styles.dateRow}>
                <View style={[styles.dateCard, startDate && styles.dateCardActive]}>
                    <View style={styles.dateIconWrap}>
                        <Ionicons
                            name="calendar-outline"
                            size={16}
                            color={isLight ? primary.colorPrimary : secondary.colorSecondaryBg}
                        />
                    </View>
                    <Text style={styles.dateLabel}>Pickup</Text>
                    <Text style={styles.dateValue}>{formatDisplayDate(startDate)}</Text>
                </View>

                <View style={styles.dateDivider}>
                    <Ionicons
                        name="arrow-forward"
                        size={16}
                        color={isLight ? secondary.colorSecondary : primary.colorPrimaryBg}
                    />
                </View>

                <View style={[styles.dateCard, endDate && styles.dateCardActive]}>
                    <View style={styles.dateIconWrap}>
                        <Ionicons
                            name="flag-outline"
                            size={16}
                            color={isLight ? primary.colorPrimary : secondary.colorSecondaryBg}
                        />
                    </View>
                    <Text style={styles.dateLabel}>Return</Text>
                    <Text style={styles.dateValue}>{formatDisplayDate(endDate)}</Text>
                </View>
            </View>

            <View style={styles.calendarCard}>
                <Calendar
                    style={styles.calendar}
                    markingType="period"
                    markedDates={markedDates}
                    onDayPress={onDayPress}
                    minDate={today}
                    enableSwipeMonths
                    theme={{
                        backgroundColor: "transparent",
                        calendarBackground: "transparent",
                        textSectionTitleColor: isLight
                            ? secondary.colorSecondary
                            : primary.colorPrimaryBg,
                        selectedDayBackgroundColor: rangeColor,
                        selectedDayTextColor: rangeTextColor,
                        todayTextColor: rangeColor,
                        dayTextColor: isLight
                            ? primary.colorPrimaryText
                            : secondary.colorSecondaryBg,
                        textDisabledColor: isLight
                            ? secondary.colorSecondaryBorder
                            : primary.colorPrimaryBorder,
                        arrowColor: rangeColor,
                        monthTextColor: isLight
                            ? primary.colorPrimaryText
                            : secondary.colorSecondaryBg,
                        textDayFontFamily: layoutTheme.fonts.hind.medium,
                        textMonthFontFamily: layoutTheme.fonts.hind.semiBold,
                        textDayHeaderFontFamily: layoutTheme.fonts.hind.medium,
                        textDayFontSize: 15,
                        textMonthFontSize: 18,
                        textDayHeaderFontSize: 12,
                    }}
                />
            </View>

            <View style={styles.footer}>
                {canContinue && (
                    <View style={styles.summary}>
                        <Text style={styles.summaryLabel}>Duration</Text>
                        <Text style={styles.summaryValue}>
                            {days} day{days === 1 ? "" : "s"}
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.cta, !canContinue && styles.ctaDisabled]}
                    disabled={!canContinue}
                    activeOpacity={0.85}
                    onPress={() => {
                        if (!canContinue) return;
                        router.push(`/booking/${id}/page`);
                    }}
                >
                    <Text style={styles.ctaText}>
                        {canContinue ? "Continue to booking" : "Select return date"}
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const getStyles = (theme: ThemeType) => {
    const isLight = theme === "light";
    const { primary, secondary } = layoutTheme.colors;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isLight ? "#F4F6F7" : primary.colorPrimaryActive,
            paddingHorizontal: 20,
            paddingTop: 8,
        },
        hero: {
            marginBottom: 20,
        },
        eyebrow: {
            fontSize: 12,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            fontFamily: layoutTheme.fonts.hind.medium,
            color: isLight ? secondary.colorSecondary : primary.colorPrimaryBg,
            marginBottom: 6,
        },
        title: {
            fontSize: 28,
            fontFamily: layoutTheme.fonts.iceberg.regular,
            color: isLight ? primary.colorPrimaryText : secondary.colorSecondaryBg,
            marginBottom: 6,
        },
        subtitle: {
            fontSize: 15,
            fontFamily: layoutTheme.fonts.hind.regular,
            color: isLight ? secondary.colorSecondary : primary.colorPrimaryBg,
        },
        dateRow: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 18,
            gap: 8,
        },
        dateCard: {
            flex: 1,
            backgroundColor: isLight ? "#FFFFFF" : primary.colorPrimary,
            borderRadius: 16,
            padding: 14,
            borderWidth: 1,
            borderColor: isLight ? secondary.colorSecondaryBorder : primary.colorPrimaryBorder,
        },
        dateCardActive: {
            borderColor: isLight ? primary.colorPrimary : primary.colorPrimaryHover,
            backgroundColor: isLight ? "#FFFFFF" : primary.colorPrimaryHover,
        },
        dateIconWrap: {
            width: 28,
            height: 28,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isLight ? secondary.colorSecondaryBg : primary.colorPrimaryActive,
            marginBottom: 10,
        },
        dateLabel: {
            fontSize: 12,
            fontFamily: layoutTheme.fonts.hind.medium,
            color: isLight ? secondary.colorSecondary : primary.colorPrimaryBg,
            marginBottom: 2,
        },
        dateValue: {
            fontSize: 15,
            fontFamily: layoutTheme.fonts.hind.semiBold,
            color: isLight ? primary.colorPrimaryText : secondary.colorSecondaryBg,
        },
        dateDivider: {
            width: 28,
            height: 28,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isLight ? secondary.colorSecondaryBg : primary.colorPrimary,
        },
        calendarCard: {
            backgroundColor: isLight ? "#FFFFFF" : primary.colorPrimary,
            borderRadius: 20,
            paddingVertical: 8,
            paddingHorizontal: 4,
            borderWidth: 1,
            borderColor: isLight ? secondary.colorSecondaryBorder : primary.colorPrimaryBorder,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isLight ? 0.06 : 0.25,
            shadowRadius: 16,
            elevation: 3,
        },
        calendar: {
            borderRadius: 20,
        },
        footer: {
            marginTop: "auto",
            paddingTop: 20,
            paddingBottom: 12,
            gap: 14,
        },
        summary: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 4,
        },
        summaryLabel: {
            fontSize: 14,
            fontFamily: layoutTheme.fonts.hind.regular,
            color: isLight ? secondary.colorSecondary : primary.colorPrimaryBg,
        },
        summaryValue: {
            fontSize: 16,
            fontFamily: layoutTheme.fonts.hind.semiBold,
            color: isLight ? primary.colorPrimaryText : secondary.colorSecondaryBg,
        },
        cta: {
            backgroundColor: isLight ? primary.colorPrimary : primary.colorPrimaryHover,
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
        },
        ctaDisabled: {
            opacity: 0.45,
        },
        ctaText: {
            color: "#FFFFFF",
            fontSize: 16,
            fontFamily: layoutTheme.fonts.hind.semiBold,
        },
    });
};

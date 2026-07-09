import { layoutTheme } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { bookingFormSchema, BookingFormSchema } from "./booking-form.schema";


export default function BookingForm() {
    const { colorScheme } = useTheme();
    const styles = getStyles(colorScheme);
    const placeholderColor = colorScheme === "light"
        ? layoutTheme.colors.secondary.colorSecondary
        : layoutTheme.colors.primary.colorPrimaryBorder;



    const { control, handleSubmit, formState: { errors } } = useForm<BookingFormSchema>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            cardNumber: "",
            cardHolderName: "",
            cardExpirationDate: "",
            cardCvv: "",
        }
    });

    const formatHolderName = (text: string) => {
        const cleaned = text.replace(/[^a-zA-Z\s]/g, "")
        return cleaned.toUpperCase();
    }

    const formatCardNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, "")
        return cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    }

    const formatExpirationDate = (text: string) => {} // MM/YY

    const formatCvv = (text: string) => {} // 3 digits

    const onSubmit = (data: BookingFormSchema) => {
        console.log("Form Submitted:", data);
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Payment Details</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Cardholder Name</Text>
                <Controller
                    control={control}
                    name="cardHolderName"
                    render={({ field }) => (
                        <TextInput
                            style={[styles.input, errors.cardHolderName && styles.inputError]}
                            placeholder="John Doe"
                            placeholderTextColor={placeholderColor}
                            value={field.value}
                            onChangeText={(text) => {
                                const formatted = formatHolderName(text);
                                field.onChange(formatted);
                            }}
                            autoCapitalize="words"
                        />
                    )}
                />
                {errors.cardHolderName && <Text style={styles.errorText}>{errors.cardHolderName.message}</Text>}
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Card Number</Text>
                <Controller
                    control={control}
                    name="cardNumber"
                    render={({ field}) => (
                        <TextInput
                            style={[styles.input, errors.cardNumber && styles.inputError]}
                            placeholder="0000 0000 0000 0000"
                            placeholderTextColor={placeholderColor}
                            value={field.value}
                            onChangeText={(text) => {
                                const formatted = formatCardNumber(text);
                                field.onChange(formatted);
                            }}
                            keyboardType="numeric"
                            maxLength={19}
                        />
                    )}
                />
                {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber.message}</Text>}
            </View>

            <View style={styles.row}>
                <View style={[styles.inputContainer, styles.flex1, styles.rowGap]}>
                    <Text style={styles.label}>Expiry Date</Text>
                    <Controller
                        control={control}
                        name="cardExpirationDate"
                        render={({ field }) => (
                            <TextInput
                                style={[styles.input, errors.cardExpirationDate && styles.inputError]}
                                placeholder="MM/YY"
                                placeholderTextColor={placeholderColor}
                                value={field.value}
                                onChangeText={field.onChange}
                                keyboardType="numeric"
                                maxLength={5}
                            />
                        )}
                    />
                    {errors.cardExpirationDate && <Text style={styles.errorText}>{errors.cardExpirationDate.message}</Text>}
                </View>

                <View style={[styles.inputContainer, styles.flex1]}>
                    <Text style={styles.label}>CVV</Text>
                    <Controller
                        control={control}
                        name="cardCvv"
                        render={({ field }) => (
                            <TextInput
                                style={[styles.input, errors.cardCvv && styles.inputError]}
                                placeholder="123"
                                placeholderTextColor={placeholderColor}
                                value={field.value}
                                onChangeText={field.onChange}
                                keyboardType="numeric"
                                secureTextEntry
                                maxLength={3}
                            />
                        )}
                    />
                    {errors.cardCvv && <Text style={styles.errorText}>{errors.cardCvv.message}</Text>}
                </View>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.submitButtonText}>Confirm & Pay</Text>
            </TouchableOpacity>
        </View>
    );
}

const getStyles = (theme: ThemeType) => {
    const isLight = theme === "light";
    const { primary, secondary } = layoutTheme.colors;

    return StyleSheet.create({
        formContainer: {
            padding: 20,
            backgroundColor: isLight ? secondary.colorSecondaryBg : primary.colorPrimary,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: isLight ? secondary.colorSecondaryBorder : primary.colorPrimaryBorder,
        },
        sectionTitle: {
            fontSize: 18,
            fontFamily: layoutTheme.fonts.hind.semiBold,
            color: isLight ? primary.colorPrimaryText : secondary.colorSecondaryBg,
            marginBottom: 20,
        },
        inputContainer: {
            marginBottom: 16,
        },
        label: {
            fontSize: 14,
            fontFamily: layoutTheme.fonts.hind.medium,
            color: isLight ? secondary.colorSecondary : primary.colorPrimaryBg,
            marginBottom: 6,
        },
        input: {
            backgroundColor: isLight ? secondary.colorSecondaryBg : primary.colorPrimaryHover,
            color: isLight ? primary.colorPrimaryText : secondary.colorSecondaryBg,
            fontSize: 16,
            fontFamily: layoutTheme.fonts.hind.regular,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: isLight ? secondary.colorSecondaryBorder : primary.colorPrimaryBorder,
        },
        inputError: {
            borderColor: primary.colorPrimaryActive,
        },
        errorText: {
            color: primary.colorPrimaryActive,
            fontSize: 12,
            fontFamily: layoutTheme.fonts.hind.medium,
            marginTop: 4,
        },
        row: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        rowGap: {
            marginRight: 12,
        },
        flex1: {
            flex: 1,
        },
        submitButton: {
            backgroundColor: theme === "light" ? primary.colorPrimary : secondary.colorSecondaryBg,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            marginTop: 8,
        },
        submitButtonText: {
            color: theme === "light" ? secondary.colorSecondaryBg : primary.colorPrimaryText,
            fontSize: 16,
            fontFamily: layoutTheme.fonts.hind.semiBold,
        },
    });
};

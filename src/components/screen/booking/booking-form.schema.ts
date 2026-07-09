import { z } from "zod";

export const bookingFormSchema = z.object({
    cardNumber: z.string().min(16).max(19),
    cardHolderName: z.string().min(1),
    cardExpirationDate: z.string().min(1),
    cardCvv: z.string().min(1).max(3),
})

export type BookingFormSchema = z.infer<typeof bookingFormSchema>
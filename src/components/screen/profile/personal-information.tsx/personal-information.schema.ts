import { z } from "zod";

export const personalInformationSchema = z.object({
    avatar: z.string().optional(),
    fullName: z.string().min(1, { message: "Full name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(1, { message: "Phone number is required" }),
    address: z.string().min(1, { message: "Address is required" }),
})

export type PersonalInformationType = z.infer<typeof personalInformationSchema>;
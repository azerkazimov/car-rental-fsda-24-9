import { z } from 'zod';

export const signupSchema = z.object({
    username: z.string().min(3, "Username is required"),
    email: z.string().email("Email is required"),
    password: z.string().min(8, "Password is required"),
    address: z.string().optional(),

})

export type SignupFormType = z.infer<typeof signupSchema>;
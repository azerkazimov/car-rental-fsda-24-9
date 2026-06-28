import { z } from 'zod';

export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export type SigninFormType = z.infer<typeof signinSchema>;

// z.infer<typeof signinSchema>; avtomatik olaraq email ve password tipini tapir
// export type Sigin ={
//     email: string;
//     password: string;
// }
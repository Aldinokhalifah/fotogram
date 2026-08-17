import * as z from "zod";

export const RegisterSchema = z.object({
    name: z.string({ error: "Name is required" }).min(3, { error: "Name must be at least 3 character"}),
    email: z.email({ error: "Email must be a valid email address" }),
    username: z.string().min(3, { error: "Username must be at least 3 characters" }),
    password: z.string().min(8, { error: "Password must be at least 8 characters" }),
});
export type RegisterInput  = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
    email: z.email({ error: "Email must be a valid email address" }),
    password: z.string().min(8, { error: "Password must be at least 8 characters" }),
});
export type LogiInput = z.infer<typeof LoginSchema>;
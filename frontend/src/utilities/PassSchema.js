import z from 'zod'


export const PasswordSchema = z
  .object({
    currentPassword: z.string().min(4, { message: "Current password is required" }),
    newPassword: z
    .string()
    .min(8, { message: "New password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Must include at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Must include at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Must include at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Must include at least one special character" }),
    confirmNewPassword: z.string().min(4, { message: "Please confirm your new password" }),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
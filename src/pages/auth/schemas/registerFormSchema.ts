
import { z } from "zod";

const RegisterFormSchema = z.object({
  name: z.string().min(2, "Имя должно содержать не менее 2 символов"),
  email: z.string().email("Введите корректный email адрес"),
  password: z
    .string()
    .min(6, "Пароль должен содержать не менее 6 символов"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export default RegisterFormSchema;

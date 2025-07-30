import * as zod from "zod";
/**
 * @title Update user Zod Schema
 * @dev This schema is used to validate the Update user form and infer the type of the form data.
 */
export const UpdateUserSchema = zod.object({
  name: zod.string().optional(),
  email: zod.string().email("Email inválido.").optional(),
  title: zod.string().optional(),
  lattes: zod.string().optional(),
  newPassword: zod.string().min(8, "Senha deve ter no mínimo 8 caracteres.").optional(),
  currentPassword: zod.string().optional(),
});

/**
 * @title Update user Props
 * @dev This type is used to infer the type of the form data.
 */
export type UpdateUserProps = zod.infer<typeof UpdateUserSchema>;

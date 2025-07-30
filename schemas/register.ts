import * as zod from "zod";
/**
 * @title Register Zod Schema
 * @dev This schema is used to validate the Register form and infer the type of the form data.
 */
export const RegisterSchema = zod.object({
  name: zod.string().min(3, "Name must be at least 3 characters long."),
  email: zod.string().email("Invalid email.").min(5, "Email must be at least 5 characters long."),
  password: zod.string().min(8, "Password must be at least 8 characters long."),
  wallet_address: zod.string().min(42, "Wallet address must be at least 42 characters long.").nullable(),
});

/**
 * @title Register Props
 * @dev This type is used to infer the type of the form data.
 */
export type RegisterProps = zod.infer<typeof RegisterSchema>;

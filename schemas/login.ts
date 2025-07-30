import * as zod from 'zod';
/**
 * @title Login Zod Schema
 * @dev This schema is used to validate the login form and infer the type of the form data.
 */
export const LoginSchema = zod.object({
  email: zod.string().email('Invalid email.').min(5, 'Email must be at least 3 characters.'),
  password: zod.string().min(8, 'Password must be at least 8 characters.'),
});

/**
 * @title Login Props
 * @dev This type is used to infer the type of the form data.
 */
export type LoginProps = zod.infer<typeof LoginSchema>;

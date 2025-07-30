import { z } from 'zod';

export const recoveryPasswordRequestService = async (email: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/recovery-password`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      email,
    }),
  });

  if (response.status === 200) {
    return {
      success: true,
      message: 'Recovery request successfully',
    };
  }

  const responseData = await response.json();
  const message = responseData.message ?? 'Error in recovery password.';

  return {
    success: false,
    message: message,
  };
};

export const validateRecoveryPasswordRequesService = async ({
  email,
  confirmationCode,
}: ValidateRecoveryPasswordProps) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/validate-code`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      email,
      confirmationCode,
    }),
  });

  if (response.status === 200) {
    return {
      success: true,
      message: 'Recovery request successfully',
    };
  }

  const responseData = await response.json();
  const message = responseData.message ?? 'Error in recovery password.';

  return {
    success: false,
    message: message,
  };
};

export const confirmRecoveryPasswordRequestService = async (data: ConfirmRecoveryPasswordProps) => {
  if (data.newPassword !== data.confirmPassword) {
    return {
      success: false,
      message: "Passwords don't match",
    };
  }
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/reset-password`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.status === 200) {
    return {
      success: true,
      message: 'Password reset successful',
    };
  }

  const responseData = await response.json();
  const message = responseData.message ?? 'Password reset failed.';

  return {
    success: false,
    message: message,
  };
};

export type ValidateRecoveryPasswordProps = {
  email: string;
  confirmationCode: string;
};

export type ConfirmRecoveryPasswordProps = {
  newPassword: string;
  email: string;
  confirmationCode: string;
  confirmPassword: string;
};

export const ConfirmRecoveryPasswordSchema = z
  .object({
    newPassword: z.string(),
    email: z
      .string()
      .email('Invalid email.')
      .min(5, 'If this e-mail is already registered, you will recieve a message in your inbox.'),
    confirmationCode: z.string().min(7, 'Confirmation code must be at least 5 characters.'),
    confirmPassword: z.string().min(8, 'Password must be at lea st 8 characters.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

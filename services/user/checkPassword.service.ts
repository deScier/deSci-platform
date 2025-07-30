import { getSession } from 'next-auth/react';

export const checkPasswordService = async (data: CheckPasswordRequestProps) => {
  const session = await getSession();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/check-password`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${session?.user?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (response.status === 200) {
    return {
      success: true,
      message: 'Password validate',
    };
  }

  const responseData = await response.json();

  const message = responseData.message || 'Invalid password';

  return {
    success: false,
    message,
  };
};

export type CheckPasswordRequestProps = {
  password: string;
};

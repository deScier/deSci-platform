export const verifyEmailService = async (data: VerifyEmailRequestProps): Promise<boolean> => {
  const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/check-email`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data),
  });

  const response = (await request.json()) as { status: number; message: string };

  if (response.status === 200) {
    return true;
  }

  return false;
};

export type VerifyEmailRequestProps = {
  email: string;
};

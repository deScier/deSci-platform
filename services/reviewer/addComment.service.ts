import { getSession } from 'next-auth/react';

export const addCommentService = async (data: AddCommentProps) => {
  const session = await getSession();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviewer/comment`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${session?.user?.token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (response.status === 201) {
    return {
      success: true,
      message: 'Added comment successfully',
    };
  }

  const message = responseData.message ?? 'Error in add comment.';

  return {
    success: false,
    message: message,
  };
};

type AddCommentProps = {
  documentId: string;
  comment: string;
};

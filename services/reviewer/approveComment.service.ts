import { getSession } from 'next-auth/react';

export const approveCommentService = async (data: ApproveCommentProps) => {
  const session = await getSession();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviewer/approve-comment`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${session?.user?.token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (response.status === 200) {
    return {
      success: true,
      message: 'Updated comment successfully',
    };
  }

  const message = responseData.message ?? 'Error in update comment.';

  return {
    success: false,
    message: message,
  };
};

type ApproveCommentProps = {
  commentId: string;
  approvedStatus: ApproveStatus;
  answer?: string;
};

export type ApproveStatus = 'APPROVED' | 'REJECTED';

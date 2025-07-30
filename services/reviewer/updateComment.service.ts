import { getSession } from "next-auth/react";

export const updateCommentService = async (data: UpdateCommentProps) => {
  const session = await getSession();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviewer/comment`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${session?.user?.token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (response.status === 200) {
    return {
      success: true,
      message: "Updated comment successfully",
    };
  }

  const message = responseData.message ?? "Error in update comment.";

  return {
    success: false,
    message: message,
  };
};

type UpdateCommentProps = {
  commentId: string;
  comment: string;
};

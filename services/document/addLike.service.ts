import { getSession } from "next-auth/react";

export const addLikeService = async (documentId: string) => {
  const session = await getSession();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/like`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${session?.user?.token}`,
    },
    body: JSON.stringify({
      documentId,
    }),
  });

  const responseData = await response.json();

  if (response.status === 200) {
    return {
      success: true,
      message: "Submitted like successfully",
    };
  }

  const message = responseData.message ?? "Error in submit like.";

  return {
    success: false,
    message: message,
  };
};

import { getSession } from "next-auth/react";

export const updateInviteStatusService = async (data: UpdateInviteStatusProps) => {
  const session = await getSession();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviewer`, {
    method: "PUT",
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
      message: "Invite update successfully",
    };
  }

  const message = responseData.message ?? "Error in update invite status.";

  return {
    success: false,
    message: message,
  };
};

type UpdateInviteStatusProps = {
  title: string;
  role: string;
  inviteStatus: "ACCEPTED" | "REJECTED";
  inviteCode: string;
};

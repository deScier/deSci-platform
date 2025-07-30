import { getSession } from "next-auth/react";

export const updateUserService = async (data: UpdateUserRequestProps) => {
  const session = await getSession();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${session?.user?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (response.status === 200) {
    return {
      success: true,
      message: "Updated user successfully",
    };
  }

  const responseData = await response.json();
  const message = responseData.message ?? "Error in update user.";

  return {
    success: false,
    message: message,
  };
};

export type UpdateUserRequestProps = {
  name?: string;
  email?: string;
  newPassword?: string;
  currentPassword?: string;
  lattes?: string;
};

import { getSession } from "next-auth/react";

export const approveByAdminService = async (data: DocumentApproveStatusProps) => {
  const session = await getSession();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/approve-document`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${session?.user?.token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  const status = data.approve ? "approved" : "rejected";

  if (response.status === 200) {
    return {
      success: true,
      message: `Document ${status} successfully`,
    };
  }

  const message = responseData.message ?? `Error in update document status.`;

  return {
    success: false,
    message: message,
  };
};

type DocumentApproveStatusProps = {
  documentId: string;
  approve: boolean;
};

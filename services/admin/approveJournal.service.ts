import { getSession } from 'next-auth/react';

export const approveJournalByAdminService = async (data: JournalApproveStatusProps) => {
  const session = await getSession();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/approve-journal`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${session?.user?.token}`,
    },
    body: JSON.stringify(data),
  });

  if (response.status === 204) {
    return {
      success: true,
      message: `Journal ${data.status} successfully`,
    };
  }

  const responseData = await response.json();

  const message = responseData.message ?? `Error in update document status.`;

  return {
    success: false,
    message: message,
  };
};

type JournalApproveStatusProps = {
  journalId: string;
  status: 'APPROVED' | 'REJECTED';
};

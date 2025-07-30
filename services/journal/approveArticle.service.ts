import { getSession } from 'next-auth/react';

export type ApproveDocumentDTO = {
  documentId: string;
  approve: boolean;
  message?: string;
};

export const ApproveArticleForJournal = async (data: ApproveDocumentDTO) => {
  const session = await getSession();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journals/approve-document`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${session?.user?.token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  const status = data.approve ? 'approved' : 'rejected';

  return response.status === 200
    ? { success: true, message: `Document ${status} successfully` }
    : { success: false, message: responseData.message ?? 'Error in updating document status.' };
};

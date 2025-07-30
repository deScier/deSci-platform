import { getSession } from 'next-auth/react';

export const finalSubmitDocumentService = async (data: SubmitDocumentProps) => {
  const session = await getSession();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/confirm-submit`, {
    method: 'PATCH',
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
      message: 'Document submitted successfully.',
    };
  }

  const message = responseData.message ?? 'Error in submit document.';

  return {
    success: false,
    message: message,
  };
};

type SubmitDocumentProps = {
  documentId: string;
};

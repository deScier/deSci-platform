import { getSession } from 'next-auth/react';

export const updateDocumentService = async (data: UpdateDocumentProps) => {
  const session = await getSession();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
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
      message: 'Document updated successfully',
    };
  }

  const message = responseData.message ?? 'Error in update document.';

  return {
    success: false,
    message: message,
  };
};

type UpdateDocumentProps = {
  documentId: string;
  document?: DocumentProps;
  authorsToRemove?: string[];
  updateAuthors?: UpdateAuthor[];
};

type DocumentProps = {
  title?: string;
  abstract?: string | null;
  abstractChart?: string | null;
  keywords?: string[];
  field?: string;
  documentType?: string;
  accessType?: string;
  category?: string;
  price?: number;
  nftHash?: string;
  nftLink?: string;
  authors?: CreateAuthor[];
};

export type CreateAuthor = {
  name: string;
  email: string;
  title: string;
  revenuePercent?: number;
  walletAddress?: string;
  position?: number;
};

export type UpdateAuthor = {
  id: string;
  name?: string;
  email?: string;
  title?: string;
  revenuePercent?: number;
  walletAddress?: string;
  position?: number;
};

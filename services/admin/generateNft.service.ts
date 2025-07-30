import { getSession } from 'next-auth/react';

export const generateNftAdminService = async (data: GenerateNftData) => {
  const session = await getSession();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/generate-nft`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${session?.user?.token}`,
    },
    body: JSON.stringify({
      ...data,
      numCopies: data.numCopies || 1,
    }),
  });

  const responseData = await response.json();

  if (response.status === 200) {
    return {
      success: true,
      message: 'NFT generated successfully',
      data: responseData.data,
    };
  }

  const message = responseData.message ?? 'Error in generating NFT.';

  return {
    success: false,
    message: message,
  };
};

interface GenerateNftData {
  documentId: string;
  numCopies?: number;
}

import { getSession } from 'next-auth/react';

export const deleteFileByAdminService = async (versionId: string) => {
  const session = await getSession();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete-file`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${session?.user?.token}`,
    },
    body: JSON.stringify({ versionId }),
  });

  const responseData = await response.json();

  if (response.status === 200) {
    return {
      success: true,
      message: 'File version deleted successfully',
    };
  }

  const message = responseData.message ?? 'Error in deleting file version.';

  return {
    success: false,
    message: message,
  };
};

import { getSession } from 'next-auth/react';

export const submitNewJournalService = async (data: CreateJournalDTO) => {
  const session = await getSession();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journals`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${session?.user?.token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (response.status === 201) {
    return {
      success: true,
      journalId: responseData.journal.id,
      message: 'Journal submitted successfully!',
    };
  }

  const message = responseData.message ?? 'Error in submit journal.';

  return {
    success: false,
    message: message,
  };
};

export type CreateJournalDTO = {
  name: string;
  field: string;
  keywords: string[];
  rationale: string;
  originatesFrom: string;
  cover: string;
  members: CreateMembersDTO[];
};

export type MembersRoles = 'EDITOR_IN_CHIEF' | 'MEMBER' | 'EDITORIAL_BOARD_MEMBER';

export type CreateMembersDTO = {
  name: string;
  email: string;
  role: MembersRoles;
};

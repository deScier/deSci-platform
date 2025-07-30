import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { JournalDetailsProps } from "@/services/journal/getJournals.service";
import { NextAuthOptions, Session, getServerSession } from "next-auth";
import { unstable_noStore as noStore } from "next/cache";

import JournalDetails from "@/components/pages/Journal/JournalDetails";
import React from "react";

export default async function JournalDetailsPage({ params }: { params: { id: string } }) {
  noStore();

  const options = authOptions as NextAuthOptions;
  const session = await getServerSession(options);

  const fetchJournal = async (journalId: string, data: Session | null) => {
    if (session?.user?.token) {
      const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journals/${journalId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${session.user.token}` },
      });

      const response = (await request.json()) as JournalDetailsProps;
      const journal = response.journal;

      return journal;
    }
  };

  const journal = await fetchJournal(params.id, session);

  return <React.Fragment>{journal && <JournalDetails params={{ journal: journal }} />}</React.Fragment>;
}

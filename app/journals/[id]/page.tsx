import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { home_routes } from "@/routes/home";
import { JournalDetailsProps } from "@/services/journal/getJournals.service";
import { NextAuthOptions, Session, getServerSession } from "next-auth";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

import JournalDetails from "@/components/pages/Journal/JournalDetails";
import React from "react";

export default async function JournalDetailsPage({ params }: { params: { id: string } }) {
  unstable_noStore();

  const options = authOptions as NextAuthOptions;
  const session = await getServerSession(options);

  const fetchJournal = async (journalId: string) => {
    if (session?.user?.token) {
      const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journals/${journalId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${session.user.token}` },
        next: { revalidate: 60 },
      });

      const response = (await request.json()) as JournalDetailsProps;
      const journal = response.journal;

      return journal;
    }
  };

  const journal = await fetchJournal(params.id);

  if (!journal) redirect(home_routes.journals);

  return <React.Fragment>{journal && <JournalDetails params={{ journal: journal }} />}</React.Fragment>;
}

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export const useStatistics = () => {
  const { data: session } = useSession();
  const [statistics, setStatistics] = useState<StatisticsProps>();

  const getStatistics = async () => {
    if (session?.user) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/statistics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${session.user.token}`,
        },
      });

      const statisticsData: StatisticsProps = await response.json();

      setStatistics(statisticsData);
    }
  };

  useEffect(() => {
    getStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  return { statistics };
};

export type StatisticsProps = {
  totalDocuments: number;
  totalSubmittedDocuments: number;
  totalUnderReviewDocuments: number;
  totalLikesOnDocuments: number;
  totalViewsOnDocuments: number;
  publishedDocuments: DocumentBasicProps[];
  pendingDocuments: DocumentBasicProps[];
};

export type DocumentBasicProps = {
  id: string;
  title: string;
  cover?: string;
  createdAt: Date;
  reviewerApprovals: number;
  editorsApprovals: number;
  likes: number;
  views: number;
};

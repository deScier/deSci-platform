import { ReviewersOnDocuments } from '@/services/document/getArticles';
import { useState } from 'react';

export const useGetApprovals = () => {
  const [reviewerApprovals, setReviewerApprovals] = useState<string[]>(['PENDING']);
  const [editorApprovals, setEditorApprovals] = useState<string[]>(['PENDING']);

  const getApprovals = (approvals: ReviewersOnDocuments[]) => {
    const reviewers = approvals.filter((item) => item.role === 'reviewer');
    reviewers.forEach((item, index) => {
      if (reviewerApprovals[index]) {
        reviewerApprovals[index] = item.approvedStatus;
        setReviewerApprovals(reviewerApprovals);
      } else {
        reviewerApprovals.push(item.approvedStatus);
        setReviewerApprovals(reviewerApprovals);
      }
    });

    const editors = approvals.filter((item) => item.role === 'editor');
    editors.forEach((item, index) => {
      if (editorApprovals[index]) {
        editorApprovals[index] = item.approvedStatus;
        setEditorApprovals(editorApprovals);
      } else {
        editorApprovals.push(item.approvedStatus);
        setEditorApprovals(editorApprovals);
      }
    });
  };

  return { getApprovals, reviewerApprovals, editorApprovals };
};

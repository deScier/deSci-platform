import { DocumentProps, UserProps } from '@/services/document/getArticles';
import { z } from 'zod';

export const addCommentSchema = z.object({
  documentId: z.string({ required_error: 'Document ID is required' }),
  comment: z.string({ required_error: 'Comment is required' }),
});

export const approveCommentSchema = z.object({
  commentId: z.string({ required_error: 'Comment id is required' }),
  approvedStatus: z.enum(['APPROVED', 'REJECTED'], {
    required_error: 'Approved status is required',
  }),
  answer: z.string().optional(),
});

export type AuthorProps = z.infer<typeof approveCommentSchema>;

export type AddCommentProps = z.infer<typeof addCommentSchema>;

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type CommentsProps = {
  id: string;
  comment: string;
  approvedByAuthor: ApprovalStatus;
  authorComment?: string | null;
  userId: string;
  user?: UserProps;
  documentId: string;
  document?: DocumentProps;
  createdAt: Date;
  updatedAt: Date;
};

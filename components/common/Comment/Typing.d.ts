interface CommentItemProps {
  id?: string;
  comment_author: string;
  comment_content: string;
  reason?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  user_id: string;
  onApprove?: () => void;
  onReject?: () => void;
  onEdit?: () => void;
  onSeeReasoning?: () => void;
}

export { CommentItemProps };

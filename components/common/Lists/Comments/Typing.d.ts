import { DocumentGetProps } from "@/services/document/getArticles";
import { CommentItemProps } from "../../Comment/Typing";

interface EditorReviewListProps {
  article: DocumentGetProps | null;
  onApprove?: (comment: CommentItemProps) => void;
  onReject?: (comment: CommentItemProps) => void;
  onSeeReasoning?: (comment: CommentItemProps) => void;
}

export { EditorReviewListProps };

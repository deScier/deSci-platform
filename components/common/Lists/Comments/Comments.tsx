export { CommentsList };
export type { EditorReviewListProps };

import { ScrollArea } from '@/components/ui/scroll-area';
import { comments_initial_state, reducer_comments } from '@/states/reducer_comments';
import { twMerge } from 'tailwind-merge';
import { DocumentGetProps } from '@/services/document/getArticles';
import { CommentItemProps } from '../../Comment/Comment';
import { CommentItem } from '@/components/common/Comment/Comment';

import React from 'react';

/**
 * @title Comments List Component
 * @notice Handles the display and interaction with comments on an article.
 * @dev This component renders a list of comments and provides functionality for approval, rejection, and viewing reasons for the comments.
 */
const CommentsList: React.FC<EditorReviewListProps> = ({
  article,
  onApprove,
  onReject,
  onSeeReasoning,
}: EditorReviewListProps) => {
  /**
   * @dev Initializes the useReducer hook with the reducer_comments function and comments_initial_state initial state.
   * @return State and dispatch function from the useReducer hook.
   */
  const [state, dispatch] = React.useReducer(reducer_comments, comments_initial_state);
  return (
    <React.Fragment>
      <div className="border rounded-md p-4">
        <ScrollArea className={twMerge('h-[342px]', `${state.comments && state.comments.length == 0 && 'h-full'}`)}>
          <div className="grid gap-4">
            {state.comments && state.comments.length > 0 ? (
              state.comments?.map((comment) => (
                <React.Fragment key={comment.id}>
                  <CommentItem
                    comment_author={comment.comment_author}
                    comment_content={comment.comment_content}
                    status={comment.status as 'PENDING' | 'APPROVED' | 'REJECTED'}
                    user_id={comment.user_id}
                    onApprove={() => {
                      onApprove && onApprove(comment);
                    }}
                    onReject={() => {
                      onReject && onReject(comment);
                    }}
                    onSeeReasoning={() => {
                      onSeeReasoning && onSeeReasoning(comment);
                    }}
                  />
                </React.Fragment>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No comments available</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </React.Fragment>
  );
};

interface EditorReviewListProps {
  comments: CommentItemProps[];
  document: DocumentGetProps;
  article?: any;
  onApprove?: (comment: CommentItemProps) => void;
  onReject?: (comment: CommentItemProps) => void;
  onSeeReasoning?: (comment: CommentItemProps) => void;
}
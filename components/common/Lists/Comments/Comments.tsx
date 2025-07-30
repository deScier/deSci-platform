import { ScrollArea } from "@/components/ui/scroll-area";
import { comments_initial_state, reducer_comments } from "@/states/reducer_comments";
import { twMerge } from "tailwind-merge";
import { EditorReviewListProps } from "./Typing";

import CommentItem from "@/components/common/Comment/Comment";
import React from "react";

/**
 * @title Comments List Component
 * @notice Handles the display and interaction with comments on an article.
 * @dev This component renders a list of comments and provides functionality for approval, rejection, and viewing reasons for the comments.
 */
export const CommentsList: React.FC<EditorReviewListProps> = ({
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
        <ScrollArea className={twMerge("h-[342px]", `${state.comments && state.comments.length == 0 && "h-full"}`)}>
          <div className="grid gap-4">
            {state.comments && state.comments.length > 0 ? (
              state.comments?.map((comment) => (
                <React.Fragment key={comment.id}>
                  <CommentItem
                    comment_author={comment.comment_author}
                    comment_content={comment.comment_content}
                    status={comment.status as "PENDING" | "APPROVED" | "REJECTED"}
                    onApprove={() => {
                      onApprove && onApprove(comment);
                    }}
                    onReject={() => {
                      onReject && onReject(comment);
                    }}
                    onSeeReasoning={() => {
                      onSeeReasoning && onSeeReasoning(comment);
                    }}
                    user_id={comment.user_id}
                  />
                  <hr className="divider-h mt-1" />
                </React.Fragment>
              ))
            ) : (
              <p className="text-center col-span-2 text-gray-500">There are no comments on this document.</p>
            )}
          </div>
        </ScrollArea>
      </div>
    </React.Fragment>
  );
};

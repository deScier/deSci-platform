import { CommentItemProps } from "@components/common/Comment/Typing";
import { useSession } from "next-auth/react";
import { Check, Pencil, X } from "react-bootstrap-icons";

import React from "react";
/**
 * @title CommentItem Component
 * @notice Handles the display and interaction of a single comment item.
 * @dev This component displays a comment along with action buttons based on its status and user permissions.
 */
const CommentItem: React.FC<CommentItemProps> = ({
  comment_author,
  comment_content,
  onApprove,
  status = "PENDING",
  onReject,
  onSeeReasoning,
  onEdit,
  user_id,
}: CommentItemProps) => {
  /** @dev Initialize session hook to access user session data */
  const { data: session } = useSession();

  return (
    <React.Fragment>
      <div className="grid gap-2">
        <div className="flex justify-between items-center">
          <p className="text-base font-semibold">{comment_author}</p>
          {status === "PENDING" && (
            <React.Fragment>
              <div className="flex items-center gap-2">
                {onEdit && session?.user?.userInfo.id === user_id && (
                  <div onClick={onEdit}>
                    <Pencil className="w-5 h-5 hover:scale-110 transition-all duration-200 fill-primary-main cursor-pointer" />
                  </div>
                )}
                {onReject && (
                  <div onClick={onReject}>
                    <X className="w-8 h-8 hover:scale-110 transition-all duration-200 fill-status-error cursor-pointer" />
                  </div>
                )}
                {onApprove && (
                  <div onClick={onApprove}>
                    <Check className="w-8 h-8 hover:scale-110 transition-all duration-200 fill-status-green cursor-pointer" />
                  </div>
                )}
              </div>
            </React.Fragment>
          )}
          {status === "REJECTED" && (
            <div className="flex items-center gap-4">
              <p className="text-sm text-neutral-gray italic font-regular">Proposal rejected</p>
              <p
                className="text-sm font-semibold text-terciary-main select-none cursor-pointer hover:underline"
                onClick={onSeeReasoning}
              >
                See argument
              </p>
            </div>
          )}
          {status === "APPROVED" && (
            <div>
              <p className="text-sm text-status-green italic font-regular">Proposal accepted</p>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm">{comment_content}</p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CommentItem;

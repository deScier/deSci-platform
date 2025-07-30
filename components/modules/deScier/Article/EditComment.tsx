import * as Button from "@components/common/Button/Button";
import * as Input from "@components/common/Input/Input";
import React from "react";
import { X } from "react-bootstrap-icons";

/**
 * @title EditComment Component
 * @notice This component allows users to edit their comments.
 * @dev This is a functional component in React.js using TypeScript.
 * @param onClose - Function to close the edit comment modal.
 * @param onConfirm - Function to confirm the edit.
 * @param comment - The current comment text.
 */
const EditComment: React.FC<EditCommentsProps> = ({ onClose, onConfirm, comment }: EditCommentsProps) => {
  /** @dev Initialize state for the edited comment */
  const [reason, setReason] = React.useState(comment);
  return (
    <React.Fragment>
      <X
        className="w-8 h-8 absolute top-4 right-4 cursor-pointer hover:text-status-error transition-all duration-500 ease-out hover:scale-110 hover:rotate-180 transform"
        onClick={onClose}
      />
      <div className="grid gap-6">
        <div className="grid gap-2">
          <h3 className="text-xl font-semibold">Edit comment</h3>
        </div>
        <Input.Root>
          <Input.Label>Comment</Input.Label>
          <Input.TextArea
            value={reason}
            placeholder="Explain your reasoning"
            onInput={(e) => setReason(e.currentTarget.value)}
          />
        </Input.Root>
        <div className="grid gap-4">
          <Button.Button className="py-3 px-8" onClick={() => onConfirm(reason)}>
            Confirm edit
          </Button.Button>
          <Button.Button variant="outline" className="py-3 px-8" onClick={onClose}>
            Cancel
          </Button.Button>
        </div>
      </div>
    </React.Fragment>
  );
};

interface EditCommentsProps {
  comment: string;
  onConfirm: (value: string) => void;
  onClose: () => void;
}

export default EditComment;

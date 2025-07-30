import { useLimitCharacters } from "@/hooks/useLimitCharacters";
import * as Button from "@components/common/Button/Button";
import * as Input from "@components/common/Input/Input";
import React from "react";
import { X } from "react-bootstrap-icons";

/**
 * @title Reasoning Component
 * @notice This component is used to provide a response to a reviewer's comments.
 * @dev This is a functional component that takes in onClose, onConfirm, message, and documentAuthor as props.
 * @param {function} onClose - Function to close the component.
 * @param {function} onConfirm - Function to confirm the action.
 * @param {string} message - The message to be displayed.
 * @param {string} documentAuthor - The author of the document.
 */
const Reasoning: React.FC<ArticleUnderReviewProps> = ({
  onClose,
  onConfirm,
  message,
  documentAuthor,
}: ArticleUnderReviewProps) => {
  /** @dev Initialize characterLimit and length using useLimitCharacters hook */
  const { characterLimit, length } = useLimitCharacters(message || "");

  /** @dev Initialize state for reason */
  const [reason, setReason] = React.useState(message || "");

  return (
    <React.Fragment>
      <X
        className="w-8 h-8 absolute top-4 right-4 cursor-pointer hover:text-status-error transition-all duration-500 ease-out hover:scale-110 hover:rotate-180 transform"
        onClick={onClose}
      />
      <div className="grid gap-6">
        <div className="grid gap-2">
          <h3 className="text-xl font-semibold">Response to Reviewer</h3>
          {message === "" && (
            <p className="text-sm">
              Please provide a detailed explanation for why you disagree with the reviewer{"'"}s comments
            </p>
          )}
        </div>
        {message ? (
          <>
            <div className="grid gap-0">
              <p className="text-base font-semibold"> {documentAuthor} </p>
              <p className="text-md"> {message} </p>
            </div>

            <Button.Button variant="outline" className="py-3 px-8" onClick={onClose}>
              Return
            </Button.Button>
          </>
        ) : (
          <>
            <Input.Root>
              <Input.Label className="flex gap-2 items-center">
                <span className="text-sm font-semibold">Reasoning</span>
                <span className="text-sm text-neutral-light_gray">{length}/500 characters</span>
              </Input.Label>
              <Input.TextArea
                defaultValue={reason}
                placeholder="Explain your reasoning"
                onInput={(e) => {
                  characterLimit({
                    e: e,
                    limit: 500,
                    onInput: (value) => {
                      setReason(value.currentTarget.value);
                    },
                  });
                }}
              />
            </Input.Root>
            <div className="grid gap-4">
              <Button.Button className="py-3 px-8" onClick={() => onConfirm(reason)}>
                Submit Response
              </Button.Button>
              <Button.Button variant="outline" className="py-3 px-8" onClick={onClose}>
                Cancel
              </Button.Button>
            </div>
          </>
        )}
      </div>
    </React.Fragment>
  );
};

interface ArticleUnderReviewProps {
  message: string;
  documentAuthor?: string;
  onConfirm: (value: string) => void;
  onClose: () => void;
}

export default Reasoning;

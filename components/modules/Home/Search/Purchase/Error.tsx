import * as Button from "@components/common/Button/Button";
import ErrorIllustration from "public/svgs/modules/home/illustration-error.svg";
import React from "react";
import { X } from "react-bootstrap-icons";

/**
 * @title PurchaseError Component
 * @notice This component displays an error message and an illustration for errors during the checkout process.
 * @dev Component for handling display of checkout errors.
 */
export const PurchaseError: React.FC<PurchaseErrorProps> = ({ onClose }: PurchaseErrorProps) => {
  return (
    <React.Fragment>
      <X
        className="w-8 h-8 absolute top-4 right-4 cursor-pointer hover:text-status-error transition-all duration-500 ease-out hover:scale-110 hover:rotate-180 transform"
        onClick={onClose}
      />
      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-semibold">Error on checkout</h3>
        <ErrorIllustration className="max-w-[180px] mx-auto my-0" />
        <p className="text-base text-neutral-gray text-center">
          There was an error processing your order. (Explanation of the error). Try again.
        </p>
        <Button.Button variant="outline" className="py-3 px-4" onClick={onClose}>
          Return to checkout
        </Button.Button>
      </div>
    </React.Fragment>
  );
};

interface PurchaseErrorProps {
  onClose: () => void;
}

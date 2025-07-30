import * as Button from "@components/common/Button/Button";
import SucessIllustration from "public/svgs/modules/home/illustration-sucess.svg";
import React from "react";
import { X } from "react-bootstrap-icons";

/**
 *  @title PurchaseSuccess Component
 *  @notice This component displays a success message after a purchase is made.
 *  @dev It includes a close button, a success message, an illustration, a confirmation message, and a return button.
 */
export const PurchaseSuccess: React.FC<PurchaseSuccessProps> = ({ onClose, onReturn }: PurchaseSuccessProps) => {
  return (
    <React.Fragment>
      <X
        className="w-8 h-8 absolute top-4 right-4 cursor-pointer hover:text-status-error transition-all duration-500 ease-out hover:scale-110 hover:rotate-180 transform"
        onClick={onClose}
      />
      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-semibold">Purchase successful!</h3>
        <SucessIllustration className="max-w-[242px] mx-auto my-0" />
        <p className="text-base text-neutral-gray text-center">
          Your purchase was confirmed, and the article will be available for accessing and downloading.
        </p>
        <Button.Button className="py-3 px-4" onClick={onReturn}>
          Back to article page
        </Button.Button>
      </div>
    </React.Fragment>
  );
};

interface PurchaseSuccessProps {
  onClose: () => void;
  onReturn: () => void;
}

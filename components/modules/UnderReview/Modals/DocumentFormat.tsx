import * as Button from "@components/common/Button/Button";
import DocumentIllustration from "public/svgs/modules/under-review/under-review-illustration.svg";
import React from "react";
import { X } from "react-bootstrap-icons";

/**
 * @title DocumentFormatModal Component
 * @notice This component provides information about the required document format for final upload and display on the platform.
 */
export const DocumentFormatModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="grid gap-6">
      <X
        className="w-8 h-8 absolute top-4 right-4 cursor-pointer hover:text-status-error transition-all duration-500 ease-out hover:scale-110 hover:rotate-180 transform"
        onClick={onClose}
      />
      <div className="relative">
        <h3 className="text-lg font-semibold">Document format</h3>
        <p className="">
          Please update your article file format to .pdf for the final upload. This final file will be displayed for
          users accessing the platform after the final approval!
        </p>
        <DocumentIllustration className="w-full h-32" />
        <Button.Button variant="outline">Return</Button.Button>
      </div>
    </div>
  );
};
